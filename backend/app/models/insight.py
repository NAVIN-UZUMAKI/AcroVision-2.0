from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base


class Insight(Base):
    __tablename__ = "insights"

    id = Column(String(64), primary_key=True, index=True)
    farm_id = Column(String(64), ForeignKey("farms.id", ondelete="CASCADE"), nullable=False, index=True)
    field_id = Column(String(64), ForeignKey("fields.id", ondelete="SET NULL"), nullable=True, index=True)
    category = Column(String(64), nullable=False, default="IRRIGATION")  # IRRIGATION, SPRAY, HEALTH, NUTRIENTS
    title = Column(String(256), nullable=False)
    observation = Column(Text, nullable=False)
    explanation = Column(Text, nullable=False)
    recommendation = Column(Text, nullable=False)
    confidence = Column(Float, nullable=False, default=0.85)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False, index=True)

    # Relationships
    farm = relationship("Farm", back_populates="insights")
    field = relationship("Field", back_populates="insights")
