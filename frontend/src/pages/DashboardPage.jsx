import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFarm } from '../hooks/useFarm';
import { useData } from '../hooks/useData';
import { useMode } from '../hooks/useMode';
import FarmSummaryCard from '../components/farm/FarmSummaryCard';
import ActionCard from '../components/ui/ActionCard';
import FieldCard from '../components/field/FieldCard';
import MetricCard from '../components/ui/MetricCard';
import WeatherSummaryWidget from '../components/weather/WeatherSummaryWidget';
import AIInsightCard from '../components/ai/AIInsightCard';
import FieldDetailModal from '../components/field/FieldDetailModal';
import EdgeAIScanModal from '../components/crop/EdgeAIScanModal';
import LoadingState from '../components/ui/LoadingState';
import EmptyState from '../components/ui/EmptyState';
import {
  Sprout,
  AlertCircle,
  Activity,
  ArrowRight,
  Sparkles,
  Layers,
  Plus,
} from 'lucide-react';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { activeFarm, fields, isLoading: farmLoading } = useFarm();
  const { sensors, activeAlerts, insights, resolveAlert, snoozeAlert } = useData();
  const { isAdvancedMode } = useMode();

  const [selectedFieldModal, setSelectedFieldModal] = useState(null);
  const [scanFieldModal, setScanFieldModal] = useState(null);

  if (farmLoading && !activeFarm) {
    return <LoadingState message="Loading farm intelligence..." />;
  }

  if (!activeFarm) {
    return (
      <EmptyState
        title="No Active Farm Configured"
        description="Please complete initial farm onboarding to begin monitoring."
        actionLabel="Setup Farm Now"
        onAction={() => navigate('/setup')}
      />
    );
  }

  // Actionable top items
  const pendingActions = activeAlerts.slice(0, 2);
  const keySensors = sensors.slice(0, 4);

  return (
    <div className="fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>Farm Command Center</h1>
          <p>
            {isAdvancedMode
              ? 'Real-time telemetry, threshold evaluations, and edge node health.'
              : `Here is what is happening today on ${activeFarm.name}.`}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => navigate('/ai-insights')}
          >
            <Sparkles size={15} style={{ color: 'var(--intel-teal-solid)' }} />
            <span>Ask AcroVision</span>
          </button>

          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => navigate('/setup')}
          >
            <Plus size={15} />
            <span>Add Field / Farm</span>
          </button>
        </div>
      </div>

      {/* 1. Overall Farm Status Hero */}
      <div style={{ marginBottom: 'var(--space-xl)' }}>
        <FarmSummaryCard />
      </div>

      {/* 2. Urgent Actions / What Needs Attention */}
      <section style={{ marginBottom: 'var(--space-xl)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={20} style={{ color: 'var(--status-action-solid)' }} />
            <span>What Needs Attention Today</span>
          </h2>
          {activeAlerts.length > 2 && (
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => navigate('/alerts')}
              style={{ fontWeight: 700 }}
            >
              <span>View All ({activeAlerts.length})</span>
              <ArrowRight size={14} />
            </button>
          )}
        </div>

        {pendingActions.length > 0 ? (
          <div className="grid-cols-2">
            {pendingActions.map((alert) => (
              <ActionCard
                key={alert.id}
                alert={alert}
                onResolve={resolveAlert}
                onSnooze={snoozeAlert}
                onViewDetails={() => navigate('/alerts')}
              />
            ))}
          </div>
        ) : (
          <div
            style={{
              padding: '16px 20px',
              backgroundColor: 'var(--forest-50)',
              border: '1px solid var(--forest-200)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: 'var(--forest-900)',
            }}
          >
            <Sprout size={20} style={{ color: 'var(--forest-700)' }} />
            <div>
              <strong>All clear!</strong> No urgent interventions needed today. Soil moisture and climate parameters are balanced.
            </div>
          </div>
        )}
      </section>

      {/* 3. Split Layout: Weather & AI Insights */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: 'var(--space-xl)',
          marginBottom: 'var(--space-xl)',
        }}
        className="dashboard-split-grid"
      >
        {/* Weather Summary */}
        <div>
          <WeatherSummaryWidget showForecast={true} />
        </div>

        {/* AI Insight Card */}
        <div>
          {insights.length > 0 && (
            <AIInsightCard
              insight={insights[0]}
              onClick={() => navigate('/ai-insights')}
            />
          )}
        </div>
      </div>

      {/* 4. Active Fields Grid */}
      <section style={{ marginBottom: 'var(--space-xl)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={20} style={{ color: 'var(--forest-700)' }} />
            <span>Active Field Plots ({fields.length})</span>
          </h2>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => navigate('/monitoring')}
            style={{ fontWeight: 700 }}
          >
            <span>Full Field Inspection</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {fields.length > 0 ? (
          <div className="grid-cols-3">
            {fields.map((f) => (
              <FieldCard
                key={f.id}
                field={f}
                onClick={(field) => setSelectedFieldModal(field)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Fields Registered"
            description="Add your first plot or greenhouse zone to monitor."
            actionLabel="Add Field"
            onAction={() => navigate('/setup')}
          />
        )}
      </section>

      {/* 5. Key Soil & Climate Measurements */}
      <section style={{ marginBottom: 'var(--space-xl)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={20} style={{ color: 'var(--water-blue-solid)' }} />
            <span>Live Soil & Climate Telemetry</span>
          </h2>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => navigate('/monitoring')}
            style={{ fontWeight: 700 }}
          >
            <span>View All Probes ({sensors.length})</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {keySensors.length > 0 ? (
          <div className="grid-cols-4">
            {keySensors.map((s) => (
              <MetricCard key={s.id} sensor={s} showField={true} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Active Sensor Feeds"
            description="Sensors will appear once paired with your field plots."
          />
        )}
      </section>

      {/* Modals */}
      <FieldDetailModal
        isOpen={Boolean(selectedFieldModal)}
        onClose={() => setSelectedFieldModal(null)}
        field={selectedFieldModal}
      />

      <EdgeAIScanModal
        isOpen={Boolean(scanFieldModal)}
        onClose={() => setScanFieldModal(null)}
        field={scanFieldModal}
      />

      <style>{`
        @media (max-width: 900px) {
          .dashboard-split-grid {
            grid-template-columns: 1fr !important;
            gap: var(--space-md) !important;
          }
        }
      `}</style>
    </div>
  );
}
