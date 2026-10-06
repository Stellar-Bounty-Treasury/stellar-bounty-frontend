import { describe, it, expect } from 'vitest';
import { isValidStellarAddress } from '../services/stellar';

describe('Level 3 Settlement Router & Treasury Logic Tests', () => {
  const validDev = 'GCJ2ZWBIPSHBATSPIB45PZIB3QLI5HT6EURUSAO6WSTNFVQSSMDRQ2XE';
  const validDesigner = 'GAR2BSQ6MU46AT7JUCD5TIK3E5BYRVRUUVBPYDJAP3OALCT24NV3EPPV';
  const validReviewer = 'GCETG2VIX2A2LRWI3FVIRV5VNOPP2FJQCDK6HYVTV3753L74JYRKV5ED';

  function validateSettlementAllocations(
    mode: 'fixed' | 'percentage',
    milestoneReward: number,
    recipients: Array<{ recipient: string; amount?: number; percentage_bps?: number }>
  ): { valid: boolean; error?: string } {
    if (!recipients || recipients.length === 0) {
      return { valid: false, error: 'Settlement must have at least one recipient.' };
    }

    const seen = new Set<string>();
    for (const r of recipients) {
      if (!isValidStellarAddress(r.recipient)) {
        return { valid: false, error: `Invalid address: ${r.recipient}` };
      }
      if (seen.has(r.recipient)) {
        return { valid: false, error: `Duplicate recipient address: ${r.recipient}` };
      }
      seen.add(r.recipient);
    }

    if (mode === 'fixed') {
      const totalAmount = recipients.reduce((sum, r) => sum + (r.amount || 0), 0);
      if (Math.abs(totalAmount - milestoneReward) > 0.0001) {
        return { valid: false, error: `Total allocated (${totalAmount}) does not match reward (${milestoneReward}).` };
      }
    } else {
      const totalBps = recipients.reduce((sum, r) => sum + (r.percentage_bps || 0), 0);
      if (totalBps !== 10000) {
        return { valid: false, error: `Total percentage (${totalBps / 100}%) must equal 100%.` };
      }
    }

    return { valid: true };
  }

  describe('Multi-Recipient Fixed Amount Allocation', () => {
    it('approves exact fixed allocation matching milestone reward (700 + 200 + 100 = 1000 XLM)', () => {
      const result = validateSettlementAllocations('fixed', 1000, [
        { recipient: validDev, amount: 700 },
        { recipient: validDesigner, amount: 200 },
        { recipient: validReviewer, amount: 100 },
      ]);
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('rejects fixed allocation exceeding milestone reward (700 + 250 + 100 = 1050 != 1000 XLM)', () => {
      const result = validateSettlementAllocations('fixed', 1000, [
        { recipient: validDev, amount: 700 },
        { recipient: validDesigner, amount: 250 },
        { recipient: validReviewer, amount: 100 },
      ]);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('does not match reward');
    });

    it('rejects fixed allocation below milestone reward (500 + 300 = 800 != 1000 XLM)', () => {
      const result = validateSettlementAllocations('fixed', 1000, [
        { recipient: validDev, amount: 500 },
        { recipient: validDesigner, amount: 300 },
      ]);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('does not match reward');
    });
  });

  describe('Multi-Recipient Percentage Split Allocation', () => {
    it('approves exact percentage basis points summing to 10000 bps (60% + 25% + 15%)', () => {
      const result = validateSettlementAllocations('percentage', 1000, [
        { recipient: validDev, percentage_bps: 6000 },
        { recipient: validDesigner, percentage_bps: 2500 },
        { recipient: validReviewer, percentage_bps: 1500 },
      ]);
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('rejects percentage basis points not equal to 10000 bps (50% + 30% = 80%)', () => {
      const result = validateSettlementAllocations('percentage', 1000, [
        { recipient: validDev, percentage_bps: 5000 },
        { recipient: validDesigner, percentage_bps: 3000 },
      ]);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('must equal 100%');
    });
  });

  describe('Security & Duplicate Prevention', () => {
    it('rejects duplicate recipient addresses', () => {
      const result = validateSettlementAllocations('fixed', 1000, [
        { recipient: validDev, amount: 600 },
        { recipient: validDev, amount: 400 },
      ]);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Duplicate recipient address');
    });

    it('rejects invalid recipient address format', () => {
      const result = validateSettlementAllocations('fixed', 1000, [
        { recipient: 'INVALID_STELLAR_ADDRESS', amount: 1000 },
      ]);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Invalid address');
    });
  });
});
