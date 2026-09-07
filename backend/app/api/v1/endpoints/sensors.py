from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.telemetry import InterpretedSensorResponse, SensorReadingResponse
from app.services.sensor_service import SensorService

router = APIRouter()


@router.get(
    "/sensors/latest",
    response_model=List[InterpretedSensorResponse],
    summary="Get All Latest Interpreted Sensors",
    description="Returns latest interpreted sensor readings with freshness and agronomic status.",
)
def get_all_latest_sensors(
    field_id: Optional[str] = None,
    db: Session = Depends(get_db),
):
    return SensorService.get_latest_interpreted_sensors(db, field_id=field_id)


@router.get(
    "/fields/{field_id}/sensors",
    response_model=List[InterpretedSensorResponse],
    summary="Get Latest Interpreted Sensors for Field",
)
def get_field_sensors(
    field_id: str,
    db: Session = Depends(get_db),
):
    return SensorService.get_latest_interpreted_sensors(db, field_id=field_id)


@router.get(
    "/fields/{field_id}/readings",
    response_model=List[SensorReadingResponse],
    summary="Get Telemetry History for Field",
)
def get_field_readings(
    field_id: str,
    sensor_type: Optional[str] = None,
    limit: int = Query(default=50, le=200),
    db: Session = Depends(get_db),
):
    return SensorService.get_readings_history(
        db,
        field_id=field_id,
        sensor_type=sensor_type,
        limit=limit,
    )
