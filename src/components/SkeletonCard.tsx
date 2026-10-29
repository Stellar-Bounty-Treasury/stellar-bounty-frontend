import React from 'react';

export const SkeletonCard: React.FC = () => {
  return (
    <div className="glass-panel" style={{ padding: '20px', borderRadius: 12, minHeight: 200, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ width: '60%', height: 20, background: 'rgba(255,255,255,0.06)', borderRadius: 4 }} />
      <div style={{ width: '90%', height: 14, background: 'rgba(255,255,255,0.04)', borderRadius: 4 }} />
      <div style={{ width: '40%', height: 14, background: 'rgba(255,255,255,0.04)', borderRadius: 4 }} />
      <div style={{ marginTop: 'auto', width: '100%', height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 999 }} />
    </div>
  );
};
