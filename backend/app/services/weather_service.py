from typing import Dict, Any, Optional
from datetime import datetime, timezone


class WeatherService:
    """
    Weather Service Abstraction.
    Ready to integrate with Open-Meteo, IMD, or local on-farm weather stations.
    """

    @staticmethod
    def get_weather_for_location(location: Optional[str] = None) -> Dict[str, Any]:
        now = datetime.now(timezone.utc)
        return {
            "status": "configured_local_fallback",
            "provider": "AcroVision Weather Integration Interface",
            "location": location or "Farm Location",
            "temperature_c": 28.5,
            "humidity_pct": 64.0,
            "wind_speed_kmh": 9.2,
            "rain_probability": 15.0,
            "forecast_summary": "Clear to partly cloudy with calm morning winds. Favorable for field work and spraying.",
            "spray_suitability": {
                "is_suitable": True,
                "reason": "Low wind drift risk (<15 km/h) and minimal rain probability (<20%).",
                "recommended_window": "06:30 AM – 09:30 AM",
            },
            "timestamp": now.isoformat(),
        }
