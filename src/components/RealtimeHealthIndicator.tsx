import React from 'react';
import { Radio, RefreshCw } from 'lucide-react';

interface RealtimeHealthIndicatorProps {
  status: 'connected' | 'reconnecting' | 'disconnected';
  eventCount: number;
  onReconnect?: () => void;
}

export const RealtimeHealthIndicator: React.FC<RealtimeHealthIndicatorProps> = ({
  status,
  eventCount,
  onReconnect,
}) => {
  const statusColors = {
    connected: '#34d399',
    reconnecting: '#facc15',
    disconnected: '#f87171',
  };

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '3px 10px',
        borderRadius: 999,
        background: 'rgba(15, 23, 42, 0.6)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        fontSize: '0.72rem',
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: statusColors[status] }} />
      <span style={{ color: '#fff', textTransform: 'capitalize' }}>SSE Stream: {status}</span>
      <span style={{ color: 'var(--text-muted)' }}>({eventCount} events)</span>
      {status === 'disconnected' && onReconnect && (
        <button
          onClick={onReconnect}
          style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', padding: 0 }}
          title="Retry SSE connection"
        >
          <RefreshCw size={10} />
        </button>
      )}
    </div>
  );
};
