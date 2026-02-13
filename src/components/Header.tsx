'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import DarkModeToggle from '@/components/ui/DarkModeToggle';
import UnitToggle from '@/components/ui/UnitToggle';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { usePreferences } from '@/context/PreferencesContext';
import { useLocale } from '@/context/LocaleContext';
import AuthControls from '@/components/AuthControls';
import { stripLocaleFromPathname } from '@/i18n/config';

export default function Header(): React.JSX.Element {
  const pathname = usePathname();
  const { preferences } = usePreferences();
  const { localizePath, t } = useLocale();
  const { darkMode } = preferences;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const normalizedPathname = stripLocaleFromPathname(pathname);

  const quickLinks = [
    { name: t('header.quick.calculators'), path: '/calculators' },
    { name: t('header.quick.blog'), path: '/blog' },
    { name: t('header.quick.learn'), path: '/learn' },
    { name: t('header.quick.saved'), path: '/saved-results' },
  ];

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={`py-4 border-b border-gray-200 ${darkMode ? 'bg-gray-900 text-white border-gray-800' : 'bg-white shadow-sm'}`}
    >
      <div className="container mx-auto flex items-center justify-between gap-4 px-4">
        <Link
          href={localizePath('/')}
          className="notranslate text-2xl font-bold text-accent transition-transform duration-300 hover:scale-[1.02]"
        >
          HealthCheck
        </Link>

        <nav aria-label={t('header.quickLinksAria')} className="hidden lg:flex items-center gap-2">
          {quickLinks.map(link => (
            <Link
              key={link.path}
              href={localizePath(link.path)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                normalizedPathname === link.path
                  ? 'bg-accent text-white shadow-lg'
                  : 'hover:bg-accent/10'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-3">
          <div className="hidden md:block">
            <LanguageSwitcher />
          </div>
          <DarkModeToggle />
          <UnitToggle />
          <div className="hidden lg:block">
            <AuthControls />
          </div>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className={`lg:hidden p-2 rounded-lg transition-colors ${
              darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
            }`}
            aria-label={mobileMenuOpen ? t('header.closeMenu') : t('header.openMenu')}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav
          aria-label={t('header.mobileNavAria')}
          className={`lg:hidden border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
        >
          <div className="container mx-auto px-4 py-4 space-y-2">
            <div className="py-1">
              <LanguageSwitcher />
            </div>
            {quickLinks.map(link => (
              <Link
                key={link.path}
                href={localizePath(link.path)}
                className={`block rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                  normalizedPathname === link.path
                    ? 'bg-accent text-white'
                    : darkMode
                      ? 'hover:bg-gray-800'
                      : 'hover:bg-accent/10'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className={`pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <AuthControls />
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
