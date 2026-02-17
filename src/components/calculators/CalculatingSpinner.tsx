'use client';

import React from 'react';

interface CalculatingSpinnerProps {
  label?: string;
}

const CalculatingSpinner: React.FC<CalculatingSpinnerProps> = ({ label = 'Calculating...' }) => {
  return (
    <div
      className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400"
      role="status"
      aria-live="polite"
    >
      <span className="inline-block h-4 w-4 rounded-full bg-accent/60 animate-pulse" />
      <span>{label}</span>
    </div>
  );
};

export default CalculatingSpinner;
