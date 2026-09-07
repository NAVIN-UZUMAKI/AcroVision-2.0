import { Link, useNavigate } from 'react-router-dom';
import {
  Leaf,
  Eye,
  Brain,
  CheckCircle2,
  ArrowRight,
  ScanEye,
  Smartphone,
  Cpu,
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh', color: 'var(--text-primary)' }}>
      {/* Top Navbar */}
      <nav
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 48px',
          borderBottom: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--surface-elevated)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--forest-700)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Leaf size={22} aria-hidden="true" />
          </div>
          <span style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--forest-900)' }}>
            ACROVISION 🌱
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link to="/login" className="btn btn-ghost" style={{ fontWeight: 700 }}>
            Sign In
          </Link>
          <Link to="/setup" className="btn btn-primary" style={{ fontWeight: 700 }}>
            <span>Setup Farm</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '80px 24px 60px 24px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--forest-100)',
            color: 'var(--forest-800)',
            padding: '6px 16px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.875rem',
            fontWeight: 700,
            marginBottom: '24px',
          }}
        >
          <Leaf size={16} />
          <span>Farmer-First Intelligent Agriculture Platform</span>
        </div>

        <h1
          style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            color: 'var(--forest-900)',
            maxWidth: '900px',
            margin: '0 auto 24px auto',
            letterSpacing: '-0.03em',
          }}
        >
          AcroVision watches the farm, understands what is happening, and tells you what to do.
        </h1>

        <p
          style={{
            fontSize: '1.25rem',
            color: 'var(--text-secondary)',
            maxWidth: '720px',
            margin: '0 auto 40px auto',
            lineHeight: 1.6,
          }}
        >
          Transform raw soil telemetry and weather forecasts into clear, 5-second actionable decisions. No complex dashboards. Just calm, confident farm stewardship.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={() => navigate('/setup')}
            style={{ fontWeight: 800, padding: '16px 32px' }}
          >
            <span>Start Farm Onboarding</span>
            <ArrowRight size={18} />
          </button>

          <button
            type="button"
            className="btn btn-secondary btn-lg"
            onClick={() => navigate('/dashboard')}
            style={{ fontWeight: 700, padding: '16px 28px' }}
          >
            <span>Explore Live Demo Farm</span>
          </button>
        </div>
      </header>

      {/* 3-Step Promise Pipeline */}
      <section
        style={{
          maxWidth: '1200px',
          margin: '0 auto 80px auto',
          padding: '0 24px',
        }}
      >
        <div
          style={{
            backgroundColor: 'var(--surface-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            padding: '48px 32px',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '32px',
              textAlign: 'center',
            }}
            className="promise-grid"
          >
            <div>
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--water-blue-bg)',
                  color: 'var(--water-blue-solid)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto',
                }}
              >
                <Eye size={28} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px' }}>1. Watches</h3>
              <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)' }}>
                Collects continuous root-zone soil moisture, temperature, micro-weather, and Edge AI canopy scans.
              </p>
            </div>

            <div>
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--intel-teal-bg)',
                  color: 'var(--intel-teal-solid)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto',
                }}
              >
                <Brain size={28} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px' }}>2. Understands</h3>
              <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)' }}>
                Interprets measurements through crop type, growth stages, soil water holding capacity, and disease risk models.
              </p>
            </div>

            <div>
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--forest-100)',
                  color: 'var(--forest-800)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto',
                }}
              >
                <CheckCircle2 size={28} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px' }}>3. Tells What To Do</h3>
              <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)' }}>
                Provides plain-English action cards: "Water North Block tomorrow at 7 AM" with clear "Why?" explanations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section
        style={{
          maxWidth: '1200px',
          margin: '0 auto 100px auto',
          padding: '0 24px',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--forest-900)' }}>
            Engineered specifically for real farm operations
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
            Two distinct view modes built into one cohesive platform.
          </p>
        </div>

        <div className="grid-cols-3">
          <div className="acro-card">
            <div style={{ color: 'var(--forest-700)', marginBottom: '16px' }}>
              <Smartphone size={32} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '8px' }}>Simple Farmer Mode</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Understandable in 5–10 seconds. Focuses on what is happening, if it is good or bad, and immediate action items.
            </p>
          </div>

          <div className="acro-card">
            <div style={{ color: 'var(--water-blue-solid)', marginBottom: '16px' }}>
              <Cpu size={32} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '8px' }}>Advanced Manager Mode</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Inspect raw ESP32 telemetry, node signal strengths, battery voltages, and agronomic threshold curves.
            </p>
          </div>

          <div className="acro-card">
            <div style={{ color: 'var(--intel-teal-solid)', marginBottom: '16px' }}>
              <ScanEye size={32} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '8px' }}>Edge AI Vision Scanner</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Optical leaf disease detection with quantified confidence scoring, organic treatment recipes, and preventive steps.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--surface-elevated)',
          padding: '40px 24px',
          textAlign: 'center',
          fontSize: '0.9rem',
          color: 'var(--text-muted)',
        }}
      >
        <p>AcroVision — Digital Farming Assistant • Built for Farmers Worldwide</p>
      </footer>

      <style>{`
        @media (max-width: 800px) {
          .promise-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
        }
      `}</style>
    </div>
  );
}
