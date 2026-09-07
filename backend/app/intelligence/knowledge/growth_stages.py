from typing import Dict, Any


def adjust_for_soil_type(target_range: Dict[str, float], soil_type: str) -> Dict[str, float]:
    """
    Adjust moisture and irrigation thresholds based on soil texture water-holding capacity.
    - Sand drains rapidly: lower holding capacity, action triggered sooner.
    - Clay holds water tightly: higher waterlogging risk, root suffocation hazard.
    """
    adjusted = dict(target_range)
    if not soil_type:
        return adjusted

    st = soil_type.lower()
    if "sand" in st:
        adjusted["optimal_min"] = max(20.0, adjusted.get("optimal_min", 50.0) - 5.0)
        adjusted["optimal_max"] = max(45.0, adjusted.get("optimal_max", 70.0) - 5.0)
        adjusted["min"] = max(15.0, adjusted.get("min", 25.0) - 5.0)
    elif "clay" in st:
        adjusted["optimal_max"] = min(85.0, adjusted.get("optimal_max", 70.0) + 5.0)
        adjusted["max"] = min(90.0, adjusted.get("max", 85.0) + 5.0)
    return adjusted


def adjust_for_growth_stage(
    target_range: Dict[str, float],
    sensor_type: str,
    growth_stage: str,
) -> Dict[str, float]:
    """
    Adjust targets according to crop phenological stage.
    - Flowering & Fruit-set: high water and nutrient demand.
    - Ripening / Harvest: reduced moisture preferred to concentrate sugars and prevent fruit splitting.
    """
    adjusted = dict(target_range)
    if not growth_stage or sensor_type != "soil_moisture":
        return adjusted

    gs = growth_stage.lower()
    if any(k in gs for k in ("flower", "bloom", "fruit", "bud")):
        adjusted["optimal_min"] = adjusted.get("optimal_min", 50.0) + 5.0
        adjusted["optimal_max"] = adjusted.get("optimal_max", 70.0) + 5.0
    elif any(k in gs for k in ("ripen", "harvest", "mature")):
        adjusted["optimal_min"] = max(30.0, adjusted.get("optimal_min", 50.0) - 10.0)
        adjusted["optimal_max"] = max(50.0, adjusted.get("optimal_max", 70.0) - 10.0)
    elif any(k in gs for k in ("seedling", "germinat", "emerg")):
        adjusted["optimal_min"] = adjusted.get("optimal_min", 50.0) + 5.0
        adjusted["min"] = adjusted.get("min", 25.0) + 5.0

    return adjusted
