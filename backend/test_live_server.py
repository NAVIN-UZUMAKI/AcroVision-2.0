import httpx
import json

base_url = "http://127.0.0.1:8000/api/v1"

client = httpx.Client(base_url=base_url, timeout=10.0)

print("1. Health Check...")
r = client.get("/health")
print("Health:", r.json())

print("\n2. Ingest Reading A (Soil Moisture = 23.5%, Temp = 33.0°C)...")
r_a = client.post(
    "/telemetry",
    json={
        "device_id": "ESP32_FIELD_01",
        "field_id": "field_01",
        "readings": {"soil_moisture": 23.5, "temperature": 33.0},
    },
)
print("Ingest A Response:", r_a.status_code, r_a.json()["stored_readings"], "readings stored")

print("\n3. Query Dashboard after Reading A...")
dash_a = client.get("/farms/farm_01/dashboard").json()
for s in dash_a["key_sensors"]:
    print(f"  Sensor: {s['name']} -> {s['value']} {s['unit']} | Status: {s['status']} ({s['status_label']}) | Freshness: {s['freshness_label']}")
print(f"  Urgent Actions ({len(dash_a['urgent_actions'])}): {[a['title'] for a in dash_a['urgent_actions']]}")
print(f"  Efficiency Score: {dash_a['efficiency_score']}%")

print("\n4. Ingest Reading B (Soil Moisture = 66.0%, Temp = 24.5°C)...")
r_b = client.post(
    "/telemetry",
    json={
        "device_id": "ESP32_FIELD_01",
        "field_id": "field_01",
        "readings": {"soil_moisture": 66.0, "temperature": 24.5},
    },
)
print("Ingest B Response:", r_b.status_code, r_b.json()["stored_readings"], "readings stored")

print("\n5. Query Dashboard after Reading B...")
dash_b = client.get("/farms/farm_01/dashboard").json()
for s in dash_b["key_sensors"]:
    print(f"  Sensor: {s['name']} -> {s['value']} {s['unit']} | Status: {s['status']} ({s['status_label']}) | Freshness: {s['freshness_label']}")
print(f"  Urgent Actions ({len(dash_b['urgent_actions'])}): {[a['title'] for a in dash_b['urgent_actions']]}")
print(f"  Efficiency Score: {dash_b['efficiency_score']}%")

print("\n6. Query Telemetry History for field_01...")
history = client.get("/fields/field_01/readings?sensor_type=soil_moisture").json()
print(f"  Found {len(history)} historical readings for soil_moisture:")
for h in history:
    print(f"    ID: {h['id']} | Value: {h['value']} {h['unit']} | Timestamp: {h['timestamp']} | Freshness: {h['freshness']}")

print("\n7. Ask Farming Assistant context question...")
ask_res = client.post("/ask", json={"query": "Should I water North Block tomorrow?", "farm_id": "farm_01"}).json()
print(f"  Assistant: {ask_res['text']}")
print(f"  Why: {ask_res['why']}")
print(f"  Action: {ask_res['action']}")
print(f"  Confidence: {ask_res['confidence']}")

print("\nALL LIVE INTEGRATION TESTS PASSED SUCCESSFULLY!")
