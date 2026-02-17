'use client';

import React, { useState, useId, useRef, useEffect, useCallback } from 'react';

interface FAQItem {
  question: string;
  answer: string | React.ReactNode;
}

interface FAQAccordionProps {
  items: FAQItem[];
  title?: string;
}

function FAQItemRow({
  item,
  isOpen,
  onToggle,
  idPrefix,
  index,
}: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
  idPrefix: string;
  index: number;
}): React.ReactElement {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    }
  }, [isOpen, item.answer]);

  const buttonId = `${idPrefix}-button-${index}`;
  const panelId = `${idPrefix}-panel-${index}`;

  return (
    <div className="border-b border-slate-200/60 dark:border-slate-700/40 last:border-b-0">
      <h3>
        <button
          id={buttonId}
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={panelId}
          className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-accent font-medium text-sm sm:text-base transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-inset"
        >
          <span>{item.question}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 flex-shrink-0 text-accent/70 transition-transform duration-300 ease-out ${
              isOpen ? 'rotate-180' : 'rotate-0'
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        style={{
          maxHeight: isOpen ? `${height}px` : '0px',
          opacity: isOpen ? 1 : 0,
        }}
        className="overflow-hidden transition-all duration-300 ease-out"
      >
        <div
          ref={contentRef}
          className="px-5 pb-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed"
        >
          {typeof item.answer === 'string' ? <p>{item.answer}</p> : item.answer}
        </div>
      </div>
    </div>
  );
}

function generateFAQSchema(items: FAQItem[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: typeof item.answer === 'string' ? item.answer : '',
      },
    })),
  };
}

export default function FAQAccordion({ items, title }: FAQAccordionProps): React.ReactElement {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const idPrefix = useId();

  const handleToggle = useCallback((index: number) => {
    setOpenIndex(prev => (prev === index ? null : index));
  }, []);

  const schema = generateFAQSchema(items);

  return (
    <section aria-label={title || 'Frequently Asked Questions'}>
      {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}
      <div className="glass-panel rounded-2xl overflow-hidden divide-y-0">
        {items.map((item, index) => (
          <FAQItemRow
            key={`${idPrefix}-${index}`}
            item={item}
            isOpen={openIndex === index}
            onToggle={() => handleToggle(index)}
            idPrefix={idPrefix}
            index={index}
          />
        ))}
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema),
        }}
      />
    </section>
  );
}
