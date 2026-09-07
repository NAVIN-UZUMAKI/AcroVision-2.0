import { INITIAL_WEATHER } from '../data/seedWeather';
import { api } from './apiClient';

export const weatherService = {
  /**
   * Get weather report and farming forecast for a location.
   */
  async getWeather(locationName = 'Farm Location') {
    try {
      const res = await api.get(`/weather?location=${encodeURIComponent(locationName)}`);
      if (res && res.temperature_c !== undefined) {
        return {
          location: res.location || locationName,
          temperature: res.temperature_c,
          condition: res.condition || 'Sunny',
          humidity: res.humidity ?? 65,
          windSpeed: res.wind_speed_kmh ?? 8,
          windDirection: res.wind_direction || 'NE',
          precipitationChance: res.rain_probability_pct ?? 10,
          uvIndex: res.uv_index ?? 7,
          solarRadiation: res.solar_radiation_wm2 ?? 620,
          forecast: INITIAL_WEATHER.forecast,
          spraySuitability: res.spray_recommendation
            ? {
                isSuitable: res.is_suitable_for_spraying,
                summary: res.spray_recommendation,
                reason: res.reason,
                bestWindow: res.best_window,
              }
            : this.getSprayEvaluation(res.wind_speed_kmh || 8, res.rain_probability_pct || 10),
          irrigationGuidance: res.irrigation_guidance || 'Ideal weather for standard drip irrigation.',
          timestamp: res.timestamp || new Date().toISOString(),
        };
      }
    } catch {
      // Offline fallback
    }
    return {
      ...INITIAL_WEATHER,
      location: locationName || INITIAL_WEATHER.location,
      timestamp: new Date().toISOString(),
    };
  },

  /**
   * Evaluate suitability for spraying / tractor work.
   */
  getSprayEvaluation(windSpeedKmh, precipChance) {
    if (windSpeedKmh > 20) {
      return {
        isSuitable: false,
        summary: 'High Drift Risk — Not Recommended',
        reason: `Wind is ${windSpeedKmh} km/h (above 15 km/h limit). Spray droplets will drift off-target.`,
        bestWindow: 'Wait for wind to subside below 12 km/h in the evening.',
      };
    }
    if (precipChance > 50) {
      return {
        isSuitable: false,
        summary: 'Rain Risk — Washout Hazard',
        reason: `${precipChance}% chance of precipitation will wash off chemical/biological applications.`,
        bestWindow: 'Postpone spraying until weather clears.',
      };
    }
    return {
      isSuitable: true,
      summary: 'Optimal Spray Window Active',
      reason: `Calm wind (${windSpeedKmh} km/h) and low rain probability (${precipChance}%). High deposition efficiency.`,
      bestWindow: 'Early morning (06:30 – 09:30 AM) or late afternoon (04:30 – 06:30 PM)',
    };
  },
};

