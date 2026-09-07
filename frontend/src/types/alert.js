/**
 * @file alert.js
 * Domain contracts for Farmer Action Center Alerts.
 */

/**
 * @typedef {'GOOD' | 'WATCH' | 'ACTION NEEDED' | 'URGENT'} AlertSeverity
 */

/**
 * @typedef {'irrigation' | 'disease' | 'weather' | 'nutrient' | 'hardware'} AlertCategory
 */

/**
 * @typedef {Object} AlertAction
 * @property {string} id
 * @property {string} label - e.g. "Turn on Drip Valve", "Mark as Watered"
 * @property {'primary' | 'secondary' | 'urgent'} variant
 * @property {string} type - 'RESOLVE' | 'SNOOZE' | 'LINK_DEVICE' | 'TRIGGER_IRRIGATION'
 */

/**
 * @typedef {Object} Alert
 * @property {string} id
 * @property {string} farmId
 * @property {string} fieldId
 * @property {string} fieldName
 * @property {string} title
 * @property {string} description - Why this alert happened
 * @property {string} recommendedAction - What the farmer should do
 * @property {string} whenToDo - e.g. "Tomorrow morning before 9 AM"
 * @property {AlertSeverity} severity
 * @property {AlertCategory} category
 * @property {boolean} isRead
 * @property {boolean} isResolved
 * @property {string} createdAt
 * @property {string|null} resolvedAt
 * @property {AlertAction[]} actions
 */
