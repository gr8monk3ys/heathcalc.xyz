'use client';

import React from 'react';
import Link from 'next/link';
import { useSavedResults } from '@/context/SavedResultsContext';
import { useLocale } from '@/context/LocaleContext';

interface SaveResultPromptProps {
  calculatorType: string;
  calculatorName: string;
  data: Record<string, unknown>;
  className?: string;
}

/**
 * A banner shown after calculation encouraging users to save results
 * for progress tracking. Uses the glass-panel design token.
 */
export default function SaveResultPrompt({
  calculatorType,
  calculatorName,
  data,
  className = '',
}: SaveResultPromptProps): React.JSX.Element | null {
  const { savedResults, canSaveResults, saveResult, isResultSaved } = useSavedResults();
  const { localizePath } = useLocale();
  const [dismissed, setDismissed] = React.useState(false);
  const [justSaved, setJustSaved] = React.useState(false);

  // Count how many results exist for this calculator type
  const existingCount = savedResults.filter(r => r.calculatorType === calculatorType).length;

  // Don't render if dismissed, or if user can't save, or if already saved this exact result
  if (dismissed) return null;

  // Check if this exact result is already tracked
  const _alreadySaved = savedResults.some(r => {
    if (r.calculatorType !== calculatorType) return false;
    return isResultSaved(r.id);
  });

  const handleSave = (): void => {
    const didSave = saveResult(calculatorType, calculatorName, data);
    if (didSave) {
      setJustSaved(true);
    }
  };

  if (justSaved) {
    return (
      <div className={`glass-panel rounded-2xl px-5 py-4 ${className}`}>
        <div className="flex items-center gap-3">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            className="text-emerald-500 shrink-0"
          >
            <circle cx="10" cy="10" r="10" fill="currentColor" fillOpacity="0.15" />
            <path
              d="M6 10l3 3 5-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="flex-1">
            <p className="text-sm font-semibold">Result saved</p>
            <p className="text-xs opacity-60">
              {existingCount > 0
                ? `You now have ${existingCount + 1} ${calculatorName} results tracked.`
                : 'Save more results over time to see your progress.'}
            </p>
          </div>
          <Link
            href={localizePath('/saved-results')}
            className="text-accent text-sm font-medium hover:underline whitespace-nowrap"
          >
            View progress
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`glass-panel rounded-2xl px-5 py-4 ${className}`}>
      <div className="flex items-start gap-3">
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          className="text-accent shrink-0 mt-0.5"
        >
          <path
            d="M5 3a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v15l-5-2.5L5 18V3z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold">
            {existingCount > 0
              ? `Track your ${calculatorName} progress`
              : 'Save this result to track your progress over time'}
          </p>
          {existingCount > 0 && (
            <p className="text-xs opacity-60 mt-0.5">
              You have {existingCount} saved result{existingCount === 1 ? '' : 's'}. Add this one to
              see trends.
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {canSaveResults ? (
            <button
              type="button"
              onClick={handleSave}
              className="elevated-pill rounded-full px-4 py-1.5 text-xs font-semibold text-accent hover:-translate-y-0.5 transition-transform"
            >
              Save result
            </button>
          ) : (
            <span className="text-xs opacity-50">Sign in to save</span>
          )}
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="Dismiss save prompt"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M3 3l8 8M11 3l-8 8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
