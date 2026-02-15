'use client';

import React from 'react';
import Link from 'next/link';
import { SavedResultsList } from '@/components/SaveResult';
import { useAuth } from '@/context/AuthContext';
import { useLocale } from '@/context/LocaleContext';

export default function SavedResultsPage() {
  const { isAuthenticated } = useAuth();
  const { localizePath, t } = useLocale();

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-2 text-3xl font-bold">{t('savedResults.page.title')}</h1>
      <p className="mb-8 text-gray-600">{t('savedResults.page.subtitle')}</p>

      {!isAuthenticated ? (
        <div className="neumorph rounded-lg p-6">
          <h2 className="mb-2 text-xl font-semibold">{t('savedResults.page.signedOut.title')}</h2>
          <p className="mb-4 text-gray-700">{t('savedResults.page.signedOut.body')}</p>
          <Link href={localizePath('/')} className="text-accent font-medium hover:underline">
            {t('savedResults.page.signedOut.cta')} <span aria-hidden="true">→</span>
          </Link>
        </div>
      ) : (
        <SavedResultsList />
      )}
    </div>
  );
}
