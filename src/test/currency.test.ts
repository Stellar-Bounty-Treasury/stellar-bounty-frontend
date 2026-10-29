import { describe, it, expect } from 'vitest';
import { currencyService } from '../services/currencyService';

describe('Multi-Currency Conversion Unit Test Suite', () => {
  it('converts XLM to USD accurately with default rates', () => {
    const usd = currencyService.convertXlm(100, 'USD');
    expect(usd).toBe(12); // 100 * 0.12
  });

  it('converts XLM to USDC parity', () => {
    const usdc = currencyService.convertXlm(100, 'USDC');
    expect(usdc).toBe(12);
  });

  it('formats converted currency with symbols and tags', () => {
    const formatted = currencyService.formatConverted(100, 'USD');
    expect(formatted).toBe('$12.00');

    const formattedXlm = currencyService.formatConverted(100, 'XLM');
    expect(formattedXlm).toBe('100.00 XLM');
  });
});
