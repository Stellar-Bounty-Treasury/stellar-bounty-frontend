import React, { useState } from 'react';
import { api } from '../services/api';
import { Milestone } from '../types';
import { X, CheckCircle2, AlertCircle, Loader2, Send, ExternalLink, Key } from 'lucide-react';
import { useWallet } from '../context/WalletContext';

interface SubmitMilestoneModalProps {
  milestone: Milestone | null;
  isOpen: boolean;
  onClose: () => void;
  onMilestoneSubmitted: (milestone: Milestone) => void;
}

export const SubmitMilestoneModal: React.FC<SubmitMilestoneModalProps> = ({
  milestone,
  isOpen,
  onClose,
  onMilestoneSubmitted,
}) => {
  const { address } = useWallet();
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen || !milestone) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!evidenceUrl.trim()) {
      setError('Please provide a valid deliverable reference URL or GitHub PR link.');
      return;
    }

    setLoading(true);
    try {
      // Record milestone submission on backend & contract event indexer
      const updated = await api.submitMilestone(milestone.id, {
        submission_reference: evidenceUrl.trim(),
        transaction_hash: `sub-tx-${Date.now()}`,
      });

      setSuccess(true);
      setTimeout(() => {
        onMilestoneSubmitted(updated);
        handleClose();
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Failed to submit milestone deliverable.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEvidenceUrl('');
    setSubmissionNotes('');
    setError(null);
    setSuccess(false);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div
        className="glass-panel modal-content"
        style={{ maxWidth: 520 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.15)',
                color: 'var(--success)',
                padding: 8,
                borderRadius: '50%',
              }}
            >
              <Send size={20} />
            </div>
            <div>
              <h2 className="modal-title">Submit Milestone Deliverable</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Milestone #{milestone.contract_milestone_id} — {milestone.reward_amount} XLM
              </p>
            </div>
          </div>
          <button className="btn-icon" onClick={handleClose} id="close-submit-milestone-modal">
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="error-banner" style={{ marginBottom: 16 }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div
            className="glass-panel"
            style={{
              padding: 14,
              marginBottom: 16,
              background: 'rgba(16, 185, 129, 0.1)',
              borderColor: 'var(--success)',
              color: 'var(--success)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <CheckCircle2 size={18} />
            <span>Deliverable recorded! Milestone is now open for community review.</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div
            style={{
              padding: 12,
              borderRadius: 8,
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-color)',
              marginBottom: 16,
              fontSize: '0.85rem',
            }}
          >
            <div style={{ color: 'var(--text-muted)', marginBottom: 4 }}>Milestone Goal:</div>
            <div style={{ fontWeight: 500 }}>{milestone.description}</div>
            <div style={{ marginTop: 8, fontSize: '0.78rem', color: '#38bdf8' }}>
              Designated Recipient: {milestone.recipient_address.slice(0, 8)}...{milestone.recipient_address.slice(-6)}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="evidence-url">
              Deliverable Reference / Evidence Link *
            </label>
            <input
              id="evidence-url"
              type="text"
              className="form-input"
              placeholder="https://github.com/Stellar-Bounty-Treasury/contracts/pull/1"
              value={evidenceUrl}
              onChange={(e) => setEvidenceUrl(e.target.value)}
              disabled={loading || success}
              required
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4, display: 'block' }}>
              Provide a verifiable GitHub PR, commit SHA, IPFS CID, or live deployment link.
            </span>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="submission-notes">
              Submission Summary / Notes (Optional)
            </label>
            <textarea
              id="submission-notes"
              className="form-textarea"
              rows={2}
              placeholder="Completed all unit tests and passing CI build."
              value={submissionNotes}
              onChange={(e) => setSubmissionNotes(e.target.value)}
              disabled={loading || success}
            />
          </div>

          <div
            style={{
              padding: 10,
              borderRadius: 8,
              background: 'rgba(245, 158, 11, 0.08)',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              marginBottom: 20,
              fontSize: '0.78rem',
              color: '#f59e0b',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Key size={16} style={{ flexShrink: 0 }} />
            <span>
              Signed with worker address: {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Active Wallet'}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || success}
              id="submit-milestone-deliverable-btn"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="spinner" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send size={15} />
                  <span>Submit Deliverable</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
