import type { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Waist-to-Hip Ratio Calculator | WHR Calculator',
  description:
    'Calculate your Waist-to-Hip Ratio (WHR) to assess your body fat distribution and health risks. Learn about apple vs. pear body shapes and their health implications.',
  keywords:
    'waist-to-hip ratio, whr calculator, body shape calculator, apple shape, pear shape, central obesity, fat distribution, waist circumference, hip circumference, health risk calculator',
  alternates: {
    canonical: 'https://www.heathcheck.info/whr',
  },
  openGraph: {
    title: 'Waist-to-Hip Ratio Calculator | WHR Calculator',
    description:
      'Calculate your Waist-to-Hip Ratio (WHR) to assess your body fat distribution and health risks. Learn about apple vs. pear body shapes and their health implications.',
    url: 'https://www.heathcheck.info/whr',
    siteName: 'HealthCheck',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/images/calculators/whr-calculator.jpg',
        width: 1200,
        height: 630,
        alt: 'Waist-to-Hip Ratio Calculator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Waist-to-Hip Ratio Calculator | WHR Calculator',
    description:
      'Calculate your Waist-to-Hip Ratio (WHR) to assess your body fat distribution and health risks. Learn about apple vs. pear body shapes and their health implications.',
    images: ['/images/calculators/whr-calculator.jpg'],
  },
};

export default function WHRLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
