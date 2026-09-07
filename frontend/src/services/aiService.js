import { INITIAL_INSIGHTS, KNOWLEDGE_BASE_RESPONSES } from '../data/seedInsights';
import { api } from './apiClient';

function normalizeInsight(i) {
  return {
    id: i.id,
    farmId: i.farm_id || i.farmId || 'farm_01',
    fieldId: i.field_id || i.fieldId,
    fieldName: i.field_name || i.fieldName || 'North Tomato Block',
    category: i.category || 'irrigation',
    title: i.title,
    observation: i.observation,
    explanation: i.explanation,
    recommendation: i.recommendation,
    confidence: i.confidence ?? 0.92,
    createdAt: i.created_at || new Date().toISOString(),
    actionLabel: 'Schedule Action',
  };
}

export const aiService = {
  /**
   * Get dashboard contextual insight cards from backend API or local fallback.
   */
  async getInsights(farmId = 'farm_01') {
    try {
      const backendInsights = await api.get(`/farms/${farmId}/insights`);
      if (Array.isArray(backendInsights) && backendInsights.length > 0) {
        return backendInsights.map(normalizeInsight);
      }
    } catch {
      // Offline fallback
    }
    return INITIAL_INSIGHTS;
  },

  /**
   * Ask AcroVision conversational assistant a question with full farm context.
   */
  async askAcroVision(userQuery, farmContext = {}) {
    try {
      const res = await api.post('/ask', {
        query: userQuery,
        farm_id: farmContext.farmId || 'farm_01',
      });
      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: res.text,
        why: res.why,
        action: res.action,
        confidence: res.confidence ? Math.round(res.confidence * 100) : null,
        isInsufficientData: res.is_insufficient_data,
        timestamp: new Date().toISOString(),
      };
    } catch {
      // Offline agronomic knowledge base fallback
      await new Promise((resolve) => setTimeout(resolve, 300));
      const q = userQuery.toLowerCase().trim();

      for (const item of KNOWLEDGE_BASE_RESPONSES) {
        if (item.keywords.some((kw) => q.includes(kw))) {
          return {
            id: `msg-${Date.now()}`,
            sender: 'assistant',
            text: item.shortAnswer,
            why: item.why,
            action: item.action,
            confidence: item.confidence,
            isInsufficientData: false,
            timestamp: new Date().toISOString(),
          };
        }
      }

      if (farmContext.fields && farmContext.fields.length > 0) {
        const matchedField = farmContext.fields.find(
          (f) => q.includes(f.name.toLowerCase()) || q.includes(f.crop?.name?.toLowerCase() || '')
        );
        if (matchedField) {
          return {
            id: `msg-${Date.now()}`,
            sender: 'assistant',
            text: `${matchedField.name} currently has health score of ${matchedField.healthScore}% with status ${matchedField.currentStatus}.`,
            why: `Growing ${matchedField.crop.name} (${matchedField.crop.variety}) in ${matchedField.crop.growthStage} stage under ${matchedField.soilType}.`,
            action: matchedField.summaryAdvice,
            confidence: 88,
            isInsufficientData: false,
            timestamp: new Date().toISOString(),
          };
        }
      }

      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: `I don't have enough verified live telemetry or agronomic data to answer "${userQuery}" with high certainty.`,
        why: 'No matching sensor trend, weather forecast pattern, or crop health scan matches this specific question.',
        action: 'Try asking: "Should I water tomorrow?", "Is it a good day to spray?", or "Check soil moisture".',
        confidence: null,
        isInsufficientData: true,
        timestamp: new Date().toISOString(),
      };
    }
  },
};

