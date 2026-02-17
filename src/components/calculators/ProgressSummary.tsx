'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useSavedResults } from '@/context/SavedResultsContext';
import { useLocale } from '@/context/LocaleContext';

interface SparklineProps {
  values: number[];
  color?: string;
}

function Sparkline({ values, color = 'var(--accent)' }: SparklineProps): React.JSX.Element | null {
  if (values.length < 2) return null;

  const w = 60;
  const h = 20;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="inline-block">
      <polyline
        points={points.join(' ')}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function getNumericValue(data: Record<string, unknown>): number | null {
  const keys = Object.keys(data);
  for (const key of keys) {
    if (typeof data[key] === 'number') return data[key];
  }
  return null;
}

interface CalculatorGroup {
  type: string;
  name: string;
  values: number[];
  latestDate: string;
  latestValue: number;
}

/**
 * A compact progress summary widget showing recent calculator activity.
 * Only renders when the user has saved results.
 */
export default function ProgressSummary({
  className = '',
}: {
  className?: string;
}): React.JSX.Element | null {
  const { savedResults } = useSavedResults();
  const { localizePath } = useLocale();

  const recentGroups = useMemo((): CalculatorGroup[] => {
    if (savedResults.length === 0) return [];

    const grouped = new Map<string, { name: string; items: { date: string; value: number }[] }>();

    for (const result of savedResults) {
      const val = getNumericValue(result.data);
      if (val === null) continue;

      const existing = grouped.get(result.calculatorType);
      if (existing) {
        existing.items.push({ date: result.date, value: val });
      } else {
        grouped.set(result.calculatorType, {
          name: result.calculatorName,
          items: [{ date: result.date, value: val }],
        });
      }
    }

    const groups: CalculatorGroup[] = [];
    const entries = Array.from(grouped.entries());
    for (let idx = 0; idx < entries.length; idx++) {
      const entry = entries[idx];
      const type = entry[0];
      const name = entry[1].name;
      const items = entry[1].items;
      const sortedItems = items.sort(
        (a: { date: string; value: number }, b: { date: string; value: number }) =>
          new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      const latest = sortedItems[sortedItems.length - 1];
      groups.push({
        type,
        name,
        values: sortedItems.map((i: { date: string; value: number }) => i.value),
        latestDate: latest.date,
        latestValue: latest.value,
      });
    }

    // Sort by most recent result first, take top 3
    return groups
      .sort(
        (a: CalculatorGroup, b: CalculatorGroup) =>
          new Date(b.latestDate).getTime() - new Date(a.latestDate).getTime()
      )
      .slice(0, 3);
  }, [savedResults]);

  if (recentGroups.length === 0) return null;

  return (
    <div className={`glass-panel rounded-2xl p-5 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold">Your Progress</h3>
        <Link
          href={localizePath('/saved-results')}
          className="text-accent text-xs font-medium hover:underline"
        >
          View all
        </Link>
      </div>

      <div className="space-y-3">
        {recentGroups.map(group => {
          const dateLabel = new Date(group.latestDate).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
          });

          return (
            <div key={group.type} className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{group.name}</p>
                <p className="text-xs opacity-50">{dateLabel}</p>
              </div>
              <div className="shrink-0">
                <Sparkline values={group.values} />
              </div>
              <span className="text-sm font-bold tabular-nums w-14 text-right">
                {Number.isInteger(group.latestValue)
                  ? group.latestValue
                  : group.latestValue.toFixed(1)}
              </span>
            </div>
          );
        })}
      </div>

      {savedResults.length > 3 && (
        <p className="mt-3 text-xs text-center opacity-50">
          {savedResults.length} total results saved
        </p>
      )}
    </div>
  );
}
