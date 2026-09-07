/**
 * @file device.js
 * Domain contracts for IoT Nodes, ESP32 Microcontrollers, and Edge Gateways.
 */

/**
 * @typedef {'CONNECTED' | 'STALE' | 'DISCONNECTED' | 'UPDATING'} DeviceConnectionStatus
 */

/**
 * @typedef {Object} HardwareTelemetry
 * @property {number} batteryPercent - 0 to 100
 * @property {number} batteryVoltage - e.g. 3.7V
 * @property {number} signalDbm - e.g. -68 dBm
 * @property {string} signalQuality - 'Excellent' | 'Good' | 'Fair' | 'Weak'
 * @property {number} uptimeHours
 * @property {string} firmwareVersion - e.g. "v1.4.2-esp32-agro"
 * @property {string} ipAddress
 * @property {string} macAddress
 * @property {string} transmissionProtocol - 'MQTT' | 'HTTP POST' | 'LoRaWAN'
 */

/**
 * @typedef {Object} DeviceNode
 * @property {string} id
 * @property {string} name - e.g. "Field Node Alpha (ESP32-S3)"
 * @property {string} farmId
 * @property {string} fieldId
 * @property {string} fieldName
 * @property {'ESP32 Soil Hub' | 'Edge AI Vision Camera' | 'Microclimate Weather Station' | 'Automated Valve Controller'} deviceType
 * @property {DeviceConnectionStatus} status
 * @property {HardwareTelemetry} telemetry
 * @property {string[]} attachedSensorIds
 * @property {string} lastSeen
 * @property {string} installedAt
 */
