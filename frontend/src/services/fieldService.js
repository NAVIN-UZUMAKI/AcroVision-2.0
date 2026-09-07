/**
 * @file fieldService.js
 * Field Domain Service.
 * Manages field queries, updates, and creation tied to the active farm.
 */

import { INITIAL_FIELDS } from '../data/seedFields';
import { api } from './apiClient';

const FIELDS_STORAGE_KEY = 'acrovision_fields_data';

function loadLocalFields() {
  try {
    const data = localStorage.getItem(FIELDS_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch {
    // Fallback
  }
  return INITIAL_FIELDS;
}

function saveLocalFields(fields) {
  try {
    localStorage.setItem(FIELDS_STORAGE_KEY, JSON.stringify(fields));
  } catch {
    // Local storage error
  }
}

function normalizeField(f) {
  return {
    id: f.id,
    farmId: f.farm_id || f.farmId || 'farm_01',
    name: f.name,
    area: f.area,
    areaUnit: f.area_unit || f.areaUnit || 'acres',
    soilType: f.soil_type || f.soilType || 'Loam',
    irrigationMethod: f.irrigation_method || f.irrigationMethod || 'Precision Drip Irrigation',
    crop: {
      id: f.crop?.id || `crop-${f.id}`,
      name: f.crop?.crop_name || f.crop?.name || 'Crop',
      variety: f.crop?.variety || 'Standard Hybrid',
      growthStage: f.crop?.growth_stage || f.crop?.growthStage || 'Vegetative Growth',
      category: f.crop?.category || 'Crop',
      daysPlanted: 30,
      daysToMaturity: 90,
    },
    sensorIds: f.sensorIds || [],
    deviceIds: f.deviceIds || [],
    currentStatus: f.current_status || 'GOOD',
    healthScore: f.health_score ?? 90,
    summaryAdvice: f.summary_advice || 'Crop is growing normally under favorable conditions.',
    lastUpdated: f.updated_at || new Date().toISOString(),
  };
}

export const fieldService = {
  /**
   * Get all fields for a given farm.
   */
  async getFieldsByFarm(farmId = 'farm_01') {
    try {
      const backendFields = await api.get(`/farms/${farmId}/fields`);
      if (Array.isArray(backendFields) && backendFields.length > 0) {
        const normalized = backendFields.map(normalizeField);
        saveLocalFields(normalized);
        return normalized;
      }
    } catch {
      // Backend offline fallback
    }
    const fields = loadLocalFields();
    return fields.filter((f) => f.farmId === farmId || f.farmId === 'farm-001' || farmId === 'farm_01');
  },

  /**
   * Get all fields.
   */
  async getAllFields() {
    return this.getFieldsByFarm('farm_01');
  },

  /**
   * Get single field by ID.
   */
  async getFieldById(fieldId) {
    try {
      const f = await api.get(`/fields/${fieldId}`);
      if (f) return normalizeField(f);
    } catch {
      // Fallback
    }
    const fields = loadLocalFields();
    return fields.find((f) => f.id === fieldId) || null;
  },

  /**
   * Create a new field for a farm.
   */
  async createField(fieldData) {
    const payload = {
      farm_id: fieldData.farmId || 'farm_01',
      name: fieldData.name || 'New Field Plot',
      area: Number(fieldData.area) || 5.0,
      area_unit: fieldData.areaUnit || 'acres',
      soil_type: fieldData.soilType || 'Loam',
      irrigation_method: fieldData.irrigationMethod || 'Precision Drip Irrigation',
      crop_name: fieldData.cropName || fieldData.crop?.name || 'Tomato',
      crop_variety: fieldData.cropVariety || fieldData.crop?.variety || 'Standard Hybrid',
      growth_stage: fieldData.growthStage || fieldData.crop?.growthStage || 'Vegetative Growth',
    };

    try {
      const created = await api.post('/fields', payload);
      const normalized = normalizeField(created);
      const local = loadLocalFields();
      saveLocalFields([normalized, ...local]);
      return normalized;
    } catch {
      const fields = loadLocalFields();
      const newField = {
        id: `field-${Date.now()}`,
        farmId: fieldData.farmId,
        name: fieldData.name || 'New Field Plot',
        area: Number(fieldData.area) || 5.0,
        areaUnit: fieldData.areaUnit || 'acres',
        crop: {
          id: `crop-${Date.now()}`,
          name: fieldData.cropName || fieldData.crop?.name || 'Crop',
          variety: fieldData.cropVariety || fieldData.crop?.variety || 'Standard Variety',
          category: fieldData.cropCategory || 'Vegetable',
          growthStage: fieldData.growthStage || fieldData.crop?.growthStage || 'Vegetative Growth',
          daysToMaturity: 90,
          daysPlanted: 30,
        },
        soilType: fieldData.soilType || 'Rich Loam (Balanced)',
        irrigationMethod: fieldData.irrigationMethod || 'Precision Drip Irrigation',
        sensorIds: fieldData.sensorIds || [],
        deviceIds: fieldData.deviceIds || [],
        currentStatus: 'GOOD',
        healthScore: 88,
        summaryAdvice: 'Healthy crop emergence and favorable soil conditions.',
        lastUpdated: new Date().toISOString(),
      };
      saveLocalFields([newField, ...fields]);
      return newField;
    }
  },

  /**
   * Update field status / information.
   */
  async updateField(id, updates) {
    try {
      const updated = await api.put(`/fields/${id}`, {
        name: updates.name,
        area: updates.area ? Number(updates.area) : undefined,
        area_unit: updates.areaUnit,
        soil_type: updates.soilType,
        irrigation_method: updates.irrigationMethod,
      });
      return normalizeField(updated);
    } catch {
      const fields = loadLocalFields();
      const index = fields.findIndex((f) => f.id === id);
      if (index !== -1) {
        fields[index] = { ...fields[index], ...updates, lastUpdated: new Date().toISOString() };
        saveLocalFields(fields);
        return fields[index];
      }
    }
    return null;
  },
};

