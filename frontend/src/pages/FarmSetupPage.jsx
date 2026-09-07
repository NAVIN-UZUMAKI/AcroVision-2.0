import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFarm } from '../hooks/useFarm';
import {
  GROWTH_STAGES,
  SOIL_TYPES,
  IRRIGATION_METHODS,
  FARM_TYPES,
} from '../types/farm';
import {
  Leaf,
  ArrowRight,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

const COMMON_CROPS = [
  'Tomato',
  'Potato',
  'Corn (Maize)',
  'Apple',
  'Grapes',
  'Strawberry',
  'Bell Peppers',
  'Cherry',
  'Peach',
  'Citrus / Orange (greening check only)',
  'Squash (mildew check only)',
  'Blueberry (healthy check only)',
  'Raspberry (healthy check only)',
  'Soybean (healthy check only)',
];

export default function FarmSetupPage() {
  const navigate = useNavigate();
  const { createAndActivateFarm } = useFarm();

  const [step, setStep] = useState(1);
  const totalSteps = 6;

  const [formData, setFormData] = useState({
    farmerName: 'Ramesh Patel',
    farmName: 'Green Valley Organic Farm',
    location: 'Coimbatore, Tamil Nadu, India',
    area: 15,
    areaUnit: 'acres',
    farmType: 'Organic Crop Farm',
    mainCrop: 'Tomato',
    cropVariety: 'Roma Hybrid',
    growthStage: 'Flowering / Budding',
    soilType: 'Rich Loam (Balanced)',
    irrigationMethod: 'Precision Drip Irrigation',
    monitoringAlerts: {
      soilMoisture: true,
      weatherRisk: true,
      diseaseScan: true,
      dailyBriefing: true,
    },
  });

  const [isCompleted, setIsCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const updateField = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    setError('');
    if (step === 1 && (!formData.farmerName.trim() || !formData.farmName.trim())) {
      setError('Please provide both your name and farm name.');
      return;
    }
    if (step === 2 && (!formData.location.trim() || !formData.area || formData.area <= 0)) {
      setError('Please enter a valid farm location and total area.');
      return;
    }
    if (step === 3 && (!formData.farmType || !formData.mainCrop)) {
      setError('Please select your farm type and primary crop.');
      return;
    }
    if (step === 4 && !formData.growthStage) {
      setError('Please select current growth stage.');
      return;
    }
    if (step === 5 && (!formData.soilType || !formData.irrigationMethod)) {
      setError('Please select your soil type and irrigation system.');
      return;
    }

    if (step < totalSteps) {
      setStep((s) => s + 1);
    } else {
      handleFinalSubmit();
    }
  };

  const handlePrev = () => {
    setError('');
    if (step > 1) {
      setStep((s) => s - 1);
    }
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      await createAndActivateFarm(formData);
      setIsCompleted(true);
    } catch (err) {
      setError(err?.message || 'Failed to initialize farm. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-primary)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 'var(--space-xl) var(--space-md)',
      }}
    >
      <div style={{ maxWidth: '640px', width: '100%' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'var(--forest-100)',
              color: 'var(--forest-800)',
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.825rem',
              fontWeight: 700,
              marginBottom: '12px',
            }}
          >
            <Leaf size={15} />
            <span>Farm Onboarding Journey</span>
          </div>

          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>
            {isCompleted ? 'Farm Ready!' : 'Setup Your Farm Profile'}
          </h1>
          <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {isCompleted
              ? 'Your agricultural parameters have been calibrated into AcroVision.'
              : `Step ${step} of ${totalSteps}: Tailoring intelligence for your land and crops.`}
          </p>

          {/* Step Progress Dots */}
          {!isCompleted && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '8px',
                marginTop: 'var(--space-md)',
              }}
            >
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  style={{
                    width: i === step ? '28px' : '8px',
                    height: '8px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor:
                      i === step
                        ? 'var(--forest-700)'
                        : i < step
                        ? 'var(--forest-300)'
                        : 'var(--border-strong)',
                    transition: 'all var(--transition-normal)',
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Card Body */}
        <div className="acro-card" style={{ padding: 'var(--space-xl)' }}>
          {error && (
            <div
              style={{
                backgroundColor: 'var(--status-urgent-bg)',
                color: 'var(--status-urgent-text)',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                marginBottom: 'var(--space-md)',
                border: '1px solid var(--status-urgent-border)',
              }}
              role="alert"
            >
              {error}
            </div>
          )}

          {/* Completion Celebration */}
          {isCompleted ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-lg) 0' }}>
              <div
                style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--forest-100)',
                  color: 'var(--forest-800)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px auto',
                }}
              >
                <Sparkles size={36} />
              </div>

              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--forest-900)' }}>
                Welcome to AcroVision 🌱
              </h2>
              <p style={{ fontSize: '1.1rem', color: 'var(--forest-700)', fontWeight: 600, marginTop: '8px' }}>
                Your farm is ready to be monitored.
              </p>

              <div
                style={{
                  margin: 'var(--space-xl) 0',
                  padding: '16px',
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-lg)',
                  textAlign: 'left',
                  fontSize: '0.9rem',
                }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Farm:</span>{' '}
                    <strong>{formData.farmName}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Farmer:</span>{' '}
                    <strong>{formData.farmerName}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Main Crop:</span>{' '}
                    <strong>{formData.mainCrop} ({formData.growthStage})</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Total Area:</span>{' '}
                    <strong>{formData.area} {formData.areaUnit}</strong>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="btn btn-primary btn-lg"
                onClick={() => navigate('/dashboard')}
                style={{ width: '100%', padding: '14px', fontWeight: 800 }}
              >
                <span>Launch Farm Dashboard</span>
                <ArrowRight size={18} />
              </button>
            </div>
          ) : (
            <div>
              {/* STEP 1: Farmer & Farm Name */}
              {step === 1 && (
                <div className="fade-in">
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 'var(--space-md)' }}>
                    1. Farmer & Farm Identification
                  </h3>

                  <div className="form-group">
                    <label className="form-label" htmlFor="farmer-name">
                      Farmer / Manager Name *
                    </label>
                    <input
                      id="farmer-name"
                      type="text"
                      className="form-input"
                      placeholder="e.g. Ramesh Patel"
                      value={formData.farmerName}
                      onChange={(e) => updateField('farmerName', e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="farm-name">
                      Farm or Estate Name *
                    </label>
                    <input
                      id="farm-name"
                      type="text"
                      className="form-input"
                      placeholder="e.g. Green Valley Organic Farm"
                      value={formData.farmName}
                      onChange={(e) => updateField('farmName', e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: Location & Area */}
              {step === 2 && (
                <div className="fade-in">
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 'var(--space-md)' }}>
                    2. Geographic Location & Land Size
                  </h3>

                  <div className="form-group">
                    <label className="form-label" htmlFor="farm-location">
                      Farm Location / District *
                    </label>
                    <input
                      id="farm-location"
                      type="text"
                      className="form-input"
                      placeholder="e.g. Coimbatore, Tamil Nadu, India"
                      value={formData.location}
                      onChange={(e) => updateField('location', e.target.value)}
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-md)' }}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="farm-area">
                        Total Cultivated Area *
                      </label>
                      <input
                        id="farm-area"
                        type="number"
                        min="0.1"
                        step="0.1"
                        className="form-input"
                        value={formData.area}
                        onChange={(e) => updateField('area', Number(e.target.value))}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="farm-unit">
                        Unit
                      </label>
                      <select
                        id="farm-unit"
                        className="form-select"
                        value={formData.areaUnit}
                        onChange={(e) => updateField('areaUnit', e.target.value)}
                      >
                        <option value="acres">Acres</option>
                        <option value="hectares">Hectares</option>
                        <option value="sq_meters">Sq Meters</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Farm Type & Primary Crop */}
              {step === 3 && (
                <div className="fade-in">
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 'var(--space-md)' }}>
                    3. Farm System & Main Crop
                  </h3>

                  <div className="form-group">
                    <label className="form-label" htmlFor="farm-type">
                      Farm System Type
                    </label>
                    <select
                      id="farm-type"
                      className="form-select"
                      value={formData.farmType}
                      onChange={(e) => updateField('farmType', e.target.value)}
                    >
                      {FARM_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="main-crop">
                      Primary Cultivated Crop *
                    </label>
                    <select
                      id="main-crop"
                      className="form-select"
                      value={formData.mainCrop}
                      onChange={(e) => updateField('mainCrop', e.target.value)}
                    >
                      {COMMON_CROPS.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* STEP 4: Crop Variety & Growth Stage */}
              {step === 4 && (
                <div className="fade-in">
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 'var(--space-md)' }}>
                    4. Variety & Current Growth Stage
                  </h3>

                  <div className="form-group">
                    <label className="form-label" htmlFor="crop-variety">
                      Crop Variety / Hybrid (Optional)
                    </label>
                    <input
                      id="crop-variety"
                      type="text"
                      className="form-input"
                      placeholder="e.g. Roma Hybrid, Sweet Corn F1, Albion"
                      value={formData.cropVariety}
                      onChange={(e) => updateField('cropVariety', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="growth-stage">
                      Current Crop Growth Stage *
                    </label>
                    <select
                      id="growth-stage"
                      className="form-select"
                      value={formData.growthStage}
                      onChange={(e) => updateField('growthStage', e.target.value)}
                    >
                      {GROWTH_STAGES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <span className="form-hint">
                      This calibrates root water demand and nutrient target ranges.
                    </span>
                  </div>
                </div>
              )}

              {/* STEP 5: Soil Type & Irrigation */}
              {step === 5 && (
                <div className="fade-in">
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 'var(--space-md)' }}>
                    5. Soil Classification & Irrigation
                  </h3>

                  <div className="form-group">
                    <label className="form-label" htmlFor="soil-type">
                      Dominant Soil Classification *
                    </label>
                    <select
                      id="soil-type"
                      className="form-select"
                      value={formData.soilType}
                      onChange={(e) => updateField('soilType', e.target.value)}
                    >
                      {SOIL_TYPES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="irrigation-method">
                      Primary Irrigation Method *
                    </label>
                    <select
                      id="irrigation-method"
                      className="form-select"
                      value={formData.irrigationMethod}
                      onChange={(e) => updateField('irrigationMethod', e.target.value)}
                    >
                      {IRRIGATION_METHODS.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* STEP 6: Monitoring Preferences */}
              {step === 6 && (
                <div className="fade-in">
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 'var(--space-md)' }}>
                    6. Assistant & Monitoring Preferences
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px',
                        backgroundColor: 'var(--bg-secondary)',
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={formData.monitoringAlerts.soilMoisture}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            monitoringAlerts: {
                              ...formData.monitoringAlerts,
                              soilMoisture: e.target.checked,
                            },
                          })
                        }
                        style={{ width: '18px', height: '18px', accentColor: 'var(--forest-700)' }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                          Soil Moisture & Irrigation Alerts
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          Alert me when root zone moisture drops below optimal threshold.
                        </div>
                      </div>
                    </label>

                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px',
                        backgroundColor: 'var(--bg-secondary)',
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={formData.monitoringAlerts.weatherRisk}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            monitoringAlerts: {
                              ...formData.monitoringAlerts,
                              weatherRisk: e.target.checked,
                            },
                          })
                        }
                        style={{ width: '18px', height: '18px', accentColor: 'var(--forest-700)' }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                          Spray Window & Weather Risk Advisories
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          Notify optimal times for spraying based on wind and rainfall probability.
                        </div>
                      </div>
                    </label>

                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px',
                        backgroundColor: 'var(--bg-secondary)',
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={formData.monitoringAlerts.diseaseScan}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            monitoringAlerts: {
                              ...formData.monitoringAlerts,
                              diseaseScan: e.target.checked,
                            },
                          })
                        }
                        style={{ width: '18px', height: '18px', accentColor: 'var(--forest-700)' }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                          Edge AI Crop Disease Detection
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          Highlight optical leaf lesions and provide organic remedies.
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {/* Navigation Controls */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 'var(--space-xl)',
                  paddingTop: 'var(--space-md)',
                  borderTop: '1px solid var(--border-subtle)',
                }}
              >
                {step > 1 ? (
                  <button type="button" className="btn btn-secondary" onClick={handlePrev}>
                    <ArrowLeft size={16} />
                    <span>Previous</span>
                  </button>
                ) : (
                  <div />
                )}

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleNext}
                  disabled={isSubmitting}
                  style={{ minWidth: '140px' }}
                >
                  <span>{step === totalSteps ? (isSubmitting ? 'Calibrating...' : 'Complete Setup') : 'Next Step'}</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
