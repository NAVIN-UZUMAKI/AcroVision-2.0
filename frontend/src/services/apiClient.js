/**
 * @file apiClient.js
 * Centralized HTTP API Client for AcroVision Backend.
 * Seamlessly interfaces with FastAPI backend at http://localhost:8000/api/v1
 * with automatic fallback to local persistence when offline.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

let isBackendAvailable = true;
let lastCheckTime = 0;

export async function checkBackendHealth() {
  const now = Date.now();
  if (now - lastCheckTime < 10000) {
    return isBackendAvailable;
  }
  try {
    const res = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(2500),
    });
    isBackendAvailable = res.ok;
  } catch {
    isBackendAvailable = false;
  }
  lastCheckTime = now;
  return isBackendAvailable;
}

export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const defaultHeaders = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      signal: options.signal || AbortSignal.timeout(6000),
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => '');
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { detail: errorText || `HTTP ${res.status}` };
      }
      throw new Error(errorData.detail || `Request failed with status ${res.status}`);
    }

    isBackendAvailable = true;
    return await res.json();
  } catch (err) {
    // If connection refused, mark backend unavailable for fast fallback
    if (err.name === 'TypeError' || err.name === 'TimeoutError' || (err.message && err.message.includes('fetch'))) {
      isBackendAvailable = false;
    }
    throw err;
  }
}

export const api = {
  get: (endpoint, options) => apiRequest(endpoint, { method: 'GET', ...options }),
  post: (endpoint, body, options) => apiRequest(endpoint, { method: 'POST', body: JSON.stringify(body), ...options }),
  put: (endpoint, body, options) => apiRequest(endpoint, { method: 'PUT', body: JSON.stringify(body), ...options }),
  patch: (endpoint, body, options) => apiRequest(endpoint, { method: 'PATCH', body: JSON.stringify(body), ...options }),
  delete: (endpoint, options) => apiRequest(endpoint, { method: 'DELETE', ...options }),
  isOnline: () => isBackendAvailable,
  getBaseUrl: () => API_BASE_URL,
};
