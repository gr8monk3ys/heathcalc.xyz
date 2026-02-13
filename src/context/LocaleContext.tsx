'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  defaultLocale,
  getLocaleFromPathname,
  localeCookieName,
  localeToHtmlLang,
  normalizeLocale,
  prefixPathWithLocale,
  stripLocaleFromPathname,
  type SupportedLocale,
} from '@/i18n/config';
import { getMessage, type MessageKey } from '@/i18n/messages';

interface LocaleContextValue {
  locale: SupportedLocale;
  setLocale: (nextLocale: SupportedLocale) => void;
  localizePath: (path: string) => string;
  t: (key: MessageKey) => string;
}

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

interface LocaleProviderProps {
  children: React.ReactNode;
  initialLocale?: SupportedLocale;
}

export function LocaleProvider({
  children,
  initialLocale = defaultLocale,
}: LocaleProviderProps): React.JSX.Element {
  const router = useRouter();
  const pathname = usePathname();

  const locale = useMemo(() => {
    const localeFromPath = getLocaleFromPathname(pathname ?? '');
    if (localeFromPath) return localeFromPath;

    return normalizeLocale(initialLocale) ?? defaultLocale;
  }, [initialLocale, pathname]);

  useEffect(() => {
    document.documentElement.lang = localeToHtmlLang[locale];
    document.cookie = `${localeCookieName}=${locale}; path=/; max-age=31536000; samesite=lax`;
  }, [locale]);

  const localizePath = useCallback(
    (path: string): string => {
      if (!path.startsWith('/')) return path;
      return prefixPathWithLocale(path, locale);
    },
    [locale]
  );

  const setLocale = useCallback(
    (nextLocale: SupportedLocale): void => {
      if (!pathname) return;
      const basePath = stripLocaleFromPathname(pathname);
      const localizedPath = prefixPathWithLocale(basePath, nextLocale);
      const query = typeof window !== 'undefined' ? window.location.search : '';
      router.push(`${localizedPath}${query}`);
    },
    [pathname, router]
  );

  const t = useCallback(
    (key: MessageKey): string => {
      return getMessage(locale, key);
    },
    [locale]
  );

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale,
      localizePath,
      t,
    }),
    [locale, localizePath, setLocale, t]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}
