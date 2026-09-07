import { useState } from 'react';
import { useFarm } from '../hooks/useFarm';
import { useData } from '../hooks/useData';
import CropHealthCard from '../components/crop/CropHealthCard';
import EdgeAIScanModal from '../components/crop/EdgeAIScanModal';
import EmptyState from '../components/ui/EmptyState';
import { ShieldCheck, Camera } from 'lucide-react';

export default function CropHealthPage() {
  const { fields } = useFarm();
  const { cropHealth } = useData();
  const [activeScanField, setActiveScanField] = useState(null);

  // Overall average crop health score
  const avgHealthScore = cropHealth.length > 0
    ? Math.round(cropHealth.reduce((acc, h) => acc + h.overallHealthScore, 0) / cropHealth.length)
    : 88;

  const totalIssues = cropHealth.reduce((acc, h) => acc + (h.issuesDetected?.length || 0), 0);

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Crop Health & Edge AI Diagnostics</h1>
          <p>
            Canopy health assessments, leaf disease scouting, and localized treatment recommendations.
          </p>
        </div>

        
      </div>
  <div
    className="acro-card"
    style={{
      marginBottom: 'var(--space-xl)',
      padding: 'var(--space-xl)'
    }}
  >
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 'var(--space-md)'
      }}
    >
      <div>
        <h2 style={{ margin: 0 }}>
          AI Crop Diagnostic
        </h2>

        <p
          style={{
            margin: '6px 0 0',
            color: 'var(--text-secondary)'
          }}
        >
          Upload a plant leaf image for disease detection and recommendations.
        </p>
      </div>
    </div>

    <EdgeAIScanModal
      isOpen={true}
      onClose={() => {}}
      field={fields[0] || null}
    />
  </div>

  {/* Hero Overview Banner */}
      {/* Hero Overview Banner */}
      <div
        className="acro-card"
        style={{
          background: 'linear-gradient(135deg, var(--forest-900) 0%, var(--forest-800) 100%)',
          color: '#FFFFFF',
          marginBottom: 'var(--space-xl)',
          border: 'none',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 'var(--space-lg)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--forest-300)', fontSize: '0.85rem' }}>
              <ShieldCheck size={16} />
              <span>Farm-Wide Canopy Index</span>
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#FFFFFF', marginTop: '4px' }}>
              {avgHealthScore}% — Vigorous Canopy Health
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--forest-100)', marginTop: '4px' }}>
              {totalIssues > 0
                ? `${totalIssues} minor leaf observation${totalIssues > 1 ? 's' : ''} detected across ${cropHealth.length} monitored fields.`
                : 'All fields are free of active fungal, bacterial, or pest infestations.'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                padding: '12px 18px',
                borderRadius: 'var(--radius-md)',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{cropHealth.length}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--forest-300)' }}>Scanned Plots</div>
            </div>

            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                padding: '12px 18px',
                borderRadius: 'var(--radius-md)',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{totalIssues}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--forest-300)' }}>Active Issues</div>
            </div>
          </div>
        </div>
      </div>

      {/* Field Health Cards Grid */}
      {cropHealth.length > 0 ? (
        <div className="grid-cols-3">
          {cropHealth.map((assessment) => {
            const fieldObj = fields.find((f) => f.id === assessment.fieldId) || {
              id: assessment.fieldId,
              name: assessment.fieldName,
              crop: { name: assessment.cropName },
            };

            return (
              <CropHealthCard
                key={assessment.id}
                assessment={assessment}
                onScanClick={() => setActiveScanField(fieldObj)}
              />
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No Crop Scans Available"
          description="Trigger an optical camera scan to generate crop condition assessments."
          actionLabel="Run First Scan"
          onAction={() => setActiveScanField(fields[0] || null)}
        />
      )}

      {/* Edge AI Camera Scan Modal */}
      
    </div>
  );
}
