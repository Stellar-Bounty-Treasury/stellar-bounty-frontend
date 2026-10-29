import React from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';

export interface FilterState {
  search: string;
  status: string;
  category: string;
  minAmount?: string;
  maxAmount?: string;
}

interface BountyFilterBarProps {
  filters: FilterState;
  onChange: (newFilters: FilterState) => void;
  onReset: () => void;
}

export const CATEGORIES = [
  'All',
  'Smart Contracts',
  'DeFi',
  'Security',
  'Tooling',
  'Infrastructure',
  'Community',
];

export const STATUSES = ['All', 'open', 'funded', 'completed', 'settled'];

export const BountyFilterBar: React.FC<BountyFilterBarProps> = ({ filters, onChange, onReset }) => {
  return (
    <div className="glass-panel" style={{ padding: '16px 20px', borderRadius: 12, marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Search Input Row */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search bounties by title, keyword, or requirements..."
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            style={{
              width: '100%',
              padding: '10px 14px 10px 38px',
              borderRadius: 8,
              border: '1px solid var(--border-color)',
              background: 'rgba(0, 0, 0, 0.25)',
              color: '#fff',
              fontSize: '0.9rem',
            }}
          />
        </div>

        <button
          onClick={onReset}
          className="btn btn-secondary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.85rem' }}
          title="Reset all filters"
        >
          <RotateCcw size={14} /> Reset
        </button>
      </div>

      {/* Category Pills Row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, marginRight: 4 }}>Category:</span>
        {CATEGORIES.map((cat) => {
          const isSelected = (cat === 'All' && !filters.category) || filters.category === cat;
          return (
            <button
              key={cat}
              onClick={() => onChange({ ...filters, category: cat === 'All' ? '' : cat })}
              style={{
                background: isSelected ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                border: `1px solid ${isSelected ? '#38bdf8' : 'rgba(255, 255, 255, 0.1)'}`,
                color: isSelected ? '#38bdf8' : 'var(--text-muted)',
                padding: '4px 12px',
                borderRadius: 999,
                fontSize: '0.78rem',
                fontWeight: isSelected ? 600 : 400,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Status Filter Row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, marginRight: 4 }}>Status:</span>
        {STATUSES.map((st) => {
          const isSelected = (st === 'All' && !filters.status) || filters.status === st;
          return (
            <button
              key={st}
              onClick={() => onChange({ ...filters, status: st === 'All' ? '' : st })}
              style={{
                background: isSelected ? 'rgba(168, 85, 247, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                border: `1px solid ${isSelected ? '#c084fc' : 'rgba(255, 255, 255, 0.1)'}`,
                color: isSelected ? '#c084fc' : 'var(--text-muted)',
                padding: '4px 12px',
                borderRadius: 999,
                fontSize: '0.78rem',
                fontWeight: isSelected ? 600 : 400,
                cursor: 'pointer',
                textTransform: 'capitalize',
                transition: 'all 0.15s ease',
              }}
            >
              {st}
            </button>
          );
        })}
      </div>
    </div>
  );
};
