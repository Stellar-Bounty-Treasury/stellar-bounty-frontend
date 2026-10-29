import { describe, it, expect } from 'vitest';
import { CATEGORIES, STATUSES } from '../components/BountyFilterBar';

describe('Frontend Components and Filter Logic Suite', () => {
  it('defines standard hackathon-ready bounty categories', () => {
    expect(CATEGORIES).toContain('Smart Contracts');
    expect(CATEGORIES).toContain('DeFi');
    expect(CATEGORIES).toContain('Security');
    expect(CATEGORIES).toContain('Tooling');
    expect(CATEGORIES).toContain('Infrastructure');
  });

  it('defines valid bounty status lifecycle values', () => {
    expect(STATUSES).toContain('open');
    expect(STATUSES).toContain('funded');
    expect(STATUSES).toContain('completed');
    expect(STATUSES).toContain('settled');
  });

  it('computes funding progress percentage accurately', () => {
    const computePercent = (funded: number, target: number) => {
      if (target <= 0) return 0;
      return Math.min(100, Math.round((funded / target) * 100));
    };

    expect(computePercent(500, 1000)).toBe(50);
    expect(computePercent(1000, 1000)).toBe(100);
    expect(computePercent(1500, 1000)).toBe(100);
    expect(computePercent(0, 1000)).toBe(0);
  });
});
