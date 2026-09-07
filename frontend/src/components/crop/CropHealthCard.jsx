import StatusBadge from '../ui/StatusBadge';
import { ScanEye, Bug, Sparkles, CheckCircle2 } from 'lucide-react';

export default function CropHealthCard({ assessment, onScanClick }) {
  if (!assessment) return null;

  const hasIssues = assessment.issuesDetected && assessment.issuesDetected.length > 0;

  return (
    <div className="acro-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        {/* Header */}
        <div className="card-header">
          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{assessment.fieldName}</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {assessment.cropName} • {assessment.assessedVia}
            </p>
          </div>
          <StatusBadge status={assessment.status} size="sm" />
        </div>

        {/* Health Score & Confidence */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 14px',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-md)',
            margin: 'var(--space-md) 0',
          }}
        >
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Crop Health Score
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--forest-800)' }}>
              {assessment.overallHealthScore}%
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span className="badge badge-intel" style={{ fontSize: '0.725rem' }}>
              <Sparkles size={11} aria-hidden="true" />
              <span>{assessment.scanConfidence}% AI Confidence</span>
            </span>
          </div>
        </div>

        {/* Observation Summary */}
        <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: 1.45, marginBottom: 'var(--space-md)' }}>
          {assessment.summary}
        </p>

        {/* Detected Issues (if any) */}
        {hasIssues ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {assessment.issuesDetected.map((issue) => (
              <div
                key={issue.id}
                style={{
                  border: '1px solid var(--status-watch-border)',
                  backgroundColor: 'var(--status-watch-bg)',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.825rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: 'var(--status-watch-text)' }}>
                    <Bug size={14} aria-hidden="true" />
                    <span>{issue.name}</span>
                  </div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--status-watch-text)' }}>
                    {issue.confidenceScore}% match
                  </span>
                </div>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  {issue.symptomsObserved}
                </p>
                <div style={{ fontWeight: 600, color: 'var(--forest-900)' }}>
                  🌿 Treatment: {issue.organicTreatment}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              backgroundColor: 'var(--forest-50)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--forest-800)',
              fontSize: '0.825rem',
              fontWeight: 600,
            }}
          >
            <CheckCircle2 size={16} aria-hidden="true" />
            <span>Zero disease or pest indicators detected on latest scan.</span>
          </div>
        )}
      </div>

      {/* Footer / Action */}
      <div
        style={{
          marginTop: 'var(--space-md)',
          paddingTop: 'var(--space-sm)',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {new Date(assessment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>

        {onScanClick && (
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => onScanClick(assessment)}
            aria-label={`Trigger Edge AI scan for ${assessment.fieldName}`}
          >
            <ScanEye size={14} aria-hidden="true" />
            <span>Trigger Edge Scan</span>
          </button>
        )}
      </div>
    </div>
  );
}
