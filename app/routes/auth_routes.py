from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas, auth, database

router = APIRouter(tags=["Auth"])

# Register
@router.post("/register", response_model=schemas.FarmerOut)
def register_farmer(farmer: schemas.FarmerCreate, db: Session = Depends(database.get_db)):
    phone_clean = farmer.phone.strip()
    existing = db.query(models.Farmer).filter(models.Farmer.phone == phone_clean).first()
    if existing:
        raise HTTPException(status_code=400, detail="Phone already registered")

    hashed_password = auth.hash_password(farmer.password)
    role = getattr(farmer, "role", "farmer") or "farmer"
    crop_start = farmer.crop_start_date if farmer.crop_start_date and str(farmer.crop_start_date).strip() else None
    yield_dt = farmer.yield_date if farmer.yield_date and str(farmer.yield_date).strip() else None

    new_farmer = models.Farmer(
        name=farmer.name.strip(),
        phone=phone_clean,
        email=farmer.email.strip(),
        password_hash=hashed_password,
        acres=farmer.acres,
        crop_start_date=crop_start,
        yield_date=yield_dt,
        health_condition=farmer.health_condition,
        role=role
    )
    db.add(new_farmer)
    db.commit()
    db.refresh(new_farmer)
    return new_farmer

# Login
@router.post("/login")
def login_farmer(credentials: schemas.LoginSchema, db: Session = Depends(database.get_db)):
    phone_clean = credentials.phone.strip()
    farmer = db.query(models.Farmer).filter(models.Farmer.phone == phone_clean).first()
    if not farmer or not auth.verify_password(credentials.password, farmer.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    role = getattr(farmer, "role", None) or "farmer"
    access_token = auth.create_access_token(data={"sub": str(farmer.id), "role": role})
    return {
        "access_token": access_token,
        "token": access_token,
        "token_type": "bearer",
        "role": role,
        "user": {
            "id": farmer.id,
            "name": farmer.name,
            "phone": farmer.phone,
            "role": role
        }
    }

# Farmer Profile
@router.get("/profile")
def get_farmer_profile(phone: str, db: Session = Depends(database.get_db)):
    phone_clean = phone.strip()
    farmer = db.query(models.Farmer).filter(models.Farmer.phone == phone_clean).first()
    if not farmer:
        raise HTTPException(status_code=404, detail="Farmer not found")
    return {
        "id": farmer.id,
        "name": farmer.name,
        "phone": farmer.phone,
        "email": farmer.email,
        "acres": farmer.acres,
        "crop_start_date": str(farmer.crop_start_date),
        "yield_date": str(farmer.yield_date),
        "health_condition": farmer.health_condition,
        "role": getattr(farmer, "role", "farmer") or "farmer"
    }
