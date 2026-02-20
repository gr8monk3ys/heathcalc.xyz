'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useLocalStorage, LocalStorageError } from '@/hooks/useLocalStorage';

// Unit system preferences stored in localStorage
interface UnitSystemPreferences {
  unitSystem: 'metric' | 'imperial';
  heightUnit: 'cm' | 'ft';
  weightUnit: 'kg' | 'lb';
  energyUnit: 'kcal' | 'kj';
}

// Context type for unit system
interface UnitSystemContextType {
  unitSystem: 'metric' | 'imperial';
  heightUnit: 'cm' | 'ft';
  weightUnit: 'kg' | 'lb';
  energyUnit: 'kcal' | 'kj';
  setUnitSystem: (system: 'metric' | 'imperial') => void;
  setHeightUnit: (unit: 'cm' | 'ft') => void;
  setWeightUnit: (unit: 'kg' | 'lb') => void;
  setEnergyUnit: (unit: 'kcal' | 'kj') => void;
  storageError: LocalStorageError | null;
  dismissStorageError: () => void;
}

// Default unit system preferences
const defaultUnitSystemPreferences: UnitSystemPreferences = {
  unitSystem: 'metric',
  heightUnit: 'cm',
  weightUnit: 'kg',
  energyUnit: 'kcal',
};

// Create the context
const UnitSystemContext = createContext<UnitSystemContextType | undefined>(undefined);

// Provider component
export function UnitSystemProvider({ children }: { children: ReactNode }) {
  // Track storage error state for user notification
  const [displayedError, setDisplayedError] = useState<LocalStorageError | null>(null);

  // Handle storage errors
  const handleStorageError = useCallback((error: LocalStorageError) => {
    setDisplayedError(error);
  }, []);

  // Use localStorage to persist unit system preferences
  const [storedPreferences, setStoredPreferences, , storageError] =
    useLocalStorage<UnitSystemPreferences>(
      'unit-system-preferences',
      defaultUnitSystemPreferences,
      {
        onError: handleStorageError,
      }
    );

  // Dismiss storage error notification
  const dismissStorageError = useCallback(() => {
    setDisplayedError(null);
  }, []);

  // Unit system setters
  const setUnitSystem = useCallback(
    (system: 'metric' | 'imperial') => {
      setStoredPreferences(prev => {
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
    },
    [setStoredPreferences]
  );

  const setHeightUnit = useCallback(
    (unit: 'cm' | 'ft') => {
      setStoredPreferences(prev => ({ ...prev, heightUnit: unit }));
    },
    [setStoredPreferences]
  );

  const setWeightUnit = useCallback(
    (unit: 'kg' | 'lb') => {
      setStoredPreferences(prev => ({ ...prev, weightUnit: unit }));
    },
    [setStoredPreferences]
  );

  const setEnergyUnit = useCallback(
    (unit: 'kcal' | 'kj') => {
      setStoredPreferences(prev => ({ ...prev, energyUnit: unit }));
    },
    [setStoredPreferences]
  );

  // Context value
  const contextValue: UnitSystemContextType = {
    unitSystem: storedPreferences.unitSystem,
    heightUnit: storedPreferences.heightUnit,
    weightUnit: storedPreferences.weightUnit,
    energyUnit: storedPreferences.energyUnit,
    setUnitSystem,
    setHeightUnit,
    setWeightUnit,
    setEnergyUnit,
    storageError: displayedError || storageError,
    dismissStorageError,
  };

  return <UnitSystemContext.Provider value={contextValue}>{children}</UnitSystemContext.Provider>;
}

// Custom hook to use the unit system context
export function useUnitSystem(): UnitSystemContextType {
  const context = useContext(UnitSystemContext);

  if (context === undefined) {
    throw new Error('useUnitSystem must be used within a UnitSystemProvider');
  }

  return context;
}
