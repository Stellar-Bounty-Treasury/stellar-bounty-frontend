import React from 'react';
import { Scale } from 'lucide-react';

interface DisputeBadgeProps {
  status?: 'none' | 'pending' | 'resolved_paid' | 'resolved_refunded';
}

export const DisputeBadge: React.FC<DisputeBadgeProps> = ({ status = 'pending' }) => {
  if (!status || status === 'none') return null;

  const config = {
    pending: { label: 'Dispute Pending', bg: 'rgba(234, 179, 8, 0.15)', border: '#eab308', color: '#facc15' },
    resolved_paid: { label: 'Dispute Settled: Payout', bg: 'rgba(16, 185, 129, 0.15)', border: '#10b981', color: '#34d399' },
    resolved_refunded: { label: 'Dispute Settled: Refund', bg: 'rgba(168, 85, 247, 0.15)', border: '#a855f7', color: '#c084fc' },
  }[status] || { label: 'Under Review', bg: 'rgba(234, 179, 8, 0.15)', border: '#eab308', color: '#facc15' };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: '2px 8px',
        borderRadius: 999,
        background: config.bg,
        border: `1px solid ${config.border}`,
        color: config.color,
        fontSize: '0.72rem',
        fontWeight: 600,
      }}
    >
      <Scale size={12} />
      <span>{config.label}</span>
    </span>
  );
};
