'use client';

import React, { createContext, useContext, ReactNode, useEffect, useMemo, useRef } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useAuth } from '@/context/AuthContext';
import { computeSavedResultKey } from '@/utils/savedResultsKey';

export interface SavedResult {
  id: string;
  calculatorType: string;
  calculatorName: string;
  date: string;
  data: Record<string, unknown>;
}

interface SavedResultsContextState {
  savedResults: SavedResult[];
  canSaveResults: boolean;
  saveResult: (
    calculatorType: string,
    calculatorName: string,
    data: Record<string, unknown>
  ) => boolean;
  removeResult: (id: string) => void;
  clearAllResults: () => void;
  isResultSaved: (id: string) => boolean;
}

const SavedResultsContext = createContext<SavedResultsContextState | undefined>(undefined);

interface SavedResultsProviderProps {
  children: ReactNode;
}

function generateResultId(type: string, _resultData: Record<string, unknown>): string {
  return computeSavedResultKey(type, _resultData);
}

function mergeSavedResults(local: SavedResult[], remote: SavedResult[]): SavedResult[] {
  const merged = new Map<string, SavedResult>();

  for (const item of [...remote, ...local]) {
    const existing = merged.get(item.id);
    if (!existing || item.date > existing.date) {
      merged.set(item.id, item);
    }
  }

  return Array.from(merged.values())
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 30);
}

async function syncResultToServer(result: SavedResult): Promise<void> {
  try {
    await fetch('/api/saved-results', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        calculatorType: result.calculatorType,
        calculatorName: result.calculatorName,
        data: result.data,
      }),
    });
  } catch {
    // Best-effort sync.
  }
}

async function deleteResultFromServer(id: string): Promise<void> {
  try {
    await fetch(`/api/saved-results/${encodeURIComponent(id)}`, { method: 'DELETE' });
  } catch {
    // Best-effort delete.
  }
}

async function clearResultsFromServer(): Promise<void> {
  try {
    await fetch('/api/saved-results', { method: 'DELETE' });
  } catch {
    // Best-effort delete.
  }
}

export function SavedResultsProvider({ children }: SavedResultsProviderProps): React.JSX.Element {
  const { user } = useAuth();
  const [savedResultsByUser, setSavedResultsByUser] = useLocalStorage<
    Record<string, SavedResult[]>
  >('healthcheck-saved-results-by-user', {});

  const userKey = user?.email ?? 'guest';
  const savedResults = useMemo(
    () => savedResultsByUser[userKey] ?? [],
    [savedResultsByUser, userKey]
  );
  const savedResultsRef = useRef<SavedResult[]>(savedResults);
  savedResultsRef.current = savedResults;

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    async function hydrateFromServer() {
      try {
        const res = await fetch('/api/saved-results', { method: 'GET' });
        if (!res.ok) return;
        const payload = (await res.json()) as
          | { success: true; results: SavedResult[] }
          | { success: false; error: string };

        if (!payload.success || !Array.isArray(payload.results)) return;

        const remoteResults = payload.results;
        const localResults = savedResultsRef.current;
        const merged = mergeSavedResults(localResults, remoteResults);

        if (cancelled) return;
        setSavedResultsByUser(prev => ({
          ...prev,
          [userKey]: merged,
        }));

        // Best-effort: push any locally cached items that are missing on the server.
        const remoteIds = new Set(remoteResults.map(result => result.id));
        const missingLocal = localResults.filter(result => !remoteIds.has(result.id));
        for (const result of missingLocal.slice(0, 30)) {
          void syncResultToServer(result);
        }
      } catch {
        // Best-effort hydration.
      }
    }

    void hydrateFromServer();

    return () => {
      cancelled = true;
    };
  }, [setSavedResultsByUser, user, userKey]);

  function saveResult(
    calculatorType: string,
    calculatorName: string,
    data: Record<string, unknown>
  ): boolean {
    if (!user) {
      return false;
    }

    const resultId = generateResultId(calculatorType, data);

    if (savedResults.some(result => result.id === resultId)) {
      return false;
    }

    const newResult: SavedResult = {
      id: resultId,
      calculatorType,
      calculatorName,
      date: new Date().toISOString(),
      data,
    };

    const updatedForUser = [newResult, ...savedResults].slice(0, 30);
    setSavedResultsByUser(prev => ({
      ...prev,
      [userKey]: updatedForUser,
    }));

    void syncResultToServer(newResult);

    return true;
  }

  function removeResult(id: string): void {
    setSavedResultsByUser(prev => ({
      ...prev,
      [userKey]: (prev[userKey] ?? []).filter(result => result.id !== id),
    }));
    void deleteResultFromServer(id);
  }

  function clearAllResults(): void {
    setSavedResultsByUser(prev => ({
      ...prev,
      [userKey]: [],
    }));
    void clearResultsFromServer();
  }

  function isResultSaved(id: string): boolean {
    return savedResults.some(result => result.id === id);
  }

  const value: SavedResultsContextState = {
    savedResults,
    canSaveResults: Boolean(user),
    saveResult,
    removeResult,
    clearAllResults,
    isResultSaved,
  };

  return <SavedResultsContext.Provider value={value}>{children}</SavedResultsContext.Provider>;
}

export function useSavedResults(): SavedResultsContextState {
  const context = useContext(SavedResultsContext);
  if (context === undefined) {
    throw new Error('useSavedResults must be used within a SavedResultsProvider');
  }
  return context;
}
