import { describe, it, expect } from 'vitest';
import { EXPLORER_BASE_URL } from '../services/stellar';

describe('Frontend Validation & Logic Tests', () => {
  describe('Contribution Amount Validation', () => {
    function validateAmount(
      input: string | number,
      walletBalance: number
    ): { valid: boolean; error?: string } {
      const parsed = typeof input === 'string' ? parseFloat(input) : input;
      if (isNaN(parsed) || parsed <= 0) {
        return { valid: false, error: 'Please enter a valid positive XLM amount.' };
      }
      if (parsed > walletBalance) {
        return {
          valid: false,
          error: `Insufficient balance. You have ${walletBalance} XLM, but tried to contribute ${parsed} XLM.`,
        };
      }
      if (walletBalance - parsed < 0.5) {
        return {
          valid: false,
          error: 'Please leave at least 0.5 XLM in your wallet to cover network reserve and transaction fees.',
        };
      }
      return { valid: true };
    }

    it('rejects zero or negative contribution amount', () => {
      expect(validateAmount(0, 100).valid).toBe(false);
      expect(validateAmount(-15, 100).valid).toBe(false);
      expect(validateAmount('abc', 100).valid).toBe(false);
    });

    it('rejects amount exceeding user XLM balance', () => {
      const result = validateAmount(150, 100);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Insufficient balance');
    });

    it('rejects contribution when remaining balance is insufficient for fee reserve (< 0.5 XLM)', () => {
      const result = validateAmount(99.8, 100);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('leave at least 0.5 XLM');
    });

    it('accepts valid contribution amount with sufficient reserve', () => {
      const result = validateAmount(50, 100);
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });
  });

  describe('Wallet Address & Explorer Logic', () => {
    function shortenAddress(addr: string): string {
      if (!addr || addr.length < 8) return addr;
      return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
    }

    it('shortens Stellar G address accurately', () => {
      const full = 'GBSVC3MFSXVVYNUP6MUNDSM37G4ED5JACUSG3OLDSPBOYIYM6XGL4OAB';
      expect(shortenAddress(full)).toBe('GBSV...4OAB');
    });

    it('generates correct Stellar Expert Explorer URL for transaction hash', () => {
      const hash = 'a8f4b2c1d3e5f7a9b0c2d4e6f8a1b3c5d7e9f0a2b4c6d8e1f3a5b7c9d0e2f4a6';
      const explorerUrl = `${EXPLORER_BASE_URL}/${hash}`;
      expect(explorerUrl).toBe(
        'https://stellar.expert/explorer/testnet/tx/a8f4b2c1d3e5f7a9b0c2d4e6f8a1b3c5d7e9f0a2b4c6d8e1f3a5b7c9d0e2f4a6'
      );
    });
  });

  describe('Bounty Progress & Status Calculations', () => {
    function calculateBountyProgress(funded: number, target: number): {
      percentage: number;
      isFunded: boolean;
      status: string;
    } {
      const pct = Math.min(100, Math.round((funded / (target || 1)) * 100));
      const fundedState = funded >= target;
      return {
        percentage: pct,
        isFunded: fundedState,
        status: fundedState ? 'funded' : 'open',
      };
    }

    it('calculates open bounty progress percentage correctly', () => {
      const progress = calculateBountyProgress(35, 100);
      expect(progress.percentage).toBe(35);
      expect(progress.isFunded).toBe(false);
      expect(progress.status).toBe('open');
    });

    it('transitions to funded when contributions meet or exceed target', () => {
      const progress = calculateBountyProgress(100, 100);
      expect(progress.percentage).toBe(100);
      expect(progress.isFunded).toBe(true);
      expect(progress.status).toBe('funded');
    });
  });

  describe('Level 2 Milestone & Conditional Payment Logic', () => {
    function evaluateConditionalSettlement(
      approvals: number,
      threshold: number,
      status: string
    ): {
      isUnlocked: boolean;
      percent: number;
      needed: number;
      message: string;
    } {
      const needed = Math.max(0, threshold - approvals);
      const percent = Math.min(100, Math.round((approvals / (threshold || 1)) * 100));
      const isUnlocked = approvals >= threshold && status !== 'paid';

      return {
        isUnlocked,
        percent,
        needed,
        message:
          status === 'paid'
            ? 'Payment Settled On-Chain'
            : isUnlocked
            ? 'Verification requirement satisfied'
            : `Payment Locked — ${needed} additional approval required`,
      };
    }

    it('enforces locked payment state when approvals are below threshold', () => {
      const state = evaluateConditionalSettlement(1, 2, 'under_review');
      expect(state.isUnlocked).toBe(false);
      expect(state.needed).toBe(1);
      expect(state.percent).toBe(50);
      expect(state.message).toContain('Payment Locked');
    });

    it('unlocks payment settlement when approval threshold is satisfied', () => {
      const state = evaluateConditionalSettlement(2, 2, 'approved');
      expect(state.isUnlocked).toBe(true);
      expect(state.needed).toBe(0);
      expect(state.percent).toBe(100);
      expect(state.message).toContain('Verification requirement satisfied');
    });

    it('marks settlement finalized when status is paid', () => {
      const state = evaluateConditionalSettlement(3, 2, 'paid');
      expect(state.isUnlocked).toBe(false);
      expect(state.message).toContain('Payment Settled');
    });
  });
});
