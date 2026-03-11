import { describe, expect, it } from 'vitest';
import { isAutomatedBrowser } from './adsense';

describe('adsense helpers', () => {
  it('detects webdriver-driven browsers', () => {
    expect(isAutomatedBrowser({ webdriver: true, userAgent: 'Chrome' })).toBe(true);
  });

  it('detects headless user agents', () => {
    expect(isAutomatedBrowser({ userAgent: 'Mozilla/5.0 HeadlessChrome/145.0.0.0' })).toBe(true);
  });

  it('allows normal browsers', () => {
    expect(
      isAutomatedBrowser({
        webdriver: false,
        userAgent:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 Chrome/145.0.0.0 Safari/537.36',
      })
    ).toBe(false);
  });
});
