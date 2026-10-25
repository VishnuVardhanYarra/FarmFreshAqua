import io
import pytest
from PIL import Image
from starlette.testclient import TestClient

from app.main import app
from app.routes.image_routes import load_inference_model

client = TestClient(app)


def create_test_image_bytes(format="JPEG", size=(224, 224), color=(73, 109, 137)):
    """Helper to generate valid image bytes in memory."""
    buf = io.BytesIO()
    img = Image.new("RGB", size, color=color)
    img.save(buf, format=format)
    return buf.getvalue()


# 1. FastAPI application imports and /health responds
def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}


# 2. Root status endpoint
def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "online"


# 3. OpenAPI schema and /docs are available
def test_docs_and_openapi():
    docs_resp = client.get("/docs")
    assert docs_resp.status_code == 200

    openapi_resp = client.get("/openapi.json")
    assert openapi_resp.status_code == 200
    schema = openapi_resp.json()
    assert "/images/predict" in schema["paths"]
    assert "/auth/login" in schema["paths"]


# 4. CORS headers returned for production Vercel origin
def test_cors_preflight_production_vercel():
    headers = {
        "Origin": "https://farm-fresh-aqua.vercel.app",
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "Content-Type",
    }
    response = client.options("/images/predict", headers=headers)
    assert response.status_code == 200
    assert response.headers.get("access-Control-Allow-Origin") in [
        "https://farm-fresh-aqua.vercel.app",
        "*",
    ]


# 5. Prediction endpoint rejects missing file
def test_predict_missing_file():
    response = client.post("/images/predict")
    assert response.status_code == 422


# 6. Prediction endpoint rejects empty file (0 bytes)
def test_predict_empty_file():
    files = {"file": ("empty.jpg", b"", "image/jpeg")}
    response = client.post("/images/predict", files=files)
    assert response.status_code == 400
    assert "empty" in response.json()["detail"].lower()


# 7. Prediction endpoint rejects non-image / unsupported file
def test_predict_non_image_file():
    files = {"file": ("script.sh", b"#!/bin/bash\necho hello", "text/plain")}
    response = client.post("/images/predict", files=files)
    assert response.status_code == 400
    assert "unsupported" in response.json()["detail"].lower() or "not a valid" in response.json()["detail"].lower()


# 8. Prediction endpoint rejects corrupted image
def test_predict_corrupted_image():
    # File with image/jpeg mime type but corrupted binary content
    files = {"file": ("corrupted.jpg", b"\xFF\xD8\xFF\xE0garbagebytesnotanimage", "image/jpeg")}
    response = client.post("/images/predict", files=files)
    assert response.status_code == 400
    assert "not a valid" in response.json()["detail"].lower() or "corrupted" in response.json()["detail"].lower()


# 9. Valid image upload reaches inference and returns expected schema
def test_predict_valid_image():
    img_bytes = create_test_image_bytes(format="JPEG")
    files = {"file": ("shrimp_test.jpg", img_bytes, "image/jpeg")}
    response = client.post("/images/predict", files=files)
    assert response.status_code == 200
    data = response.json()
    assert "predicted_class" in data
    assert isinstance(data["predicted_class"], int)
    assert "confidence" in data
    assert 0.0 <= data["confidence"] <= 1.0
    assert "url" in data
    assert data["url"].startswith("/static/")
    assert data.get("model") in ["resnet18", "resnet50", "custom_shrimp_model"]


# 10. Unexpected inference failure produces clean 500 without leaking stack traces
def test_predict_unexpected_inference_failure(monkeypatch):
    import app.routes.image_routes as img_routes

    def faulty_inference(image):
        raise RuntimeError("Simulated internal GPU/CPU device failure")

    monkeypatch.setattr(img_routes, "run_inference_sync", faulty_inference)

    img_bytes = create_test_image_bytes(format="PNG")
    files = {"file": ("faulty_test.png", img_bytes, "image/png")}
    response = client.post("/images/predict", files=files)
    assert response.status_code == 500
    assert "inference error" in response.json()["detail"].lower()
    # Confirm no stack trace / internal exception type is leaked to client
    assert "Simulated internal" not in response.json()["detail"]


# 11. Existing auth and upload routes remain intact
def test_auth_login_endpoint():
    response = client.post("/auth/login", json={"phone": "0000000000", "password": "wrong"})
    assert response.status_code in [401, 404]  # Invalid credentials expected
