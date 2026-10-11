import { describe, it, expect } from 'vitest';
import { formatAddress, formatHash } from '../utils/formatters';

describe('formatters utility', () => {
  describe('formatAddress', () => {
    const fullStellarAddress = 'GBSVC3MFSXVVYNUP6MUNDSM37G4ED5JACUSG3OLDSPBOYIYM6XGL4OAB';

    it('formats Stellar address with default 4 start and 4 end characters', () => {
      expect(formatAddress(fullStellarAddress)).toBe('GBSV...4OAB');
    });

    it('formats address with custom character lengths', () => {
      expect(formatAddress(fullStellarAddress, 8, 6)).toBe('GBSVC3MF...GL4OAB');
      expect(formatAddress(fullStellarAddress, 10, 8)).toBe('GBSVC3MFSX...6XGL4OAB');
      expect(formatAddress(fullStellarAddress, 6, 4)).toBe('GBSVC3...4OAB');
    });

    it('returns empty string for null, undefined, or empty input', () => {
      expect(formatAddress(null)).toBe('');
      expect(formatAddress(undefined)).toBe('');
      expect(formatAddress('')).toBe('');
      expect(formatAddress('   ')).toBe('');
    });

    it('returns original address unchanged if length is less than or equal to start + end chars', () => {
      expect(formatAddress('GABC', 4, 4)).toBe('GABC');
      expect(formatAddress('12345678', 4, 4)).toBe('12345678');
    });

    it('trims leading and trailing whitespace before formatting', () => {
      expect(formatAddress(`  ${fullStellarAddress}  `)).toBe('GBSV...4OAB');
    });
  });

  describe('formatHash', () => {
    const fullTxHash = 'a8f4b2c1d3e5f7a9b0c2d4e6f8a1b3c5d7e9f0a2b4c6d8e1f3a5b7c9d0e2f4a6';

    it('formats hash with default 6 leading characters', () => {
      expect(formatHash(fullTxHash)).toBe('a8f4b2...');
    });

    it('formats hash with custom leading character count', () => {
      expect(formatHash(fullTxHash, 8)).toBe('a8f4b2c1...');
      expect(formatHash(fullTxHash, 10)).toBe('a8f4b2c1d3...');
    });

    it('returns empty string for null, undefined, or empty input', () => {
      expect(formatHash(null)).toBe('');
      expect(formatHash(undefined)).toBe('');
      expect(formatHash('')).toBe('');
    });

    it('returns original hash unchanged if length is less than or equal to keepChars', () => {
      expect(formatHash('abc', 6)).toBe('abc');
      expect(formatHash('abcdef', 6)).toBe('abcdef');
    });
  });
});
