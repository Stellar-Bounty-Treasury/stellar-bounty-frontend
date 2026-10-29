import React from 'react';
import { DollarSign, ArrowUpRight, TrendingUp, Shield } from 'lucide-react';
import { formatXlm } from '../utils/formatters';

interface VolumeMetricsCardProps {
  totalDistributed: number;
  totalFunds: number;
  platformFeeBps?: number;
}

export const VolumeMetricsCard: React.FC<VolumeMetricsCardProps> = ({
  totalDistributed,
  totalFunds,
  platformFeeBps = 250,
}) => {
  const feesCollected = (totalDistributed * platformFeeBps) / 10000;

  return (
    <div className="glass-panel" style={{ padding: '16px 20px', borderRadius: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Treasury Volume & Throughput</span>
        <TrendingUp size={16} color="#34d399" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Distributed</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#34d399', marginTop: 2 }}>
            {formatXlm(totalDistributed)} XLM
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Protocol Fees (2.5%)</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#38bdf8', marginTop: 2 }}>
            {formatXlm(feesCollected)} XLM
          </div>
        </div>
      </div>
    </div>
  );
};
