/**
 * @file farmService.js
 * Farm Domain Service.
 * Manages active farm, multi-farm lists, creation from onboarding (/setup), and updates.
 */

import { INITIAL_FARMS } from '../data/seedFarms';
import { api } from './apiClient';

const FARMS_STORAGE_KEY = 'acrovision_farms_data';
const ACTIVE_FARM_ID_KEY = 'acrovision_active_farm_id';

function loadLocalFarms() {
  try {
    const data = localStorage.getItem(FARMS_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch {
    // Fallback
  }
  return INITIAL_FARMS;
}

function saveLocalFarms(farms) {
  try {
    localStorage.setItem(FARMS_STORAGE_KEY, JSON.stringify(farms));
  } catch {
    // Local storage error
  }
}

function normalizeFarm(f) {
  return {
    id: f.id,
    name: f.name,
    farmerName: f.owner_name || f.farmerName || 'Farmer',
    location: f.location,
    totalArea: f.area || f.totalArea || 10,
    areaUnit: f.area_unit || f.areaUnit || 'acres',
    farmType: f.farm_type || f.farmType || 'Organic Crop Farm',
    primaryCrops: f.primary_crops || f.primaryCrops || ['Tomatoes', 'Strawberries'],
    efficiencyScore: f.efficiency_score ?? 92,
    overallStatus: f.overall_status || 'GOOD',
    fieldCount: f.field_count ?? 2,
    activeDeviceCount: f.active_device_count ?? 2,
    createdAt: f.created_at || new Date().toISOString(),
    lastSyncAt: f.updated_at || new Date().toISOString(),
  };
}

export const farmService = {
  /**
   * Get all registered farms from backend API or local fallback.
   */
  async getFarms() {
    try {
      const backendFarms = await api.get('/farms');
      if (Array.isArray(backendFarms) && backendFarms.length > 0) {
        const normalized = backendFarms.map(normalizeFarm);
        saveLocalFarms(normalized);
        return normalized;
      }
    } catch {
      // Backend offline: use local cache/seed
    }
    return loadLocalFarms();
  },

  /**
   * Get farm by ID.
   */
  async getFarmById(id) {
    try {
      const farm = await api.get(`/farms/${id}`);
      if (farm) return normalizeFarm(farm);
    } catch {
      // Fallback
    }
    const farms = loadLocalFarms();
    return farms.find((f) => f.id === id) || farms[0];
  },

  /**
   * Get the active farm ID.
   */
  getActiveFarmId() {
    try {
      const activeId = localStorage.getItem(ACTIVE_FARM_ID_KEY);
      if (activeId) return activeId;
    } catch {
      // Fallback
    }
    return 'farm_01';
  },

  /**
   * Set the active farm ID.
   */
  setActiveFarmId(farmId) {
    try {
      localStorage.setItem(ACTIVE_FARM_ID_KEY, farmId);
    } catch {
      // Local storage error
    }
  },

  /**
   * Create a new farm.
   */
  async createFarm(farmData) {
    const payload = {
      name: farmData.name || 'My New Farm',
      location: farmData.location || 'Local Region',
      area: Number(farmData.totalArea) || 10.0,
      area_unit: farmData.areaUnit || 'acres',
      farm_type: farmData.farmType || 'Organic Crop Farm',
      owner_name: farmData.farmerName || 'Farmer',
    };

    try {
      const created = await api.post('/farms', payload);
      const normalized = normalizeFarm(created);
      const local = loadLocalFarms();
      saveLocalFarms([normalized, ...local]);
      this.setActiveFarmId(normalized.id);
      return normalized;
    } catch {
      // Offline fallback creation
      const localFarms = loadLocalFarms();
      const newFarm = {
        id: `farm-${Date.now()}`,
        name: farmData.name || 'My New Farm',
        farmerName: farmData.farmerName || 'Farmer',
        location: farmData.location || 'Local Region',
        totalArea: Number(farmData.totalArea) || 10,
        areaUnit: farmData.areaUnit || 'acres',
        farmType: farmData.farmType || 'Organic Crop Farm',
        primaryCrops: farmData.primaryCrops || (farmData.mainCrop ? [farmData.mainCrop] : ['Tomatoes']),
        efficiencyScore: 85,
        overallStatus: 'GOOD',
        fieldCount: 1,
        activeDeviceCount: 1,
        createdAt: new Date().toISOString(),
        lastSyncAt: new Date().toISOString(),
      };
      saveLocalFarms([newFarm, ...localFarms]);
      this.setActiveFarmId(newFarm.id);
      return newFarm;
    }
  },

  /**
   * Update an existing farm.
   */
  async updateFarm(id, updates) {
    try {
      const updated = await api.put(`/farms/${id}`, {
        name: updates.name,
        location: updates.location,
        area: updates.totalArea ? Number(updates.totalArea) : undefined,
        area_unit: updates.areaUnit,
        farm_type: updates.farmType,
        owner_name: updates.farmerName,
      });
      return normalizeFarm(updated);
    } catch {
      const farms = loadLocalFarms();
      const index = farms.findIndex((f) => f.id === id);
      if (index !== -1) {
        farms[index] = { ...farms[index], ...updates, lastSyncAt: new Date().toISOString() };
        saveLocalFarms(farms);
        return farms[index];
      }
    }
    return null;
  },
};

