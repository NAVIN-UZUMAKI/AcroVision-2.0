from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.alert import AlertResponse, AlertCreate
from app.services.alert_service import AlertService

router = APIRouter()


@router.get(
    "/farms/{farm_id}/alerts",
    response_model=List[AlertResponse],
    summary="Get All Alerts for Farm",
)
def get_farm_alerts(
    farm_id: str,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
):
    return AlertService.get_by_farm(db, farm_id=farm_id, status=status)


@router.patch(
    "/alerts/{alert_id}/resolve",
    response_model=AlertResponse,
    summary="Mark Alert as Resolved",
)
def resolve_alert(
    alert_id: str,
    db: Session = Depends(get_db),
):
    alert = AlertService.resolve_alert(db, alert_id)
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    return alert


@router.post(
    "/alerts",
    response_model=AlertResponse,
    summary="Create Manual Farm Alert",
)
def create_alert(
    alert_in: AlertCreate,
    db: Session = Depends(get_db),
):
    return AlertService.create_alert(db, alert_in)
