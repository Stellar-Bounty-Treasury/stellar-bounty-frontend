import React from 'react';
import { Search, Plus } from 'lucide-react';

interface EmptyStateProps {
  message?: string;
  onClearFilters?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  message = 'No bounties match your criteria.',
  onClearFilters,
}) => {
  return (
    <div style={{ padding: '40px 20px', textAlign: 'center', maxWidth: 400, margin: '0 auto' }}>
      <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px auto' }}>
        <Search size={24} color="var(--text-muted)" />
      </div>
      <h3 style={{ fontSize: '1rem', color: '#fff', margin: 0 }}>No Bounties Found</h3>
      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 6 }}>{message}</div>
      {onClearFilters && (
        <button onClick={onClearFilters} className="btn btn-secondary" style={{ marginTop: 14, fontSize: '0.82rem' }}>
          Reset Filters
        </button>
      )}
    </div>
  );
};
