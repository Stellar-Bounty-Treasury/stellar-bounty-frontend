import React from 'react';
import { formatXlm } from '../utils/formatters';

interface FundingProgressBarProps {
  funded: number;
  target: number;
}

export const FundingProgressBar: React.FC<FundingProgressBarProps> = ({ funded, target }) => {
  const rawPercent = target > 0 ? (funded / target) * 100 : 0;
  const percent = Math.min(100, Math.round(rawPercent));
  const isFullyFunded = funded >= target && target > 0;

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Funding Progress</span>
        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: isFullyFunded ? '#34d399' : '#fff' }}>
          {percent}%
        </span>
      </div>

      <div style={{ width: '100%', height: 8, background: 'rgba(255, 255, 255, 0.1)', borderRadius: 999, overflow: 'hidden' }}>
        <div
          style={{
            width: `${percent}%`,
            height: '100%',
            background: isFullyFunded ? 'linear-gradient(90deg, #10b981, #34d399)' : 'linear-gradient(90deg, #6366f1, #38bdf8)',
            borderRadius: 999,
            transition: 'width 0.4s ease',
          }}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        <span>{formatXlm(funded)} XLM</span>
        <span>Target: {formatXlm(target)} XLM</span>
      </div>
    </div>
  );
};
