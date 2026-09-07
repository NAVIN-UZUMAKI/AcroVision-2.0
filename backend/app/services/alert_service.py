import uuid
from typing import List, Optional
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.models.alert import Alert
from app.models.field import Field
from app.schemas.alert import AlertCreate, AlertResponse


class AlertService:
    @staticmethod
    def get_by_farm(db: Session, farm_id: str, status: Optional[str] = None) -> List[AlertResponse]:
        query = db.query(Alert).filter(Alert.farm_id == farm_id)
        if status:
            query = query.filter(Alert.status == status.upper())
        alerts = query.order_by(Alert.created_at.desc()).all()

        results = []
        for a in alerts:
            field = db.query(Field).filter(Field.id == a.field_id).first() if a.field_id else None
            resp = AlertResponse.model_validate(a)
            resp.field_name = field.name if field else "All Fields"
            results.append(resp)
        return results

    @staticmethod
    def resolve_alert(db: Session, alert_id: str) -> Optional[AlertResponse]:
        alert = db.query(Alert).filter(Alert.id == alert_id).first()
        if not alert:
            return None
        alert.status = "RESOLVED"
        alert.resolved_at = datetime.now(timezone.utc)
        db.commit()
        db.refresh(alert)
        field = db.query(Field).filter(Field.id == alert.field_id).first() if alert.field_id else None
        resp = AlertResponse.model_validate(alert)
        resp.field_name = field.name if field else "All Fields"
        return resp

    @staticmethod
    def create_alert(db: Session, alert_in: AlertCreate) -> AlertResponse:
        now = datetime.now(timezone.utc)
        alert = Alert(
            id=alert_in.id or f"alert_{uuid.uuid4().hex[:8]}",
            farm_id=alert_in.farm_id,
            field_id=alert_in.field_id,
            sensor_type=alert_in.sensor_type,
            severity=alert_in.severity,
            title=alert_in.title,
            message=alert_in.message,
            recommendation=alert_in.recommendation,
            status="ACTIVE",
            created_at=now,
        )
        db.add(alert)
        db.commit()
        db.refresh(alert)
        return AlertResponse.model_validate(alert)
