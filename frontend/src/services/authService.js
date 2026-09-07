/**
 * @file authService.js
 * Authentication Service interface.
 * Uses local session for prototype, structured to connect to FastAPI JWT auth in Prompt 2.
 */

const AUTH_STORAGE_KEY = 'acrovision_auth_session';

const DEFAULT_USER = {
  id: 'usr-001',
  name: 'Ramesh Patel',
  email: 'ramesh.patel@agrovision.farm',
  role: 'Farm Owner',
  phone: '+91 98450 12345',
  preferredLanguage: 'en',
  avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
};

export const authService = {
  /**
   * Get the current logged-in user or null.
   */
  getCurrentUser() {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fallback
    }
    // Default active session for instant farmer access
    return DEFAULT_USER;
  },

  /**
   * Farmer login.
   */
  async login(email) {
    // In Prompt 2: return fetch('/api/auth/login', { method: 'POST', body: ... })
    const user = {
      ...DEFAULT_USER,
      email: email || DEFAULT_USER.email,
    };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    return { success: true, user, token: 'demo-jwt-token-agrovision' };
  },

  /**
   * Farmer signup.
   */
  async signup({ name, email, phone }) {
    // In Prompt 2: return fetch('/api/auth/signup', { method: 'POST', body: ... })
    const user = {
      id: `usr-${Date.now()}`,
      name: name || 'New Farmer',
      email: email || 'farmer@agrovision.farm',
      phone: phone || '',
      role: 'Farm Owner',
      preferredLanguage: 'en',
      avatarUrl: DEFAULT_USER.avatarUrl,
    };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    return { success: true, user, token: 'demo-jwt-token-agrovision' };
  },

  /**
   * Logout.
   */
  async logout() {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return { success: true };
  },

  /**
   * Password reset request.
   */
  async requestPasswordReset(email) {
    // In Prompt 2: return fetch('/api/auth/forgot-password', ...)
    return { success: true, message: `Reset link sent to ${email}` };
  },
};
