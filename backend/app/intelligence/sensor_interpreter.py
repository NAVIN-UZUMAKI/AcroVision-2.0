from typing import Optional, Dict, Any
from app.intelligence.knowledge.sensor_ranges import (
    canonicalize_sensor_type,
    get_sensor_properties,
)
from app.intelligence.knowledge.crops import get_crop_profile
from app.intelligence.knowledge.growth_stages import adjust_for_soil_type, adjust_for_growth_stage


def interpret_reading(
    sensor_type: str,
    value: Optional[float],
    crop_name: Optional[str] = None,
    growth_stage: Optional[str] = None,
    soil_type: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Interpret raw sensor value in the context of crop, growth stage, and soil texture.
    """
    canon_type = canonicalize_sensor_type(sensor_type)
    props = get_sensor_properties(canon_type)
    unit = props.get("unit", "")
    crop_name_clean = crop_name or "General Crop"
    growth_stage_clean = growth_stage or "Vegetative Growth"
    soil_type_clean = soil_type or "Loam"

    # Base target range
    base_range = {
        "min": props.get("default_min", 20.0),
        "max": props.get("default_max", 85.0),
        "optimal_min": props.get("optimal_min", 50.0),
        "optimal_max": props.get("optimal_max", 70.0),
    }

    # Crop-specific overrides
    if crop_name:
        profile = get_crop_profile(crop_name)
        targets = profile.get("sensor_targets", {})
        if canon_type in targets:
            base_range.update(targets[canon_type])

    # Soil and growth stage adjustments
    soil_adjusted = adjust_for_soil_type(base_range, soil_type_clean)
    final_range = adjust_for_growth_stage(soil_adjusted, canon_type, growth_stage_clean)
    final_range["unit"] = unit

    if value is None:
        return {
            "sensor_type": canon_type,
            "value": None,
            "unit": unit,
            "status": "WATCH",
            "status_label": "No Data",
            "preferred_range": final_range,
            "explanation": "No telemetry reading has been received from this sensor yet.",
            "recommendation": "Verify ESP32 power and wireless connectivity.",
            "confidence": 0.0,
            "requires_alert": False,
            "alert_severity": "WATCH",
        }

    opt_min = final_range["optimal_min"]
    opt_max = final_range["optimal_max"]
    abs_min = final_range["min"]
    abs_max = final_range["max"]

    status = "GOOD"
    status_label = "Optimal"
    explanation = f"{props['label']} is at {value}{unit}, within preferred target ({opt_min}–{opt_max}{unit}) for {crop_name_clean}."
    recommendation = None
    requires_alert = False
    alert_severity = "GOOD"

    if canon_type == "soil_moisture":
        if value < abs_min:
            status = "URGENT"
            status_label = "Critically Dry"
            explanation = f"Soil moisture is at {value}%, severely below minimum root threshold ({abs_min}%). Plant is under acute moisture stress."
            recommendation = "Trigger emergency drip irrigation immediately for 45 minutes."
            requires_alert = True
            alert_severity = "URGENT"
        elif value < opt_min:
            status = "ACTION_NEEDED"
            status_label = "Dry — Water Needed"
            explanation = f"Soil moisture is at {value}%, dipping below preferred window ({opt_min}–{opt_max}%)."
            recommendation = "Schedule irrigation tomorrow morning before peak solar hours."
            requires_alert = True
            alert_severity = "ACTION_NEEDED"
        elif value > abs_max:
            status = "ACTION_NEEDED"
            status_label = "Waterlogged"
            explanation = f"Soil moisture is at {value}%, exceeding safe root aeration limit ({abs_max}%). High risk of root rot."
            recommendation = "Pause all irrigation; inspect field drainage canals."
            requires_alert = True
            alert_severity = "ACTION_NEEDED"
        elif value > opt_max:
            status = "WATCH"
            status_label = "Elevated Moisture"
            explanation = f"Soil moisture is slightly high ({value}%). Monitor drainage trend."
            recommendation = "Delay next watering cycle by 12 hours."
            requires_alert = False
            alert_severity = "WATCH"
        else:
            status = "GOOD"
            status_label = "Optimal Moisture"
            explanation = f"Soil moisture is {value}%, ideal for {crop_name_clean} during {growth_stage_clean} stage."
            recommendation = "Maintain regular irrigation schedule."

    elif canon_type in ("soil_temperature", "air_temperature"):
        label = "Soil temperature" if canon_type == "soil_temperature" else "Air temperature"
        if value < abs_min:
            status = "ACTION_NEEDED"
            status_label = "Cold Stress"
            explanation = f"{label} is {value}°C, which restricts root absorption and photosynthetic rate."
            recommendation = "Deploy row covers or thermal mulch if low temperatures persist."
            requires_alert = True
            alert_severity = "ACTION_NEEDED"
        elif value > abs_max:
            status = "ACTION_NEEDED"
            status_label = "Heat Stress Risk"
            explanation = f"{label} is {value}°C, exceeding optimal biological range ({opt_min}–{opt_max}°C)."
            recommendation = "Ensure adequate shading or misting to reduce canopy heat load."
            requires_alert = True
            alert_severity = "ACTION_NEEDED"
        elif value < opt_min or value > opt_max:
            status = "WATCH"
            status_label = "Sub-optimal Temp"
            explanation = f"{label} is {value}°C, slightly outside ideal window ({opt_min}–{opt_max}°C)."
            recommendation = "Keep an eye on diurnal temperature swings."
            requires_alert = False
        else:
            status = "GOOD"
            status_label = "Ideal Temperature"
            explanation = f"{label} is {value}°C, supporting vigorous crop growth."

    elif canon_type == "humidity":
        if value > abs_max:
            status = "ACTION_NEEDED"
            status_label = "High Fungal Risk"
            explanation = f"Relative humidity is {value}%, creating favorable microclimate for fungal foliar diseases."
            recommendation = "Improve greenhouse ventilation or prune dense canopy foliage."
            requires_alert = True
            alert_severity = "ACTION_NEEDED"
        elif value < abs_min:
            status = "WATCH"
            status_label = "Very Low Humidity"
            explanation = f"Relative humidity is {value}%, increasing transpiration water loss."
            recommendation = "Monitor soil moisture closely to prevent rapid desiccation."
        else:
            status = "GOOD"
            status_label = "Balanced Humidity"
            explanation = f"Relative humidity is {value}%, within safe bounds."

    elif canon_type == "soil_ph":
        if value < opt_min:
            status = "WATCH"
            status_label = "Acidic Soil"
            explanation = f"Soil pH is {value}, below target ({opt_min}–{opt_max})."
            recommendation = "Plan agricultural lime or dolomite application post-harvest."
        elif value > opt_max:
            status = "WATCH"
            status_label = "Alkaline Soil"
            explanation = f"Soil pH is {value}, above target ({opt_min}–{opt_max}). May restrict micronutrient uptake."
            recommendation = "Incorporate organic matter or elemental sulfur to moderate soil pH."
        else:
            status = "GOOD"
            status_label = "Balanced pH"
            explanation = f"Soil pH is {value}, providing optimal nutrient bioavailability."

    else:
        # General sensor handler
        if value < abs_min or value > abs_max:
            status = "ACTION_NEEDED"
            status_label = "Out of Bounds"
            explanation = f"{props['label']} reading ({value}{unit}) is outside expected range ({abs_min}–{abs_max}{unit})."
            recommendation = "Inspect sensor probe placement and field environment."
            requires_alert = True
            alert_severity = "ACTION_NEEDED"
        elif value < opt_min or value > opt_max:
            status = "WATCH"
            status_label = "Sub-optimal"
            explanation = f"{props['label']} reading ({value}{unit}) is slightly outside optimal target ({opt_min}–{opt_max}{unit})."
            recommendation = "Monitor trends over upcoming telemetry cycles."
        else:
            status = "GOOD"
            status_label = "Optimal"
            explanation = f"{props['label']} is {value}{unit}, meeting agronomic targets."

    return {
        "sensor_type": canon_type,
        "value": value,
        "unit": unit,
        "status": status,
        "status_label": status_label,
        "preferred_range": final_range,
        "explanation": explanation,
        "recommendation": recommendation,
        "confidence": 0.92,
        "requires_alert": requires_alert,
        "alert_severity": alert_severity,
    }
