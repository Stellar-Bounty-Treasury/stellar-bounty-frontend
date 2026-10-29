import { describe, it, expect } from 'vitest';
import { DEMO_SHOWCASE_BOUNTIES } from '../utils/demoData';
import { DEMO_PERSONAS } from '../context/DemoModeContext';

describe('Hackathon Demo Assets & Schema Validation', () => {
  it('validates demo showcase bounties have required fields', () => {
    expect(DEMO_SHOWCASE_BOUNTIES.length).toBeGreaterThanOrEqual(4);
    for (const b of DEMO_SHOWCASE_BOUNTIES) {
      expect(b.id).toBeGreaterThan(0);
      expect(b.title.length).toBeGreaterThan(10);
      expect(b.target_amount).toBeGreaterThan(0);
      expect(['open', 'funded', 'completed']).toContain(b.status);
    }
  });

  it('validates all three judge personas are populated', () => {
    expect(DEMO_PERSONAS.creator).toBeDefined();
    expect(DEMO_PERSONAS.contributor).toBeDefined();
    expect(DEMO_PERSONAS.arbitrator).toBeDefined();

    expect(DEMO_PERSONAS.creator.address.startsWith('G')).toBe(true);
    expect(DEMO_PERSONAS.contributor.address.startsWith('G')).toBe(true);
    expect(DEMO_PERSONAS.arbitrator.address.startsWith('G')).toBe(true);
  });
});
