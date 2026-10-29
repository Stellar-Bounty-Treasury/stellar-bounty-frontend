import React, { useState } from 'react';
import { X, CheckCircle2, XCircle, ShieldCheck } from 'lucide-react';
import { Milestone } from '../types';

interface VerifyMilestoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  milestone: Milestone | null;
  onVote: (milestoneId: number, decision: 'approve' | 'reject') => Promise<void>;
}

export const VerifyMilestoneModal: React.FC<VerifyMilestoneModalProps> = ({
  isOpen,
  onClose,
  milestone,
  onVote,
}) => {
  const [decision, setDecision] = useState<'approve' | 'reject'>('approve');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !milestone) return null;

  const handleVoteSubmit = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await onVote(milestone.id, decision);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Verification vote failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} id="verify-modal-overlay">
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 440 }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={20} color="#34d399" />
            </div>
            <div>
              <h2 className="modal-title">Evaluate Milestone Deliverable</h2>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Sign cryptographic consensus review vote</div>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div style={{ marginTop: 14, fontSize: '0.85rem', color: '#fff' }}>
          <strong>Milestone:</strong> {milestone.description}
        </div>

        {milestone.submission_reference && (
          <div style={{ marginTop: 8, fontSize: '0.8rem', color: '#38bdf8' }}>
            <a href={milestone.submission_reference} target="_blank" rel="noreferrer" style={{ color: '#38bdf8' }}>
              View Submission Link ↗
            </a>
          </div>
        )}

        <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
          <button
            type="button"
            onClick={() => setDecision('approve')}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: 8,
              border: `1px solid ${decision === 'approve' ? '#10b981' : 'var(--border-color)'}`,
              background: decision === 'approve' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.03)',
              color: decision === 'approve' ? '#34d399' : 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <CheckCircle2 size={16} /> Approve
          </button>

          <button
            type="button"
            onClick={() => setDecision('reject')}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: 8,
              border: `1px solid ${decision === 'reject' ? '#ef4444' : 'var(--border-color)'}`,
              background: decision === 'reject' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255,255,255,0.03)',
              color: decision === 'reject' ? '#f87171' : 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <XCircle size={16} /> Reject
          </button>
        </div>

        <div className="modal-footer" style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary" onClick={handleVoteSubmit} disabled={isLoading}>
            {isLoading ? 'Voting...' : 'Confirm ' + (decision === 'approve' ? 'Approval' : 'Rejection')}
          </button>
        </div>
      </div>
    </div>
  );
};
