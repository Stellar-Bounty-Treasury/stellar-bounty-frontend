import React from 'react';
import { X, Award, CheckCircle2, ShieldCheck } from 'lucide-react';
import { formatAddress, formatXlm } from '../utils/formatters';
import { CopyButton } from './CopyButton';

interface ContributorProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  address: string;
  completedCount: number;
  totalEarnedXlm: number;
}

export const ContributorProfileDrawer: React.FC<ContributorProfileDrawerProps> = ({
  isOpen,
  onClose,
  address,
  completedCount,
  totalEarnedXlm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} id="profile-drawer-overlay">
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 420 }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(99, 102, 241, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Award size={22} color="#818cf8" />
            </div>
            <div>
              <h2 className="modal-title" style={{ fontSize: '1.05rem' }}>Contributor Reputation</h2>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>On-chain Stellar track record</div>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="glass-panel" style={{ padding: '12px 14px', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: '#fff' }}>{formatAddress(address, 10, 8)}</span>
            <CopyButton textToCopy={address} label="Copy" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div className="glass-panel" style={{ padding: '12px 14px', borderRadius: 8 }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Milestones Completed</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#38bdf8', marginTop: 4 }}>{completedCount}</div>
            </div>

            <div className="glass-panel" style={{ padding: '12px 14px', borderRadius: 8 }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Earnings</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#34d399', marginTop: 4 }}>{formatXlm(totalEarnedXlm)} XLM</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: '#34d399', marginTop: 4 }}>
            <ShieldCheck size={16} /> Verified Stellar Testnet Keyholder
          </div>
        </div>
      </div>
    </div>
  );
};
