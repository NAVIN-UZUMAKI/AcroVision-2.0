/**
 * @file aiInsight.js
 * Domain contracts for AcroVision AI Assistant & Contextual Intelligence.
 */

/**
 * @typedef {Object} AIInsight
 * @property {string} id
 * @property {string} title
 * @property {string} shortAnswer
 * @property {string} why
 * @property {string} action
 * @property {number} confidenceScore - 0 to 100%
 * @property {'High' | 'Moderate' | 'Low / Insufficient Data'} dataSufficiency
 * @property {string} category - 'Irrigation' | 'Nutrient' | 'Weather Risk' | 'Yield Forecast'
 * @property {string} timestamp
 * @property {string} fieldName
 */

/**
 * @typedef {Object} AssistantMessage
 * @property {string} id
 * @property {'user' | 'assistant'} sender
 * @property {string} text
 * @property {string|null} why
 * @property {string|null} action
 * @property {number|null} confidence
 * @property {boolean} isInsufficientData
 * @property {string} timestamp
 */
