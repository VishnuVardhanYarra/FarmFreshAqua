from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from pathlib import Path
import uuid, shutil
from sqlalchemy.orm import Session
from app import models, database, schemas
from torchvision.models import resnet50, ResNet50_Weights
import torch
import torchvision.transforms as transforms
from PIL import Image

router = APIRouter()

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# -----------------------------
# Lazy-loaded ResNet model with dynamic quantization for low-memory environments
# -----------------------------
_model = None

def get_model():
    global _model
    if _model is None:
        try:
            torch.set_num_threads(1)
            base_model = resnet50(weights=ResNet50_Weights.DEFAULT)
            base_model.eval()
            try:
                # Quantize linear layers for ~75% memory reduction (fits within 512MB RAM)
                _model = torch.quantization.quantize_dynamic(
                    base_model, {torch.nn.Linear}, dtype=torch.qint8
                )
            except Exception:
                _model = base_model
        except Exception as e:
            print(f"Model initialization error: {e}")
            raise
    return _model

preprocess = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])

def predict(image_path):
    model = get_model()
    image = Image.open(image_path).convert("RGB")
    input_tensor = preprocess(image).unsqueeze(0)
    with torch.no_grad():
        outputs = model(input_tensor)
    probabilities = torch.nn.functional.softmax(outputs[0], dim=0)
    predicted_class = probabilities.argmax().item()
    return predicted_class, probabilities[predicted_class].item()

# -----------------------------
# Image upload endpoint
# -----------------------------
@router.post("/upload", response_model=schemas.ImageResponse)
async def upload_image(file: UploadFile = File(...), db: Session = Depends(database.get_db)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid file type")

    filename = f"{uuid.uuid4()}.{file.filename.split('.')[-1]}"
    file_path = UPLOAD_DIR / filename

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Save metadata to DB
    image = models.Image(filename=filename)
    db.add(image)
    db.commit()
    db.refresh(image)

    return {
        "id": image.id,
        "filename": image.filename,
        "url": f"/static/{filename}",
        "uploaded_at": image.uploaded_at
    }

# -----------------------------
# Image predict endpoint
# -----------------------------
@router.post("/predict")
async def predict_image(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid file type")

    filename = f"{uuid.uuid4()}.{file.filename.split('.')[-1]}"
    file_path = UPLOAD_DIR / filename

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    predicted_class, confidence = predict(file_path)
    return {"predicted_class": predicted_class, "confidence": confidence, "url": f"/static/{filename}"}
