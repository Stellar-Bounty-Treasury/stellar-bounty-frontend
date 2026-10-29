import React from 'react';
import { Activity } from 'lucide-react';

interface NetworkBadgeProps {
  networkName?: string;
  isOnline?: boolean;
}

export const NetworkBadge: React.FC<NetworkBadgeProps> = ({
  networkName = 'Stellar Testnet',
  isOnline = true,
}) => {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 10px',
        borderRadius: 999,
        background: 'rgba(30, 41, 59, 0.7)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        fontSize: '0.75rem',
        fontWeight: 600,
        color: '#e2e8f0',
      }}
      title="Soroban RPC & Horizon: Connected"
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: isOnline ? '#34d399' : '#f87171',
          boxShadow: isOnline ? '0 0 8px #34d399' : 'none',
        }}
      />
      <span>{networkName}</span>
      <Activity size={12} color="#94a3b8" />
    </div>
  );
};
