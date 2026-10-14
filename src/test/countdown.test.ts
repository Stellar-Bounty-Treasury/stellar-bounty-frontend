import { describe, it, expect } from 'vitest';
import {
  calculateTimeRemaining,
  resolveBountyDeadline,
} from '../utils/countdown';

describe('Countdown Calculation Utilities', () => {
  const baseTime = new Date('2026-10-14T12:00:00Z').getTime();

  it('handles null, undefined, or empty deadline gracefully', () => {
    const resultNull = calculateTimeRemaining(null, baseTime);
    expect(resultNull.isExpired).toBe(false);
    expect(resultNull.formatted).toBe('No deadline');
    expect(resultNull.compactText).toBe('No deadline');
    expect(resultNull.totalMs).toBe(0);

    const resultUndefined = calculateTimeRemaining(undefined, baseTime);
    expect(resultUndefined.isExpired).toBe(false);
    expect(resultUndefined.formatted).toBe('No deadline');
  });

  it('handles invalid date strings gracefully', () => {
    const result = calculateTimeRemaining('not-a-valid-date', baseTime);
    expect(result.isExpired).toBe(false);
    expect(result.formatted).toBe('Invalid date');
    expect(result.compactText).toBe('Invalid');
  });

  it('calculates future deadline with multiple days and hours remaining', () => {
    // 5 days, 4 hours ahead
    const target = baseTime + (5 * 24 + 4) * 60 * 60 * 1000 + 30 * 60 * 1000;
    const result = calculateTimeRemaining(target, baseTime);

    expect(result.isExpired).toBe(false);
    expect(result.isUrgent).toBe(false);
    expect(result.isCritical).toBe(false);
    expect(result.days).toBe(5);
    expect(result.hours).toBe(4);
    expect(result.formatted).toBe('5d 4h remaining');
    expect(result.compactText).toBe('5d 4h');
  });

  it('calculates urgent deadline when remaining time is under 24 hours', () => {
    // 14 hours, 20 minutes ahead
    const target = baseTime + 14 * 60 * 60 * 1000 + 20 * 60 * 1000;
    const result = calculateTimeRemaining(target, baseTime);

    expect(result.isExpired).toBe(false);
    expect(result.isUrgent).toBe(true);
    expect(result.isCritical).toBe(false);
    expect(result.days).toBe(0);
    expect(result.hours).toBe(14);
    expect(result.minutes).toBe(20);
    expect(result.formatted).toBe('14h 20m remaining');
    expect(result.compactText).toBe('14h 20m');
  });

  it('calculates critical deadline when remaining time is under 3 hours', () => {
    // 2 hours, 15 minutes ahead
    const target = baseTime + 2 * 60 * 60 * 1000 + 15 * 60 * 1000;
    const result = calculateTimeRemaining(target, baseTime);

    expect(result.isExpired).toBe(false);
    expect(result.isUrgent).toBe(true);
    expect(result.isCritical).toBe(true);
    expect(result.days).toBe(0);
    expect(result.hours).toBe(2);
    expect(result.minutes).toBe(15);
    expect(result.formatted).toBe('2h 15m remaining');
    expect(result.compactText).toBe('2h 15m');
  });

  it('formats minutes and seconds when less than one hour remains', () => {
    // 45 minutes, 30 seconds ahead
    const target = baseTime + 45 * 60 * 1000 + 30 * 1000;
    const result = calculateTimeRemaining(target, baseTime);

    expect(result.isExpired).toBe(false);
    expect(result.isUrgent).toBe(true);
    expect(result.isCritical).toBe(true);
    expect(result.days).toBe(0);
    expect(result.hours).toBe(0);
    expect(result.minutes).toBe(45);
    expect(result.seconds).toBe(30);
    expect(result.formatted).toBe('45m 30s remaining');
    expect(result.compactText).toBe('45m 30s');
  });

  it('detects expired deadline when deadline is in the past', () => {
    // 10 minutes ago
    const target = baseTime - 10 * 60 * 1000;
    const result = calculateTimeRemaining(target, baseTime);

    expect(result.isExpired).toBe(true);
    expect(result.isUrgent).toBe(false);
    expect(result.isCritical).toBe(false);
    expect(result.formatted).toBe('Deadline passed');
    expect(result.compactText).toBe('Expired');
    expect(result.totalMs).toBe(0);
  });

  it('resolves explicit deadline over created_at fallback', () => {
    const deadline = '2026-11-01T00:00:00Z';
    const resolved = resolveBountyDeadline({
      deadline,
      created_at: '2026-10-01T00:00:00Z',
    });
    expect(resolved).toBe(deadline);
  });

  it('falls back to 14 days from created_at when deadline is omitted', () => {
    const createdAt = '2026-10-01T00:00:00.000Z';
    const resolved = resolveBountyDeadline({
      deadline: null,
      created_at: createdAt,
    });
    expect(resolved).toBe('2026-10-15T00:00:00.000Z');
  });

  it('returns null when neither deadline nor created_at is provided', () => {
    expect(resolveBountyDeadline({})).toBeNull();
  });
});
