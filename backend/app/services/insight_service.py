import uuid
from typing import List, Optional
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.models.insight import Insight
from app.models.field import Field
from app.models.crop import Crop
from app.models.sensor_reading import SensorReading
from app.schemas.insight import InsightResponse, InsightCreate
from app.intelligence.sensor_interpreter import interpret_reading


class InsightService:
    @staticmethod
    def get_by_farm(db: Session, farm_id: str) -> List[InsightResponse]:
        insights = db.query(Insight).filter(Insight.farm_id == farm_id).order_by(Insight.created_at.desc()).all()
        if not insights:
            # Dynamically formulate insights based on actual field telemetry
            return InsightService.generate_dynamic_insights(db, farm_id)

        results = []
        for ins in insights:
            field = db.query(Field).filter(Field.id == ins.field_id).first() if ins.field_id else None
            resp = InsightResponse.model_validate(ins)
            resp.field_name = field.name if field else "General Farm"
            results.append(resp)
        return results

    @staticmethod
    def generate_dynamic_insights(db: Session, farm_id: str) -> List[InsightResponse]:
        fields = db.query(Field).filter(Field.farm_id == farm_id).all()
        now = datetime.now(timezone.utc)
        results = []

        for field in fields:
            crop = db.query(Crop).filter(Crop.field_id == field.id).first()
            crop_name = crop.crop_name if crop else "General Crop"
            growth_stage = crop.growth_stage if crop else "Vegetative Growth"

            latest_moisture = (
                db.query(SensorReading)
                .filter(SensorReading.field_id == field.id, SensorReading.sensor_type == "soil_moisture")
                .order_by(SensorReading.timestamp.desc())
                .first()
            )

            if latest_moisture:
                interp = interpret_reading(
                    sensor_type="soil_moisture",
                    value=latest_moisture.value,
                    crop_name=crop_name,
                    growth_stage=growth_stage,
                    soil_type=field.soil_type,
                )

                if interp["status"] in ("URGENT", "ACTION_NEEDED"):
                    results.append(
                        InsightResponse(
                            id=f"ins_{field.id}_moist",
                            farm_id=farm_id,
                            field_id=field.id,
                            field_name=field.name,
                            category="IRRIGATION",
                            title=f"{field.name} Irrigation Scheduling",
                            observation=f"Soil moisture reading is {latest_moisture.value}%, below preferred target for {crop_name}.",
                            explanation=interp["explanation"],
                            recommendation=interp.get("recommendation", "Consider scheduling an irrigation cycle."),
                            confidence=0.92,
                            created_at=now,
                        )
                    )
                else:
                    results.append(
                        InsightResponse(
                            id=f"ins_{field.id}_moist",
                            farm_id=farm_id,
                            field_id=field.id,
                            field_name=field.name,
                            category="IRRIGATION",
                            title=f"{field.name} Optimal Soil Hydration",
                            observation=f"Soil moisture is at {latest_moisture.value}%, matching target bounds ({interp['preferred_range']['optimal_min']}–{interp['preferred_range']['optimal_max']}%).",
                            explanation=f"Root zone has adequate capillary water reserves for {growth_stage}.",
                            recommendation="Maintain current irrigation cycle without alteration.",
                            confidence=0.95,
                            created_at=now,
                        )
                    )
            else:
                # Honest reporting: no fabricated data
                results.append(
                    InsightResponse(
                        id=f"ins_{field.id}_nodata",
                        farm_id=farm_id,
                        field_id=field.id,
                        field_name=field.name,
                        category="MONITORING",
                        title=f"{field.name} Telemetry Awaiting",
                        observation="Not enough sensor telemetry to formulate confident diagnostic recommendations.",
                        explanation="ESP32 soil probe has not transmitted telemetry packets for this plot yet.",
                        recommendation="Power on the sensor node to begin live physiological tracking.",
                        confidence=0.20,
                        created_at=now,
                    )
                )

        return results
