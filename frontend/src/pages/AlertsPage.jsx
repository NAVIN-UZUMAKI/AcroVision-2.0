import { useState } from 'react';
import { useData } from '../hooks/useData';
import { useFarm } from '../hooks/useFarm';
import AlertFilters from '../components/alerts/AlertFilters';
import AlertItem from '../components/alerts/AlertItem';
import EmptyState from '../components/ui/EmptyState';
import { CheckCircle2 } from 'lucide-react';

export default function AlertsPage() {
  const { fields } = useFarm();
  const { alerts, resolveAlert, snoozeAlert } = useData();

  const [activeFilter, setActiveFilter] = useState('ALL');
  const [selectedFieldFilter, setSelectedFieldFilter] = useState('ALL');

  // Filter calculations
  const counts = {
    all: alerts.length,
    active: alerts.filter((a) => !a.isResolved).length,
    urgent: alerts.filter((a) => !a.isResolved && (a.severity === 'URGENT' || a.severity === 'ACTION NEEDED')).length,
    watch: alerts.filter((a) => !a.isResolved && a.severity === 'WATCH').length,
    resolved: alerts.filter((a) => a.isResolved).length,
  };

  const filteredAlerts = alerts.filter((a) => {
    // Field filter
    if (selectedFieldFilter !== 'ALL' && a.fieldId !== selectedFieldFilter) {
      return false;
    }

    // Status / Severity filter
    if (activeFilter === 'ACTIVE') return !a.isResolved;
    if (activeFilter === 'URGENT') return !a.isResolved && (a.severity === 'URGENT' || a.severity === 'ACTION NEEDED');
    if (activeFilter === 'WATCH') return !a.isResolved && a.severity === 'WATCH';
    if (activeFilter === 'RESOLVED') return a.isResolved;
    return true;
  });

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Farmer Action Center & Alerts</h1>
          <p>
            Prioritized tasks, irrigation triggers, and disease alerts across all monitored plots.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <AlertFilters
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        counts={counts}
      />

      {/* Field Selector Pill */}
      {fields.length > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-md)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            Filter by Field:
          </span>
          <select
            className="form-select"
            value={selectedFieldFilter}
            onChange={(e) => setSelectedFieldFilter(e.target.value)}
            style={{ width: 'auto', padding: '4px 10px', fontSize: '0.825rem' }}
          >
            <option value="ALL">All Farm Fields</option>
            {fields.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Alert Items List */}
      {filteredAlerts.length > 0 ? (
        <div>
          {filteredAlerts.map((alert) => (
            <AlertItem
              key={alert.id}
              alert={alert}
              onResolve={resolveAlert}
              onSnooze={snoozeAlert}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Alerts Found"
          description={
            activeFilter === 'RESOLVED'
              ? 'No resolved task history recorded yet.'
              : 'All fields are operating under optimal targets with no active alarms.'
          }
          icon={CheckCircle2}
        />
      )}
    </div>
  );
}
