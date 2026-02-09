'use client';

import React from 'react';
import Link from 'next/link';
import { useCookieConsent } from '@/components/CookieConsent';

export default function Footer(): React.JSX.Element {
  const { openConsentBanner } = useCookieConsent();
  return (
    <footer className="bg-primary p-6 border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="text-xl font-bold text-accent">
              HealthCheck
            </Link>
            <p className="text-sm mt-2">Your go-to resource for health and fitness calculators</p>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Calculators</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/bmi" className="text-sm hover:text-accent">
                  BMI Calculator
                </Link>
              </li>
              <li>
                <Link href="/body-fat" className="text-sm hover:text-accent">
                  Body Fat Calculator
                </Link>
              </li>
              <li>
                <Link href="/calorie-deficit" className="text-sm hover:text-accent">
                  Calorie Deficit Calculator
                </Link>
              </li>
              <li>
                <Link href="/tdee" className="text-sm hover:text-accent">
                  TDEE Calculator
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm hover:text-accent">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/about/editorial" className="text-sm hover:text-accent">
                  Editorial Process
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm hover:text-accent">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm hover:text-accent">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-sm hover:text-accent">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm hover:text-accent">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="text-sm hover:text-accent">
                  Disclaimer
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={openConsentBanner}
                  className="text-sm hover:text-accent"
                >
                  Cookie Settings
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Trust signals */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-accent shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
          <span>Content reviewed by certified health and fitness professionals</span>
          <span className="mx-1">|</span>
          <Link href="/about/editorial" className="text-accent hover:underline">
            Learn about our process
          </Link>
        </div>

        {/* Medical disclaimer */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-center text-xs text-gray-500 dark:text-gray-400">
          <p>
            HealthCheck provides general informational content and tools only. Nothing on this
            website constitutes medical advice. Always consult a qualified healthcare professional
            before making changes to your diet, exercise, or health regimen.
          </p>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-600 dark:text-gray-400">
          &copy; {new Date().getFullYear()} HealthCheck. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
