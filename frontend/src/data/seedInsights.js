/**
 * @file seedInsights.js
 * Seed AI Insights and prompt response knowledge base for AcroVision Assistant.
 */

export const INITIAL_INSIGHTS = [
  {
    id: 'ins-001',
    title: 'Water Deficit Alert on North Block Tomatoes',
    shortAnswer: 'North Block A needs 25 minutes of drip irrigation tomorrow morning.',
    why: 'Soil moisture is currently at 38%, which is below the 55% target for the Flowering stage. Tomorrow’s temperature will reach 31°C.',
    action: 'Open North Block A drip valve at 07:00 AM before sun intensity increases.',
    confidenceScore: 94,
    dataSufficiency: 'High',
    category: 'Irrigation',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    fieldName: 'North Block A (Tomatoes)',
  },
  {
    id: 'ins-002',
    title: 'Ideal Spray Window Active Today',
    shortAnswer: 'Today morning is the best window this week for preventive crop sprays.',
    why: 'Wind speed is calm (9 km/h), relative humidity is 62%, and no rain is forecasted for 36 hours.',
    action: 'Apply recommended bio-fungicide to border tomato rows before 10:00 AM.',
    confidenceScore: 96,
    dataSufficiency: 'High',
    category: 'Weather Risk',
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    fieldName: 'All Fields',
  },
  {
    id: 'ins-003',
    title: 'Sweet Corn Canopy Vigorous Growth',
    shortAnswer: 'Corn in East Ridge is in peak vegetative stage with optimal soil nitrogen.',
    why: 'Soil nitrogen is at 68 mg/kg and soil moisture is steady at 62%. Canopy expansion is on track.',
    action: 'No intervention required today; plan side-dressing fertilizer in 10 days.',
    confidenceScore: 92,
    dataSufficiency: 'High',
    category: 'Nutrient',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    fieldName: 'East Ridge (Sweet Corn)',
  },
];

export const KNOWLEDGE_BASE_RESPONSES = [
  {
    keywords: ['water', 'irrigate', 'moisture', 'dry', 'when to water'],
    shortAnswer: 'North Block A (Tomatoes) is getting dry and requires irrigation tomorrow morning.',
    why: 'Soil moisture is down to 38% (preferred 55%–75%). Other fields (East Ridge and Greenhouse) have sufficient moisture.',
    action: 'Schedule 25 minutes of drip irrigation for North Block A at 7:00 AM tomorrow.',
    confidence: 95,
    isInsufficientData: false,
  },
  {
    keywords: ['weather', 'rain', 'forecast', 'wind', 'spray'],
    shortAnswer: 'Weather is clear today with light breeze; rain is expected Wednesday.',
    why: 'Today is 28°C with 9 km/h wind, ideal for spraying. Wednesday has a 70% chance of showers (8.5mm).',
    action: 'Perform spraying and soil cultivation today or tomorrow. Hold off on chemical applications Wednesday.',
    confidence: 96,
    isInsufficientData: false,
  },
  {
    keywords: ['disease', 'pest', 'blight', 'fungus', 'health', 'yellow'],
    shortAnswer: 'Minor early blight signs detected on 3 tomato border plants.',
    why: 'Edge AI camera scan identified concentric ring spots on lower leaves in Row 2. South Greenhouse also has slight powdery mildew risk.',
    action: 'Prune the lowest affected leaves and spray organic Bacillus subtilis or copper soap.',
    confidence: 92,
    isInsufficientData: false,
  },
  {
    keywords: ['fertilizer', 'nitrogen', 'nutrient', 'ph', 'soil'],
    shortAnswer: 'Soil nutrients and pH are healthy across your active fields.',
    why: 'Tomato block pH is 6.4 (optimal 6.2–6.8). Corn nitrogen is 68 mg/kg. Blueberry block pH is 4.8.',
    action: 'Maintain current organic compost regime; next nitrogen side-dressing due in 10 days for corn.',
    confidence: 90,
    isInsufficientData: false,
  },
];
