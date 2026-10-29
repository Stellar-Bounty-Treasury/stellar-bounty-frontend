import React from 'react';
import { TrendingUp } from 'lucide-react';
import { formatXlm } from '../utils/formatters';

export interface TimelineDataPoint {
  date: string;
  cumulative_funds_xlm: number;
}

interface TimelineChartProps {
  data: TimelineDataPoint[];
}

export const TimelineChart: React.FC<TimelineChartProps> = ({ data }) => {
  const maxVal = Math.max(...data.map((d) => d.cumulative_funds_xlm), 1000);

  return (
    <div className="glass-panel" style={{ padding: '16px 20px', borderRadius: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <TrendingUp size={18} color="#34d399" />
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', margin: 0 }}>30-Day Treasury Inflow</h3>
      </div>

      <div style={{ height: 120, display: 'flex', alignItems: 'flex-end', gap: 6, paddingBottom: 6 }}>
        {data.map((d, i) => {
          const heightPct = Math.max(8, Math.round((d.cumulative_funds_xlm / maxVal) * 100));
          return (
            <div
              key={i}
              style={{
                flex: 1,
                height: `${heightPct}%`,
                background: 'linear-gradient(180deg, #38bdf8, #6366f1)',
                borderRadius: '4px 4px 0 0',
                transition: 'height 0.3s ease',
              }}
              title={`${d.date}: ${formatXlm(d.cumulative_funds_xlm)} XLM`}
            />
          );
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>
        <span>{data[0]?.date || '30 days ago'}</span>
        <span>Today</span>
      </div>
    </div>
  );
};
