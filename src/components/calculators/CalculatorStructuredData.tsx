'use client';

import React from 'react';
import StructuredData, {
  createCalculatorSchema,
  createFAQSchema,
} from '@/components/StructuredData';

interface FAQItem {
  question: string;
  answer: string;
}

interface CalculatorStructuredDataProps {
  name: string;
  description: string;
  url: string;
  faqs?: FAQItem[];
}

export default function CalculatorStructuredData({
  name,
  description,
  url,
  faqs = [],
}: CalculatorStructuredDataProps) {
  return (
    <>
      <StructuredData
        data={createCalculatorSchema({
          name,
          description,
          url,
        })}
      />
      {faqs.length > 0 && <StructuredData data={createFAQSchema(faqs)} />}
    </>
  );
}
