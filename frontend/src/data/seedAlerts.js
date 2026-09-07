/**
 * @file seedAlerts.js
 * Farmer-first actionable alert queue.
 */

export const INITIAL_ALERTS = [
  {
    id: 'alert-001',
    farmId: 'farm-001',
    fieldId: 'field-001',
    fieldName: 'North Block A (Tomatoes)',
    title: 'North Block A is getting dry',
    description: 'Soil moisture is at 38% (preferred is 55%–75% for Flowering stage). Plant transpiration will increase with 30°C afternoon sun.',
    recommendedAction: 'Water North Block A tomorrow morning at 07:00 AM (25 minutes drip cycle).',
    whenToDo: 'Tomorrow morning before 09:00 AM',
    severity: 'ACTION NEEDED',
    category: 'irrigation',
    isRead: false,
    isResolved: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    resolvedAt: null,
    actions: [
      { id: 'act-1', label: 'Mark as Watered', variant: 'primary', type: 'RESOLVE' },
      { id: 'act-2', label: 'Remind in 2 hours', variant: 'secondary', type: 'SNOOZE' },
    ],
  },
  {
    id: 'alert-002',
    farmId: 'farm-001',
    fieldId: 'field-001',
    fieldName: 'North Block A (Tomatoes)',
    title: 'Early Blight spotted on 3 border plants',
    description: 'Edge AI camera scan identified early fungal lesion spots on lower foliage in Row 2.',
    recommendedAction: 'Prune lowest yellowing leaves and apply organic Bacillus subtilis bio-spray.',
    whenToDo: 'Today during low wind spray window (before 10:00 AM)',
    severity: 'WATCH',
    category: 'disease',
    isRead: false,
    isResolved: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    resolvedAt: null,
    actions: [
      { id: 'act-3', label: 'Treatment Applied', variant: 'primary', type: 'RESOLVE' },
      { id: 'act-4', label: 'Inspect in Field', variant: 'secondary', type: 'LINK_DEVICE' },
    ],
  },
  {
    id: 'alert-003',
    farmId: 'farm-001',
    fieldId: 'field-003',
    fieldName: 'South Greenhouse 1 (Strawberries)',
    title: 'High nighttime greenhouse humidity',
    description: 'Relative humidity stayed at 88% for 4 hours last night, increasing powdery mildew vulnerability.',
    recommendedAction: 'Open greenhouse side louvers and turn on ventilation fan.',
    whenToDo: 'Immediate action',
    severity: 'WATCH',
    category: 'hardware',
    isRead: true,
    isResolved: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    resolvedAt: null,
    actions: [
      { id: 'act-5', label: 'Ventilation Adjusted', variant: 'primary', type: 'RESOLVE' },
    ],
  },
];
