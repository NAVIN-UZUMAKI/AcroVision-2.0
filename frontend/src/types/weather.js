/**
 * @file weather.js
 * Domain contracts for Agricultural Weather and Farming Advisories.
 */

/**
 * @typedef {Object} SprayAdvisory
 * @property {boolean} isSuitable
 * @property {string} summary
 * @property {string} reason
 * @property {string} bestWindow
 */

/**
 * @typedef {Object} ForecastDay
 * @property {string} date
 * @property {string} dayName
 * @property {number} tempHigh
 * @property {number} tempLow
 * @property {string} condition - 'Sunny' | 'Partly Cloudy' | 'Scattered Showers' | 'Rain' | 'Windy'
 * @property {string} conditionIcon
 * @property {number} precipChance - 0 to 100%
 * @property {number} expectedPrecipMm
 * @property {number} windSpeedKmh
 * @property {string} farmingAdvice - e.g. "Optimal for spraying pesticides in morning"
 */

/**
 * @typedef {Object} WeatherReport
 * @property {string} location
 * @property {string} timestamp
 * @property {boolean} isDemoData
 * @property {number} temperature
 * @property {number} feelsLike
 * @property {number} humidity
 * @property {number} windSpeedKmh
 * @property {string} windDirection
 * @property {number} precipitationMm
 * @property {number} uvIndex
 * @property {string} condition
 * @property {string} conditionDescription
 * @property {string} farmerSummary - e.g. "Warm & clear. Great day for fieldwork and tractor operations."
 * @property {SprayAdvisory} sprayAdvisory
 * @property {string} irrigationGuidance - e.g. "No rainfall forecasted next 48h; standard irrigation required."
 * @property {ForecastDay[]} forecast
 */
