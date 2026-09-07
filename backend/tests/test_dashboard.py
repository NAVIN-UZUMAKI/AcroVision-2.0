def test_dashboard_initial_state_no_fake_readings(client):
    response = client.get("/api/v1/farms/farm_01/dashboard")
    assert response.status_code == 200
    data = response.json()

    assert data["farm"]["id"] == "farm_01"
    assert data["farm"]["name"] == "Test Valley Farm"
    assert data["overall_status"] == "GOOD"
    assert len(data["fields"]) >= 1
    # Ensure NO fake sensor readings exist initially
    assert len(data["key_sensors"]) == 0
    assert len(data["urgent_actions"]) == 0


def test_dashboard_reacts_to_changing_real_telemetry(client):
    # 1. Ingest low soil moisture = 22%
    res1 = client.post(
        "/api/v1/telemetry",
        json={
            "device_id": "ESP32_FIELD_01",
            "field_id": "field_01",
            "readings": {"soil_moisture": 22.0, "temperature": 31.0},
        },
    )
    assert res1.status_code == 201

    # 2. Query dashboard - verify real value 22.0 appears and status is updated
    dash1 = client.get("/api/v1/farms/farm_01/dashboard").json()
    assert len(dash1["key_sensors"]) >= 1

    moist_sensor = next(s for s in dash1["key_sensors"] if s["sensor_type"] == "soil_moisture")
    assert moist_sensor["value"] == 22.0
    assert moist_sensor["status"] in ("ACTION_NEEDED", "URGENT")
    assert len(dash1["urgent_actions"]) >= 1
    assert dash1["efficiency_score"] < 100

    # 3. Ingest subsequent optimal moisture = 62%
    res2 = client.post(
        "/api/v1/telemetry",
        json={
            "device_id": "ESP32_FIELD_01",
            "field_id": "field_01",
            "readings": {"soil_moisture": 62.0, "temperature": 26.0},
        },
    )
    assert res2.status_code == 201

    # 4. Query dashboard - verify real value 62.0 appears and alert is cleared
    dash2 = client.get("/api/v1/farms/farm_01/dashboard").json()
    moist_sensor2 = next(s for s in dash2["key_sensors"] if s["sensor_type"] == "soil_moisture")
    assert moist_sensor2["value"] == 62.0
    assert moist_sensor2["status"] == "GOOD"
    assert moist_sensor2["status_label"] == "Optimal Moisture"
    assert len(dash2["urgent_actions"]) == 0
    assert dash2["efficiency_score"] == 100


def test_dashboard_not_found(client):
    response = client.get("/api/v1/farms/non_existent_farm/dashboard")
    assert response.status_code == 404
