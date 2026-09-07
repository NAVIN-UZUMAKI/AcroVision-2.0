from typing import Optional

from fastapi import APIRouter, Query

from app.services.weather_service import WeatherService
from app.intelligence.weather_predictor import WeatherPredictor


router = APIRouter(
    prefix="/weather",
)


@router.get(
    "/tomorrow",
    summary="Predict tomorrow's weather",
)
def predict_tomorrow_weather(
    location: Optional[str] = Query(
        default=None,
        description="Farm or city location",
    ),
):
    # Get the latest available weather information
    weather = WeatherService.get_weather_for_location(location)

    # Generate tomorrow's prediction
    prediction = WeatherPredictor.predict_tomorrow(weather)

    return {
        "status": "success",
        "location": weather.get("location"),
        "prediction": prediction,
        "source": weather.get("provider"),
    }