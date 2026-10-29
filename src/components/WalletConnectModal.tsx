import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { X, Wallet, Key, Globe, Shield, AlertCircle, ExternalLink } from 'lucide-react';

interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WalletConnectModal: React.FC<WalletConnectModalProps> = ({ isOpen, onClose }) => {
  const { connectFreighter, connectAlbedo, connectXbull, connectTestnetKeypair, isLoading, error } = useWallet();
  const [secretInput, setSecretInput] = useState('');
  const [showSecretInput, setShowSecretInput] = useState(false);

  if (!isOpen) return null;

  const handleFreighter = async () => {
    await connectFreighter();
    onClose();
  };

  const handleAlbedo = async () => {
    await connectAlbedo();
    onClose();
  };

  const handleXbull = async () => {
    await connectXbull();
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
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 460 }}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Connect Stellar Wallet</h2>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>
              Choose your preferred Stellar wallet provider
            </div>
          </div>
          <button className="modal-close" onClick={onClose} id="close-wallet-modal-btn">
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="error-banner" style={{ marginTop: 12 }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
          {/* Freighter */}
          <button
            className="glass-panel"
            onClick={handleFreighter}
            disabled={isLoading}
            id="connect-freighter-btn"
            style={{
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              textAlign: 'left',
              width: '100%',
              cursor: 'pointer',
              border: '1px solid var(--border-color)',
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 10,
                background: 'rgba(56, 189, 248, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Wallet size={22} color="#38bdf8" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>Freighter Wallet</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Official Stellar browser extension</div>
            </div>
            <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: 999, background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8' }}>Popular</span>
          </button>

          {/* Albedo */}
          <button
            className="glass-panel"
            onClick={handleAlbedo}
            disabled={isLoading}
            id="connect-albedo-btn"
            style={{
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              textAlign: 'left',
              width: '100%',
              cursor: 'pointer',
              border: '1px solid var(--border-color)',
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 10,
                background: 'rgba(168, 85, 247, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Globe size={22} color="#c084fc" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>Albedo Web Wallet</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Secure browser & mobile popup authorization</div>
            </div>
            <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: 999, background: 'rgba(168, 85, 247, 0.2)', color: '#c084fc' }}>Web</span>
          </button>

          {/* xBull */}
          <button
            className="glass-panel"
            onClick={handleXbull}
            disabled={isLoading}
            id="connect-xbull-btn"
            style={{
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              textAlign: 'left',
              width: '100%',
              cursor: 'pointer',
              border: '1px solid var(--border-color)',
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 10,
                background: 'rgba(34, 197, 94, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Shield size={22} color="#4ade80" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>xBull Wallet</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Multi-platform wallet extension & PWA</div>
            </div>
            <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: 999, background: 'rgba(34, 197, 94, 0.2)', color: '#4ade80' }}>Desktop</span>
          </button>

          {/* Testnet Dev Keypair */}
          <button
            className="glass-panel"
            onClick={handleGenerateKeypair}
            disabled={isLoading}
            id="connect-instant-testnet-btn"
            style={{
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              textAlign: 'left',
              width: '100%',
              cursor: 'pointer',
              border: '1px solid var(--border-color)',
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 10,
                background: 'rgba(234, 179, 8, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Key size={22} color="#facc15" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>Instant Testnet Account</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Auto-generate & fund 10,000 XLM via Friendbot</div>
            </div>
            <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: 999, background: 'rgba(234, 179, 8, 0.2)', color: '#facc15' }}>Dev Faucet</span>
          </button>
        </div>

        {/* Manual Secret Key Import Toggle */}
        <div style={{ marginTop: 14, textAlign: 'center' }}>
          <button
            type="button"
            onClick={() => setShowSecretInput(!showSecretInput)}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.82rem', cursor: 'pointer', textDecoration: 'underline' }}
          >
            {showSecretInput ? 'Hide Secret Key Import' : 'Or import existing Testnet Secret Key (S...)'}
          </button>
        </div>

        {showSecretInput && (
          <form onSubmit={handleImportSecret} style={{ marginTop: 10, display: 'flex', gap: 8 }}>
            <input
              type="password"
              placeholder="SXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
              value={secretInput}
              onChange={(e) => setSecretInput(e.target.value)}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: 6,
                border: '1px solid var(--border-color)',
                background: 'rgba(0,0,0,0.3)',
                color: '#fff',
                fontSize: '0.8rem',
              }}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '8px 14px', fontSize: '0.8rem' }}>
              Import
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
