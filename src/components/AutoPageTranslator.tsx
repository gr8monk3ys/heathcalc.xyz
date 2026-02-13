'use client';

import { useEffect } from 'react';
import { defaultLocale, localeToGoogleLanguage } from '@/i18n/config';
import { useLocale } from '@/context/LocaleContext';

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate?: {
        TranslateElement: new (
          options: Record<string, unknown>,
          elementId: string
        ) => Record<string, unknown>;
      };
    };
  }
}

const GOOGLE_TRANSLATE_SCRIPT_ID = 'google-translate-script';
const GOOGLE_TRANSLATE_ELEMENT_ID = 'google_translate_element';
const GOOGLE_TRANSLATE_INCLUDED_LANGUAGES = ['es', 'fr', 'de', 'pt', 'zh-CN'].join(',');

function setGoogleTranslateCookie(targetLanguage: string): void {
  document.cookie = `googtrans=/en/${targetLanguage}; path=/`;
}

function applyGoogleLanguage(targetLanguage: string): boolean {
  const languageSelect = document.querySelector<HTMLSelectElement>('select.goog-te-combo');
  if (!languageSelect) return false;

  if (languageSelect.value !== targetLanguage) {
    languageSelect.value = targetLanguage;
    languageSelect.dispatchEvent(new Event('change'));
  }

  return true;
}

function applyGoogleLanguageWithRetry(targetLanguage: string): void {
  let attempts = 0;
  const maxAttempts = 40;
  const interval = window.setInterval(() => {
    attempts += 1;
    const translated = applyGoogleLanguage(targetLanguage);
    if (translated || attempts >= maxAttempts) {
      window.clearInterval(interval);
    }
  }, 150);
}

function loadGoogleTranslateScript(targetLanguage: string): void {
  if (window.google?.translate?.TranslateElement) {
    applyGoogleLanguageWithRetry(targetLanguage);
    return;
  }

  window.googleTranslateElementInit = () => {
    const TranslateElement = window.google?.translate?.TranslateElement;
    if (!TranslateElement) return;

    new TranslateElement(
      {
        pageLanguage: 'en',
        includedLanguages: GOOGLE_TRANSLATE_INCLUDED_LANGUAGES,
        autoDisplay: false,
      },
      GOOGLE_TRANSLATE_ELEMENT_ID
    );

    applyGoogleLanguageWithRetry(targetLanguage);
  };

  if (document.getElementById(GOOGLE_TRANSLATE_SCRIPT_ID)) {
    return;
  }

  const script = document.createElement('script');
  script.id = GOOGLE_TRANSLATE_SCRIPT_ID;
  script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  script.async = true;
  script.defer = true;
  document.body.appendChild(script);
}

export default function AutoPageTranslator(): React.JSX.Element {
  const { locale } = useLocale();

  useEffect(() => {
    const targetLanguage = localeToGoogleLanguage[locale];
    if (locale === defaultLocale) {
      setGoogleTranslateCookie('en');
      return;
    }

    setGoogleTranslateCookie(targetLanguage);
    loadGoogleTranslateScript(targetLanguage);
  }, [locale]);

  return <div id={GOOGLE_TRANSLATE_ELEMENT_ID} className="sr-only" aria-hidden="true" />;
}
