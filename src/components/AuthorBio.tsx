import React from 'react';
import Link from 'next/link';

interface AuthorBioProps {
  variant?: 'compact' | 'full';
  className?: string;
}

function InitialsAvatar({ className = '' }: { className?: string }): React.JSX.Element {
  return (
    <div
      className={`flex items-center justify-center rounded-full bg-accent/10 text-accent font-bold ${className}`}
      aria-hidden="true"
    >
      HC
    </div>
  );
}

export function AuthorBio({
  variant = 'compact',
  className = '',
}: AuthorBioProps): React.JSX.Element {
  if (variant === 'compact') {
    return (
      <div
        className={`flex items-center gap-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 ${className}`}
      >
        <InitialsAvatar className="h-10 w-10 text-sm" />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            HealthCheck Editorial Team
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Reviewed by certified health and fitness professionals
          </p>
        </div>
        <Link
          href="/about/editorial"
          className="ml-auto shrink-0 text-xs font-medium text-accent hover:underline"
        >
          Our process
        </Link>
      </div>
    );
  }

  return (
    <div className={`neumorph rounded-lg p-6 ${className}`}>
      <div className="flex items-start gap-4">
        <InitialsAvatar className="h-16 w-16 text-xl" />
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            HealthCheck Editorial Team
          </h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Reviewed by certified health and fitness professionals
          </p>
          <p className="mt-3 text-sm text-gray-700 dark:text-gray-300">
            Our editorial team combines expertise in exercise science, nutrition, and public health.
            Every piece of content on HealthCheck is researched, fact-checked, and reviewed to
            ensure accuracy and clarity. We rely on peer-reviewed studies, established clinical
            formulas, and guidance from credentialed professionals.
          </p>
          <Link
            href="/about/editorial"
            className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
          >
            Learn more about our editorial process
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
