import React from 'react';
import { formatPercent, formatXlm } from '../utils/formatters';

export interface SplitRecipient {
  address: string;
  bps: number;
  label?: string;
}

interface SettlementSplitCalculatorProps {
  totalAmountXlm: number;
  recipients: SplitRecipient[];
  onChange: (updated: SplitRecipient[]) => void;
}

export const SettlementSplitCalculator: React.FC<SettlementSplitCalculatorProps> = ({
  totalAmountXlm,
  recipients,
  onChange,
}) => {
  const totalBps = recipients.reduce((acc, r) => acc + (r.bps || 0), 0);
  const remainingBps = 10000 - totalBps;
  const isValid = totalBps === 10000;

  const handleBpsChange = (index: number, val: number) => {
    const updated = [...recipients];
    updated[index] = { ...updated[index], bps: Math.max(0, Math.min(10000, val)) };
    onChange(updated);
  };

  const colors = ['#6366f1', '#38bdf8', '#34d399', '#facc15', '#f472b6', '#a855f7'];

  return (
    <div className="glass-panel" style={{ padding: '16px 18px', borderRadius: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>Settlement Distribution (10,000 BPS)</span>
        <span
          style={{
            fontSize: '0.8rem',
            fontWeight: 700,
            color: isValid ? '#34d399' : '#f87171',
          }}
        >
          {formatPercent(totalBps)} / 100%
        </span>
      </div>

      {/* Visual Distribution Bar */}
      <div style={{ width: '100%', height: 12, background: 'rgba(255, 255, 255, 0.08)', borderRadius: 999, overflow: 'hidden', display: 'flex' }}>
        {recipients.map((r, i) => {
          const widthPct = (r.bps / 10000) * 100;
          return (
            <div
              key={i}
              style={{
                width: `${widthPct}%`,
                height: '100%',
                background: colors[i % colors.length],
                transition: 'width 0.2s ease',
              }}
              title={`${r.label || r.address}: ${formatPercent(r.bps)}`}
            />
          );
        })}
      </div>

      {/* Inputs list */}
      <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {recipients.map((r, i) => {
          const amountXlm = (totalAmountXlm * r.bps) / 10000;
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: colors[i % colors.length] }} />
              <div style={{ flex: 1, fontSize: '0.8rem', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {r.label || `${r.address.slice(0, 6)}...${r.address.slice(-4)}`}
              </div>
              <input
                type="number"
                min="0"
                max="10000"
                step="50"
                value={r.bps}
                onChange={(e) => handleBpsChange(i, parseInt(e.target.value, 10) || 0)}
                style={{
                  width: 80,
                  padding: '4px 8px',
                  borderRadius: 6,
                  border: '1px solid var(--border-color)',
                  background: 'rgba(0,0,0,0.3)',
                  color: '#fff',
                  fontSize: '0.8rem',
                  textAlign: 'right',
                }}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', width: 40 }}>BPS</span>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#38bdf8', width: 85, textAlign: 'right' }}>
                {formatXlm(amountXlm)} XLM
              </span>
            </div>
          );
        })}
      </div>

      {!isValid && (
        <div style={{ marginTop: 10, fontSize: '0.75rem', color: '#f87171' }}>
          Total distribution must equal exactly 10,000 basis points ({remainingBps > 0 ? `+${remainingBps} BPS needed` : `${Math.abs(remainingBps)} BPS excess`}).
        </div>
      )}
    </div>
  );
};
