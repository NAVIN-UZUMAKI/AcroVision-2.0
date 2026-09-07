/**
 * @file rulesEngine.js
 * Centralized Agronomic Interpretation Engine for AcroVision.
 * Converts raw sensor telemetry + crop context into actionable farmer intelligence.
 */

/**
 * Base ranges by sensor type and crop category.
 */
const CROP_RANGE_CONFIGS = {
  default: {
    soil_moisture: { optimalMin: 50, optimalMax: 70, min: 25, max: 85, unit: '%' },
    soil_temp: { optimalMin: 18, optimalMax: 26, min: 10, max: 35, unit: '°C' },
    air_temp: { optimalMin: 20, optimalMax: 28, min: 10, max: 38, unit: '°C' },
    air_humidity: { optimalMin: 55, optimalMax: 75, min: 30, max: 95, unit: '%' },
    soil_ph: { optimalMin: 6.0, optimalMax: 7.0, min: 5.0, max: 8.5, unit: 'pH' },
    soil_ec: { optimalMin: 1.2, optimalMax: 2.2, min: 0.5, max: 3.5, unit: 'dS/m' },
    nitrogen: { optimalMin: 35, optimalMax: 60, min: 15, max: 90, unit: 'mg/kg' },
    solar_radiation: { optimalMin: 350, optimalMax: 650, min: 100, max: 950, unit: 'W/m²' },
  },
  Tomato: {
    soil_moisture: { optimalMin: 55, optimalMax: 75, min: 30, max: 85, unit: '%' },
    soil_temp: { optimalMin: 20, optimalMax: 27, min: 14, max: 34, unit: '°C' },
    air_temp: { optimalMin: 21, optimalMax: 29, min: 12, max: 36, unit: '°C' },
    air_humidity: { optimalMin: 60, optimalMax: 75, min: 40, max: 90, unit: '%' },
    soil_ph: { optimalMin: 6.2, optimalMax: 6.8, min: 5.5, max: 7.5, unit: 'pH' },
  },
  Strawberry: {
    soil_moisture: { optimalMin: 60, optimalMax: 80, min: 35, max: 90, unit: '%' },
    soil_temp: { optimalMin: 16, optimalMax: 22, min: 8, max: 30, unit: '°C' },
    soil_ph: { optimalMin: 5.5, optimalMax: 6.5, min: 5.0, max: 7.2, unit: 'pH' },
  },
  Corn: {
    soil_moisture: { optimalMin: 50, optimalMax: 70, min: 25, max: 85, unit: '%' },
    soil_temp: { optimalMin: 20, optimalMax: 30, min: 12, max: 38, unit: '°C' },
    nitrogen: { optimalMin: 50, optimalMax: 80, min: 20, max: 110, unit: 'mg/kg' },
  },
  Blueberry: {
    soil_moisture: { optimalMin: 55, optimalMax: 70, min: 30, max: 85, unit: '%' },
    soil_ph: { optimalMin: 4.5, optimalMax: 5.5, min: 4.0, max: 6.2, unit: 'pH' },
  },
};

/**
 * Adjust ranges according to soil type water holding capacity.
 */
function adjustForSoilType(range, soilType) {
  const adjusted = { ...range };
  if (!soilType) return adjusted;

  if (soilType.toLowerCase().includes('sand')) {
    // Sand drains faster; preferred moisture is slightly lower, action triggered sooner
    adjusted.optimalMin = Math.max(30, adjusted.optimalMin - 5);
    adjusted.optimalMax = Math.max(50, adjusted.optimalMax - 5);
  } else if (soilType.toLowerCase().includes('clay')) {
    // Clay holds moisture longer; waterlogging risk is higher
    adjusted.optimalMax = Math.min(80, adjusted.optimalMax + 5);
  }
  return adjusted;
}

/**
 * Adjust ranges according to growth stage requirements.
 */
function adjustForGrowthStage(range, sensorType, growthStage) {
  const adjusted = { ...range };
  if (!growthStage) return adjusted;

  const stage = growthStage.toLowerCase();
  if (sensorType === 'soil_moisture') {
    if (stage.includes('flowering') || stage.includes('fruit') || stage.includes('budding')) {
      // High water demand during flowering & fruit set
      adjusted.optimalMin += 5;
      adjusted.optimalMax += 5;
    } else if (stage.includes('ripen') || stage.includes('harvest')) {
      // Drier soil preferred near harvest to concentrate sugars
      adjusted.optimalMin = Math.max(35, adjusted.optimalMin - 10);
      adjusted.optimalMax = Math.max(55, adjusted.optimalMax - 10);
    }
  }
  return adjusted;
}

/**
 * Core interpretation function: derives agricultural understanding from sensor readings.
 */
export function interpretSensorReading({
  sensorType,
  value,
  cropName = 'General Crop',
  growthStage = 'Vegetative Growth',
  soilType = 'Loam',
  lastUpdated = new Date().toISOString(),
  isOnline = true,
}) {
  // Determine Data Freshness
  const now = new Date().getTime();
  const readingTime = new Date(lastUpdated).getTime();
  const diffMinutes = Math.max(0, Math.floor((now - readingTime) / (1000 * 60)));

  let freshness;
  let freshnessLabel;

  if (!isOnline) {
    freshness = 'DISCONNECTED';
    freshnessLabel = 'Sensor disconnected';
  } else if (diffMinutes < 15) {
    freshness = 'CURRENT';
    freshnessLabel = diffMinutes === 0 ? 'Updated just now' : `Updated ${diffMinutes} min ago`;
  } else if (diffMinutes < 60) {
    freshness = 'RECENT';
    freshnessLabel = `Updated ${diffMinutes} min ago`;
  } else if (diffMinutes < 180) {
    freshness = 'STALE';
    const hours = Math.floor(diffMinutes / 60);
    freshnessLabel = `Updated ${hours}h ago (Data may be outdated)`;
  } else {
    freshness = 'DISCONNECTED';
    freshnessLabel = 'No recent data (>3h)';
  }

  // Handle missing data
  if (value === null || value === undefined || isNaN(value) || !isOnline) {
    return {
      value: null,
      unit: CROP_RANGE_CONFIGS.default[sensorType]?.unit || '',
      status: isOnline ? 'WATCH' : 'URGENT',
      statusLabel: isOnline ? 'No Data' : 'Disconnected',
      preferredRange: CROP_RANGE_CONFIGS.default[sensorType] || { min: 0, max: 100, optimalMin: 40, optimalMax: 70, unit: '' },
      explanation: isOnline ? 'Awaiting initial telemetry transmission.' : 'Sensor node is currently offline or unpowered.',
      recommendation: isOnline ? 'Check gateway connection.' : 'Inspect sensor battery and wireless signal.',
      timestamp: lastUpdated,
      freshness,
      freshnessLabel,
    };
  }

  // Resolve Preferred Range
  const baseRange = (CROP_RANGE_CONFIGS[cropName] && CROP_RANGE_CONFIGS[cropName][sensorType])
    ? CROP_RANGE_CONFIGS[cropName][sensorType]
    : (CROP_RANGE_CONFIGS.default[sensorType] || { min: 0, max: 100, optimalMin: 40, optimalMax: 70, unit: '' });

  const soilAdjusted = adjustForSoilType(baseRange, soilType);
  const finalRange = adjustForGrowthStage(soilAdjusted, sensorType, growthStage);

  // Compute Status, StatusLabel, Explanation, Recommendation
  let status;
  let statusLabel;
  let explanation;
  let recommendation;

  if (sensorType === 'soil_moisture') {
    if (value < finalRange.min) {
      status = 'URGENT';
      statusLabel = 'Critically Dry';
      explanation = `Soil moisture is at ${value}%, significantly below minimum root threshold (${finalRange.min}%). Crop is at severe water deficit risk.`;
      recommendation = `Trigger emergency drip irrigation immediately for 45 minutes.`;
    } else if (value < finalRange.optimalMin) {
      status = 'ACTION NEEDED';
      statusLabel = 'Dry — Water Needed';
      explanation = `Soil moisture is at ${value}%, dropping below preferred target (${finalRange.optimalMin}–${finalRange.optimalMax}%).`;
      recommendation = `Schedule irrigation tomorrow morning before peak sun.`;
    } else if (value > finalRange.max) {
      status = 'ACTION NEEDED';
      statusLabel = 'Waterlogged';
      explanation = `Soil moisture is ${value}%, exceeding safe root aeration limit (${finalRange.max}%). Risk of root suffocation or fungal damping.`;
      recommendation = `Pause all scheduled watering; check field drainage channels.`;
    } else if (value > finalRange.optimalMax) {
      status = 'WATCH';
      statusLabel = 'Slightly Wet';
      explanation = `Soil moisture is elevated (${value}%). No immediate danger, but monitor drainage.`;
      recommendation = `Delay next scheduled watering cycle by 12 hours.`;
    } else {
      status = 'GOOD';
      statusLabel = 'Optimal Moisture';
      explanation = `Soil moisture is ${value}%, ideal for ${cropName} during ${growthStage}.`;
      recommendation = `Maintain current regular irrigation schedule.`;
    }
  } else if (sensorType === 'soil_temp') {
    if (value < finalRange.min) {
      status = 'ACTION NEEDED';
      statusLabel = 'Cold Root Zone';
      explanation = `Soil temperature is ${value}°C, slowing root nutrient uptake.`;
      recommendation = `Consider plastic mulch or greenhouse covers if frost risk persists.`;
    } else if (value > finalRange.optimalMax) {
      status = 'WATCH';
      statusLabel = 'Elevated Soil Heat';
      explanation = `Soil temperature is ${value}°C, which increases root evaporation rate.`;
      recommendation = `Ensure adequate canopy shade or mulch cover.`;
    } else {
      status = 'GOOD';
      statusLabel = 'Ideal Root Temp';
      explanation = `Root zone temperature is ${value}°C, supporting active nutrient absorption.`;
      recommendation = null;
    }
  } else if (sensorType === 'soil_ph') {
    if (value < finalRange.optimalMin) {
      status = 'WATCH';
      statusLabel = 'Acidic Soil';
      explanation = `Soil pH is ${value}, lower than preferred ${finalRange.optimalMin}–${finalRange.optimalMax}.`;
      recommendation = `Plan agricultural lime application after harvest.`;
    } else if (value > finalRange.optimalMax) {
      status = 'WATCH';
      statusLabel = 'Alkaline Soil';
      explanation = `Soil pH is ${value}, which may restrict iron and phosphorus availability.`;
      recommendation = `Add elemental sulfur or organic compost to lower pH over time.`;
    } else {
      status = 'GOOD';
      statusLabel = 'Balanced pH';
      explanation = `Soil pH is ${value}, ensuring high nutrient bioavailability.`;
      recommendation = null;
    }
  } else {
    // General sensor fallback
    if (value < finalRange.min || value > finalRange.max) {
      status = 'ACTION NEEDED';
      statusLabel = 'Out of Range';
      explanation = `Reading is ${value}${finalRange.unit}, outside expected bounds.`;
      recommendation = `Inspect field conditions and verify sensor placement.`;
    } else if (value < finalRange.optimalMin || value > finalRange.optimalMax) {
      status = 'WATCH';
      statusLabel = 'Sub-optimal';
      explanation = `Reading is ${value}${finalRange.unit}, slightly outside optimal window.`;
      recommendation = `Observe trend over next 24 hours.`;
    } else {
      status = 'GOOD';
      statusLabel = 'Optimal';
      explanation = `Reading is ${value}${finalRange.unit}, within preferred agricultural targets.`;
      recommendation = null;
    }
  }

  return {
    value,
    unit: finalRange.unit || '',
    status,
    statusLabel,
    preferredRange: finalRange,
    explanation,
    recommendation,
    timestamp: lastUpdated,
    freshness,
    freshnessLabel,
  };
}
