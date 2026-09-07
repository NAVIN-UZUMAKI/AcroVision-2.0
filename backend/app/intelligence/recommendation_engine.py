from typing import List, Dict, Any, Optional


class RecommendationEngine:
    """
    Synthesizes multi-factor farm state into prioritized, farmer-first recommendations.
    Always produces: What, Why, When, and Confidence.
    """

    @staticmethod
    def generate_recommendations(
        field_name: str,
        crop_name: str,
        interpretations: List[Dict[str, Any]],
        weather_context: Optional[Dict[str, Any]] = None,
    ) -> List[Dict[str, Any]]:
        recommendations = []

        # Find soil moisture interpretation
        moisture_interp = next((i for i in interpretations if i.get("sensor_type") == "soil_moisture"), None)
        temp_interp = next((i for i in interpretations if i.get("sensor_type") in ("soil_temperature", "air_temperature")), None)
        humidity_interp = next((i for i in interpretations if i.get("sensor_type") == "humidity"), None)

        # 1. Soil moisture-driven irrigation decision
        if moisture_interp and moisture_interp.get("value") is not None:
            val = moisture_interp["value"]
            opt_min = moisture_interp["preferred_range"]["optimal_min"]
            status = moisture_interp["status"]

            if status == "URGENT":
                recommendations.append({
                    "id": f"rec-irr-urgent-{field_name}",
                    "category": "IRRIGATION",
                    "title": f"Emergency Watering for {field_name}",
                    "what": f"Trigger emergency drip irrigation for {field_name}",
                    "why": f"Soil moisture is at {val}%, severely below minimum root threshold for {crop_name}.",
                    "when": "Immediate (within the hour)",
                    "action": "Open irrigation valve for 45 minutes and re-verify probe reading.",
                    "confidence": 0.96,
                })
            elif status == "ACTION_NEEDED" and val < opt_min:
                # Check weather before recommending water
                rain_chance = weather_context.get("rain_probability", 0) if weather_context else 0
                if rain_chance > 60:
                    recommendations.append({
                        "id": f"rec-irr-rain-{field_name}",
                        "category": "IRRIGATION",
                        "title": f"Hold Irrigation for {field_name}",
                        "what": f"Delay scheduled watering for {field_name}",
                        "why": f"Soil is getting dry ({val}%), but rainfall is forecasted with {rain_chance}% probability.",
                        "when": "Re-evaluate tomorrow morning",
                        "action": "Pause irrigation pumps to conserve water and prevent soil saturation.",
                        "confidence": 0.88,
                    })
                else:
                    recommendations.append({
                        "id": f"rec-irr-schedule-{field_name}",
                        "category": "IRRIGATION",
                        "title": f"Schedule Irrigation for {field_name}",
                        "what": f"Water {field_name} tomorrow morning",
                        "why": f"Soil moisture ({val}%) is dipping below the optimal window for {crop_name}.",
                        "when": "Tomorrow morning (06:00 – 08:30 AM)",
                        "action": "Run precision drip cycle for 30 minutes before high solar transpiration.",
                        "confidence": 0.92,
                    })

        # 2. Disease / Microclimate ventilation recommendation
        if humidity_interp and humidity_interp.get("value") is not None:
            hum = humidity_interp["value"]
            if hum > 85.0:
                recommendations.append({
                    "id": f"rec-hum-{field_name}",
                    "category": "CROP_HEALTH",
                    "title": f"Canopy Ventilation for {field_name}",
                    "what": f"Improve air circulation in {field_name}",
                    "why": f"Relative humidity is {hum}%, creating ideal conditions for fungal spore germination.",
                    "when": "During peak daylight hours",
                    "action": "Open greenhouse side vents or thin dense bottom leaves to promote airflow.",
                    "confidence": 0.86,
                })

        # 3. Default fallback if all conditions are balanced
        if not recommendations:
            recommendations.append({
                "id": f"rec-opt-{field_name}",
                "category": "ROUTINE",
                "title": f"{field_name} Conditions Optimal",
                "what": f"Maintain routine crop management for {field_name}",
                "why": f"Soil moisture and microclimate parameters are balanced within preferred targets for {crop_name}.",
                "when": "Continuous routine",
                "action": "No immediate interventions required. Continue daily telemetry monitoring.",
                "confidence": 0.95,
            })

        return recommendations
