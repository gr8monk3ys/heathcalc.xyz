import type { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Calorie Calculator | HealthCheck',
  description: 'Calculate your daily calorie needs for maintenance, weight loss, or muscle gain.',
  alternates: {
    canonical: 'https://www.heathcheck.info/calorie',
  },
  openGraph: {
    title: 'Calorie Calculator | HealthCheck',
    description: 'Calculate your daily calorie needs for maintenance, weight loss, or muscle gain.',
    type: 'website',
    url: 'https://www.heathcheck.info/calorie',
    images: [
      {
        url: '/images/calculators/calorie-calculator.jpg',
        width: 1200,
        height: 630,
        alt: 'Calorie Calculator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Calorie Calculator | HealthCheck',
    description: 'Calculate your daily calorie needs for maintenance, weight loss, or muscle gain.',
    images: ['/images/calculators/calorie-calculator.jpg'],
  },
};

export default function CalorieLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
