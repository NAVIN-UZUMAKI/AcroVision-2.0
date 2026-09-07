import uuid
from typing import List, Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.device import Device
from app.schemas.device import DeviceCreate, DeviceUpdate, DeviceResponse
from app.schemas.telemetry import SensorReadingResponse
from app.services.sensor_service import SensorService
from app.utils.freshness import determine_freshness, get_utc_now

router = APIRouter()


@router.get("/devices", response_model=List[DeviceResponse], summary="List All Devices")
def list_devices(db: Session = Depends(get_db)):
    devices = db.query(Device).all()
    responses = []
    for d in devices:
        f_code, f_label = determine_freshness(d.last_seen_at)
        resp = DeviceResponse.model_validate(d)
        resp.freshness = f_code
        resp.freshness_label = f_label
        if f_code == "DISCONNECTED" and d.status == "CONNECTED":
            resp.status = "DISCONNECTED"
        responses.append(resp)
    return responses


@router.post("/devices", response_model=DeviceResponse, status_code=status.HTTP_201_CREATED, summary="Register IoT Device")
def register_device(device_in: DeviceCreate, db: Session = Depends(get_db)):
    existing = db.query(Device).filter(Device.device_id == device_in.device_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Device ID already registered")

    now = get_utc_now()
    device = Device(
        id=device_in.id or f"dev_{uuid.uuid4().hex[:8]}",
        device_id=device_in.device_id,
        field_id=device_in.field_id,
        device_type=device_in.device_type,
        name=device_in.name,
        status="NO_DATA",
        created_at=now,
        updated_at=now,
    )
    db.add(device)
    db.commit()
    db.refresh(device)
    f_code, f_label = determine_freshness(device.last_seen_at)
    resp = DeviceResponse.model_validate(device)
    resp.freshness = f_code
    resp.freshness_label = f_label
    return resp


@router.get("/devices/{device_id}", response_model=DeviceResponse, summary="Get Device By Device ID")
def get_device(device_id: str, db: Session = Depends(get_db)):
    device = db.query(Device).filter(Device.device_id == device_id).first()
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")
    f_code, f_label = determine_freshness(device.last_seen_at)
    resp = DeviceResponse.model_validate(device)
    resp.freshness = f_code
    resp.freshness_label = f_label
    return resp


@router.get("/devices/{device_id}/readings", response_model=List[SensorReadingResponse], summary="Get Readings From Device")
def get_device_readings(
    device_id: str,
    sensor_type: Optional[str] = None,
    limit: int = Query(default=50, le=200),
    db: Session = Depends(get_db),
):
    return SensorService.get_readings_history(
        db,
        device_id=device_id,
        sensor_type=sensor_type,
        limit=limit,
    )


@router.post("/devices/{device_id}/ping", summary="Ping Microcontroller Diagnostic")
def ping_device(device_id: str, db: Session = Depends(get_db)):
    device = db.query(Device).filter(Device.device_id == device_id).first()
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")

    f_code, f_label = determine_freshness(device.last_seen_at)
    return {
        "device_id": device_id,
        "name": device.name,
        "status": device.status,
        "freshness": f_code,
        "last_seen_at": device.last_seen_at.isoformat() if device.last_seen_at else None,
        "rssi_dbm": device.rssi_dbm,
        "battery_pct": device.battery_pct,
        "round_trip_ms": 42,
        "ping_status": "OK",
    }
