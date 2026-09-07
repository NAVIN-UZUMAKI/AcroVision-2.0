from typing import Dict, Any, Optional
from datetime import datetime, timezone
import requests


class WeatherService:
    """
    Real weather service using Open-Meteo.

    Converts real forecast data into the format expected
    by the AcroVision frontend and AI prediction layer.
    """

    # Default farm coordinates.
    # These can later come from the user's selected farm.
    DEFAULT_LATITUDE = 13.4050
    DEFAULT_LONGITUDE = 80.1240

    @staticmethod
    def get_weather_for_location(
        location: Optional[str] = None
    ) -> Dict[str, Any]:

        latitude = WeatherService.DEFAULT_LATITUDE
        longitude = WeatherService.DEFAULT_LONGITUDE

        url = "https://api.open-meteo.com/v1/forecast"

        params = {
            "latitude": latitude,
            "longitude": longitude,
            "current": (
                "temperature_2m,"
                "relative_humidity_2m,"
                "apparent_temperature,"
                "precipitation,"
                "weather_code,"
                "wind_speed_10m,"
                "wind_direction_10m"
            ),
            "daily": (
                "temperature_2m_max,"
                "temperature_2m_min,"
                "precipitation_probability_max,"
                "precipitation_sum,"
                "weather_code,"
                "wind_speed_10m_max"
            ),
            "timezone": "auto",
            "forecast_days": 5,
        }

        try:
            response = requests.get(
                url,
                params=params,
                timeout=10,
            )

            response.raise_for_status()

            data = response.json()

            current = data["current"]
            daily = data["daily"]

            weather_code = current["weather_code"]

            return {
                "status": "success",
                "provider": "Open-Meteo",
                "location": location or "AcroVision Farm",
                "temperature_c": current["temperature_2m"],
                "humidity_pct": current["relative_humidity_2m"],
                "wind_speed_kmh": current["wind_speed_10m"],
                "wind_direction": current["wind_direction_10m"],
                "rain_probability": daily["precipitation_probability_max"][0],
                "precipitation_mm": current["precipitation"],
                "weather_code": weather_code,
                "forecast_summary": WeatherService.weather_code_to_text(
                    weather_code
                ),
                "timestamp": current["time"],
                "forecast": daily,
            }

        except Exception as exc:
            print(f"Weather API error: {exc}")

            # Safe fallback if the external API is unavailable.
            return {
                "status": "fallback",
                "provider": "AcroVision Local Fallback",
                "location": location or "AcroVision Farm",
                "temperature_c": 28.5,
                "humidity_pct": 64.0,
                "wind_speed_kmh": 9.2,
                "wind_direction": 0,
                "rain_probability": 15.0,
                "precipitation_mm": 0.0,
                "weather_code": 1,
                "forecast_summary": "Clear to partly cloudy",
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "forecast": {},
            }

    @staticmethod
    def weather_code_to_text(code: int) -> str:
        """
        Convert WMO weather codes into human-readable conditions.
        """

        if code == 0:
            return "Clear sky"

        if code in [1, 2]:
            return "Mainly clear to partly cloudy"

        if code == 3:
            return "Overcast"

        if code in [45, 48]:
            return "Foggy"

        if code in [51, 53, 55]:
            return "Drizzle"

        if code in [61, 63, 65]:
            return "Rain"

        if code in [66, 67]:
            return "Freezing rain"

        if code in [71, 73, 75, 77]:
            return "Snow"

        if code in [80, 81, 82]:
            return "Rain showers"

        if code in [85, 86]:
            return "Snow showers"

        if code in [95, 96, 99]:
            return "Thunderstorm"

        return "Variable weather"
