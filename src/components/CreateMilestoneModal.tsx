import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { api } from '../services/api';
import { Milestone } from '../types';
import { X, CheckCircle2, AlertCircle, Loader2, Target, ShieldCheck } from 'lucide-react';

interface CreateMilestoneModalProps {
  bountyId: number;
  isOpen: boolean;
  onClose: () => void;
  onMilestoneCreated: (milestone: Milestone) => void;
}

export const CreateMilestoneModal: React.FC<CreateMilestoneModalProps> = ({
  bountyId,
  isOpen,
  onClose,
  onMilestoneCreated,
}) => {
  const { address } = useWallet();
  const [description, setDescription] = useState('');
  const [rewardAmount, setRewardAmount] = useState('');
  const [recipientAddress, setRecipientAddress] = useState(address || '');
  const [approvalThreshold, setApprovalThreshold] = useState('2');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsedReward = parseFloat(rewardAmount);
    const parsedThreshold = parseInt(approvalThreshold, 10);

    if (!description.trim()) {
      setError('Please provide a milestone description.');
      return;
    }
    if (isNaN(parsedReward) || parsedReward <= 0) {
      setError('Reward amount must be a positive number of XLM.');
      return;
    }
    if (!recipientAddress.startsWith('G') || recipientAddress.length !== 56) {
      setError('Please enter a valid Stellar public key (56 characters, starts with G).');
      return;
    }
    if (isNaN(parsedThreshold) || parsedThreshold < 1) {
      setError('Approval threshold must be at least 1 reviewer.');
      return;
    }

    setLoading(true);
    try {
      const newMilestone = await api.createMilestone(bountyId, {
        description: description.trim(),
        reward_amount: parsedReward,
        recipient_address: recipientAddress.trim(),
        approval_threshold: parsedThreshold,
      });

      setSuccess(true);
      setTimeout(() => {
        onMilestoneCreated(newMilestone);
        handleClose();
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Failed to create milestone.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setDescription('');
    setRewardAmount('');
    setRecipientAddress(address || '');
    setApprovalThreshold('2');
    setError(null);
    setSuccess(false);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div
        className="glass-panel modal-content"
        style={{ maxWidth: 540 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                background: 'rgba(56, 189, 248, 0.15)',
                color: '#38bdf8',
                padding: 8,
                borderRadius: '50%',
              }}
            >
              <Target size={20} />
            </div>
            <div>
              <h2 className="modal-title">Add On-Chain Milestone</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Bounty #{bountyId} — Enforced by Soroban Smart Contract
              </p>
            </div>
          </div>
          <button className="btn-icon" onClick={handleClose} id="close-create-milestone-modal">
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
            <span>Milestone created successfully on Soroban contract!</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="milestone-desc">
              Deliverable Description *
            </label>
            <textarea
              id="milestone-desc"
              className="form-textarea"
              rows={3}
              placeholder="e.g. Implement wallet history component and write unit tests"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading || success}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div className="form-group">
              <label className="form-label" htmlFor="milestone-reward">
                Reward Amount (XLM) *
              </label>
              <input
                id="milestone-reward"
                type="number"
                step="0.1"
                min="0.1"
                className="form-input"
                placeholder="e.g. 50"
                value={rewardAmount}
                onChange={(e) => setRewardAmount(e.target.value)}
                disabled={loading || success}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="milestone-threshold">
                Required Approvals *
              </label>
              <input
                id="milestone-threshold"
                type="number"
                min="1"
                max="10"
                className="form-input"
                placeholder="2"
                value={approvalThreshold}
                onChange={(e) => setApprovalThreshold(e.target.value)}
                disabled={loading || success}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="milestone-recipient">
              Designated Worker Address (Stellar G-Key) *
            </label>
            <input
              id="milestone-recipient"
              type="text"
              className="form-input"
              placeholder="GBDOSMGJGGPBIUAORRTYPEWPO5TXTXPQC7FLAP5ZZ4XVYHTDAFBCOMRX"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              disabled={loading || success}
              required
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4, display: 'block' }}>
              Only this recipient address can receive the locked XLM once verified.
            </span>
          </div>

          <div
            style={{
              padding: 12,
              borderRadius: 8,
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-color)',
              marginBottom: 20,
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              display: 'flex',
              gap: 8,
            }}
          >
            <ShieldCheck size={16} color="#38bdf8" style={{ flexShrink: 0, marginTop: 2 }} />
            <span>
              Funds remain securely locked in the Soroban escrow. Payment release requires community verification meeting the approval threshold.
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
              id="submit-create-milestone-btn"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="spinner" />
                  <span>Registering...</span>
                </>
              ) : (
                <span>Create Milestone</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
