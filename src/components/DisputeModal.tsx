import React, { useState } from 'react';
import { X, Scale, AlertTriangle, Send } from 'lucide-react';

interface DisputeModalProps {
  isOpen: boolean;
  onClose: () => void;
  bountyId: number;
  milestoneId: number;
  onSubmit: (reason: string) => Promise<void>;
}

export const DisputeModal: React.FC<DisputeModalProps> = ({
  isOpen,
  onClose,
  bountyId,
  milestoneId,
  onSubmit,
}) => {
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim() || reason.trim().length < 10) {
      setError('Please provide a substantive dispute reason (at least 10 characters).');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await onSubmit(reason.trim());
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to file dispute');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} id="dispute-modal-overlay">
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 440 }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(234, 179, 8, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Scale size={20} color="#facc15" />
            </div>
            <div>
              <h2 className="modal-title">File Milestone Dispute</h2>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Escalate to decentralized arbitration</div>
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

        <form onSubmit={handleSubmit} style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#fff', marginBottom: 6 }}>
              Dispute Statement & Evidence
            </label>
            <textarea
              rows={4}
              placeholder="State the deliverable deficiency, SLA violation, or disagreement in detail..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
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
              {isLoading ? 'Submitting...' : 'File Dispute'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
