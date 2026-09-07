from app.intelligence.sensor_interpreter import interpret_reading
from app.intelligence.rules_engine import AgronomicRulesEngine


def test_sensor_interpretation_optimal():
    interp = interpret_reading(
        sensor_type="soil_moisture",
        value=62.0,
        crop_name="Tomato",
        growth_stage="Flowering",
        soil_type="Loam",
    )
    assert interp["status"] == "GOOD"
    assert interp["status_label"] == "Optimal Moisture"
    assert interp["requires_alert"] is False
    assert interp["preferred_range"]["unit"] == "%"


def test_sensor_interpretation_critical_deficit():
    interp = interpret_reading(
        sensor_type="soil_moisture",
        value=20.0,
        crop_name="Tomato",
        growth_stage="Flowering",
        soil_type="Loam",
    )
    assert interp["status"] == "URGENT"
    assert "Critically Dry" in interp["status_label"]
    assert interp["requires_alert"] is True
    assert "emergency drip irrigation" in interp["recommendation"]


def test_farm_efficiency_calculation():
    # 1. No alerts
    eff_good = AgronomicRulesEngine.calculate_farm_efficiency(
        fields_status=[],
        active_alerts=[],
        devices_status=[{"status": "CONNECTED"}],
    )
    assert eff_good["efficiency_score"] == 100
    assert eff_good["overall_status"] == "GOOD"

    # 2. With urgent alert
    eff_urgent = AgronomicRulesEngine.calculate_farm_efficiency(
        fields_status=[],
        active_alerts=[{"severity": "URGENT", "status": "ACTIVE"}],
        devices_status=[{"status": "CONNECTED"}],
    )
    assert eff_urgent["efficiency_score"] < 90
    assert len(eff_urgent["penalties"]) >= 1
