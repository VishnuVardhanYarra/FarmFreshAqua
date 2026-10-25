import io
import os
import uuid
import logging
import threading
from pathlib import Path
from typing import Tuple

from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from starlette.concurrency import run_in_threadpool
from sqlalchemy.orm import Session
from PIL import Image, UnidentifiedImageError
import torch
import torchvision.transforms as transforms
from torchvision.models import (
    resnet18, ResNet18_Weights,
    resnet50, ResNet50_Weights
)

from app import models, database, schemas

logger = logging.getLogger("farmfreshaqua.images")

router = APIRouter()

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# Maximum upload size: 10 MB
MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024

# Allowed file extensions and MIME types
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
ALLOWED_MIME_TYPES = {"image/jpeg", "image/png", "image/webp"}

# Standard ImageNet normalization transform
preprocess = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])

# Thread-safe model holder
_model = None
_model_lock = threading.Lock()
_model_name = os.getenv("MODEL_ARCHITECTURE", "resnet18").lower().strip()


def load_inference_model():
    """
    Thread-safe model loader.
    Defaults to ResNet-18 (~45MB weights, ~350MB peak RSS) to prevent OOM
    crashes on 512MB RAM cloud tiers like Render Free.
    Also checks for custom trained shrimp disease weights at models/shrimp_disease_model.pth.
    """
    global _model, _model_name
    if _model is not None:
        return _model

    with _model_lock:
        if _model is not None:
            return _model

        torch.set_num_threads(1)
        custom_weights_path = os.getenv("SHRIMP_MODEL_PATH", "models/shrimp_disease_model.pth")

        if os.path.exists(custom_weights_path):
            logger.info("Loading custom trained shrimp disease model from %s", custom_weights_path)
            model = resnet18(weights=None)
            checkpoint = torch.load(custom_weights_path, map_location="cpu")
            if isinstance(checkpoint, dict) and "state_dict" in checkpoint:
                model.load_state_dict(checkpoint["state_dict"])
            elif isinstance(checkpoint, dict):
                model.load_state_dict(checkpoint)
            model.eval()
            _model = model
            _model_name = "custom_shrimp_model"
            logger.info("Custom shrimp disease model loaded successfully")
        else:
            logger.info(
                "No custom shrimp disease weights found at '%s'. "
                "Loading base architecture '%s' (ImageNet-pretrained).",
                custom_weights_path, _model_name
            )
            if _model_name == "resnet50":
                model = resnet50(weights=ResNet50_Weights.DEFAULT)
            else:
                model = resnet18(weights=ResNet18_Weights.DEFAULT)
                _model_name = "resnet18"

            model.eval()
            _model = model
            logger.info("Model '%s' initialized and ready for inference", _model_name)

    return _model


def run_inference_sync(image: Image.Image) -> Tuple[int, float]:
    """
    Synchronous CPU-bound inference function.
    Runs inside a threadpool worker to avoid blocking the asyncio event loop.
    """
    model = load_inference_model()
    input_tensor = preprocess(image).unsqueeze(0)
    with torch.inference_mode():
        outputs = model(input_tensor)
        probabilities = torch.nn.functional.softmax(outputs[0], dim=0)
        predicted_class = probabilities.argmax().item()
        confidence = probabilities[predicted_class].item()
    return predicted_class, confidence


def validate_and_open_image(contents: bytes) -> Image.Image:
    """
    Validates byte content as a valid, uncorrupted image.
    Uses Image.verify() and re-opens to produce a sanitized RGB Image object.
    """
    if len(contents) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty (0 bytes).")
    if len(contents) > MAX_IMAGE_SIZE_BYTES:
        raise HTTPException(
            status_code=400,
            detail=f"File exceeds maximum allowed size of {MAX_IMAGE_SIZE_BYTES // (1024 * 1024)}MB."
        )

    try:
        # verify() checks integrity
        test_img = Image.open(io.BytesIO(contents))
        test_img.verify()

        # Re-open for actual tensor conversion
        img = Image.open(io.BytesIO(contents)).convert("RGB")
        return img
    except (UnidentifiedImageError, OSError, ValueError, SyntaxError) as e:
        logger.warning("Invalid image upload: %s", e)
        raise HTTPException(
            status_code=400,
            detail="The uploaded file is not a valid or supported image format (JPEG, PNG, WebP supported)."
        )


# -----------------------------
# Image upload endpoint
# -----------------------------
@router.post("/upload", response_model=schemas.ImageResponse)
async def upload_image(file: UploadFile = File(...), db: Session = Depends(database.get_db)):
    if not file or not file.filename:
        raise HTTPException(status_code=400, detail="No file provided or invalid filename.")

    ext = Path(file.filename).suffix.lower()
    if ext not in ALLOWED_EXTENSIONS and (file.content_type or "").lower() not in ALLOWED_MIME_TYPES:
        raise HTTPException(status_code=400, detail="Invalid image file type.")

    try:
        contents = await file.read()
    except Exception as e:
        logger.error("Failed to read file: %s", e)
        raise HTTPException(status_code=400, detail="Failed to read uploaded file.")

    # Validate image integrity
    validate_and_open_image(contents)

    saved_filename = f"{uuid.uuid4()}{ext or '.jpg'}"
    file_path = UPLOAD_DIR / saved_filename

    try:
        with open(file_path, "wb") as f:
            f.write(contents)

        image_record = models.Image(filename=saved_filename)
        db.add(image_record)
        db.commit()
        db.refresh(image_record)

        return {
            "id": image_record.id,
            "filename": image_record.filename,
            "url": f"/static/{saved_filename}",
            "uploaded_at": image_record.uploaded_at
        }
    except Exception as e:
        logger.exception("Failed to save uploaded image metadata")
        if file_path.exists():
            try:
                file_path.unlink()
            except Exception:
                pass
        raise HTTPException(status_code=500, detail="Failed to save image.")


# -----------------------------
# Image predict endpoint
# -----------------------------
@router.post("/predict")
async def predict_image(file: UploadFile = File(...)):
    """
    Analyzes an uploaded shrimp image for disease classification.
    Validates file integrity, performs threadpool inference, and saves image.
    """
    if not file or not file.filename:
        raise HTTPException(status_code=400, detail="No file provided or invalid filename.")

    # Validate file extension / MIME type
    ext = Path(file.filename).suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        content_type = (file.content_type or "").lower()
        if content_type not in ALLOWED_MIME_TYPES:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported file format '{ext or content_type}'. Please upload JPEG, PNG, or WebP."
            )
        ext = ".jpg" if "jpeg" in content_type else ".png"

    # Read image contents safely
    try:
        contents = await file.read()
    except Exception as e:
        logger.error("Failed to read uploaded file: %s", e)
        raise HTTPException(status_code=400, detail="Failed to read uploaded file.")

    # Validate image data (checks corruption, empty file, format)
    image_obj = validate_and_open_image(contents)

    # Save to disk with unique UUID
    saved_filename = f"{uuid.uuid4()}{ext}"
    saved_path = UPLOAD_DIR / saved_filename
    saved_to_disk = False

    try:
        with open(saved_path, "wb") as f:
            f.write(contents)
        saved_to_disk = True

        # Run CPU inference off the async event loop
        predicted_class, confidence = await run_in_threadpool(run_inference_sync, image_obj)

        logger.info(
            "Prediction success for %s: class=%d, confidence=%.4f (model: %s)",
            saved_filename, predicted_class, confidence, _model_name
        )

        return {
            "predicted_class": predicted_class,
            "confidence": round(confidence, 4),
            "url": f"/static/{saved_filename}",
            "model": _model_name
        }

    except HTTPException:
        # Re-raise explicit HTTP exceptions and clean up temp file if written
        if saved_to_disk and saved_path.exists():
            try:
                saved_path.unlink()
            except Exception:
                pass
        raise

    except Exception as e:
        logger.exception("Unexpected inference failure on %s", file.filename)
        # Clean up saved file on disk if inference failed
        if saved_to_disk and saved_path.exists():
            try:
                saved_path.unlink()
            except Exception:
                pass
        raise HTTPException(
            status_code=500,
            detail="Inference error occurred while processing the image. Please try again."
        )
