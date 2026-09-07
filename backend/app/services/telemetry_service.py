import uuid
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from app.models.device import Device
from app.models.field import Field
from app.models.crop import Crop
from app.models.sensor_reading import SensorReading
from app.models.alert import Alert
from app.schemas.telemetry import TelemetryBatchInput, SingleReadingInput, TelemetryIngestResponse
from app.intelligence.sensor_interpreter import interpret_reading
from app.intelligence.recommendation_engine import RecommendationEngine
from app.intelligence.knowledge.sensor_ranges import canonicalize_sensor_type, get_sensor_properties
from app.utils.freshness import get_utc_now


from fastapi import HTTPException

class TelemetryService:
    @staticmethod
    def ingest_batch(db: Session, telemetry_in: TelemetryBatchInput) -> TelemetryIngestResponse:
        # Validate device_id
        if not telemetry_in.device_id or not telemetry_in.device_id.strip():
            raise HTTPException(status_code=422, detail="device_id must be a non-empty string.")

        # Validate readings dictionary
        if not telemetry_in.readings:
            raise HTTPException(status_code=422, detail="readings dictionary cannot be empty.")

        now = telemetry_in.timestamp or get_utc_now()
        if now.tzinfo is None:
            now = now.replace(tzinfo=timezone.utc)

        # 1. Resolve target field
        field = None
        if telemetry_in.field_id:
            field = db.query(Field).filter(Field.id == telemetry_in.field_id).first()
            if not field:
                raise HTTPException(
                    status_code=404,
                    detail=f"Field '{telemetry_in.field_id}' does not exist in the database.",
                )

        # 2. Identify or auto-register Device
        device = db.query(Device).filter(Device.device_id == telemetry_in.device_id).first()
        if not device:
            device = Device(
                id=f"dev_{uuid.uuid4().hex[:8]}",
                device_id=telemetry_in.device_id.strip(),
                field_id=telemetry_in.field_id,
                device_type="ESP32_NODE",
                name=f"ESP32 Node ({telemetry_in.device_id.strip()})",
                status="CONNECTED",
                battery_pct=telemetry_in.battery_pct,
                rssi_dbm=telemetry_in.rssi_dbm,
                last_seen_at=now,
                created_at=now,
                updated_at=now,
            )
            db.add(device)
        else:
            device.status = "CONNECTED"
            device.last_seen_at = now
            device.updated_at = now
            if telemetry_in.battery_pct is not None:
                device.battery_pct = telemetry_in.battery_pct
            if telemetry_in.rssi_dbm is not None:
                device.rssi_dbm = telemetry_in.rssi_dbm
            if telemetry_in.field_id and not device.field_id:
                device.field_id = telemetry_in.field_id

        # If field not explicitly provided, resolve from device or fallback to first field
        if not field:
            if device.field_id:
                field = db.query(Field).filter(Field.id == device.field_id).first()
            if not field:
                field = db.query(Field).first()
                if not field:
                    field = Field(
                        id="field_01",
                        farm_id="farm_01",
                        name="Default Field Plot",
                        area=5.0,
                        soil_type="Loam",
                        irrigation_method="Precision Drip Irrigation",
                        created_at=now,
                        updated_at=now,
                    )
                    db.add(field)
                    db.flush()

        crop = db.query(Crop).filter(Crop.field_id == field.id).first()
        crop_name = crop.crop_name if crop else "General Crop"
        growth_stage = crop.growth_stage if crop else "Vegetative Growth"

        stored_count = 0
        interpretations = []
        alerts_created = []

        # 3. Process every reading in batch
        for raw_sensor_name, raw_value in telemetry_in.readings.items():
            if raw_value is None:
                continue

            val = float(raw_value)
            canon_type = canonicalize_sensor_type(raw_sensor_name)
            props = get_sensor_properties(canon_type)
            unit = props.get("unit", "")

            # Store in database
            reading = SensorReading(
                device_id=telemetry_in.device_id,
                field_id=field.id,
                sensor_type=canon_type,
                value=val,
                unit=unit,
                timestamp=now,
                created_at=now,
            )
            db.add(reading)
            stored_count += 1

            # Agronomic interpretation
            interp = interpret_reading(
                sensor_type=canon_type,
                value=val,
                crop_name=crop_name,
                growth_stage=growth_stage,
                soil_type=field.soil_type,
            )
            interpretations.append(interp)

            # Alert evaluation
            if interp.get("requires_alert"):
                # Check for existing active alert for this field & sensor
                existing_alert = (
                    db.query(Alert)
                    .filter(
                        Alert.field_id == field.id,
                        Alert.sensor_type == canon_type,
                        Alert.status == "ACTIVE",
                    )
                    .first()
                )
                if existing_alert:
                    existing_alert.severity = interp["alert_severity"]
                    existing_alert.title = f"{field.name} — {interp['status_label']}"
                    existing_alert.message = interp["explanation"]
                    existing_alert.recommendation = interp.get("recommendation")
                else:
                    new_alert = Alert(
                        id=f"alert_{uuid.uuid4().hex[:8]}",
                        farm_id=field.farm_id,
                        field_id=field.id,
                        sensor_type=canon_type,
                        severity=interp["alert_severity"],
                        title=f"{field.name} — {interp['status_label']}",
                        message=interp["explanation"],
                        recommendation=interp.get("recommendation"),
                        status="ACTIVE",
                        created_at=now,
                    )
                    db.add(new_alert)
                    alerts_created.append({
                        "id": new_alert.id,
                        "title": new_alert.title,
                        "severity": new_alert.severity,
                        "message": new_alert.message,
                    })
            else:
                # If status returned to optimal GOOD, auto-resolve any active alerts for this sensor
                active_alert = (
                    db.query(Alert)
                    .filter(
                        Alert.field_id == field.id,
                        Alert.sensor_type == canon_type,
                        Alert.status == "ACTIVE",
                    )
                    .first()
                )
                if active_alert and interp["status"] == "GOOD":
                    active_alert.status = "RESOLVED"
                    active_alert.resolved_at = now

        db.commit()

        # 4. Generate recommendations
        recommendations = RecommendationEngine.generate_recommendations(
            field_name=field.name,
            crop_name=crop_name,
            interpretations=interpretations,
        )

        return TelemetryIngestResponse(
            success=True,
            device_id=telemetry_in.device_id,
            field_id=field.id,
            stored_readings=stored_count,
            interpretations=interpretations,
            recommendations=recommendations,
            alerts_created=alerts_created,
            timestamp=now,
        )

    @staticmethod
    def ingest_single(db: Session, reading_in: SingleReadingInput) -> TelemetryIngestResponse:
        batch = TelemetryBatchInput(
            device_id=reading_in.device_id,
            field_id=reading_in.field_id,
            readings={reading_in.sensor_type: reading_in.value},
            timestamp=reading_in.timestamp,
        )
        return TelemetryService.ingest_batch(db, batch)
