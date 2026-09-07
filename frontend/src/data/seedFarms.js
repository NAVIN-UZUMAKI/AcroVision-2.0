/**
 * @file seedFarms.js
 * Seed farm data for initial load and multi-farm support.
 */

export const INITIAL_FARMS = [
  {
    id: 'farm-001',
    name: 'Green Valley Organic Farm',
    farmerName: 'Ramesh Patel',
    location: 'Coimbatore, Tamil Nadu, India',
    totalArea: 18.5,
    areaUnit: 'acres',
    farmType: 'Organic Crop Farm',
    primaryCrops: ['Tomatoes', 'Sweet Corn', 'Strawberries', 'Bell Peppers'],
    efficiencyScore: 88,
    overallStatus: 'WATCH',
    fieldCount: 4,
    activeDeviceCount: 3,
    createdAt: '2026-01-15T08:00:00.000Z',
    lastSyncAt: new Date().toISOString(),
  },
  {
    id: 'farm-002',
    name: 'Highland Berry Orchards',
    farmerName: 'Ramesh Patel',
    location: 'Ooty Hills, Tamil Nadu, India',
    totalArea: 12.0,
    areaUnit: 'acres',
    farmType: 'Orchard / Perennial Plantation',
    primaryCrops: ['Blueberries', 'Raspberries'],
    efficiencyScore: 94,
    overallStatus: 'GOOD',
    fieldCount: 2,
    activeDeviceCount: 2,
    createdAt: '2026-02-10T10:30:00.000Z',
    lastSyncAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
  },
];
