import React from 'react';
import { X, QrCode } from 'lucide-react';
import { CopyButton } from './CopyButton';

interface QrModalProps {
  isOpen: boolean;
  onClose: () => void;
  address: string;
  amountXlm?: number;
}

export const QrModal: React.FC<QrModalProps> = ({ isOpen, onClose, address, amountXlm }) => {
  if (!isOpen) return null;

  const sep7Uri = `web+stellar:pay?destination=${encodeURIComponent(address)}${amountXlm ? `&amount=${amountXlm}` : ''}`;
  const qrSvgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(sep7Uri)}`;

  return (
    <div className="modal-overlay" onClick={onClose} id="qr-modal-overlay">
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 380, textAlign: 'center' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <QrCode size={20} color="#38bdf8" />
            <h2 className="modal-title" style={{ fontSize: '1.1rem' }}>Scan to Pay with Stellar</h2>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
          <div style={{ background: '#fff', padding: 14, borderRadius: 12, display: 'inline-block' }}>
            <img src={qrSvgUrl} alt="Stellar Payment QR Code" width={180} height={180} style={{ display: 'block' }} />
          </div>

          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Compatible with LOBSTR, Solar, and SEP-0007 mobile wallets.
          </div>

          <div className="glass-panel" style={{ padding: '8px 12px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#fff' }}>
              {address.slice(0, 10)}...{address.slice(-8)}
            </span>
            <CopyButton textToCopy={sep7Uri} label="Copy URI" />
          </div>
        </div>
      </div>
    </div>
  );
};
