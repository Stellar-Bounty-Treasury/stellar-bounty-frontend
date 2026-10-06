import React, { useState, useEffect } from 'react';
import { useWallet } from '../context/WalletContext';
import { api } from '../services/api';
import { Bounty } from '../types';
import { X, AlertCircle, PlusCircle, Loader2 } from 'lucide-react';

interface CreateBountyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBountyCreated: (bounty: Bounty) => void;
}

export const CreateBountyModal: React.FC<CreateBountyModalProps> = ({
  isOpen,
  onClose,
  onBountyCreated,
}) => {
  const { isConnected, address } = useWallet();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [creatorAddress, setCreatorAddress] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (address) {
      setCreatorAddress(address);
    }
  }, [address]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Bounty title is required.');
      return;
    }
    if (!description.trim()) {
      setError('Description is required.');
      return;
    }
    const target = parseFloat(targetAmount);
    if (isNaN(target) || target <= 0) {
      setError('Funding target must be a positive XLM amount.');
      return;
    }
    if (!creatorAddress.trim()) {
      setError('Creator Stellar address is required.');
      return;
    }

    setLoading(true);
    try {
      const newBounty = await api.createBounty({
        title: title.trim(),
        description: description.trim(),
        target_amount: target,
        creator_address: creatorAddress.trim(),
      });

      onBountyCreated(newBounty);
      setTitle('');
      setDescription('');
      setTargetAmount('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create bounty');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} id="create-modal-overlay">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Create New Bounty</h2>
          <button className="modal-close" onClick={onClose} id="close-create-modal-btn">
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="error-banner" id="create-bounty-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="bounty-title-input">
              Bounty Title *
            </label>
            <input
              id="bounty-title-input"
              type="text"
              className="form-input"
              placeholder="e.g. Build Soroban Escrow Settlement Module"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="bounty-desc-input">
              Description *
            </label>
            <textarea
              id="bounty-desc-input"
              className="form-textarea"
              placeholder="Describe deliverables, requirements, and acceptance criteria..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="bounty-target-input">
              Funding Target (XLM) *
            </label>
            <input
              id="bounty-target-input"
              type="number"
              min="0.1"
              step="any"
              className="form-input"
              placeholder="e.g. 100"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="bounty-creator-input">
              Creator Address (Stellar Testnet) *
            </label>
            <input
              id="bounty-creator-input"
              type="text"
              className="form-input"
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}
              placeholder="G..."
              value={creatorAddress}
              onChange={(e) => setCreatorAddress(e.target.value)}
              required
            />
            {!isConnected && (
              <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: 4, display: 'block' }}>
                Tip: Connect your wallet to automatically populate your creator address.
              </span>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: 8 }}
            disabled={loading}
            id="submit-create-bounty-btn"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="spin" />
                <span>Creating Bounty...</span>
              </>
            ) : (
              <>
                <PlusCircle size={16} />
                <span>Create Bounty</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
