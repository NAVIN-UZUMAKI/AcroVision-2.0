from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base


class Crop(Base):
    __tablename__ = "crops"

    id = Column(String(64), primary_key=True, index=True)
    field_id = Column(String(64), ForeignKey("fields.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    crop_name = Column(String(128), nullable=False)
    variety = Column(String(128), nullable=True, default="Standard Variety")
    growth_stage = Column(String(64), nullable=False, default="Vegetative Growth")
    planting_date = Column(DateTime, nullable=True, default=lambda: datetime.now(timezone.utc))

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    field = relationship("Field", back_populates="crop")
