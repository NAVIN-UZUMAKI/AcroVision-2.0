import { useState } from 'react';
import * as ort from 'onnxruntime-web/wasm';
ort.env.wasm.wasmPaths = {
  mjs: new URL(
    '/ort/ort-wasm-simd-threaded.mjs',
    window.location.href
  ).href,

  wasm: new URL(
    '/ort/ort-wasm-simd-threaded.wasm',
    window.location.href
  ).href
};

ort.env.wasm.numThreads = 1;
import { ScanEye, CheckCircle2, RefreshCw, AlertTriangle } from 'lucide-react';

const normalizeCropName = (name) =>
  (name || '')
    .toLowerCase()
    .replace(/[^a-z]/g, '');

const cropsMatch = (predictedCrop, fieldCropName) => {
  const a = normalizeCropName(predictedCrop);
  const b = normalizeCropName(fieldCropName);
  if (!a || !b) return true;
  return a.includes(b) || b.includes(a);
};

export default function EdgeAIScanModal({ field }) {
    const loadCropGuard = async () => {
  if (!window.cropGuardSession) {
    window.cropGuardSession = await ort.InferenceSession.create(
      'https://huggingface.co/fahhhhhh99/cropguard-v2-fast/resolve/main/cropguard_v2_fast.onnx',
      {
        executionProviders: ['wasm'],
        graphOptimizationLevel: 'all'
      }
    );
  }

  return window.cropGuardSession;
};
  const analyzePlantImage = async (imageFile) => {
  const session = await loadCropGuard();

  const imageUrl = URL.createObjectURL(imageFile);

  try {
    const image = new Image();

    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = reject;
      image.src = imageUrl;
    });

    // CropGuard preprocessing:
    // resize shorter side to 256, then center crop to 224x224
    const scale = 256 / Math.min(image.width, image.height);

    const resizedWidth = Math.round(image.width * scale);
    const resizedHeight = Math.round(image.height * scale);

    const cropX = Math.max(0, Math.round((resizedWidth - 224) / 2));
    const cropY = Math.max(0, Math.round((resizedHeight - 224) / 2));

    const canvas = document.createElement('canvas');
    canvas.width = 224;
    canvas.height = 224;

    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      0,
      0,
      image.width,
      image.height,
      -cropX,
      -cropY,
      resizedWidth,
      resizedHeight
    );

    const imageData = ctx.getImageData(0, 0, 224, 224);
    const pixels = imageData.data;

    // ImageNet normalization
    const mean = [0.485, 0.456, 0.406];
    const std = [0.229, 0.224, 0.225];

    const input = new Float32Array(1 * 3 * 224 * 224);

    for (let y = 0; y < 224; y++) {
      for (let x = 0; x < 224; x++) {
        const pixelIndex = (y * 224 + x) * 4;

        const r = pixels[pixelIndex] / 255;
        const g = pixels[pixelIndex + 1] / 255;
        const b = pixels[pixelIndex + 2] / 255;

        const index = y * 224 + x;

        input[index] = (r - mean[0]) / std[0];
        input[224 * 224 + index] = (g - mean[1]) / std[1];
        input[2 * 224 * 224 + index] = (b - mean[2]) / std[2];
      }
    }

    const tensor = new ort.Tensor(
      'float32',
      input,
      [1, 3, 224, 224]
    );

    const inputName = session.inputNames[0];
    const outputName = session.outputNames[0];

    const outputs = await session.run({
      [inputName]: tensor
    });

    const logits = Array.from(outputs[outputName].data);

    // CropGuard temperature scaling
    const temperature = 0.591;

    const scaledLogits = logits.map(
      value => value / temperature
    );

    const maxLogit = Math.max(...scaledLogits);

    const expValues = scaledLogits.map(
      value => Math.exp(value - maxLogit)
    );

    const sum = expValues.reduce(
      (a, b) => a + b,
      0
    );

    const probabilities = expValues.map(
      value => value / sum
    );

    const cropGuardClasses = [
      'Apple___Apple_scab',
      'Apple___Black_rot',
      'Apple___Cedar_apple_rust',
      'Apple___healthy',
      'Blueberry___healthy',
      'Cherry_(including_sour)___Powdery_mildew',
      'Cherry_(including_sour)___healthy',
      'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot',
      'Corn_(maize)___Common_rust_',
      'Corn_(maize)___Northern_Leaf_Blight',
      'Corn_(maize)___healthy',
      'Grape___Black_rot',
      'Grape___Esca_(Black_Measles)',
      'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)',
      'Grape___healthy',
      'Orange___Haunglongbing_(Citrus_greening)',
      'Peach___Bacterial_spot',
      'Peach___healthy',
      'Pepper,_bell___Bacterial_spot',
      'Pepper,_bell___healthy',
      'Potato___Early_blight',
      'Potato___Late_blight',
      'Potato___healthy',
      'Raspberry___healthy',
      'Soybean___healthy',
      'Squash___Powdery_mildew',
      'Strawberry___Leaf_scorch',
      'Strawberry___healthy',
      'Tomato___Bacterial_spot',
      'Tomato___Early_blight',
      'Tomato___Late_blight',
      'Tomato___Leaf_Mold',
      'Tomato___Septoria_leaf_spot',
      'Tomato___Spider_mites Two-spotted_spider_mite',
      'Tomato___Target_Spot',
      'Tomato___Tomato_Yellow_Leaf_Curl_Virus',
      'Tomato___Tomato_mosaic_virus',
      'Tomato___healthy'
    ];

    const predictions = probabilities
      .map((probability, index) => ({
        label: cropGuardClasses[index],
        probability
      }))
      .sort(
        (a, b) => b.probability - a.probability
      );

    return predictions;
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
};
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  if (!field) return null;
  const handleImageChange = (event) => {
  const file = event.target.files?.[0];

  if (!file) return;

  setSelectedImage(file);
  setImagePreview(URL.createObjectURL(file));
  setScanResult(null);
};
  const handleStartScan = async () => {
  if (!selectedImage) return;

  setIsScanning(true);
  setScanResult(null);

  try {
    const predictions = await analyzePlantImage(selectedImage);

    const bestPrediction = predictions[0];

    const rawLabel = bestPrediction.label || 'Unknown';

    const parts = rawLabel.split('___');

    const crop = (parts[0] || 'Unknown')
      .replace(/_/g, ' ')
      .replace(/,\s*bell/i, ' Bell Pepper')
      .replace(/\(including sour\)/gi, '')
      .trim();

    const condition = (parts[1] || 'Unknown')
      .replace(/_/g, ' ')
      .trim();

    const confidence = Math.round(
      bestPrediction.probability * 100
    );

        const isHealthy =
      condition.toLowerCase().includes('healthy');

    const cropMismatch = false;

const isReliable = confidence >= 70;

const isPossible =
  confidence >= 40 &&
  confidence < 70;

setScanResult({
  category: isHealthy
    ? 'Healthy'
    : isReliable
      ? 'Disease detected'
      : isPossible
        ? 'Possible disease pattern'
        : 'Unable to confidently diagnose',

  status: isReliable
    ? `${crop}: ${condition}`
    : isPossible
      ? `Possible ${condition} pattern detected, but crop identification is uncertain`
      : 'Please retake the image with a clear single leaf',

  confidence,

  predictedCrop: crop,

  cropMismatch,

  recommendation: isReliable
    ? (
        isHealthy
          ? `The ${crop} appears healthy. Continue regular irrigation, monitoring, and good field hygiene.`
          : `Possible ${condition} detected in ${crop}. Remove severely affected plant material, maintain good field hygiene, monitor nearby plants, and consult an agricultural expert before treatment.`
      )
    : isPossible
      ? `The AI detected a possible ${condition} pattern, but it could not reliably identify the crop. Please upload a clear photo showing a single leaf before taking action.`
      : `The AI could not confidently identify the plant or condition. Please retake the photo with a single clear leaf, good lighting, and minimal background.`,

  top3: predictions.slice(0, 3).map(prediction => ({
    label: prediction.label,
    probability: Math.round(
      prediction.probability * 100
    )
  })),

  confidenceTier:
    confidence < 40
      ? 'low'
      : confidence < 60
        ? 'moderate'
        : 'high',

  timestamp: new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  })
});
  } catch (error) {
    console.error('CropGuard analysis error:', error);

    setScanResult({
      category: 'Analysis error',
      status: 'Could not analyze image',
      confidence: 0,
      confidenceTier: 'low',
      recommendation:
        'Please try again with a clear photo of a single plant leaf.'
    });
  } finally {
    setIsScanning(false);
  }
};

  return (
    <div>
      <div style={{ marginBottom: 'var(--space-md)' }}>
        <h3 style={{ margin: 0, marginBottom: '4px' }}>
          AI Plant Diagnosis — {field.name}
        </h3>
        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          AI plant disease analysis · mobile camera or uploaded image · browser-based CropGuard model
        </p>
      </div>

      {!scanResult && !isScanning && (
        <div
          style={{
            padding: 'var(--space-lg)',
            border: '2px dashed var(--forest-200)',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center',
            background: 'var(--forest-50)'
          }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-sm)' }}>
            📷
          </div>

          <h3 style={{ margin: 0, marginBottom: '6px' }}>
            Upload Plant Image
          </h3>

                    <div
            style={{
              textAlign: 'left',
              margin: '0 0 var(--space-md) 0',
              padding: '10px 14px',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8rem',
              color: 'var(--text-secondary)'
            }}
          >
            <p style={{ margin: '0 0 4px 0' }}>
              📷 Any photo works — from a distance, from above, or of the whole plant.
            </p>
            <p style={{ margin: 0 }}>
              📌 But the closer you can get to a single leaf, the more accurate the AI's reading will be.
              Distant or angled photos are still analyzed, but check the confidence score below —
              it tells you how sure the AI actually is.
            </p>
          </div>

          <label
            className="btn btn-primary btn-lg"
            style={{
              width: '100%',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            📷 Upload / Take Photo

            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
          </label>

          {imagePreview && (
            <div style={{ marginTop: 'var(--space-md)' }}>
              <img
                src={imagePreview}
                alt="Selected plant leaf"
                style={{
                  width: '100%',
                  maxHeight: '300px',
                  objectFit: 'contain',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--forest-200)'
                }}
              />

              <button
                type="button"
                className="btn btn-primary btn-lg"
                onClick={handleStartScan}
                disabled={!selectedImage}
                style={{
                  width: '100%',
                  marginTop: 'var(--space-md)'
                }}
              >
                <ScanEye size={20} />
                <span>Run AI Diagnostic</span>
              </button>
            </div>
          )}
        </div>
      )}

      {isScanning && (
        <div style={{ textAlign: 'center', padding: 'var(--space-lg)' }}>
          <RefreshCw
            size={24}
            className="spin"
            style={{ color: 'var(--forest-700)', margin: '0 auto 12px auto' }}
          />
          <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>
            Analyzing image...
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Running the CropGuard model on your photo in the browser.
          </p>
        </div>
      )}

      {scanResult && !isScanning && (
        <div
          style={{
            padding: 'var(--space-md)',
            border: '1px solid var(--forest-200)',
            borderRadius: 'var(--radius-md)',
            background: 'var(--surface)'
          }}
        >
          {imagePreview && (
            <div
              style={{
                marginBottom: 'var(--space-md)',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                border: '1px solid var(--forest-200)',
                background: '#FFFFFF'
              }}
            >
              <img
                src={imagePreview}
                alt="Uploaded plant leaf"
                style={{
                  display: 'block',
                  width: '100%',
                  maxHeight: '320px',
                  objectFit: 'contain'
                }}
              />
            </div>
          )}

                    {/* Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 'var(--space-md)',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {scanResult.confidenceTier === 'low' ? (
                <>
                  <AlertTriangle size={22} style={{ color: '#B45309' }} />
                  <strong>Low-Confidence Result</strong>
                </>
              ) : scanResult.confidenceTier === 'moderate' ? (
                <>
                  <AlertTriangle size={22} style={{ color: '#2563EB' }} />
                  <strong>Moderate-Confidence Result</strong>
                </>
              ) : (
                <>
                  <CheckCircle2 size={22} style={{ color: 'var(--forest-600)' }} />
                  <strong>Scan Completed Successfully</strong>
                </>
              )}
            </div>

            <span
              className="badge badge-intel"
              style={
                scanResult.confidenceTier === 'low'
                  ? { backgroundColor: '#FEF3C7', color: '#92400E' }
                  : scanResult.confidenceTier === 'moderate'
                  ? { backgroundColor: '#DBEAFE', color: '#1D4ED8' }
                  : undefined
              }
            >
              {scanResult.confidence}% Confidence
                        </span>
          </div>

          {scanResult.cropMismatch && (
            <div
              style={{
                padding: 'var(--space-md)',
                borderRadius: 'var(--radius-md)',
                background: '#FEE2E2',
                border: '1px solid #FCA5A5',
                marginBottom: 'var(--space-md)',
                fontSize: '0.85rem',
                color: '#991B1B'
              }}
            >
              🚫 This field is registered as growing <strong>{field.crop?.name}</strong>, but the AI thinks this photo looks like <strong>{scanResult.predictedCrop}</strong>. This result may not be reliable — make sure you photographed a leaf from this field's crop, or retake the photo.
            </div>
          )}

          {scanResult.confidenceTier === 'low' && (
            <div
              style={{
                padding: 'var(--space-md)',
                borderRadius: 'var(--radius-md)',
                background: '#FEF3C7',
                border: '1px solid #FBBF24',
                marginBottom: 'var(--space-md)',
                fontSize: '0.85rem',
                color: '#92400E'
              }}
            >
              ⚠️ The model isn't confident about this one — treat it as a rough guess, not a firm diagnosis.
              For a more reliable reading, retake the photo: one single leaf, plain background, good lighting, filling most of the frame.
            </div>
          )}

          {scanResult.confidenceTier === 'moderate' && (
            <div
              style={{
                padding: 'var(--space-md)',
                borderRadius: 'var(--radius-md)',
                background: '#DBEAFE',
                border: '1px solid #93C5FD',
                marginBottom: 'var(--space-md)',
                fontSize: '0.85rem',
                color: '#1D4ED8'
              }}
            >
              ℹ️ This is a moderate-confidence guess — probably in the right area, but a closer, well-lit photo of a single leaf would give a more reliable reading.
            </div>
          )}
          {/* Diagnosis */}
          <div
            style={{
              padding: 'var(--space-md)',
              borderRadius: 'var(--radius-md)',
              background: 'var(--forest-50)',
              marginBottom: 'var(--space-md)'
            }}
          >
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              AI DIAGNOSIS
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>
              {scanResult.status}
            </div>
            <div style={{ marginTop: '6px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              {scanResult.category}
            </div>
          </div>

          {/* Recommendation */}
          <div style={{ marginBottom: 'var(--space-md)' }}>
            <div style={{ fontWeight: 600, marginBottom: '6px' }}>
              🌱 Recommendation
            </div>
            <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {scanResult.recommendation}
            </p>
          </div>

          {/* Alternative predictions */}
          {scanResult.top3 && scanResult.top3.length > 0 && (
            <div style={{ marginBottom: 'var(--space-md)' }}>
              <div style={{ fontWeight: 600, marginBottom: '8px' }}>
                AI Predictions
              </div>

              {scanResult.top3.map((prediction, index) => (
                <div
                  key={`${prediction.label}-${index}`}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '7px 0',
                    borderBottom:
                      index < scanResult.top3.length - 1
                        ? '1px solid var(--forest-100)'
                        : 'none'
                  }}
                >
                  <span style={{ fontSize: '0.85rem' }}>
                    {index + 1}. {prediction.label.replace(/___/g, ' → ').replace(/_/g, ' ')}
                  </span>
                  <strong style={{ fontSize: '0.85rem' }}>
                    {prediction.probability}%
                  </strong>
                </div>
              ))}
            </div>
          )}

          {/* Scan Again */}
          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={() => {
              setScanResult(null);
              setSelectedImage(null);
              setImagePreview(null);
            }}
            style={{ width: '100%' }}
          >
            <RefreshCw size={20} />
            <span>Scan Another Photo</span>
          </button>
        </div>
      )}
    </div>
  );
  }
