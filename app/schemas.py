from pydantic import BaseModel
from datetime import date
from typing import Optional, Union

class FarmerCreate(BaseModel):
    name: str
    phone: str
    email: str
    password: str
    acres: Union[float, int] = 0
    crop_start_date: Optional[Union[date, str]] = None
    yield_date: Optional[Union[date, str]] = None
    health_condition: Optional[str] = "Normal"
    role: Optional[str] = "farmer"

class FarmerOut(BaseModel):
    id: int
    name: str
    phone: str
    email: str
    acres: Union[float, int] = 0
    crop_start_date: Optional[Union[date, str]] = None
    yield_date: Optional[Union[date, str]] = None
    health_condition: Optional[str] = None
    role: Optional[str] = "farmer"

    class Config:
        from_attributes = True

class LoginSchema(BaseModel):
    phone: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    role: Optional[str] = "farmer"

class ImageResponse(BaseModel):
    id: int
    filename: str
    url: str
