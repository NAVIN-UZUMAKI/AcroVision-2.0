import { useState, useEffect, useCallback } from 'react';
import { DataContext } from './contextDefs';
import { useFarm } from '../hooks/useFarm';
import { sensorService } from '../services/sensorService';
import { weatherService } from '../services/weatherService';
import { cropHealthService } from '../services/cropHealthService';
import { aiService } from '../services/aiService';
import { alertService } from '../services/alertService';
import { deviceService } from '../services/deviceService';

export function DataProvider({ children }) {
  const { activeFarm, fields } = useFarm();

  const [sensors, setSensors] = useState([]);
  const [weather, setWeather] = useState(null);
  const [cropHealth, setCropHealth] = useState([]);
  const [insights, setInsights] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [devices, setDevices] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(() => new Date().toISOString());

  // Load telemetry and farm data
  const loadAllData = useCallback(async () => {
    setIsSyncing(true);
    try {
      const [
        loadedSensors,
        loadedWeather,
        loadedHealth,
        loadedInsights,
        loadedAlerts,
        loadedDevices,
      ] = await Promise.all([
        sensorService.getSensors(fields),
        weatherService.getWeather(activeFarm?.location),
        cropHealthService.getAssessments(),
        aiService.getInsights(),
        alertService.getAlerts(),
        deviceService.getDevices(activeFarm?.id),
      ]);

      setSensors(loadedSensors);
      setWeather(loadedWeather);
      setCropHealth(loadedHealth);
      setInsights(loadedInsights);
      setAlerts(loadedAlerts);
      setDevices(loadedDevices);
      setLastSyncTime(new Date().toISOString());
    } finally {
      setIsSyncing(false);
    }
  }, [activeFarm, fields]);

  useEffect(() => {
    let isSubscribed = true;
    const init = async () => {
      if (isSubscribed) {
        await loadAllData();
      }
    };
    init();
    return () => {
      isSubscribed = false;
    };
  }, [loadAllData]);

  // Alert Actions
  const resolveAlert = async (alertId) => {
    await alertService.resolveAlert(alertId);
    const updated = await alertService.getAlerts();
    setAlerts(updated);
  };

  const snoozeAlert = async (alertId, hours = 2) => {
    await alertService.snoozeAlert(alertId, hours);
    const updated = await alertService.getAlerts();
    setAlerts(updated);
  };

  // Edge AI Scan Simulation
  const triggerEdgeScan = async (fieldId, fieldName, cropName) => {
    const result = await cropHealthService.triggerEdgeAIScan(fieldId, fieldName, cropName);
    const updated = await cropHealthService.getAssessments();
    setCropHealth(updated);
    return result;
  };

  // Sensor Telemetry Update
  const updateSensorReading = async (sensorId, newValue) => {
    await sensorService.updateSensorValue(sensorId, newValue);
    const updated = await sensorService.getSensors(fields);
    setSensors(updated);
  };

  // Derived counts
  const activeAlerts = alerts.filter((a) => !a.isResolved);
  const unreadAlertsCount = activeAlerts.filter((a) => !a.isRead).length;

  return (
    <DataContext.Provider
      value={{
        sensors,
        weather,
        cropHealth,
        insights,
        alerts,
        activeAlerts,
        unreadAlertsCount,
        devices,
        isSyncing,
        lastSyncTime,
        syncNow: loadAllData,
        resolveAlert,
        snoozeAlert,
        triggerEdgeScan,
        updateSensorReading,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
