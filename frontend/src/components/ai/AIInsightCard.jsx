import { Sparkles, ArrowRight } from 'lucide-react';

export default function AIInsightCard({ insight, onClick }) {
  if (!insight) return null;

  return (
    <div
      className="acro-card"
      style={{
        borderTop: '3px solid var(--intel-teal-solid)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
      }}
    >
      <div>
        {/* Header */}
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--intel-teal-bg)',
                color: 'var(--intel-teal-solid)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Sparkles size={16} aria-hidden="true" />
            </div>
            <div>
              <h4 style={{ fontSize: '0.975rem', fontWeight: 700 }}>{insight.title}</h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{insight.fieldName}</p>
            </div>
          </div>

          <span className="badge badge-intel" style={{ fontSize: '0.7rem' }}>
            {insight.confidenceScore}% Confidence
          </span>
        </div>

        {/* Short Answer */}
        <div style={{ margin: 'var(--space-sm) 0' }}>
          <p style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.4 }}>
            {insight.shortAnswer}
          </p>
        </div>

        {/* Why Explanation */}
        <div
          style={{
            backgroundColor: 'var(--bg-secondary)',
            padding: '8px 12px',
            borderRadius: 'var(--radius-sm)',
            margin: 'var(--space-sm) 0',
            fontSize: '0.825rem',
          }}
        >
          <p style={{ color: 'var(--text-secondary)' }}>
            <strong style={{ color: 'var(--text-primary)' }}>Why: </strong>
            {insight.why}
          </p>
        </div>

        {/* Action Recommendation */}
        <div
          style={{
            backgroundColor: 'var(--forest-50)',
            border: '1px solid var(--forest-100)',
            padding: '8px 12px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.825rem',
            color: 'var(--forest-900)',
            fontWeight: 600,
          }}
        >
          👉 {insight.action}
        </div>
      </div>

      {/* Footer */}
      {onClick && (
        <div
          style={{
            marginTop: 'var(--space-md)',
            paddingTop: 'var(--space-sm)',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => onClick(insight)}
            style={{ color: 'var(--intel-teal-solid)', fontWeight: 700 }}
          >
            <span>Ask Follow-up</span>
            <ArrowRight size={13} />
          </button>
        </div>
      )}
    </div>
  );
}
