/**
 * @file farm.js
 * Domain contracts for Farms, Fields, Crops, and Agricultural Attributes.
 * Ready for mapping to FastAPI SQLAlchemy models in Prompt 2.
 */

/**
 * @typedef {Object} Crop
 * @property {string} id
 * @property {string} name
 * @property {string} variety
 * @property {string} category - 'Vegetable' | 'Fruit' | 'Grain' | 'Legume' | 'Cash Crop'
 * @property {string} growthStage - 'Germination' | 'Vegetative' | 'Flowering' | 'Fruiting' | 'Ripening' | 'Harvest'
 * @property {number} daysToMaturity
 * @property {number} daysPlanted
 */

/**
 * @typedef {Object} Field
 * @property {string} id
 * @property {string} farmId
 * @property {string} name
 * @property {number} area
 * @property {'acres' | 'hectares' | 'sq_meters'} areaUnit
 * @property {Crop} crop
 * @property {'Loam' | 'Clay' | 'Sandy' | 'Silt' | 'Peat' | 'Chalky'} soilType
 * @property {'Drip' | 'Sprinkler' | 'Flood' | 'Furrow' | 'Rainfed'} irrigationMethod
 * @property {string[]} sensorIds
 * @property {string[]} deviceIds
 * @property {'GOOD' | 'WATCH' | 'ACTION NEEDED' | 'URGENT'} currentStatus
 * @property {number} healthScore - 0 to 100
 * @property {string} summaryAdvice
 * @property {string} lastUpdated
 */

/**
 * @typedef {Object} Farm
 * @property {string} id
 * @property {string} name
 * @property {string} farmerName
 * @property {string} location
 * @property {number} totalArea
 * @property {'acres' | 'hectares' | 'sq_meters'} areaUnit
 * @property {string} farmType - 'Organic' | 'Commercial' | 'Greenhouse' | 'Hydroponic' | 'Smallholder'
 * @property {string[]} primaryCrops
 * @property {number} efficiencyScore - 0 to 100
 * @property {'GOOD' | 'WATCH' | 'ACTION NEEDED' | 'URGENT'} overallStatus
 * @property {number} fieldCount
 * @property {number} activeDeviceCount
 * @property {string} createdAt
 * @property {string} lastSyncAt
 */

export const GROWTH_STAGES = [
  'Germination / Seedling',
  'Vegetative Growth',
  'Flowering / Budding',
  'Fruit Formation / Grain Filling',
  'Ripening / Maturation',
  'Ready for Harvest',
];

export const SOIL_TYPES = [
  'Rich Loam (Balanced)',
  'Clay Loam (High Moisture Hold)',
  'Sandy Loam (Quick Draining)',
  'Silt (High Fertility)',
  'Sandy (Low Moisture Hold)',
  'Peaty (High Organic Matter)',
];

export const IRRIGATION_METHODS = [
  'Precision Drip Irrigation',
  'Overhead Sprinkler System',
  'Furrow / Flood Irrigation',
  'Subsurface Drip',
  'Rainfed (Natural Precipitation)',
];

export const FARM_TYPES = [
  'Organic Crop Farm',
  'Commercial Family Farm',
  'Greenhouse & Protected Cultivation',
  'Diversified Market Garden',
  'Orchard / Perennial Plantation',
];
