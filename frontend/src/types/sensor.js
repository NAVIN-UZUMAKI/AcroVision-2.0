/**
 * @file sensor.js
 * Domain contracts for Sensors, Readings, Statuses, and Data Freshness.
 */

/**
 * @typedef {'CURRENT' | 'RECENT' | 'STALE' | 'DISCONNECTED' | 'NO_DATA'} DataFreshness
 */

/**
 * @typedef {'soil_moisture' | 'soil_temp' | 'air_temp' | 'air_humidity' | 'solar_radiation' | 'soil_ph' | 'soil_ec' | 'nitrogen' | 'phosphorus' | 'potassium'} SensorType
 */

/**
 * @typedef {Object} PreferredRange
 * @property {number} min
 * @property {number} max
 * @property {number} optimalMin
 * @property {number} optimalMax
 * @property {string} unit
 */

/**
 * @typedef {Object} InterpretedReading
 * @property {number|null} value
 * @property {string} unit
 * @property {'GOOD' | 'WATCH' | 'ACTION NEEDED' | 'URGENT'} status
 * @property {string} statusLabel - e.g. "Optimal", "Low Moisture", "Heat Stress"
 * @property {PreferredRange} preferredRange
 * @property {string} explanation - e.g. "Within good range for Flowering Tomatoes"
 * @property {string|null} recommendation - e.g. "Schedule 25min drip irrigation tomorrow morning"
 * @property {string} timestamp
 * @property {DataFreshness} freshness
 * @property {string} freshnessLabel - e.g. "Updated 4 min ago"
 */

/**
 * @typedef {Object} Sensor
 * @property {string} id
 * @property {string} deviceId
 * @property {string} fieldId
 * @property {string} name
 * @property {SensorType} type
 * @property {string} iconName
 * @property {string} depthOrPlacement - e.g. "Root Zone (15cm)", "Canopy Level"
 * @property {InterpretedReading} currentReading
 * @property {boolean} isOnline
 * @property {string} lastSeen
 */

export const SENSOR_TYPES_META = {
  soil_moisture: { label: 'Soil Moisture', unit: '%', icon: 'Droplets', category: 'soil' },
  soil_temp: { label: 'Soil Temperature', unit: '°C', icon: 'Thermometer', category: 'soil' },
  air_temp: { label: 'Air Temperature', unit: '°C', icon: 'Sun', category: 'climate' },
  air_humidity: { label: 'Air Humidity', unit: '%', icon: 'CloudRain', category: 'climate' },
  solar_radiation: { label: 'Sunlight / DLI', unit: 'W/m²', icon: 'SunMedium', category: 'climate' },
  soil_ph: { label: 'Soil pH', unit: 'pH', icon: 'FlaskConical', category: 'nutrients' },
  soil_ec: { label: 'Electrical Conductivity', unit: 'dS/m', icon: 'Zap', category: 'nutrients' },
  nitrogen: { label: 'Available Nitrogen (N)', unit: 'mg/kg', icon: 'Leaf', category: 'nutrients' },
};
