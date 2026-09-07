def test_telemetry_batch_ingestion_and_storage(client):
    payload = {
        "device_id": "ESP32_FIELD_01",
        "field_id": "field_01",
        "readings": {
            "soil_moisture": 38.0,
            "temperature": 29.4,
            "humidity": 67.0,
        },
        "battery_pct": 94.0,
        "rssi_dbm": -62,
    }
    response = client.post("/api/v1/telemetry", json=payload)
    assert response.status_code == 201
    data = response.json()

    assert data["success"] is True
    assert data["device_id"] == "ESP32_FIELD_01"
    assert data["stored_readings"] == 3
    assert len(data["interpretations"]) == 3

    # Verify soil moisture interpretation
    moist_interp = next(i for i in data["interpretations"] if i["sensor_type"] == "soil_moisture")
    assert moist_interp["status"] == "ACTION_NEEDED"
    assert "Dry" in moist_interp["status_label"]
    assert "Schedule irrigation" in moist_interp["recommendation"]

    # Verify alert was created
    assert len(data["alerts_created"]) >= 1


def test_telemetry_history_query(client):
    # Post reading
    client.post(
        "/api/v1/telemetry",
        json={
            "device_id": "ESP32_FIELD_01",
            "field_id": "field_01",
            "readings": {"soil_moisture": 42.0},
        },
    )

    # Query history
    response = client.get("/api/v1/fields/field_01/readings")
    assert response.status_code == 200
    readings = response.json()
    assert len(readings) >= 1
    assert readings[0]["value"] == 42.0
    assert readings[0]["sensor_type"] == "soil_moisture"
    assert readings[0]["freshness"] == "CURRENT"


def test_alert_auto_resolution_on_healthy_reading(client):
    # 1. Post low moisture (triggers alert)
    client.post(
        "/api/v1/telemetry",
        json={
            "device_id": "ESP32_FIELD_01",
            "field_id": "field_01",
            "readings": {"soil_moisture": 35.0},
        },
    )
    alerts_res = client.get("/api/v1/farms/farm_01/alerts?status=ACTIVE")
    assert len(alerts_res.json()) >= 1

    # 2. Post optimal moisture (resolves alert)
    client.post(
        "/api/v1/telemetry",
        json={
            "device_id": "ESP32_FIELD_01",
            "field_id": "field_01",
            "readings": {"soil_moisture": 62.0},
        },
    )
    active_alerts_res = client.get("/api/v1/farms/farm_01/alerts?status=ACTIVE")
    resolved_alerts_res = client.get("/api/v1/farms/farm_01/alerts?status=RESOLVED")

    assert len(active_alerts_res.json()) == 0
    assert len(resolved_alerts_res.json()) >= 1
