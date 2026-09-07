import uuid
from typing import List, Optional
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.models.field import Field
from app.models.crop import Crop
from app.models.sensor_reading import SensorReading
from app.schemas.field import FieldCreate, FieldUpdate
from app.schemas.crop import CropCreate, CropUpdate
from app.intelligence.sensor_interpreter import interpret_reading


class FieldService:
    @staticmethod
    def get_all(db: Session, farm_id: Optional[str] = None) -> List[Field]:
        query = db.query(Field)
        if farm_id:
            query = query.filter(Field.farm_id == farm_id)
        fields = query.all()
        for f in fields:
            FieldService._enrich_field_health(db, f)
        return fields

    @staticmethod
    def get_by_id(db: Session, field_id: str) -> Optional[Field]:
        field = db.query(Field).filter(Field.id == field_id).first()
        if field:
            FieldService._enrich_field_health(db, field)
        return field

    @staticmethod
    def create(db: Session, field_in: FieldCreate) -> Field:
        now = datetime.now(timezone.utc)
        field_id = field_in.id or f"field_{uuid.uuid4().hex[:8]}"
        field = Field(
            id=field_id,
            farm_id=field_in.farm_id,
            name=field_in.name,
            area=field_in.area,
            area_unit=field_in.area_unit,
            soil_type=field_in.soil_type,
            irrigation_method=field_in.irrigation_method,
            created_at=now,
            updated_at=now,
        )
        db.add(field)

        # Optional initial crop
        if field_in.crop_name:
            crop = Crop(
                id=f"crop_{uuid.uuid4().hex[:8]}",
                field_id=field_id,
                crop_name=field_in.crop_name,
                variety=field_in.crop_variety or "Standard Variety",
                growth_stage=field_in.growth_stage or "Vegetative Growth",
                planting_date=now,
                created_at=now,
                updated_at=now,
            )
            db.add(crop)

        db.commit()
        db.refresh(field)
        FieldService._enrich_field_health(db, field)
        return field

    @staticmethod
    def update(db: Session, field_id: str, field_in: FieldUpdate) -> Optional[Field]:
        field = db.query(Field).filter(Field.id == field_id).first()
        if not field:
            return None

        update_data = field_in.model_dump(exclude_unset=True)
        for key, val in update_data.items():
            setattr(field, key, val)

        field.updated_at = datetime.now(timezone.utc)
        db.commit()
        db.refresh(field)
        FieldService._enrich_field_health(db, field)
        return field

    @staticmethod
    def delete(db: Session, field_id: str) -> bool:
        field = db.query(Field).filter(Field.id == field_id).first()
        if not field:
            return False
        db.delete(field)
        db.commit()
        return True

    # Crop operations
    @staticmethod
    def get_crop_by_field(db: Session, field_id: str) -> Optional[Crop]:
        return db.query(Crop).filter(Crop.field_id == field_id).first()

    @staticmethod
    def set_or_update_crop(db: Session, crop_in: CropCreate) -> Crop:
        existing = db.query(Crop).filter(Crop.field_id == crop_in.field_id).first()
        now = datetime.now(timezone.utc)
        if existing:
            existing.crop_name = crop_in.crop_name
            existing.variety = crop_in.variety or existing.variety
            existing.growth_stage = crop_in.growth_stage
            existing.updated_at = now
            db.commit()
            db.refresh(existing)
            return existing
        else:
            crop = Crop(
                id=crop_in.id or f"crop_{uuid.uuid4().hex[:8]}",
                field_id=crop_in.field_id,
                crop_name=crop_in.crop_name,
                variety=crop_in.variety or "Standard Variety",
                growth_stage=crop_in.growth_stage,
                planting_date=crop_in.planting_date or now,
                created_at=now,
                updated_at=now,
            )
            db.add(crop)
            db.commit()
            db.refresh(crop)
            return crop

    @staticmethod
    def _enrich_field_health(db: Session, field: Field):
        """Derive field current status, health score, and summary advice from real sensor readings."""
        crop_name = field.crop.crop_name if field.crop else "General Crop"
        growth_stage = field.crop.growth_stage if field.crop else "Vegetative Growth"

        # Query latest readings for this field
        latest_readings = (
            db.query(SensorReading)
            .filter(SensorReading.field_id == field.id)
            .order_by(SensorReading.timestamp.desc())
            .limit(10)
            .all()
        )

        if not latest_readings:
            field.current_status = "GOOD"
            field.health_score = 90
            field.summary_advice = "Field registered. Awaiting initial sensor telemetry transmission."
            return

        # Deduplicate latest reading per sensor_type
        seen_types = set()
        unique_latest = []
        for r in latest_readings:
            if r.sensor_type not in seen_types:
                seen_types.add(r.sensor_type)
                unique_latest.append(r)

        worst_status = "GOOD"
        health_score = 95
        advice = "Optimal crop conditions maintained across all sensor probes."

        for r in unique_latest:
            interp = interpret_reading(
                sensor_type=r.sensor_type,
                value=r.value,
                crop_name=crop_name,
                growth_stage=growth_stage,
                soil_type=field.soil_type,
            )
            st = interp["status"]
            if st == "URGENT":
                worst_status = "URGENT"
                health_score = min(health_score, 45)
                advice = interp.get("recommendation") or interp.get("explanation")
            elif st == "ACTION_NEEDED" and worst_status != "URGENT":
                worst_status = "ACTION_NEEDED"
                health_score = min(health_score, 68)
                advice = interp.get("recommendation") or interp.get("explanation")
            elif st == "WATCH" and worst_status == "GOOD":
                worst_status = "WATCH"
                health_score = min(health_score, 82)
                advice = interp.get("explanation")

        field.current_status = worst_status
        field.health_score = health_score
        field.summary_advice = advice
