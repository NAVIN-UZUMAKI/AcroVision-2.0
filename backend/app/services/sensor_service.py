from typing import List, Dict, Any, Optional
from datetime import datetime
from sqlalchemy.orm import Session
from app.models.field import Field
from app.models.crop import Crop
from app.models.device import Device
from app.models.sensor_reading import SensorReading
from app.schemas.telemetry import SensorReadingResponse, InterpretedSensorResponse
from app.intelligence.sensor_interpreter import interpret_reading
from app.intelligence.knowledge.sensor_ranges import get_sensor_properties
from app.utils.freshness import determine_freshness


class SensorService:
    @staticmethod
    def get_latest_interpreted_sensors(db: Session, field_id: Optional[str] = None) -> List[InterpretedSensorResponse]:
        """
        Get the latest interpreted sensor reading for each sensor type across fields.
        Returns empty list or 'no_data' status if no readings have been ingested.
        """
        fields_query = db.query(Field)
        if field_id:
            fields_query = fields_query.filter(Field.id == field_id)
        fields = fields_query.all()

        results = []
        for f in fields:
            crop = db.query(Crop).filter(Crop.field_id == f.id).first()
            crop_name = crop.crop_name if crop else "General Crop"
            growth_stage = crop.growth_stage if crop else "Vegetative Growth"

            # Fetch distinct latest readings for this field
            readings = (
                db.query(SensorReading)
                .filter(SensorReading.field_id == f.id)
                .order_by(SensorReading.timestamp.desc())
                .limit(20)
                .all()
            )

            seen_types = set()
            for r in readings:
                if r.sensor_type in seen_types:
                    continue
                seen_types.add(r.sensor_type)

                freshness_code, freshness_label = determine_freshness(r.timestamp, is_online=True)
                interp = interpret_reading(
                    sensor_type=r.sensor_type,
                    value=r.value,
                    crop_name=crop_name,
                    growth_stage=growth_stage,
                    soil_type=f.soil_type,
                )
                props = get_sensor_properties(r.sensor_type)

                results.append(
                    InterpretedSensorResponse(
                        id=f"sensor_{f.id}_{r.sensor_type}",
                        sensor_type=r.sensor_type,
                        name=f"{props['label']} Probe",
                        field_id=f.id,
                        field_name=f.name,
                        crop_name=crop_name,
                        value=r.value,
                        unit=r.unit,
                        status=interp["status"],
                        status_label=interp["status_label"],
                        preferred_range=interp["preferred_range"],
                        explanation=interp["explanation"],
                        recommendation=interp.get("recommendation"),
                        freshness=freshness_code,
                        freshness_label=freshness_label,
                        is_online=freshness_code in ("CURRENT", "RECENT", "STALE"),
                        timestamp=r.timestamp,
                    )
                )

        return results

    @staticmethod
    def get_readings_history(
        db: Session,
        field_id: Optional[str] = None,
        device_id: Optional[str] = None,
        sensor_type: Optional[str] = None,
        limit: int = 50,
    ) -> List[SensorReadingResponse]:
        query = db.query(SensorReading)
        if field_id:
            query = query.filter(SensorReading.field_id == field_id)
        if device_id:
            query = query.filter(SensorReading.device_id == device_id)
        if sensor_type:
            query = query.filter(SensorReading.sensor_type == sensor_type)

        readings = query.order_by(SensorReading.timestamp.desc()).limit(limit).all()

        responses = []
        for r in readings:
            f_code, f_label = determine_freshness(r.timestamp)
            item = SensorReadingResponse.model_validate(r)
            item.freshness = f_code
            item.freshness_label = f_label
            responses.append(item)

        return responses
