import { describe, it, expect } from 'vitest';

describe('Settlement Split Basis Points Unit Test Suite', () => {
  it('validates 10,000 BPS sum equality for atomic distribution', () => {
    const recipients = [
      { address: 'G1...', bps: 7000 },
      { address: 'G2...', bps: 2000 },
      { address: 'G3...', bps: 1000 },
    ];

    const totalBps = recipients.reduce((sum, r) => sum + r.bps, 0);
    expect(totalBps).toBe(10000);
  });

  it('calculates recipient XLM payout accurately based on BPS share', () => {
    const totalAmount = 5000;
    const leadBps = 7500; // 75%
    const reviewerBps = 2500; // 25%

    const leadPayout = (totalAmount * leadBps) / 10000;
    const reviewerPayout = (totalAmount * reviewerBps) / 10000;

    expect(leadPayout).toBe(3750);
    expect(reviewerPayout).toBe(1250);
    expect(leadPayout + reviewerPayout).toBe(totalAmount);
  });
});
