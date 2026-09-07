import { useState, useEffect, useCallback } from 'react';
import { FarmContext } from './contextDefs';
import { farmService } from '../services/farmService';
import { fieldService } from '../services/fieldService';

export function FarmProvider({ children }) {
  const [farms, setFarms] = useState([]);
  const [activeFarmId, setActiveFarmId] = useState(() => farmService.getActiveFarmId());
  const [activeFarm, setActiveFarm] = useState(null);
  const [fields, setFields] = useState([]);
  const [selectedField, setSelectedField] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load farms list
  const loadFarmsData = useCallback(async () => {
    try {
      const allFarms = await farmService.getFarms();
      setFarms(allFarms);

      const currentActiveId = farmService.getActiveFarmId();
      let currentFarm = allFarms.find((f) => f.id === currentActiveId);
      if (!currentFarm && allFarms.length > 0) {
        currentFarm = allFarms[0];
        farmService.setActiveFarmId(currentFarm.id);
      }

      setActiveFarmId(currentFarm ? currentFarm.id : null);
      setActiveFarm(currentFarm || null);

      if (currentFarm) {
        const farmFields = await fieldService.getFieldsByFarm(currentFarm.id);
        setFields(farmFields);
        setSelectedField(farmFields.length > 0 ? farmFields[0] : null);
      } else {
        setFields([]);
        setSelectedField(null);
      }
    } catch {
      // Fallback
    }
  }, []);

  useEffect(() => {
    let isSubscribed = true;
    const init = async () => {
      if (isSubscribed) {
        await loadFarmsData();
      }
    };
    init();
    return () => {
      isSubscribed = false;
    };
  }, [loadFarmsData]);

  // Switch active farm
  const switchActiveFarm = async (farmId) => {
    farmService.setActiveFarmId(farmId);
    setActiveFarmId(farmId);
    const targetFarm = farms.find((f) => f.id === farmId);
    setActiveFarm(targetFarm || null);

    if (targetFarm) {
      const farmFields = await fieldService.getFieldsByFarm(targetFarm.id);
      setFields(farmFields);
      setSelectedField(farmFields.length > 0 ? farmFields[0] : null);
    }
  };

  // Create new farm from /setup or modal and make it active
  const createAndActivateFarm = async (setupData) => {
    setIsLoading(true);
    try {
      const newFarm = await farmService.createFarm({
        name: setupData.farmName || 'My Farm',
        farmerName: setupData.farmerName || 'Farmer',
        location: setupData.location || 'Local Region',
        totalArea: setupData.area || 10,
        areaUnit: setupData.areaUnit || 'acres',
        farmType: setupData.farmType || 'Organic Crop Farm',
        primaryCrops: setupData.mainCrop ? [setupData.mainCrop] : ['Tomatoes'],
      });

      // Also create initial field with the user's specific crop, growth stage, and soil
      const initialField = await fieldService.createField({
        farmId: newFarm.id,
        name: `${setupData.mainCrop || 'Main'} Plot 1`,
        area: setupData.area || 5.0,
        areaUnit: setupData.areaUnit || 'acres',
        cropName: setupData.mainCrop || 'Tomato',
        cropVariety: setupData.cropVariety || 'Standard Hybrid',
        growthStage: setupData.growthStage || 'Vegetative Growth',
        soilType: setupData.soilType || 'Rich Loam (Balanced)',
        irrigationMethod: setupData.irrigationMethod || 'Precision Drip Irrigation',
      });

      // Reload full state
      const allFarms = await farmService.getFarms();
      setFarms(allFarms);
      setActiveFarmId(newFarm.id);
      setActiveFarm(newFarm);
      setFields([initialField]);
      setSelectedField(initialField);

      return { farm: newFarm, field: initialField };
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FarmContext.Provider
      value={{
        farms,
        activeFarm,
        activeFarmId,
        fields,
        selectedField,
        setSelectedField,
        isLoading,
        switchActiveFarm,
        createAndActivateFarm,
        refreshFarms: loadFarmsData,
      }}
    >
      {children}
    </FarmContext.Provider>
  );
}
