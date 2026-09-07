export default function AlertFilters({
  activeFilter,
  onFilterChange,
  counts = {},
}) {
  const FILTERS = [
    { id: 'ALL', label: 'All Alerts', count: counts.all ?? 0 },
    { id: 'ACTIVE', label: 'Needs Action', count: counts.active ?? 0 },
    { id: 'URGENT', label: 'Urgent', count: counts.urgent ?? 0 },
    { id: 'WATCH', label: 'Watch Items', count: counts.watch ?? 0 },
    { id: 'RESOLVED', label: 'Resolved History', count: counts.resolved ?? 0 },
  ];

  return (
    <div className="acro-tabs" style={{ marginBottom: 'var(--space-lg)' }}>
      {FILTERS.map((f) => (
        <button
          key={f.id}
          type="button"
          className={`acro-tab-btn ${activeFilter === f.id ? 'active' : ''}`}
          onClick={() => onFilterChange(f.id)}
        >
          <span>{f.label}</span>
          <span
            style={{
              fontSize: '0.725rem',
              padding: '1px 6px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: activeFilter === f.id ? 'var(--forest-100)' : 'var(--bg-tertiary)',
              color: activeFilter === f.id ? 'var(--forest-800)' : 'var(--text-muted)',
              fontWeight: 700,
            }}
          >
            {f.count}
          </span>
        </button>
      ))}
    </div>
  );
}
