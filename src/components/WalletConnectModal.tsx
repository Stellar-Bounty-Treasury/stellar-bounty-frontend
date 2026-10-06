import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { X, Wallet, Key, Sparkles, AlertCircle } from 'lucide-react';

interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WalletConnectModal: React.FC<WalletConnectModalProps> = ({ isOpen, onClose }) => {
  const { connectFreighter, connectTestnetKeypair, isLoading, error } = useWallet();
  const [secretInput, setSecretInput] = useState('');
  const [showSecretInput, setShowSecretInput] = useState(false);

  if (!isOpen) return null;

  const handleFreighter = async () => {
    await connectFreighter();
    onClose();
  };

  const handleGenerateKeypair = async () => {
    await connectTestnetKeypair();
    onClose();
  };

  const handleImportSecret = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!secretInput.trim()) return;
    await connectTestnetKeypair(secretInput.trim());
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose} id="wallet-modal-overlay">
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 440 }}>
        <div className="modal-header">
          <h2 className="modal-title">Connect Stellar Wallet</h2>
          <button className="modal-close" onClick={onClose} id="close-wallet-modal-btn">
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="error-banner">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Freighter Option */}
          <button
            className="glass-panel"
            onClick={handleFreighter}
            disabled={isLoading}
            id="connect-freighter-btn"
            style={{
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              textAlign: 'left',
              width: '100%',
              cursor: 'pointer',
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: 'rgba(56, 189, 248, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Wallet size={24} color="#38bdf8" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: '#fff' }}>Freighter Wallet</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Official Stellar browser extension wallet
              </div>
            </div>
          </button>

          {/* Instant Testnet Account Option */}
          <button
            className="glass-panel"
            onClick={handleGenerateKeypair}
            disabled={isLoading}
            id="connect-instant-testnet-btn"
            style={{
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              textAlign: 'left',
              width: '100%',
              cursor: 'pointer',
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: 'rgba(245, 158, 11, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Sparkles size={24} color="#f59e0b" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: '#fff' }}>Instant Testnet Wallet</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Auto-generates keypair & funds 10,000 XLM via Friendbot
              </div>
            </div>
          </button>

          {/* Import Secret Key Toggle */}
          <div style={{ marginTop: 10 }}>
            {!showSecretInput ? (
              <button
                style={{
                  color: 'var(--text-dim)',
                  fontSize: '0.84rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  margin: '0 auto',
                }}
                onClick={() => setShowSecretInput(true)}
                id="toggle-secret-input-btn"
              >
                <Key size={14} />
                <span>Or import existing Testnet Secret Key</span>
              </button>
            ) : (
              <form onSubmit={handleImportSecret} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <input
                  type="password"
                  placeholder="S... (Stellar Secret Key)"
                  value={secretInput}
                  onChange={(e) => setSecretInput(e.target.value)}
                  className="form-input"
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}
                  id="secret-key-input"
                />
                <button type="submit" className="btn btn-secondary" style={{ width: '100%' }} id="submit-secret-key-btn">
                  Import & Connect
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
