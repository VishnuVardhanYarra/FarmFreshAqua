import os
from pathlib import Path
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

load_dotenv()

from app.routes import auth_routes, image_routes
from app import models, database

# Ensure uploads directory exists
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# Create DB tables
try:
    models.Base.metadata.create_all(bind=database.engine)
    # Seed default demo accounts if not present
    try:
        from app.auth import hash_password
        db_seed = database.SessionLocal()
        if not db_seed.query(models.Farmer).filter(models.Farmer.phone == "9876543210").first():
            demo_farmer = models.Farmer(
                name="Ramesh Kumar (Demo Farmer)",
                phone="9876543210",
                email="ramesh.farmer@example.com",
                password_hash=hash_password("demo123"),
                acres=5.5,
                crop_start_date="2025-01-10",
                yield_date="2025-05-15",
                health_condition="Healthy",
                role="farmer"
            )
            db_seed.add(demo_farmer)
        if not db_seed.query(models.Farmer).filter(models.Farmer.phone == "9123456780").first():
            demo_buyer = models.Farmer(
                name="Suresh Exports (Demo Buyer)",
                phone="9123456780",
                email="suresh.buyer@example.com",
                password_hash=hash_password("demo123"),
                acres=0.0,
                crop_start_date="",
                yield_date="",
                health_condition="",
                role="buyer"
            )
            db_seed.add(demo_buyer)
        db_seed.commit()
        db_seed.close()
    except Exception as seed_err:
        print(f"Notice: Demo user seeding skipped or existing: {seed_err}")
except Exception as e:
    print(f"Warning: Database initialization error: {e}")

app = FastAPI(title="Farm Fresh Aqua API - Prawn Disease Detection")

# Mount uploads folder for static access
app.mount("/static", StaticFiles(directory="uploads"), name="static")

# Include routers
app.include_router(auth_routes.router, prefix="/auth", tags=["Auth"])
app.include_router(image_routes.router, prefix="/images", tags=["Images"])

# Root / health check endpoint
@app.get("/")
def root():
    return {
        "status": "online",
        "service": "Farm Fresh Aqua API",
        "message": "API running 🚀"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}

# CORS Configuration
# Supports comma-separated ALLOWED_ORIGINS env variable
default_origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173"
]

env_origins = os.getenv("ALLOWED_ORIGINS", "")
if env_origins:
    configured_origins = [o.strip() for o in env_origins.split(",") if o.strip()]
    origins = list(set(default_origins + configured_origins))
else:
    # If not specified, allow defaults plus wildcard in development
    origins = ["*"] if os.getenv("ENVIRONMENT") != "production" else default_origins

is_wildcard = "*" in origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if is_wildcard else origins,
    allow_credentials=not is_wildcard,
    allow_methods=["*"],
    allow_headers=["*"],
)
