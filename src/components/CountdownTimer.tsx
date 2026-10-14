import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, CheckCircle2, Hourglass } from 'lucide-react';
import { calculateTimeRemaining, resolveBountyDeadline, TimeRemaining } from '../utils/countdown';

export interface CountdownTimerProps {
  deadline?: string | number | Date | null;
  createdAt?: string | null;
  status?: string;
  variant?: 'badge' | 'detailed';
  className?: string;
  id?: string;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  deadline,
  createdAt,
  status,
  variant = 'badge',
  className = '',
  id,
}) => {
  const effectiveDeadline = deadline || resolveBountyDeadline({ deadline, created_at: createdAt });

  const [remaining, setRemaining] = useState<TimeRemaining>(() =>
    calculateTimeRemaining(effectiveDeadline)
  );

  useEffect(() => {
    // If completed, settled, or no deadline, skip ticking interval
    if (status === 'completed' || status === 'settled' || !effectiveDeadline) {
      setRemaining(calculateTimeRemaining(effectiveDeadline));
      return;
    }

    setRemaining(calculateTimeRemaining(effectiveDeadline));

    const interval = setInterval(() => {
      setRemaining(calculateTimeRemaining(effectiveDeadline));
    }, 1000);

    return () => clearInterval(interval);
  }, [effectiveDeadline, status]);

  if (status === 'completed' || status === 'settled') {
    return (
      <span
        id={id}
        className={`countdown-timer timer-completed ${variant === 'detailed' ? 'timer-detailed' : 'timer-badge'} ${className}`}
        role="status"
        aria-label="Bounty completed"
      >
        <CheckCircle2 size={variant === 'detailed' ? 14 : 12} />
        <span>Completed</span>
      </span>
    );
  }

  if (!effectiveDeadline) {
    if (variant === 'detailed') {
      return (
        <span
          id={id}
          className={`countdown-timer timer-normal timer-detailed ${className}`}
          role="status"
          aria-label="No deadline set"
        >
          <Clock size={14} />
          <span>No deadline specified</span>
        </span>
      );
    }
    return null;
  }

  if (remaining.isExpired) {
    return (
      <span
        id={id}
        className={`countdown-timer timer-expired ${variant === 'detailed' ? 'timer-detailed' : 'timer-badge'} ${className}`}
        role="status"
        aria-label="Deadline passed"
      >
        <AlertTriangle size={variant === 'detailed' ? 14 : 12} />
        <span>{variant === 'detailed' ? 'Deadline passed' : 'Expired'}</span>
      </span>
    );
  }

  if (remaining.isCritical) {
    return (
      <span
        id={id}
        className={`countdown-timer timer-critical ${variant === 'detailed' ? 'timer-detailed' : 'timer-badge'} ${className}`}
        role="timer"
        aria-label={`Ending soon: ${remaining.formatted}`}
      >
        <AlertTriangle size={variant === 'detailed' ? 14 : 12} />
        <span>{variant === 'detailed' ? `Ending soon: ${remaining.formatted}` : remaining.compactText}</span>
      </span>
    );
  }

  if (remaining.isUrgent) {
    return (
      <span
        id={id}
        className={`countdown-timer timer-urgent ${variant === 'detailed' ? 'timer-detailed' : 'timer-badge'} ${className}`}
        role="timer"
        aria-label={`Ending soon: ${remaining.formatted}`}
      >
        <Hourglass size={variant === 'detailed' ? 14 : 12} />
        <span>{variant === 'detailed' ? `Ending soon: ${remaining.formatted}` : remaining.compactText}</span>
      </span>
    );
  }

  return (
    <span
      id={id}
      className={`countdown-timer timer-normal ${variant === 'detailed' ? 'timer-detailed' : 'timer-badge'} ${className}`}
      role="timer"
      aria-label={`Remaining time: ${remaining.formatted}`}
    >
      <Clock size={variant === 'detailed' ? 14 : 12} />
      <span>{variant === 'detailed' ? remaining.formatted : remaining.compactText}</span>
    </span>
  );
};
