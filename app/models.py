from sqlalchemy import Column, Integer, String, Date, Float, DateTime
from sqlalchemy.sql import func
from .database import Base

class Farmer(Base):
    __tablename__ = "farmers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    phone = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, nullable=False)
    password_hash = Column(String, nullable=False)
    acres = Column(Float, nullable=True, default=0.0)
    crop_start_date = Column(Date, nullable=True)
    yield_date = Column(Date, nullable=True)
    health_condition = Column(String, nullable=True)
    role = Column(String, default="farmer", nullable=True)

class Image(Base):
    __tablename__ = "images"
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, unique=True, index=True)
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())
