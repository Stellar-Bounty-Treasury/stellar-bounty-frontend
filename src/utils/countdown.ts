export interface TimeRemaining {
  totalMs: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
  isUrgent: boolean; // <= 24 hours
  isCritical: boolean; // <= 3 hours
  formatted: string;
  compactText: string;
}

/**
 * Calculates remaining time breakdown and formatted display strings for a given deadline.
 * If targetDeadline is null, undefined, or invalid, returns a safe default.
 */
export function calculateTimeRemaining(
  targetDeadline?: string | number | Date | null,
  referenceNow?: number | Date
): TimeRemaining {
  if (!targetDeadline) {
    return {
      totalMs: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isExpired: false,
      isUrgent: false,
      isCritical: false,
      formatted: 'No deadline',
      compactText: 'No deadline',
    };
  }

  const deadlineMs =
    typeof targetDeadline === 'number'
      ? targetDeadline
      : new Date(targetDeadline).getTime();

  if (isNaN(deadlineMs)) {
    return {
      totalMs: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isExpired: false,
      isUrgent: false,
      isCritical: false,
      formatted: 'Invalid date',
      compactText: 'Invalid',
    };
  }

  const nowMs = referenceNow
    ? (typeof referenceNow === 'number' ? referenceNow : referenceNow.getTime())
    : Date.now();

  const totalMs = deadlineMs - nowMs;

  if (totalMs <= 0) {
    return {
      totalMs: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isExpired: true,
      isUrgent: false,
      isCritical: false,
      formatted: 'Deadline passed',
      compactText: 'Expired',
    };
  }

  const oneMinuteMs = 60 * 1000;
  const oneHourMs = 60 * oneMinuteMs;
  const oneDayMs = 24 * oneHourMs;

  const days = Math.floor(totalMs / oneDayMs);
  const hours = Math.floor((totalMs % oneDayMs) / oneHourMs);
  const minutes = Math.floor((totalMs % oneHourMs) / oneMinuteMs);
  const seconds = Math.floor((totalMs % oneMinuteMs) / 1000);

  const isUrgent = totalMs <= oneDayMs; // <= 24 hours
  const isCritical = totalMs <= 3 * oneHourMs; // <= 3 hours

  let formatted = '';
  let compactText = '';

  if (days > 0) {
    formatted = `${days}d ${hours}h remaining`;
    compactText = `${days}d ${hours}h`;
  } else if (hours > 0) {
    formatted = `${hours}h ${minutes}m remaining`;
    compactText = `${hours}h ${minutes}m`;
  } else {
    formatted = `${minutes}m ${seconds}s remaining`;
    compactText = `${minutes}m ${seconds}s`;
  }

  return {
    totalMs,
    days,
    hours,
    minutes,
    seconds,
    isExpired: false,
    isUrgent,
    isCritical,
    formatted,
    compactText,
  };
}

/**
 * Resolves effective deadline string for a bounty, defaulting to 14 days from creation if deadline is not set.
 */
export function resolveBountyDeadline(
  bounty: { deadline?: string | number | Date | null; created_at?: string | null },
  defaultDurationDays = 14
): string | number | Date | null {
  if (bounty.deadline) {
    return bounty.deadline;
  }
  if (bounty.created_at) {
    const createdMs = new Date(bounty.created_at).getTime();
    if (!isNaN(createdMs)) {
      return new Date(createdMs + defaultDurationDays * 24 * 60 * 60 * 1000).toISOString();
    }
  }
  return null;
}
