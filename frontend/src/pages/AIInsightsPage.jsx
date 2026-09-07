import { useData } from '../hooks/useData';
import AIInsightCard from '../components/ai/AIInsightCard';
import ChatAssistant from '../components/ai/ChatAssistant';
import { Sparkles } from 'lucide-react';

export default function AIInsightsPage() {
  const { insights } = useData();

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Ask AcroVision & Agricultural Insights</h1>
          <p>
            Context-aware farming intelligence formulated from telemetry, crop stages, and weather forecasts.
          </p>
        </div>
      </div>

      {/* Split Layout: Interactive Chat on Left, Insight Cards on Right */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: 'var(--space-xl)',
          alignItems: 'flex-start',
        }}
        className="ai-split-layout"
      >
        {/* Interactive Chat Assistant */}
        <div>
          <ChatAssistant />
        </div>

        {/* Generated Contextual Insight Cards */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-md)' }}>
            <Sparkles size={18} style={{ color: 'var(--intel-teal-solid)' }} />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Automated Field Insights</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            {insights.map((insight) => (
              <AIInsightCard key={insight.id} insight={insight} />
            ))}
          </div>

          {/* Intelligence Notice */}
          <div
            style={{
              marginTop: 'var(--space-lg)',
              padding: '12px 14px',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              lineHeight: 1.4,
            }}
          >
            <strong>Note on AcroVision Intelligence:</strong> Recommendations are derived deterministically by cross-referencing live sensor telemetry with crop physiological requirements. If telemetry is unavailable or uncertain, the system states insufficient data rather than guessing.
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .ai-split-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
