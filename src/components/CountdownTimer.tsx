import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  targetTimestamp: number | string;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetTimestamp }) => {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; isExpired: boolean }>({
    days: 0,
    hours: 0,
    minutes: 0,
    isExpired: false,
  });

  useEffect(() => {
    function compute() {
      const target = typeof targetTimestamp === 'string' ? new Date(targetTimestamp).getTime() : targetTimestamp * (targetTimestamp < 10000000000 ? 1000 : 1);
      const now = Date.now();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, isExpired: true });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeft({ days, hours, minutes, isExpired: false });
    }

    compute();
    const interval = setInterval(compute, 60000);
    return () => clearInterval(interval);
  }, [targetTimestamp]);

  if (timeLeft.isExpired) {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#f87171', fontSize: '0.78rem', fontWeight: 600 }}>
        <Clock size={12} /> Expired
      </span>
    );
  }

  const isUrgent = timeLeft.days === 0 && timeLeft.hours < 48;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        color: isUrgent ? '#facc15' : 'var(--text-muted)',
        fontSize: '0.78rem',
        fontWeight: isUrgent ? 600 : 400,
      }}
    >
      <Clock size={12} />
      <span>
        {timeLeft.days > 0 ? `${timeLeft.days}d ` : ''}
        {`${timeLeft.hours}h ${timeLeft.minutes}m left`}
      </span>
    </span>
  );
};
