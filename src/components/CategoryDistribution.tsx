import React from 'react';
import { PieChart } from 'lucide-react';
import { formatPercent } from '../utils/formatters';

export interface CategoryStat {
  category: string;
  count: number;
  total_funds_xlm: number;
}

interface CategoryDistributionProps {
  stats: CategoryStat[];
}

export const CategoryDistribution: React.FC<CategoryDistributionProps> = ({ stats }) => {
  const totalBounties = stats.reduce((sum, s) => sum + s.count, 0);
  const colors = ['#6366f1', '#38bdf8', '#34d399', '#facc15', '#ec4899', '#a855f7'];

  return (
    <div className="glass-panel" style={{ padding: '16px 20px', borderRadius: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <PieChart size={18} color="#38bdf8" />
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', margin: 0 }}>Category Allocation</h3>
      </div>

      {/* Segmented bar */}
      <div style={{ width: '100%', height: 10, borderRadius: 999, overflow: 'hidden', display: 'flex', background: 'rgba(255,255,255,0.08)' }}>
        {stats.map((s, i) => {
          const widthPct = totalBounties > 0 ? (s.count / totalBounties) * 100 : 0;
          return (
            <div
              key={s.category}
              style={{
                width: `${widthPct}%`,
                height: '100%',
                background: colors[i % colors.length],
              }}
              title={`${s.category}: ${s.count} bounties`}
            />
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 12 }}>
        {stats.map((s, i) => (
          <div key={s.category} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: colors[i % colors.length] }} />
            <span style={{ color: 'var(--text-muted)' }}>{s.category}:</span>
            <strong style={{ color: '#fff' }}>{s.count}</strong>
          </div>
        ))}
      </div>
    </div>
  );
};
