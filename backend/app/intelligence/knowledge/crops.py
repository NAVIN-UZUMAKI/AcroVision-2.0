from typing import Dict, Any

CROP_PROFILES: Dict[str, Dict[str, Any]] = {
    "tomato": {
        "crop_name": "Tomato",
        "category": "Solanaceous Vegetable",
        "sensor_targets": {
            "soil_moisture": {"optimal_min": 55.0, "optimal_max": 75.0, "min": 30.0, "max": 85.0},
            "soil_temperature": {"optimal_min": 20.0, "optimal_max": 27.0, "min": 14.0, "max": 34.0},
            "air_temperature": {"optimal_min": 21.0, "optimal_max": 29.0, "min": 12.0, "max": 36.0},
            "humidity": {"optimal_min": 60.0, "optimal_max": 75.0, "min": 40.0, "max": 90.0},
            "soil_ph": {"optimal_min": 6.2, "optimal_max": 6.8, "min": 5.5, "max": 7.5},
            "soil_ec": {"optimal_min": 1.5, "optimal_max": 2.5, "min": 0.8, "max": 3.8},
        },
    },
    "strawberry": {
        "crop_name": "Strawberry",
        "category": "Berry Fruit",
        "sensor_targets": {
            "soil_moisture": {"optimal_min": 60.0, "optimal_max": 80.0, "min": 35.0, "max": 90.0},
            "soil_temperature": {"optimal_min": 16.0, "optimal_max": 22.0, "min": 8.0, "max": 30.0},
            "air_temperature": {"optimal_min": 18.0, "optimal_max": 25.0, "min": 8.0, "max": 32.0},
            "humidity": {"optimal_min": 60.0, "optimal_max": 80.0, "min": 45.0, "max": 92.0},
            "soil_ph": {"optimal_min": 5.5, "optimal_max": 6.5, "min": 5.0, "max": 7.2},
            "soil_ec": {"optimal_min": 1.0, "optimal_max": 1.8, "min": 0.5, "max": 2.5},
        },
    },
    "corn": {
        "crop_name": "Corn",
        "category": "Cereal Grain",
        "sensor_targets": {
            "soil_moisture": {"optimal_min": 50.0, "optimal_max": 70.0, "min": 25.0, "max": 85.0},
            "soil_temperature": {"optimal_min": 20.0, "optimal_max": 30.0, "min": 12.0, "max": 38.0},
            "air_temperature": {"optimal_min": 22.0, "optimal_max": 32.0, "min": 10.0, "max": 40.0},
            "nitrogen": {"optimal_min": 50.0, "optimal_max": 80.0, "min": 20.0, "max": 110.0},
            "soil_ph": {"optimal_min": 6.0, "optimal_max": 7.0, "min": 5.5, "max": 7.8},
        },
    },
    "blueberry": {
        "crop_name": "Blueberry",
        "category": "Acidophilic Berry",
        "sensor_targets": {
            "soil_moisture": {"optimal_min": 55.0, "optimal_max": 70.0, "min": 30.0, "max": 85.0},
            "soil_ph": {"optimal_min": 4.5, "optimal_max": 5.5, "min": 4.0, "max": 6.2},
            "soil_ec": {"optimal_min": 0.8, "optimal_max": 1.5, "min": 0.4, "max": 2.0},
        },
    },
    "potato": {
        "crop_name": "Potato",
        "category": "Tuber",
        "sensor_targets": {
            "soil_moisture": {"optimal_min": 65.0, "optimal_max": 80.0, "min": 35.0, "max": 90.0},
            "soil_temperature": {"optimal_min": 15.0, "optimal_max": 22.0, "min": 10.0, "max": 28.0},
            "soil_ph": {"optimal_min": 5.0, "optimal_max": 6.2, "min": 4.8, "max": 7.0},
        },
    },
    "wheat": {
        "crop_name": "Wheat",
        "category": "Cereal Grain",
        "sensor_targets": {
            "soil_moisture": {"optimal_min": 45.0, "optimal_max": 65.0, "min": 20.0, "max": 80.0},
            "soil_temperature": {"optimal_min": 15.0, "optimal_max": 24.0, "min": 5.0, "max": 32.0},
            "soil_ph": {"optimal_min": 6.0, "optimal_max": 7.5, "min": 5.5, "max": 8.0},
        },
    },
    "rice": {
        "crop_name": "Rice",
        "category": "Paddy Grain",
        "sensor_targets": {
            "soil_moisture": {"optimal_min": 70.0, "optimal_max": 95.0, "min": 45.0, "max": 100.0},
            "soil_temperature": {"optimal_min": 22.0, "optimal_max": 32.0, "min": 16.0, "max": 38.0},
            "water_level": {"optimal_min": 50.0, "optimal_max": 85.0, "min": 20.0, "max": 95.0},
            "soil_ph": {"optimal_min": 5.5, "optimal_max": 6.8, "min": 5.0, "max": 7.5},
        },
    },
}


def get_crop_profile(crop_name: str) -> Dict[str, Any]:
    key = crop_name.strip().lower()
    for crop_key, profile in CROP_PROFILES.items():
        if crop_key in key or key in crop_key:
            return profile
    return {
        "crop_name": crop_name,
        "category": "General Crop",
        "sensor_targets": {},
    }
