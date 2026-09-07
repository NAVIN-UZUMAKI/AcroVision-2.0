from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship, foreign
from app.core.database import Base


class SensorReading(Base):
    __tablename__ = "sensor_readings"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    device_id = Column(String(64), nullable=False, index=True)
    field_id = Column(String(64), ForeignKey("fields.id", ondelete="CASCADE"), nullable=False, index=True)
    sensor_type = Column(String(64), nullable=False, index=True)  # soil_moisture, soil_temperature, air_temperature, humidity, etc.
    value = Column(Float, nullable=False)
    unit = Column(String(32), nullable=False)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False, index=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    field = relationship("Field", back_populates="sensor_readings")
    device = relationship(
        "Device",
        primaryjoin="foreign(SensorReading.device_id)==Device.device_id",
        back_populates="sensor_readings",
        viewonly=True,
    )
