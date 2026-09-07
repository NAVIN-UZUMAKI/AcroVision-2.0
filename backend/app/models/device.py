from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship, foreign
from app.core.database import Base


class Device(Base):
    __tablename__ = "devices"

    id = Column(String(64), primary_key=True, index=True)
    device_id = Column(String(64), unique=True, nullable=False, index=True)  # e.g. "ESP32_FIELD_01"
    field_id = Column(String(64), ForeignKey("fields.id", ondelete="SET NULL"), nullable=True, index=True)
    device_type = Column(String(64), nullable=False, default="ESP32_NODE")
    name = Column(String(128), nullable=False)
    status = Column(String(32), nullable=False, default="NO_DATA")  # CONNECTED, DISCONNECTED, STALE, NO_DATA
    battery_pct = Column(Float, nullable=True)
    rssi_dbm = Column(Integer, nullable=True)
    last_seen_at = Column(DateTime, nullable=True)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    field = relationship("Field", back_populates="devices")
    sensor_readings = relationship(
        "SensorReading",
        primaryjoin="Device.device_id==foreign(SensorReading.device_id)",
        back_populates="device",
        viewonly=True,
    )
