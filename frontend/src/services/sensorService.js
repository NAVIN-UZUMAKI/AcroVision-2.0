import { INITIAL_SENSORS } from '../data/seedSensors';
import { interpretSensorReading } from './rulesEngine';
import { api } from './apiClient';

const SENSORS_STORAGE_KEY = 'acrovision_sensors_data';

function loadLocalSensors() {
  try {
    const data = localStorage.getItem(SENSORS_STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch {
    // Fallback
  }
  return INITIAL_SENSORS;
}

function saveLocalSensors(sensors) {
  try {
    localStorage.setItem(SENSORS_STORAGE_KEY, JSON.stringify(sensors));
  } catch {
    // Local storage error
  }
}

export const sensorService = {
  /**
   * Get all sensors with interpreted readings according to field & crop context.
   * Authoritatively fetches live interpreted sensors from backend database.
   */
  async getSensors(fields = [], farmId = 'farm_01') {
    try {
      const dashboard = await api.get(`/farms/${farmId}/dashboard`);
      if (dashboard && Array.isArray(dashboard.key_sensors) && dashboard.key_sensors.length > 0) {
        // Map backend interpreted sensors
        const backendSensors = dashboard.key_sensors.map((s) => ({
          id: s.id,
          name: s.name,
          type: s.sensor_type,
          fieldId: s.field_id,
          fieldName: s.field_name,
          cropName: s.crop_name,
          rawValue: s.value,
          unit: s.unit,
          isOnline: s.is_online,
          lastSeen: s.timestamp,
          currentReading: {
            sensorType: s.sensor_type,
            value: s.value,
            unit: s.unit,
            status: s.status,
            statusLabel: s.status_label,
            preferredRange: s.preferred_range,
            explanation: s.explanation,
            recommendation: s.recommendation,
            freshness: s.freshness,
            freshnessLabel: s.freshness_label,
            isOnline: s.is_online,
          },
        }));
        saveLocalSensors(backendSensors);
        return backendSensors;
      }
    } catch {
      // Backend offline fallback
    }

    // Local fallback using local rulesEngine
    const rawSensors = loadLocalSensors();
    const fieldMap = new Map(fields.map((f) => [f.id, f]));

    return rawSensors.map((s) => {
      const field = fieldMap.get(s.fieldId);
      const interpreted = interpretSensorReading({
        sensorType: s.type,
        value: s.rawValue,
        cropName: field?.crop?.name,
        growthStage: field?.crop?.growthStage,
        soilType: field?.soilType,
        lastUpdated: s.lastSeen,
        isOnline: s.isOnline,
      });

      return {
        ...s,
        fieldName: field?.name || 'Unassigned Field',
        cropName: field?.crop?.name || 'General Crop',
        currentReading: interpreted,
      };
    });
  },

  /**
   * Get sensors for a specific field.
   */
  async getSensorsByField(fieldId, field) {
    const all = await this.getSensors(field ? [field] : []);
    return all.filter((s) => s.fieldId === fieldId);
  },

  /**
   * Send live telemetry update directly to FastAPI backend.
   * Updates database, runs context rules, and persists historical telemetry.
   */
  async updateSensorValue(sensorId, newValue, fieldId = 'field_01') {
    const rawSensors = loadLocalSensors();
    const target = rawSensors.find((s) => s.id === sensorId);
    const sensorType = target ? target.type : 'soil_moisture';

    try {
      await api.post('/telemetry', {
        device_id: 'ESP32_FIELD_01',
        field_id: fieldId,
        readings: {
          [sensorType]: Number(newValue),
        },
      });
    } catch {
      // Offline fallback
    }

    const index = rawSensors.findIndex((s) => s.id === sensorId);
    if (index !== -1) {
      rawSensors[index].rawValue = Number(newValue);
      rawSensors[index].lastSeen = new Date().toISOString();
      saveLocalSensors(rawSensors);
      return rawSensors[index];
    }
    return null;
  },
};

