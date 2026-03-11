import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';

vi.mock('@/components/CookieConsent', () => ({
  useCookieConsent: () => ({
    analytics: false,
    advertising: true,
    openConsentBanner: vi.fn(),
  }),
}));

vi.mock('@/utils/logger', () => ({
  createLogger: () => ({
    logError: vi.fn(),
    logWarn: vi.fn(),
    logInfo: vi.fn(),
  }),
}));

import AdUnit from './AdUnit';

describe('AdUnit', () => {
  beforeEach(() => {
    delete (window as Window & { adsbygoogle?: Array<Record<string, never>> }).adsbygoogle;
  });

  it('queues an ad request before the AdSense script is ready', async () => {
    const { container } = render(<AdUnit slot="1234567890" />);

    await waitFor(() => {
      expect(
        (window as Window & { adsbygoogle?: Array<Record<string, never>> }).adsbygoogle
      ).toHaveLength(1);
    });

    expect(container.querySelector('ins.adsbygoogle')).toBeInTheDocument();
  });
});
