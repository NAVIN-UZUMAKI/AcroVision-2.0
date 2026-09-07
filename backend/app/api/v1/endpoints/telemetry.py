from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.telemetry import TelemetryBatchInput, SingleReadingInput, TelemetryIngestResponse
from app.services.telemetry_service import TelemetryService

router = APIRouter()


@router.post(
    "/telemetry",
    response_model=TelemetryIngestResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Ingest Real ESP32 Sensor Telemetry",
    description=(
        "Accepts real batch or multi-sensor readings from an ESP32 or IoT gateway. "
        "Stores readings in database, updates device heartbeat, runs agronomic rules engine, "
        "and triggers alerts/recommendations."
    ),
)
def ingest_telemetry_batch(
    payload: TelemetryBatchInput,
    db: Session = Depends(get_db),
):
    return TelemetryService.ingest_batch(db, payload)


@router.post(
    "/telemetry/reading",
    response_model=TelemetryIngestResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Ingest Single Sensor Reading",
    description="Accepts a single individual sensor reading.",
)
def ingest_single_reading(
    payload: SingleReadingInput,
    db: Session = Depends(get_db),
):
    return TelemetryService.ingest_single(db, payload)
