from typing import List, Dict, Any, Optional
from app.intelligence.sensor_interpreter import interpret_reading


class AgronomicRulesEngine:
    """
    Centralized Agronomic Rules Engine for AcroVision.
    Converts raw telemetry into holistic farm intelligence, efficiency metrics, and alert triggers.
    """

    @staticmethod
    def evaluate_sensor_telemetry(
        sensor_type: str,
        value: Optional[float],
        crop_name: Optional[str] = None,
        growth_stage: Optional[str] = None,
        soil_type: Optional[str] = None,
    ) -> Dict[str, Any]:
        return interpret_reading(
            sensor_type=sensor_type,
            value=value,
            crop_name=crop_name,
            growth_stage=growth_stage,
            soil_type=soil_type,
        )

    @staticmethod
    def calculate_farm_efficiency(
        fields_status: List[Dict[str, Any]],
        active_alerts: List[Dict[str, Any]],
        devices_status: List[Dict[str, Any]],
    ) -> Dict[str, Any]:
        """
        Dynamically calculate Farm Health & Operating Efficiency Score.
        """
        score = 100.0
        penalties = []

        # Alert penalties
        urgent_count = sum(1 for a in active_alerts if a.get("severity") == "URGENT")
        action_count = sum(1 for a in active_alerts if a.get("severity") == "ACTION_NEEDED")
        watch_count = sum(1 for a in active_alerts if a.get("severity") == "WATCH")

        if urgent_count > 0:
            penalty = urgent_count * 16.0
            score -= penalty
            penalties.append(f"-{int(penalty)}% for {urgent_count} critical/urgent condition(s)")

        if action_count > 0:
            penalty = action_count * 8.0
            score -= penalty
            penalties.append(f"-{int(penalty)}% for {action_count} field action(s) needed")

        if watch_count > 0:
            penalty = watch_count * 3.0
            score -= penalty
            penalties.append(f"-{int(penalty)}% for sub-optimal trend observation(s)")

        # Device connectivity check
        offline_devices = sum(1 for d in devices_status if d.get("status") in ("DISCONNECTED", "NO_DATA"))
        if offline_devices > 0 and len(devices_status) > 0:
            penalty = min(15.0, offline_devices * 5.0)
            score -= penalty
            penalties.append(f"-{int(penalty)}% for {offline_devices} uncommunicative sensor node(s)")

        final_score = int(max(35.0, min(100.0, score)))

        if final_score >= 85:
            overall_status = "GOOD"
            status_label = "Operating Efficiently"
            summary_message = "All field parameters are within healthy agronomic bounds. Continue routine monitoring."
        elif final_score >= 70:
            overall_status = "WATCH"
            status_label = "Watch Recommended"
            summary_message = "Minor sub-optimal environmental trends detected. Keep an eye on soil moisture and climate."
        elif final_score >= 50:
            overall_status = "ACTION_NEEDED"
            status_label = "Intervention Needed"
            summary_message = "One or more plots require prompt attention (e.g. irrigation scheduling or climate venting)."
        else:
            overall_status = "URGENT"
            status_label = "Critical Attention"
            summary_message = "Critical soil deficit or environmental threshold breach requiring immediate farmer action."

        return {
            "efficiency_score": final_score,
            "overall_status": overall_status,
            "status_label": status_label,
            "summary_message": summary_message,
            "penalties": penalties,
        }
