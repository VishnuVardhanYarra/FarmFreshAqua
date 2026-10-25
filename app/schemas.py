from pydantic import BaseModel
from datetime import datetime, date
from typing import Optional

class FarmerCreate(BaseModel):
    name: str
    phone: str
    email: str
    password: str
    acres: int
    crop_start_date: date
    yield_date: date
    health_condition: str
    role: Optional[str] = "farmer"

class FarmerOut(BaseModel):
    id: int
    name: str
    phone: str
    email: str
    acres: int
    crop_start_date: date
    yield_date: date
    health_condition: str
    role: Optional[str] = "farmer"

    class Config:
        from_attributes = True

class LoginSchema(BaseModel):
    phone: str
    password: str

class ImageResponse(BaseModel):
    id: int
    filename: str
    url: str
    uploaded_at: datetime

    class Config:
        from_attributes = True
