from datetime import datetime, timezone, timedelta
import pytest
from app.models.field import Field
from app.models.crop import Crop
from app.models.device import Device
from app.models.sensor_reading import SensorReading
from app.models.alert import Alert


def test_health_check_endpoint(client):
    """1. Health check returns healthy status."""
    res = client.get("/api/v1/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] in ("ok", "healthy")
    assert "version" in data
    assert "timestamp" in data


def test_telemetry_validation_rejects_malformed_requests(client):
    """3. Telemetry validation rejects malformed requests, invalid fields, empty payloads."""
    # Empty payload
    res1 = client.post("/api/v1/telemetry", json={})
    assert res1.status_code == 422

    # Missing readings
    res2 = client.post("/api/v1/telemetry", json={"device_id": "ESP32_01"})
    assert res2.status_code == 422

    # Empty readings dict
    res3 = client.post("/api/v1/telemetry", json={"device_id": "ESP32_01", "readings": {}})
    assert res3.status_code == 422

    # Non-existent field_id
    res4 = client.post(
        "/api/v1/telemetry",
        json={
            "device_id": "ESP32_01",
            "field_id": "non_existent_field_xyz",
            "readings": {"soil_moisture": 45.0},
        },
    )
    assert res4.status_code == 404
    assert "not exist" in res4.json()["detail"].lower()

    # Empty device_id
    res5 = client.post(
        "/api/v1/telemetry",
        json={
            "device_id": "   ",
            "field_id": "field_01",
            "readings": {"soil_moisture": 45.0},
        },
    )
    assert res5.status_code == 422


def test_dynamic_changing_sensor_readings_and_history(client, db_session):
    """
    CRITICAL REQUIREMENT (Section 21):
    Send soil_moisture = 20, then soil_moisture = 55.
    Verify latest telemetry is 55 (NOT 20, NOT 42, NOT hardcoded).
    Verify both 20 and 55 exist in database history.
    Then send 65 and verify optimal status.
    """
    # 1. Send Reading A: soil_moisture = 20.0
    t1 = datetime(2026, 9, 6, 10, 0, 0, tzinfo=timezone.utc)
    res_a = client.post(
        "/api/v1/telemetry",
        json={
            "device_id": "ESP32_FIELD_01",
            "field_id": "field_01",
            "readings": {"soil_moisture": 20.0, "temperature": 32.5},
            "timestamp": t1.isoformat(),
        },
    )
    assert res_a.status_code == 201

    # Verify Dashboard after Reading A
    dash_a = client.get("/api/v1/farms/farm_01/dashboard").json()
    sensor_moist_a = next(s for s in dash_a["key_sensors"] if s["sensor_type"] == "soil_moisture")
    assert sensor_moist_a["value"] == 20.0
    assert sensor_moist_a["status"] in ("ACTION_NEEDED", "URGENT")
    assert len(dash_a["urgent_actions"]) >= 1

    # 2. Send Reading B: soil_moisture = 55.0
    t2 = datetime(2026, 9, 6, 11, 0, 0, tzinfo=timezone.utc)
    res_b = client.post(
        "/api/v1/telemetry",
        json={
            "device_id": "ESP32_FIELD_01",
            "field_id": "field_01",
            "readings": {"soil_moisture": 55.0, "temperature": 25.0},
            "timestamp": t2.isoformat(),
        },
    )
    assert res_b.status_code == 201

    # Verify Dashboard after Reading B
    dash_b = client.get("/api/v1/farms/farm_01/dashboard").json()
    sensor_moist_b = next(s for s in dash_b["key_sensors"] if s["sensor_type"] == "soil_moisture")
    sensor_temp_b = next(s for s in dash_b["key_sensors"] if s["sensor_type"] in ("air_temperature", "temperature"))

    # MUST be 55.0 and 25.0 — not 20.0, not 42.0!
    assert sensor_moist_b["value"] == 55.0
    assert sensor_temp_b["value"] == 25.0

    # 3. Query historical records: both 20.0 and 55.0 must exist in DB
    history_res = client.get("/api/v1/fields/field_01/readings?sensor_type=soil_moisture")
    assert history_res.status_code == 200
    history = history_res.json()
    assert len(history) == 2
    values = [h["value"] for h in history]
    assert 55.0 in values
    assert 20.0 in values

    # 4. Send Reading C: optimal soil moisture = 65.0
    t3 = datetime(2026, 9, 6, 12, 0, 0, tzinfo=timezone.utc)
    res_c = client.post(
        "/api/v1/telemetry",
        json={
            "device_id": "ESP32_FIELD_01",
            "field_id": "field_01",
            "readings": {"soil_moisture": 65.0, "temperature": 24.0},
            "timestamp": t3.isoformat(),
        },
    )
    assert res_c.status_code == 201
    dash_c = client.get("/api/v1/farms/farm_01/dashboard").json()
    sensor_moist_c = next(s for s in dash_c["key_sensors"] if s["sensor_type"] == "soil_moisture")
    assert sensor_moist_c["value"] == 65.0
    assert sensor_moist_c["status"] == "GOOD"
    assert len(dash_c["urgent_actions"]) == 0


def test_context_aware_interpretation(client):
    """
    Verifies that sensor interpretation changes based on crop, growth stage and soil type.
    """
    # Flowering tomato on loam soil: 22% is severe deficit
    res1 = client.post(
        "/api/v1/telemetry",
        json={
            "device_id": "ESP32_FIELD_01",
            "field_id": "field_01",
            "readings": {"soil_moisture": 22.0},
        },
    )
    interp1 = res1.json()["interpretations"][0]
    assert interp1["status"] in ("ACTION_NEEDED", "URGENT")
    assert "Dry" in interp1["status_label"]
    assert "irrigation" in interp1["recommendation"].lower()

    # Optimal moisture: 65% is good
    res2 = client.post(
        "/api/v1/telemetry",
        json={
            "device_id": "ESP32_FIELD_01",
            "field_id": "field_01",
            "readings": {"soil_moisture": 65.0},
        },
    )
    interp2 = res2.json()["interpretations"][0]
    assert interp2["status"] == "GOOD"
    assert "Optimal" in interp2["status_label"]


def test_freshness_tracking(client, db_session):
    """
    Verifies timestamp-based freshness: CURRENT vs RECENT vs STALE vs DISCONNECTED.
    """
    now = datetime.now(timezone.utc)
    stale_time = now - timedelta(hours=2)

    # Ingest stale reading (2 hours old => STALE)
    client.post(
        "/api/v1/telemetry",
        json={
            "device_id": "ESP32_FIELD_01",
            "field_id": "field_01",
            "readings": {"soil_moisture": 45.0},
            "timestamp": stale_time.isoformat(),
        },
    )

    dash = client.get("/api/v1/farms/farm_01/dashboard").json()
    moist_sensor = next(s for s in dash["key_sensors"] if s["sensor_type"] == "soil_moisture")
    assert moist_sensor["value"] == 45.0
    assert moist_sensor["freshness"] == "STALE"
    assert "hours ago" in moist_sensor["freshness_label"].lower() or "ago" in moist_sensor["freshness_label"].lower()


def test_insufficient_context_recommendations(client):
    """
    When data is missing or telemetry is absent, engine does not invent fake facts.
    """
    res = client.post(
        "/api/v1/ask",
        json={
            "farm_id": "farm_01",
            "query": "Should I water North Block today?",
        },
    )
    assert res.status_code == 200
    ans = res.json()
    # Before telemetry arrives, assistant explicitly states insufficient live telemetry
    assert ans["is_insufficient_data"] is True
    assert "not enough live telemetry" in ans["text"].lower()
