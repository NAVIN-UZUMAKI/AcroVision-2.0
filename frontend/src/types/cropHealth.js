/**
 * @file cropHealth.js
 * Domain contracts for Crop Health Assessments and Edge AI Vision Results.
 */

/**
 * @typedef {Object} HealthIssue
 * @property {string} id
 * @property {string} name - e.g. "Early Blight (Alternaria solani)"
 * @property {'Fungal' | 'Bacterial' | 'Pest' | 'Nutrient Deficiency' | 'Water Stress'} category
 * @property {'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'} severity
 * @property {number} confidenceScore - 0 to 100%
 * @property {string} affectedAreaEstimate - e.g. "5% of lower canopy"
 * @property {string} symptomsObserved
 * @property {string} organicTreatment
 * @property {string} chemicalTreatment
 * @property {string} preventiveAction
 */

/**
 * @typedef {Object} CropHealthAssessment
 * @property {string} id
 * @property {string} fieldId
 * @property {string} fieldName
 * @property {string} cropName
 * @property {number} overallHealthScore - 0 to 100
 * @property {'GOOD' | 'WATCH' | 'ACTION NEEDED' | 'URGENT'} status
 * @property {string} summary
 * @property {string} timestamp
 * @property {string} assessedVia - 'Edge AI Camera Scan #04' | 'Agronomist Field Inspection' | 'Satellite NDVI'
 * @property {number} scanConfidence - 0 to 100%
 * @property {HealthIssue[]} issuesDetected
 * @property {string} immediateAction
 * @property {string} sampleImageUrl
 */

/**
 * @typedef {Object} EdgeAIResult
 * @property {string} scanId
 * @property {string} timestamp
 * @property {string} modelVersion - e.g. "YOLOv8-AgriVision-v2.4 (Edge Quantized)"
 * @property {number} inferenceLatencyMs - e.g. 42ms
 * @property {number} confidence
 * @property {string} detectedLabel
 * @property {string} boundingBox - [x, y, width, height]
 * @property {string} status - 'Healthy' | 'Issue Detected'
 */
