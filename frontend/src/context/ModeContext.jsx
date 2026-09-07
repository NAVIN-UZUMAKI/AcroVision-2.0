import { useState, useEffect } from 'react';
import { ModeContext } from './contextDefs';

const MODE_STORAGE_KEY = 'acrovision_app_mode';
const THEME_STORAGE_KEY = 'acrovision_app_theme';
const UNITS_STORAGE_KEY = 'acrovision_app_units';
const OFFLINE_STORAGE_KEY = 'acrovision_offline_sim';

export function ModeProvider({ children }) {
  const [mode, setModeState] = useState(() => {
    return localStorage.getItem(MODE_STORAGE_KEY) || 'farmer'; // 'farmer' | 'advanced'
  });

  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem(THEME_STORAGE_KEY) || 'light';
  });

  const [units, setUnitsState] = useState(() => {
    return localStorage.getItem(UNITS_STORAGE_KEY) || 'metric';
  });

  const [isOffline, setIsOfflineState] = useState(() => {
    return localStorage.getItem(OFFLINE_STORAGE_KEY) === 'true';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const setMode = (newMode) => {
    setModeState(newMode);
    localStorage.setItem(MODE_STORAGE_KEY, newMode);
  };

  const toggleMode = () => {
    const next = mode === 'farmer' ? 'advanced' : 'farmer';
    setMode(next);
  };

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const setUnits = (newUnits) => {
    setUnitsState(newUnits);
    localStorage.setItem(UNITS_STORAGE_KEY, newUnits);
  };

  const setIsOffline = (val) => {
    setIsOfflineState(val);
    localStorage.setItem(OFFLINE_STORAGE_KEY, String(val));
  };

  const toggleOffline = () => {
    setIsOffline(!isOffline);
  };

  const isAdvancedMode = mode === 'advanced';

  return (
    <ModeContext.Provider
      value={{
        mode,
        isAdvancedMode,
        setMode,
        toggleMode,
        theme,
        setTheme,
        toggleTheme,
        units,
        setUnits,
        isOffline,
        setIsOffline,
        toggleOffline,
      }}
    >
      {children}
    </ModeContext.Provider>
  );
}
