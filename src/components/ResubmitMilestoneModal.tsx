import React, { useState } from 'react';
import { X, RefreshCw, Send, AlertCircle } from 'lucide-react';

interface ResubmitMilestoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  milestoneId: number;
  onSubmit: (newRef: string) => Promise<void>;
}

export const ResubmitMilestoneModal: React.FC<ResubmitMilestoneModalProps> = ({
  isOpen,
  onClose,
  milestoneId,
  onSubmit,
}) => {
  const [submissionRef, setSubmissionRef] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionRef.trim()) {
      setError('Please provide the revised pull request or deliverable URL.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await onSubmit(submissionRef.trim());
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to resubmit milestone');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} id="resubmit-modal-overlay">
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 440 }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <RefreshCw size={20} color="#38bdf8" />
            </div>
            <div>
              <h2 className="modal-title">Resubmit Deliverable</h2>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Reset reviewer votes for revised submission</div>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="error-banner" style={{ marginTop: 14 }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#fff', marginBottom: 6 }}>
              Updated Deliverable URL (GitHub PR / Commit)
            </label>
            <input
              type="text"
              placeholder="https://github.com/org/repo/pull/12"
              value={submissionRef}
              onChange={(e) => setSubmissionRef(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 8,
                border: '1px solid var(--border-color)',
                background: 'rgba(0,0,0,0.3)',
                color: '#fff',
                fontSize: '0.85rem',
              }}
            />
          </div>

          <div className="modal-footer" style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 10 }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isLoading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isLoading} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Send size={14} />
              {isLoading ? 'Submitting...' : 'Resubmit Deliverable'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
