import React from 'react';
import { X, ShieldCheck, History } from 'lucide-react';
import { formatAddress, formatTimestamp } from '../utils/formatters';

export interface AuditLogItem {
  id: number;
  entity_type: string;
  entity_id: number;
  action: string;
  actor_address?: string;
  created_at: string;
  metadata?: string;
}

interface AuditLogDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  logs: AuditLogItem[];
  isLoading?: boolean;
}

export const AuditLogDrawer: React.FC<AuditLogDrawerProps> = ({ isOpen, onClose, logs, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} id="audit-drawer-overlay">
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: 520,
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <History size={20} color="#38bdf8" />
            </div>
            <div>
              <h2 className="modal-title">Treasury Audit Trail</h2>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Cryptographically verifiable change log</div>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div style={{ marginTop: 16, overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {isLoading && <div style={{ textAlign: 'center', padding: 20, color: 'var(--text-muted)' }}>Loading audit logs...</div>}
          {!isLoading && logs.length === 0 && (
            <div style={{ textAlign: 'center', padding: 30, color: 'var(--text-muted)' }}>No audit logs recorded yet.</div>
          )}
          {logs.map((log) => (
            <div key={log.id} className="glass-panel" style={{ padding: '12px 14px', borderRadius: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase' }}>
                  {log.action}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{formatTimestamp(log.created_at)}</span>
              </div>
              <div style={{ fontSize: '0.82rem', color: '#fff', marginTop: 4 }}>
                Target: {log.entity_type} #{log.entity_id}
              </div>
              {log.actor_address && (
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
                  Actor: {formatAddress(log.actor_address)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
