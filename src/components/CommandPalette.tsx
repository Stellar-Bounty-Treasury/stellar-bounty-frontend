import React, { useState } from 'react';
import { X, Search, Sparkles, Plus, Wallet, FileText, ExternalLink } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateBounty: () => void;
  onConnectWallet: () => void;
  onViewAudit: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onCreateBounty,
  onConnectWallet,
  onViewAudit,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const actions = [
    { label: 'Create New Bounty', icon: <Plus size={16} color="#38bdf8" />, action: () => { onCreateBounty(); onClose(); } },
    { label: 'Connect Stellar Wallet', icon: <Wallet size={16} color="#34d399" />, action: () => { onConnectWallet(); onClose(); } },
    { label: 'View Audit Trail', icon: <FileText size={16} color="#c084fc" />, action: () => { onViewAudit(); onClose(); } },
    { label: 'Open Stellar Expert Testnet', icon: <ExternalLink size={16} color="#facc15" />, action: () => { window.open('https://stellar.expert/explorer/testnet', '_blank'); onClose(); } },
  ];

  const filtered = actions.filter((a) => a.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="modal-overlay" onClick={onClose} id="command-palette-overlay">
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 460, padding: 0, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <Search size={18} color="var(--text-muted)" style={{ marginRight: 10 }} />
          <input
            type="text"
            placeholder="Type a command or action... (ESC to exit)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            style={{
              width: '100%',
              background: 'none',
              border: 'none',
              color: '#fff',
              fontSize: '0.95rem',
              outline: 'none',
            }}
          />
        </div>

        <div style={{ padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {filtered.map((item, idx) => (
            <button
              key={idx}
              onClick={item.action}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 14px',
                borderRadius: 8,
                background: 'none',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '0.88rem',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
