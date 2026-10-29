import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X, ExternalLink } from 'lucide-react';
import { getExplorerTxUrl } from '../utils/explorer';

export interface ToastItem {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  txHash?: string;
  durationMs: number;
}

interface ToastContainerProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        zIndex: 9999,
        maxWidth: 400,
      }}
    >
      {toasts.map((t) => {
        const bgColors = {
          success: 'rgba(16, 185, 129, 0.15)',
          error: 'rgba(239, 68, 68, 0.15)',
          info: 'rgba(56, 189, 248, 0.15)',
          warning: 'rgba(234, 179, 8, 0.15)',
        };
        const borderColors = {
          success: '#10b981',
          error: '#ef4444',
          info: '#38bdf8',
          warning: '#eab308',
        };
        const icons = {
          success: <CheckCircle2 size={18} color="#34d399" />,
          error: <AlertCircle size={18} color="#f87171" />,
          info: <Info size={18} color="#38bdf8" />,
          warning: <AlertTriangle size={18} color="#facc15" />,
        };

        return (
          <div
            key={t.id}
            style={{
              background: '#0f172a',
              border: `1px solid ${borderColors[t.type]}`,
              borderRadius: 8,
              padding: '12px 14px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 12,
              animation: 'fadeIn 0.2s ease-out',
            }}
          >
            <div style={{ marginTop: 2 }}>{icons[t.type]}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 500 }}>{t.message}</div>
              {t.txHash && (
                <a
                  href={getExplorerTxUrl(t.txHash)}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    fontSize: '0.75rem',
                    color: '#38bdf8',
                    marginTop: 4,
                    textDecoration: 'none',
                  }}
                >
                  View on Stellar Expert <ExternalLink size={12} />
                </a>
              )}
            </div>
            <button
              onClick={() => onDismiss(t.id)}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 2 }}
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
