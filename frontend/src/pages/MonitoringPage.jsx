import { useState } from 'react';
import { useFarm } from '../hooks/useFarm';
import { useData } from '../hooks/useData';
import { useMode } from '../hooks/useMode';
import MetricCard from '../components/ui/MetricCard';
import TelemetryTable from '../components/devices/TelemetryTable';
import FieldDetailModal from '../components/field/FieldDetailModal';
import EmptyState from '../components/ui/EmptyState';

export default function MonitoringPage() {
  const { fields } = useFarm();
  const { sensors } = useData();
  const { isAdvancedMode } = useMode();

  const [selectedFieldFilter, setSelectedFieldFilter] = useState('ALL');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('ALL');
  const [inspectField, setInspectField] = useState(null);

  // Filter sensors
  const filteredSensors = sensors.filter((s) => {
    if (selectedFieldFilter !== 'ALL' && s.fieldId !== selectedFieldFilter) {
      return false;
    }
    if (selectedCategoryFilter === 'SOIL' && !['soil_moisture', 'soil_temp'].includes(s.type)) {
      return false;
    }
    if (selectedCategoryFilter === 'CLIMATE' && !['air_temp', 'air_humidity', 'solar_radiation'].includes(s.type)) {
      return false;
    }
    if (selectedCategoryFilter === 'NUTRIENTS' && !['soil_ph', 'soil_ec', 'nitrogen'].includes(s.type)) {
      return false;
    }
    return true;
  });

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="page-title-group">
          <h1>{isAdvancedMode ? 'Field Telemetry & Sensor Nodes' : 'Field & Soil Monitoring'}</h1>
          <p>
            {isAdvancedMode
              ? 'Multi-depth soil probes, microclimate sensors, and automated interpretation rules.'
              : 'Keep track of moisture, soil temperature, and optimal crop conditions across all plots.'}
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'var(--space-md)',
          marginBottom: 'var(--space-lg)',
        }}
      >
        {/* Field Filter Chips */}
        <div className="acro-tabs">
          <button
            type="button"
            className={`acro-tab-btn ${selectedFieldFilter === 'ALL' ? 'active' : ''}`}
            onClick={() => setSelectedFieldFilter('ALL')}
          >
            All Fields ({sensors.length})
          </button>
          {fields.map((f) => {
            const count = sensors.filter((s) => s.fieldId === f.id).length;
            return (
              <button
                key={f.id}
                type="button"
                className={`acro-tab-btn ${selectedFieldFilter === f.id ? 'active' : ''}`}
                onClick={() => setSelectedFieldFilter(f.id)}
              >
                {f.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {[
            { id: 'ALL', label: 'All Probes' },
            { id: 'SOIL', label: 'Soil Moisture & Temp' },
            { id: 'NUTRIENTS', label: 'pH & Nutrients' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`btn btn-sm ${selectedCategoryFilter === cat.id ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setSelectedCategoryFilter(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content: Advanced Table vs Farmer Cards */}
      {filteredSensors.length > 0 ? (
        isAdvancedMode ? (
          <div>
            <div style={{ marginBottom: 'var(--space-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Showing {filteredSensors.length} active sensor telemetry channels
              </span>
            </div>
            <TelemetryTable sensors={filteredSensors} />
          </div>
        ) : (
          <div className="grid-cols-3">
            {filteredSensors.map((s) => {
              const matchedField = fields.find((f) => f.id === s.fieldId);
              return (
                <MetricCard
                  key={s.id}
                  sensor={s}
                  showField={true}
                  onClick={() => matchedField && setInspectField(matchedField)}
                />
              );
            })}
          </div>
        )
      ) : (
        <EmptyState
          title="No Matching Sensors Found"
          description="Try selecting another field plot or clearing your probe category filter."
          actionLabel="Show All Probes"
          onAction={() => {
            setSelectedFieldFilter('ALL');
            setSelectedCategoryFilter('ALL');
          }}
        />
      )}

      {/* Field Inspection Modal */}
      <FieldDetailModal
        isOpen={Boolean(inspectField)}
        onClose={() => setInspectField(null)}
        field={inspectField}
      />
    </div>
  );
}
