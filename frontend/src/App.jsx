import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ModeProvider } from './context/ModeContext';
import { FarmProvider } from './context/FarmContext';
import { DataProvider } from './context/DataContext';

// Layout
import AppLayout from './components/layout/AppLayout';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import FarmSetupPage from './pages/FarmSetupPage';
import DashboardPage from './pages/DashboardPage';
import FarmsPage from './pages/FarmsPage';
import MonitoringPage from './pages/MonitoringPage';
import WeatherPage from './pages/WeatherPage';
import CropHealthPage from './pages/CropHealthPage';
import AIInsightsPage from './pages/AIInsightsPage';
import AlertsPage from './pages/AlertsPage';
import DevicesPage from './pages/DevicesPage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ModeProvider>
          <FarmProvider>
            <DataProvider>
              <Routes>
                {/* Public Marketing & Auth Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />

                {/* Farmer Onboarding Flow */}
                <Route path="/setup" element={<FarmSetupPage />} />

                {/* Application AppLayout Shell */}
                <Route element={<AppLayout />}>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/farms" element={<FarmsPage />} />
                  <Route path="/monitoring" element={<MonitoringPage />} />
                  <Route path="/weather" element={<WeatherPage />} />
                  <Route path="/crop-health" element={<CropHealthPage />} />
                  <Route path="/ai-insights" element={<AIInsightsPage />} />
                  <Route path="/alerts" element={<AlertsPage />} />
                  <Route path="/devices" element={<DevicesPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </DataProvider>
          </FarmProvider>
        </ModeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
