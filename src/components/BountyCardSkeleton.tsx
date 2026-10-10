import React from 'react';

interface BountyCardSkeletonProps {
  /** Stable test/assistive id suffix so the skeleton grid is queryable. */
  index?: number;
}

/**
 * Placeholder card rendered while the bounty list is being fetched.
 * Mirrors the BountyCard layout (header, description, progress bar,
 * milestone row, footer) with shimmer blocks so the grid does not
 * jump when real cards arrive.
 */
export const BountyCardSkeleton: React.FC<BountyCardSkeletonProps> = ({ index = 0 }) => {
  return (
    <div
      className="glass-panel bounty-card bounty-card-skeleton"
      role="status"
      aria-busy="true"
      aria-label="Loading bounty"
      data-testid={`bounty-card-skeleton-${index}`}
    >
      <div>
        <div className="card-header">
          <div style={{ flex: 1 }}>
            <div className="skeleton-line" style={{ width: '70%', height: 22 }} />
            <div className="skeleton-line" style={{ width: 110, height: 18, marginTop: 8 }} />
          </div>
          <div className="skeleton-line" style={{ width: 72, height: 24, borderRadius: 20 }} />
        </div>
        <div className="skeleton-line" style={{ width: '100%', marginBottom: 8 }} />
        <div className="skeleton-line" style={{ width: '85%', marginBottom: 20 }} />
      </div>

      <div>
        <div className="progress-section">
          <div className="progress-header">
            <div className="skeleton-line" style={{ width: 120 }} />
            <div className="skeleton-line" style={{ width: 48 }} />
          </div>
          <div className="progress-bar-bg">
            <div className="skeleton-line" style={{ width: '100%', height: 8, borderRadius: 4 }} />
          </div>
        </div>

        <div className="skeleton-line" style={{ width: '100%', height: 34, marginBottom: 12 }} />

        <div className="card-footer">
          <div className="skeleton-line" style={{ width: 110 }} />
          <div style={{ display: 'flex', gap: 8 }}>
            <div className="skeleton-line" style={{ width: 76, height: 32, borderRadius: 8 }} />
            <div className="skeleton-line" style={{ width: 76, height: 32, borderRadius: 8 }} />
          </div>
        </div>
      </div>
    </div>
  );
};
