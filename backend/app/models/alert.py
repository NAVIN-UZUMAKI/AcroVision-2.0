from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(String(64), primary_key=True, index=True)
    farm_id = Column(String(64), ForeignKey("farms.id", ondelete="CASCADE"), nullable=False, index=True)
    field_id = Column(String(64), ForeignKey("fields.id", ondelete="SET NULL"), nullable=True, index=True)
    sensor_type = Column(String(64), nullable=True)
    severity = Column(String(32), nullable=False, default="ACTION_NEEDED")  # GOOD, WATCH, ACTION_NEEDED, URGENT
    title = Column(String(256), nullable=False)
    message = Column(Text, nullable=False)
    recommendation = Column(Text, nullable=True)
    status = Column(String(32), nullable=False, default="ACTIVE")  # ACTIVE, RESOLVED, SNOOZED

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False, index=True)
    resolved_at = Column(DateTime, nullable=True)

    # Relationships
    farm = relationship("Farm", back_populates="alerts")
    field = relationship("Field", back_populates="alerts")
