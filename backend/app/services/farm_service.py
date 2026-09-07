import uuid
from typing import List, Optional
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.models.farm import Farm
from app.models.field import Field
from app.models.device import Device
from app.models.alert import Alert
from app.schemas.farm import FarmCreate, FarmUpdate
from app.intelligence.rules_engine import AgronomicRulesEngine


class FarmService:
    @staticmethod
    def get_all(db: Session) -> List[Farm]:
        farms = db.query(Farm).all()
        for f in farms:
            FarmService._enrich_farm_summary(db, f)
        return farms

    @staticmethod
    def get_by_id(db: Session, farm_id: str) -> Optional[Farm]:
        farm = db.query(Farm).filter(Farm.id == farm_id).first()
        if farm:
            FarmService._enrich_farm_summary(db, farm)
        return farm

    @staticmethod
    def create(db: Session, farm_in: FarmCreate) -> Farm:
        now = datetime.now(timezone.utc)
        farm_id = farm_in.id or f"farm_{uuid.uuid4().hex[:8]}"
        farm = Farm(
            id=farm_id,
            name=farm_in.name,
            location=farm_in.location,
            area=farm_in.area,
            area_unit=farm_in.area_unit,
            farm_type=farm_in.farm_type,
            owner_name=farm_in.owner_name,
            created_at=now,
            updated_at=now,
        )
        db.add(farm)
        db.commit()
        db.refresh(farm)
        FarmService._enrich_farm_summary(db, farm)
        return farm

    @staticmethod
    def update(db: Session, farm_id: str, farm_in: FarmUpdate) -> Optional[Farm]:
        farm = db.query(Farm).filter(Farm.id == farm_id).first()
        if not farm:
            return None

        update_data = farm_in.model_dump(exclude_unset=True)
        for key, val in update_data.items():
            setattr(farm, key, val)

        farm.updated_at = datetime.now(timezone.utc)
        db.commit()
        db.refresh(farm)
        FarmService._enrich_farm_summary(db, farm)
        return farm

    @staticmethod
    def delete(db: Session, farm_id: str) -> bool:
        farm = db.query(Farm).filter(Farm.id == farm_id).first()
        if not farm:
            return False
        db.delete(farm)
        db.commit()
        return True

    @staticmethod
    def _enrich_farm_summary(db: Session, farm: Farm):
        fields = db.query(Field).filter(Field.farm_id == farm.id).all()
        field_ids = [f.id for f in fields]

        alerts = db.query(Alert).filter(Alert.farm_id == farm.id, Alert.status == "ACTIVE").all()
        devices = db.query(Device).filter(Device.field_id.in_(field_ids)).all() if field_ids else []

        alerts_dicts = [{"severity": a.severity, "status": a.status} for a in alerts]
        devices_dicts = [{"status": d.status} for d in devices]

        eff = AgronomicRulesEngine.calculate_farm_efficiency(
            fields_status=[],
            active_alerts=alerts_dicts,
            devices_status=devices_dicts,
        )

        farm.field_count = len(fields)
        farm.active_device_count = len([d for d in devices if d.status == "CONNECTED"])
        farm.efficiency_score = eff["efficiency_score"]
        farm.overall_status = eff["overall_status"]
