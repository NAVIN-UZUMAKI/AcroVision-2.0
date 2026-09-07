from datetime import datetime, timezone
from typing import Optional
from sqlalchemy.orm import Session
from app.models.farm import Farm
from app.models.field import Field
from app.models.device import Device
from app.models.alert import Alert
from app.schemas.farm import FarmResponse
from app.schemas.field import FieldResponse
from app.schemas.device import DeviceResponse
from app.schemas.dashboard import DashboardResponse
from app.services.farm_service import FarmService
from app.services.field_service import FieldService
from app.services.sensor_service import SensorService
from app.services.alert_service import AlertService
from app.services.insight_service import InsightService
from app.services.weather_service import WeatherService
from app.intelligence.rules_engine import AgronomicRulesEngine
from app.intelligence.recommendation_engine import RecommendationEngine
from app.utils.freshness import determine_freshness, get_utc_now


class DashboardService:
    @staticmethod
    def get_dashboard_data(db: Session, farm_id: str) -> Optional[DashboardResponse]:
        farm = FarmService.get_by_id(db, farm_id)
        if not farm:
            return None

        now = get_utc_now()
        fields = FieldService.get_all(db, farm_id=farm.id)
        field_ids = [f.id for f in fields]

        # 1. Fetch devices
        db_devices = db.query(Device).filter(Device.field_id.in_(field_ids)).all() if field_ids else []
        device_responses = []
        devices_status = []
        for d in db_devices:
            f_code, f_label = determine_freshness(d.last_seen_at)
            dev_resp = DeviceResponse.model_validate(d)
            dev_resp.freshness = f_code
            dev_resp.freshness_label = f_label
            # Auto-update status if stale/disconnected
            if f_code == "DISCONNECTED" and d.status == "CONNECTED":
                dev_resp.status = "DISCONNECTED"
            device_responses.append(dev_resp)
            devices_status.append({"status": dev_resp.status})

        # 2. Fetch alerts
        active_alerts = AlertService.get_by_farm(db, farm_id=farm.id, status="ACTIVE")
        urgent_alerts = [a for a in active_alerts if a.severity in ("URGENT", "ACTION_NEEDED")]

        # 3. Dynamic efficiency score calculation
        alerts_dicts = [{"severity": a.severity, "status": a.status} for a in active_alerts]
        efficiency_info = AgronomicRulesEngine.calculate_farm_efficiency(
            fields_status=[],
            active_alerts=alerts_dicts,
            devices_status=devices_status,
        )

        # 4. Fetch Key Sensors (Interpreted)
        key_sensors = SensorService.get_latest_interpreted_sensors(db)

        # 5. Formulate recommendations
        recommendations = []
        for f in fields:
            f_sensors = [s for s in key_sensors if s.field_id == f.id]
            f_interps = [
                {
                    "sensor_type": s.sensor_type,
                    "value": s.value,
                    "status": s.status,
                    "preferred_range": s.preferred_range,
                    "explanation": s.explanation,
                }
                for s in f_sensors
            ]
            crop_name = f.crop.crop_name if f.crop else "General Crop"
            field_recs = RecommendationEngine.generate_recommendations(
                field_name=f.name,
                crop_name=crop_name,
                interpretations=f_interps,
            )
            recommendations.extend(field_recs)

        # 6. Fetch insights
        insights = InsightService.get_by_farm(db, farm_id=farm.id)

        # 7. Weather
        weather = WeatherService.get_weather_for_location(farm.location)

        # 8. Field responses
        field_responses = [FieldResponse.model_validate(f) for f in fields]

        return DashboardResponse(
            farm=FarmResponse.model_validate(farm),
            efficiency_score=efficiency_info["efficiency_score"],
            overall_status=efficiency_info["overall_status"],
            status_label=efficiency_info["status_label"],
            summary_message=efficiency_info["summary_message"],
            penalties=efficiency_info["penalties"],
            urgent_actions=urgent_alerts,
            recommendations=recommendations,
            fields=field_responses,
            key_sensors=key_sensors,
            devices=device_responses,
            insights=insights,
            weather=weather,
            last_sync_time=now,
        )
