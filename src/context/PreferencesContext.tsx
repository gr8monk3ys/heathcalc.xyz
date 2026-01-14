'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import { useLocalStorage, LocalStorageError } from '@/hooks/useLocalStorage';

// Define the types for our preferences
export interface UserPreferences {
  darkMode: boolean;
  unitSystem: 'metric' | 'imperial';
  heightUnit: 'cm' | 'ft';
  weightUnit: 'kg' | 'lb';
  energyUnit: 'kcal' | 'kj';
  saveHistory: boolean;
  notificationsEnabled: boolean;
}

// Define the context type
interface PreferencesContextType {
  preferences: UserPreferences;
  setDarkMode: (enabled: boolean) => void;
  toggleDarkMode: () => void;
  setUnitSystem: (system: 'metric' | 'imperial') => void;
  setHeightUnit: (unit: 'cm' | 'ft') => void;
  setWeightUnit: (unit: 'kg' | 'lb') => void;
  setEnergyUnit: (unit: 'kcal' | 'kj') => void;
  setSaveHistory: (enabled: boolean) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  resetPreferences: () => void;
  isSystemDarkMode: boolean;
  /** Storage error if preferences couldn't be saved */
  storageError: LocalStorageError | null;
  /** Dismiss the storage error notification */
  dismissStorageError: () => void;
}

// Default preferences
const defaultPreferences: UserPreferences = {
  darkMode: false, // Default to light mode
  unitSystem: 'metric', // Default to metric
  heightUnit: 'cm', // Default to centimeters
  weightUnit: 'kg', // Default to kilograms
  energyUnit: 'kcal', // Default to kilocalories
  saveHistory: true, // Default to saving history
  notificationsEnabled: false, // Default to notifications off
};

// Create the context
const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

// Provider component
export function PreferencesProvider({ children }: { children: ReactNode }) {
  // Track storage error state for user notification
  const [displayedError, setDisplayedError] = useState<LocalStorageError | null>(null);

  // Handle storage errors
  const handleStorageError = useCallback((error: LocalStorageError) => {
    setDisplayedError(error);
  }, []);

  // Use localStorage to persist preferences
  const [storedPreferences, setStoredPreferences, , storageError] =
    useLocalStorage<UserPreferences>('user-preferences', defaultPreferences, {
      onError: handleStorageError,
    });

  // Track system dark mode preference
  const [isSystemDarkMode, setIsSystemDarkMode] = useState(false);

  // Initialize preferences from localStorage
  const [preferences, setPreferences] = useState<UserPreferences>(storedPreferences);

  // Dismiss storage error notification
  const dismissStorageError = useCallback(() => {
    setDisplayedError(null);
  }, []);

  // Update localStorage when preferences change
  useEffect(() => {
    setStoredPreferences(preferences);

    // Apply dark mode to document
    if (preferences.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [preferences, setStoredPreferences]);

  // Detect system dark mode preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // Set initial value
    setIsSystemDarkMode(mediaQuery.matches);

    // Listen for changes
    const handler = (e: MediaQueryListEvent) => {
      setIsSystemDarkMode(e.matches);
    };

    mediaQuery.addEventListener('change', handler);

    return () => {
      mediaQuery.removeEventListener('change', handler);
    };
  }, []);

  // Preference setters
  const setDarkMode = (enabled: boolean) => {
    setPreferences(prev => ({ ...prev, darkMode: enabled }));
  };

  const toggleDarkMode = () => {
    setPreferences(prev => ({ ...prev, darkMode: !prev.darkMode }));
  };

  const setUnitSystem = (system: 'metric' | 'imperial') => {
    setPreferences(prev => {
      // Update all units based on system
      const newPrefs = { ...prev, unitSystem: system };

      if (system === 'metric') {
        newPrefs.heightUnit = 'cm';
        newPrefs.weightUnit = 'kg';
      } else {
        newPrefs.heightUnit = 'ft';
        newPrefs.weightUnit = 'lb';
      }

      return newPrefs;
    });
  };

  const setHeightUnit = (unit: 'cm' | 'ft') => {
    setPreferences(prev => ({ ...prev, heightUnit: unit }));
  };

  const setWeightUnit = (unit: 'kg' | 'lb') => {
    setPreferences(prev => ({ ...prev, weightUnit: unit }));
  };

  const setEnergyUnit = (unit: 'kcal' | 'kj') => {
    setPreferences(prev => ({ ...prev, energyUnit: unit }));
  };

  const setSaveHistory = (enabled: boolean) => {
    setPreferences(prev => ({ ...prev, saveHistory: enabled }));
  };

  const setNotificationsEnabled = (enabled: boolean) => {
    setPreferences(prev => ({ ...prev, notificationsEnabled: enabled }));

    // Request notification permission if enabled
    if (enabled && 'Notification' in window) {
      Notification.requestPermission();
    }
  };

  // Reset to defaults
  const resetPreferences = () => {
    setPreferences(defaultPreferences);
  };

  // Context value
  const contextValue: PreferencesContextType = {
    preferences,
    setDarkMode,
    toggleDarkMode,
    setUnitSystem,
    setHeightUnit,
    setWeightUnit,
    setEnergyUnit,
    setSaveHistory,
    setNotificationsEnabled,
    resetPreferences,
    isSystemDarkMode,
    storageError: displayedError || storageError,
    dismissStorageError,
  };

  return (
    <PreferencesContext.Provider value={contextValue}>
      {children}
      {/* Storage error notification */}
      {displayedError && (
        <div
          className="fixed bottom-4 right-4 max-w-sm bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 shadow-lg z-50"
          role="alert"
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Preferences Not Saved
              </h3>
              <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
                {displayedError.message}. Your preferences will reset when you leave.
              </p>
            </div>
            <button
              type="button"
              onClick={dismissStorageError}
              className="ml-auto -mx-1.5 -my-1.5 bg-yellow-50 dark:bg-yellow-900 text-yellow-500 rounded-lg p-1.5 hover:bg-yellow-100 dark:hover:bg-yellow-800 inline-flex h-8 w-8"
              aria-label="Dismiss notification"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </PreferencesContext.Provider>
  );
}

// Custom hook to use the preferences context
export function usePreferences(): PreferencesContextType {
  const context = useContext(PreferencesContext);

  if (context === undefined) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }

  return context;
}
