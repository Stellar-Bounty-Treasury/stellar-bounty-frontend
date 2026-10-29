import React from 'react';
import { X, Share2, MessageCircle, Send } from 'lucide-react';
import { CopyButton } from './CopyButton';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  bountyTitle: string;
  bountyId: number;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, bountyTitle, bountyId }) => {
  if (!isOpen) return null;

  const permalink = typeof window !== 'undefined' ? window.location.origin + '?bounty=' + bountyId : 'https://bounties.stellar.org';
  const twitterUrl = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent('Check out this Stellar bounty: ' + bountyTitle + ' #Stellar #Soroban') + '&url=' + encodeURIComponent(permalink);
  const telegramUrl = 'https://t.me/share/url?url=' + encodeURIComponent(permalink) + '&text=' + encodeURIComponent(bountyTitle);

  return (
    <div className="modal-overlay" onClick={onClose} id="share-modal-overlay">
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 400 }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Share2 size={18} color="#38bdf8" />
            <h2 className="modal-title" style={{ fontSize: '1.05rem' }}>Share Bounty</h2>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="glass-panel" style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: 8 }}>
            <span style={{ fontSize: '0.78rem', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 260 }}>
              {permalink}
            </span>
            <CopyButton textToCopy={permalink} label="Copy Link" />
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <a
              href={twitterUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary"
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: '0.82rem', textDecoration: 'none' }}
            >
              <MessageCircle size={14} color="#38bdf8" /> Share on X
            </a>

            <a
              href={telegramUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary"
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: '0.82rem', textDecoration: 'none' }}
            >
              <Send size={14} color="#34d399" /> Telegram
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
