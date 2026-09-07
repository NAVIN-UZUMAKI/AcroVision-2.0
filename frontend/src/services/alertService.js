/**
 * @file alertService.js
 * Alert & Action Center Service.
 * Manages actionable farmer alerts, resolution states, and snoozes.
 */

import { INITIAL_ALERTS } from '../data/seedAlerts';
import { api } from './apiClient';

const ALERTS_STORAGE_KEY = 'acrovision_alerts_data';

function loadLocalAlerts() {
  try {
    const data = localStorage.getItem(ALERTS_STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch {
    // Fallback
  }
  return INITIAL_ALERTS;
}

function saveLocalAlerts(alerts) {
  try {
    localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(alerts));
  } catch {
    // Local storage error
  }
}

function normalizeAlert(a) {
  return {
    id: a.id,
    farmId: a.farm_id || a.farmId || 'farm_01',
    fieldId: a.field_id || a.fieldId,
    fieldName: a.field_name || a.fieldName || 'Monitored Field',
    title: a.title,
    description: a.message || a.description,
    recommendedAction: a.recommendation || a.recommendedAction,
    whenToDo: a.when_to_do || a.whenToDo || 'Today',
    severity: a.severity || 'WATCH',
    category: a.sensor_type || a.category || 'irrigation',
    isRead: false,
    isResolved: a.status === 'RESOLVED' || a.isResolved || false,
    createdAt: a.created_at || new Date().toISOString(),
    resolvedAt: a.resolved_at || a.resolvedAt || null,
    actions: [
      { id: `act-${a.id}`, label: 'Mark as Done', variant: 'primary', type: 'RESOLVE' },
    ],
  };
}

export const alertService = {
  /**
   * Get all alerts (active or resolved) from backend API or local fallback.
   */
  async getAlerts(farmId = 'farm_01') {
    try {
      const backendAlerts = await api.get(`/farms/${farmId}/alerts`);
      if (Array.isArray(backendAlerts)) {
        const normalized = backendAlerts.map(normalizeAlert);
        saveLocalAlerts(normalized);
        return normalized;
      }
    } catch {
      // Backend offline fallback
    }
    return loadLocalAlerts();
  },

  /**
   * Get active alerts count.
   */
  async getActiveAlertsCount(farmId = 'farm_01') {
    const alerts = await this.getAlerts(farmId);
    return alerts.filter((a) => !a.isResolved).length;
  },

  /**
   * Mark alert as resolved / done.
   */
  async resolveAlert(alertId) {
    try {
      const res = await api.patch(`/alerts/${alertId}/resolve`, {});
      return normalizeAlert(res);
    } catch {
      // Local fallback
    }
    const alerts = loadLocalAlerts();
    const index = alerts.findIndex((a) => a.id === alertId);
    if (index !== -1) {
      alerts[index].isResolved = true;
      alerts[index].isRead = true;
      alerts[index].resolvedAt = new Date().toISOString();
      saveLocalAlerts(alerts);
      return alerts[index];
    }
    return null;
  },

  /**
   * Mark alert as read.
   */
  async markAsRead(alertId) {
    const alerts = loadLocalAlerts();
    const index = alerts.findIndex((a) => a.id === alertId);
    if (index !== -1) {
      alerts[index].isRead = true;
      saveLocalAlerts(alerts);
      return alerts[index];
    }
    return null;
  },

  /**
   * Snooze alert for a given period.
   */
  async snoozeAlert(alertId, hours = 2) {
    const alerts = loadLocalAlerts();
    const index = alerts.findIndex((a) => a.id === alertId);
    if (index !== -1) {
      alerts[index].isRead = true;
      alerts[index].whenToDo = `Snoozed for ${hours}h`;
      saveLocalAlerts(alerts);
      return alerts[index];
    }
    return null;
  },

  /**
   * Create an alert dynamically.
   */
  async createAlert(alertData) {
    const payload = {
      farm_id: alertData.farmId || 'farm_01',
      field_id: alertData.fieldId,
      sensor_type: alertData.category || 'soil_moisture',
      severity: alertData.severity || 'ACTION_NEEDED',
      title: alertData.title,
      message: alertData.description || alertData.message,
      recommendation: alertData.recommendedAction || alertData.recommendation,
    };

    try {
      const created = await api.post('/alerts', payload);
      const normalized = normalizeAlert(created);
      const local = loadLocalAlerts();
      saveLocalAlerts([normalized, ...local]);
      return normalized;
    } catch {
      const alerts = loadLocalAlerts();
      const newAlert = {
        id: `alert-${Date.now()}`,
        farmId: alertData.farmId || 'farm_01',
        fieldId: alertData.fieldId,
        fieldName: alertData.fieldName,
        title: alertData.title,
        description: alertData.description,
        recommendedAction: alertData.recommendedAction,
        whenToDo: alertData.whenToDo || 'Today',
        severity: alertData.severity || 'WATCH',
        category: alertData.category || 'irrigation',
        isRead: false,
        isResolved: false,
        createdAt: new Date().toISOString(),
        resolvedAt: null,
        actions: [
          { id: `act-${Date.now()}`, label: 'Mark as Done', variant: 'primary', type: 'RESOLVE' },
        ],
      };
      saveLocalAlerts([newAlert, ...alerts]);
      return newAlert;
    }
  },
};

