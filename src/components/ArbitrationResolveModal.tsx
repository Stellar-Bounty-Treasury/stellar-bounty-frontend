import React, { useState } from 'react';
import { X, Gavel, CheckCircle2, RotateCcw, AlertTriangle } from 'lucide-react';

interface ArbitrationResolveModalProps {
  isOpen: boolean;
  onClose: () => void;
  bountyId: number;
  milestoneId: number;
  onResolve: (verdict: 'payout' | 'refund') => Promise<void>;
}

export const ArbitrationResolveModal: React.FC<ArbitrationResolveModalProps> = ({
  isOpen,
  onClose,
  bountyId,
  milestoneId,
  onResolve,
}) => {
  const [verdict, setVerdict] = useState<'payout' | 'refund'>('payout');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleResolve = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await onResolve(verdict);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to resolve dispute');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} id="arbitration-modal-overlay">
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 440 }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(168, 85, 247, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Gavel size={20} color="#c084fc" />
            </div>
            <div>
              <h2 className="modal-title">Arbitrator Verdict Resolution</h2>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Authority: Soroban Arbitrator Role</div>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="error-banner" style={{ marginTop: 14 }}>
            <AlertTriangle size={16} />
            <span>{error}</span>
          </div>
        )}

        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button
            type="button"
            onClick={() => setVerdict('payout')}
            className="glass-panel"
            style={{
              padding: '12px 14px',
              border: `1px solid ${verdict === 'payout' ? '#10b981' : 'var(--border-color)'}`,
              borderRadius: 8,
              textAlign: 'left',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, color: '#34d399' }}>
              <CheckCircle2 size={16} /> Rule in Favor of Contributor (Release Payout)
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
              Deliverable satisfies specifications. Milestone is authorized for settlement distribution.
            </div>
          </button>

          <button
            type="button"
            onClick={() => setVerdict('refund')}
            className="glass-panel"
            style={{
              padding: '12px 14px',
              border: `1px solid ${verdict === 'refund' ? '#a855f7' : 'var(--border-color)'}`,
              borderRadius: 8,
              textAlign: 'left',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, color: '#c084fc' }}>
              <RotateCcw size={16} /> Rule in Favor of Creator (Execute Escrow Refund)
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
              Deliverable fails specifications. Reserved escrow is returned to bounty creator.
            </div>
          </button>
        </div>

        <div className="modal-footer" style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary" onClick={handleResolve} disabled={isLoading}>
            {isLoading ? 'Executing...' : 'Submit Arbitrator Verdict'}
          </button>
        </div>
      </div>
    </div>
  );
};
