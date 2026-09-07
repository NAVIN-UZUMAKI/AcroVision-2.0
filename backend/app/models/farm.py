from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, DateTime
from sqlalchemy.orm import relationship
from app.core.database import Base


class Farm(Base):
    __tablename__ = "farms"

    id = Column(String(64), primary_key=True, index=True)
    name = Column(String(128), nullable=False)
    location = Column(String(256), nullable=False)
    area = Column(Float, nullable=False, default=1.0)
    area_unit = Column(String(32), nullable=False, default="acres")
    farm_type = Column(String(64), nullable=False, default="Organic Crop Farm")
    owner_name = Column(String(128), nullable=True, default="Farmer")

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    fields = relationship("Field", back_populates="farm", cascade="all, delete-orphan")
    alerts = relationship("Alert", back_populates="farm", cascade="all, delete-orphan")
    insights = relationship("Insight", back_populates="farm", cascade="all, delete-orphan")
