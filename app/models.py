from sqlalchemy import Column, Integer, String, Date, DateTime
from sqlalchemy.sql import func
from .database import Base

class Farmer(Base):
    __tablename__ = "farmers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    phone = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, nullable=False)
    password_hash = Column(String, nullable=False)
    acres = Column(Integer, nullable=False)
    crop_start_date = Column(Date, nullable=False)
    yield_date = Column(Date, nullable=False)
    health_condition = Column(String, nullable=False)
    role = Column(String, default="farmer", nullable=True)

class Image(Base):
    __tablename__ = "images"
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, unique=True, index=True)
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())
