'use client';

import React from 'react';
import Link from 'next/link';

interface MethodologyBadgeProps {
  formula: string;
  lastUpdated?: string;
  className?: string;
}

const MethodologyBadge: React.FC<MethodologyBadgeProps> = ({
  formula,
  lastUpdated = 'Feb 2026',
  className = '',
}) => {
  return (
    <Link
      href="/about/editorial"
      className={`inline-flex items-center gap-1.5 rounded-full border border-slate-200/60 bg-white/60 px-3 py-1 text-xs text-slate-600 backdrop-blur-sm transition-colors duration-200 hover:border-accent/30 hover:text-accent dark:border-slate-700/50 dark:bg-slate-800/40 dark:text-slate-400 dark:hover:border-accent/30 dark:hover:text-accent ${className}`}
      aria-label={`Uses ${formula}. Last updated ${lastUpdated}. View our editorial methodology.`}
    >
      <svg className="h-3 w-3 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
          clipRule="evenodd"
        />
      </svg>
      <span>
        Uses {formula} &middot; Updated {lastUpdated}
      </span>
    </Link>
  );
};

export default MethodologyBadge;
