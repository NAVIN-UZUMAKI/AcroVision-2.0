from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base


class Field(Base):
    __tablename__ = "fields"

    id = Column(String(64), primary_key=True, index=True)
    farm_id = Column(String(64), ForeignKey("farms.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(128), nullable=False)
    area = Column(Float, nullable=False, default=1.0)
    area_unit = Column(String(32), nullable=False, default="acres")
    soil_type = Column(String(64), nullable=False, default="Loam")
    irrigation_method = Column(String(64), nullable=False, default="Precision Drip Irrigation")

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    farm = relationship("Farm", back_populates="fields")
    crop = relationship("Crop", back_populates="field", uselist=False, cascade="all, delete-orphan")
    devices = relationship("Device", back_populates="field")
    sensor_readings = relationship("SensorReading", back_populates="field", cascade="all, delete-orphan")
    alerts = relationship("Alert", back_populates="field", cascade="all, delete-orphan")
    insights = relationship("Insight", back_populates="field", cascade="all, delete-orphan")
