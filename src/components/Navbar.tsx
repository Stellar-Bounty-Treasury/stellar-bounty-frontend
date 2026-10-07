import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { Coins, Copy, Check, LogOut, Wallet, ShieldCheck, Droplet, Play } from 'lucide-react';

interface NavbarProps {
  onOpenConnectModal: () => void;
  onOpenVideoModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenConnectModal, onOpenVideoModal }) => {
  const { isConnected, address, balance, disconnect, fundWithFriendbot, isLoading } = useWallet();
  const [copied, setCopied] = useState(false);

  const shortenAddress = (addr: string) => {
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
  };

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <header className="navbar">
      <div className="brand">
        <div className="brand-icon">
          <Coins size={24} color="#080c14" />
        </div>
        <div>
          <span className="brand-title">Stellar Bounty Treasury</span>
        </div>
        <span
          className="brand-badge"
          style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.2))',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            color: '#34d399',
          }}
        >
          Protocol v1.0 • Verified
        </span>
      </div>

      <div className="navbar-actions">
        {onOpenVideoModal && (
          <button
            className="btn btn-secondary"
            onClick={onOpenVideoModal}
            title="Watch full product video walkthrough"
            id="watch-demo-nav-btn"
            style={{
              padding: '6px 14px',
              fontSize: '0.82rem',
              borderColor: 'rgba(245, 158, 11, 0.4)',
              color: '#fbbf24',
              background: 'rgba(245, 158, 11, 0.08)',
            }}
          >
            <Play size={14} fill="#fbbf24" />
            <span>Watch Demo</span>
          </button>
        )}

        {/* Network Indicator */}
        <div className="pill pill-network" id="network-status-pill">
          <span className="pill-network-dot"></span>
          <span>Stellar Testnet</span>
        </div>

        {isConnected && address ? (
          <>
            {/* XLM Balance */}
            <div className="pill pill-balance" id="xlm-balance-pill" title="Stellar Testnet Balance">
              <span>{balance !== null ? `${balance.toFixed(2)} XLM` : 'Loading...'}</span>
            </div>

            {/* Friendbot Faucet */}
            <button
              className="btn btn-secondary"
              onClick={fundWithFriendbot}
              disabled={isLoading}
              title="Fund this wallet with 10,000 Testnet XLM via Friendbot"
              id="faucet-fund-btn"
              style={{ padding: '6px 12px', fontSize: '0.82rem' }}
            >
              <Droplet size={14} color="#38bdf8" />
              <span>+ Faucet</span>
            </button>

            {/* Connected Address */}
            <div
              className="btn btn-secondary"
              style={{ padding: '6px 14px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}
              id="wallet-address-pill"
            >
              <ShieldCheck size={16} color="#38bdf8" />
              <span>{shortenAddress(address)}</span>
              <button
                className="copy-btn"
                onClick={handleCopy}
                title="Copy full public address"
                id="copy-address-btn"
              >
                {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
              </button>
            </div>

            {/* Disconnect */}
            <button
              className="btn btn-secondary"
              onClick={disconnect}
              title="Disconnect wallet"
              id="disconnect-wallet-btn"
              style={{ padding: '8px' }}
            >
              <LogOut size={16} />
            </button>
          </>
        ) : (
          <button
            className="btn btn-primary"
            onClick={onOpenConnectModal}
            id="connect-wallet-nav-btn"
          >
            <Wallet size={18} />
            <span>Connect Wallet</span>
          </button>
        )}
      </div>
    </header>
  );
};
