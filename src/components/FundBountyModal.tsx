import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { stellar } from '../services/stellar';
import { api } from '../services/api';
import { Bounty } from '../types';
import {
  X,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Loader2,
  Coins,
  ArrowRight,
  Wallet,
} from 'lucide-react';

interface FundBountyModalProps {
  bounty: Bounty | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedBounty: Bounty) => void;
  onOpenConnectModal: () => void;
}

export const FundBountyModal: React.FC<FundBountyModalProps> = ({
  bounty,
  isOpen,
  onClose,
  onSuccess,
  onOpenConnectModal,
}) => {
  const { isConnected, address, balance, refreshBalance, secretKey } = useWallet();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [stepStatus, setStepStatus] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [txResult, setTxResult] = useState<{
    hash: string;
    explorerUrl: string;
    amount: number;
  } | null>(null);

  if (!isOpen || !bounty) return null;

  const handleFund = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setTxResult(null);

    // 1. Validate wallet connection
    if (!isConnected || !address) {
      setError('Please connect your Stellar wallet before contributing.');
      return;
    }

    // 2. Validate amount
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please enter a valid positive XLM amount.');
      return;
    }

    // 3. Check sufficient balance
    if (balance !== null && parsedAmount > balance) {
      setError(
        `Insufficient balance. You have ${balance.toFixed(2)} XLM, but tried to contribute ${parsedAmount} XLM.`
      );
      return;
    }

    // 4. Reserve buffer for transaction fee
    if (balance !== null && balance - parsedAmount < 0.5) {
      setError('Please leave at least 0.5 XLM in your wallet to cover network reserve and transaction fees.');
      return;
    }

    setLoading(true);
    setStepStatus('Signing & submitting transaction to Stellar Testnet...');

    try {
      // 5. Submit real payment on Stellar Testnet
      const result = await stellar.submitContributionPayment(
        address,
        bounty.creator_address,
        parsedAmount,
        secretKey || undefined
      );

      setStepStatus('Recording and verifying payment with backend...');

      // 6. Record & verify on backend
      const response = await api.recordContribution(bounty.id, {
        contributor_address: address,
        amount: parsedAmount,
        transaction_hash: result.hash,
      });

      // 7. Update UI state
      setTxResult({
        hash: result.hash,
        explorerUrl: result.explorerUrl,
        amount: parsedAmount,
      });

      // 8. Refresh wallet balance
      await refreshBalance();

      // 9. Notify parent of bounty update
      onSuccess(response.bounty);
    } catch (err: any) {
      console.error('Funding failed:', err);
      setError(err.message || 'Transaction submission or verification failed.');
    } finally {
      setLoading(false);
      setStepStatus('');
    }
  };

  const handleReset = () => {
    setAmount('');
    setError(null);
    setTxResult(null);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleReset} id="fund-modal-overlay">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Fund Bounty</h2>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 4 }}>
              {bounty.title}
            </div>
          </div>
          <button className="modal-close" onClick={handleReset} id="close-fund-modal-btn">
            <X size={20} />
          </button>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="error-banner" id="fund-error-banner">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Success Confirmation State */}
        {txResult ? (
          <div className="tx-result-box" id="fund-success-box">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <CheckCircle2 size={24} color="#10b981" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#10b981' }}>
                Transaction Confirmed!
              </h3>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: 8 }}>
              Successfully contributed <strong>{txResult.amount} XLM</strong> using a real Stellar
              Testnet transaction.
            </p>

            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-dim)' }}>
              Transaction Hash:
            </div>
            <div className="tx-hash-display" id="confirmed-tx-hash">
              {txResult.hash}
            </div>

            <a
              href={txResult.explorerUrl}
              target="_blank"
              rel="noreferrer"
              className="explorer-link"
              id="stellar-explorer-link"
            >
              <span>View on Stellar Explorer</span>
              <ExternalLink size={14} />
            </a>

            <button
              className="btn btn-primary"
              style={{ width: '100%', marginTop: 20 }}
              onClick={handleReset}
              id="done-fund-modal-btn"
            >
              Done
            </button>
          </div>
        ) : (
          /* Funding Input Form */
          <form onSubmit={handleFund}>
            {/* Wallet status banner */}
            {!isConnected ? (
              <div
                style={{
                  background: 'rgba(56, 189, 248, 0.08)',
                  border: '1px solid rgba(56, 189, 248, 0.2)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Wallet size={20} color="#38bdf8" />
                  <span style={{ fontSize: '0.88rem' }}>Connect wallet to contribute</span>
                </div>
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ padding: '6px 12px', fontSize: '0.82rem' }}
                  onClick={onOpenConnectModal}
                  id="connect-wallet-in-fund-modal-btn"
                >
                  Connect
                </button>
              </div>
            ) : (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 16,
                  padding: '10px 14px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  fontSize: '0.86rem',
                }}
              >
                <span style={{ color: 'var(--text-dim)' }}>Available Balance:</span>
                <span
                  style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#fbbf24' }}
                  id="modal-available-balance"
                >
                  {balance !== null ? `${balance.toFixed(2)} XLM` : 'Loading...'}
                </span>
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="contribution-amount-input">
                Contribution Amount (XLM) *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="contribution-amount-input"
                  type="number"
                  min="0.1"
                  step="any"
                  className="form-input"
                  placeholder="e.g. 25"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={loading}
                  required
                />
                <span
                  style={{
                    position: 'absolute',
                    right: 14,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: 'var(--text-dim)',
                  }}
                >
                  XLM
                </span>
              </div>
            </div>

            {/* Quick amount selectors */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              {[10, 25, 50, 100].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  className="btn btn-secondary"
                  style={{ flex: 1, padding: '6px 0', fontSize: '0.82rem' }}
                  onClick={() => setAmount(preset.toString())}
                  disabled={loading}
                  id={`preset-${preset}-btn`}
                >
                  +{preset} XLM
                </button>
              ))}
            </div>

            {loading && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '12px',
                  background: 'rgba(56, 189, 248, 0.08)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: 16,
                  fontSize: '0.85rem',
                  color: '#38bdf8',
                }}
                id="fund-loading-indicator"
              >
                <Loader2 size={16} className="spin" />
                <span>{stepStatus}</span>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%' }}
              disabled={loading || !isConnected}
              id="confirm-fund-bounty-btn"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="spin" />
                  <span>Processing Testnet Payment...</span>
                </>
              ) : (
                <>
                  <Coins size={18} />
                  <span>Sign & Fund Bounty</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
