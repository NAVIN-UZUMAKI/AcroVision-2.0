from typing import Dict, Any


class WeatherPredictor:
    """
    AI-style weather prediction layer for AcroVision.

    Takes available weather information and estimates
    tomorrow's agricultural weather conditions.
    """

    @staticmethod
    def predict_tomorrow(weather: Dict[str, Any]) -> Dict[str, Any]:
        temperature = float(weather.get("temperature_c", 28.0))
        humidity = float(weather.get("humidity_pct", 60.0))
        rain_probability = float(weather.get("rain_probability", 20.0))
        wind_speed = float(weather.get("wind_speed_kmh", 10.0))

        # Estimate tomorrow's temperature range
        min_temp = round(temperature - 2.0, 1)
        max_temp = round(temperature + 3.0, 1)

        # Determine expected weather condition
        if rain_probability >= 70:
            condition = "Rainy"
        elif rain_probability >= 40:
            condition = "Partly cloudy with possible rain"
        elif humidity >= 75:
            condition = "Cloudy and humid"
        else:
            condition = "Clear to partly cloudy"

        # Agricultural interpretation
        if rain_probability >= 60:
            farming_advice = (
                "Rain is likely tomorrow. Avoid unnecessary irrigation "
                "and monitor soil moisture before activating the pump."
            )
        elif rain_probability >= 30:
            farming_advice = (
                "There is a moderate chance of rain tomorrow. "
                "Check soil moisture and consider delaying irrigation."
            )
        else:
            farming_advice = (
                "Low rainfall probability is expected. "
                "Normal irrigation can be considered based on soil moisture."
            )

        # Spray recommendation
        if wind_speed <= 15 and rain_probability < 30:
            spray_advice = "Favorable conditions for spraying."
        elif wind_speed > 15:
            spray_advice = "Avoid spraying because wind may cause spray drift."
        else:
            spray_advice = "Avoid spraying if rainfall is expected."

        # Confidence score
        confidence = 80

        if rain_probability >= 70 or rain_probability <= 10:
            confidence += 5

        if humidity >= 80:
            confidence += 3

        confidence = min(confidence, 95)

        return {
            "prediction_for": "tomorrow",
            "temperature": {
                "min_c": min_temp,
                "max_c": max_temp,
            },
            "humidity_pct": round(humidity, 1),
            "rain_probability_pct": round(rain_probability, 1),
            "condition": condition,
            "wind_speed_kmh": round(wind_speed, 1),
            "confidence_pct": confidence,
            "farming_advice": farming_advice,
            "spray_advice": spray_advice,
        }