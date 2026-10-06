import React from 'react';
import { Settlement } from '../types';

interface SettlementFlowVisualizerProps {
  settlement: Settlement;
}

export const SettlementFlowVisualizer: React.FC<SettlementFlowVisualizerProps> = ({
  settlement,
}) => {
  return (
    <div
      style={{
        marginTop: '1rem',
        padding: '1.25rem',
        borderRadius: '12px',
        background: 'rgba(15, 23, 42, 0.75)',
        border: '1px solid rgba(245, 158, 11, 0.25)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1rem' }}>⚡</span>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Settlement Router Flow Diagram
          </span>
        </div>
        <span
          style={{
            fontSize: '0.72rem',
            fontWeight: 700,
            padding: '3px 8px',
            borderRadius: '12px',
            textTransform: 'uppercase',
            background: settlement.status === 'settled' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
            color: settlement.status === 'settled' ? '#34d399' : '#fbbf24',
            border: `1px solid ${settlement.status === 'settled' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(245, 158, 11, 0.4)'}`,
          }}
        >
          {settlement.status}
        </span>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        {/* Top Node: Escrow Vault */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '8px 16px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.6), rgba(17, 24, 39, 0.8))',
            border: '1px solid rgba(59, 130, 246, 0.4)',
            color: '#93c5fd',
            fontSize: '0.85rem',
            fontWeight: 700,
          }}
        >
          <span>🏦 Escrow Vault</span>
          <span style={{ color: '#fff', background: 'rgba(59, 130, 246, 0.4)', padding: '2px 8px', borderRadius: '6px' }}>
            {settlement.total_amount} XLM
          </span>
        </div>

        {/* Downward Arrow */}
        <div style={{ color: '#f59e0b', fontSize: '1rem', lineHeight: 1 }}>↓</div>

        {/* Middle Node: Settlement Router */}
        <div
          style={{
            padding: '8px 16px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, rgba(180, 83, 9, 0.3), rgba(30, 41, 59, 0.8))',
            border: '1px solid rgba(245, 158, 11, 0.5)',
            color: '#fef3c7',
            fontSize: '0.82rem',
            fontWeight: 700,
            textAlign: 'center',
          }}
        >
          🔀 Settlement Router ({settlement.allocation_type.toUpperCase()} ALLOCATION)
        </div>

        {/* Multi-Branch Lines */}
        <div style={{ color: '#94a3b8', fontSize: '1rem', lineHeight: 1 }}>├───┼───┤</div>

        {/* Recipient Nodes */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${Math.min(settlement.recipients.length, 3)}, minmax(130px, 1fr))`,
            gap: '0.75rem',
            width: '100%',
          }}
        >
          {settlement.recipients.map((r, i) => (
            <div
              key={i}
              style={{
                padding: '0.75rem',
                borderRadius: '10px',
                background: 'rgba(30, 41, 59, 0.7)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '0.72rem', color: '#fbbf24', fontWeight: 600 }}>
                {r.label || `Recipient #${i + 1}`}
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#f8fafc', margin: '4px 0' }}>
                {r.amount} <span style={{ fontSize: '0.7rem' }}>XLM</span>
              </div>
              <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontFamily: 'monospace' }}>
                {r.recipient.substring(0, 4)}...{r.recipient.substring(r.recipient.length - 4)}
              </div>
              {r.percentage_bps && (
                <div style={{ fontSize: '0.65rem', color: '#34d399', marginTop: '2px', fontWeight: 600 }}>
                  {(r.percentage_bps / 100).toFixed(1)}% share
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
