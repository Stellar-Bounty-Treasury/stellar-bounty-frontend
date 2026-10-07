import React from 'react';
import { X, Play, Download, ExternalLink } from 'lucide-react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-container"
        style={{ maxWidth: '900px', width: '95%' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '8px',
                background: 'rgba(245, 158, 11, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Play size={18} color="#fbbf24" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: '#f8fafc' }}>
                Product Walkthrough & Technical Demonstration
              </h2>
              <p style={{ margin: '2px 0 0 0', color: '#94a3b8', fontSize: '0.82rem' }}>
                End-to-end Soroban escrow lifecycle, milestone governance, and multi-recipient settlement
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: 4,
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body" style={{ padding: '20px 24px' }}>
          <div
            style={{
              borderRadius: '12px',
              overflow: 'hidden',
              background: '#020617',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 12px 30px rgba(0, 0, 0, 0.5)',
              position: 'relative',
            }}
          >
            <video
              controls
              autoPlay
              playsInline
              style={{ width: '100%', maxHeight: '520px', display: 'block' }}
              poster="/walkthrough.gif"
            >
              <source src="/walkthrough.mp4" type="video/mp4" />
              <source src="/walkthrough.webm" type="video/webm" />
              Your browser does not support HTML5 video streaming.
            </video>
          </div>

          <div
            style={{
              marginTop: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              background: 'rgba(15, 23, 42, 0.6)',
              padding: '12px 16px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.05)',
            }}
          >
            <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
              <strong>Demonstrated Flow:</strong> Bounty Creation ➔ Treasury Funding ➔ Work Submission ➔ Verification Quorum ➔ Programmable Multi-Recipient Settlement Routing
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <a
                href="/walkthrough.mp4"
                download="stellar-bounty-walkthrough.mp4"
                className="btn btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.8rem', textDecoration: 'none' }}
              >
                <Download size={14} />
                <span>Download MP4</span>
              </a>
              <a
                href="https://stellar.expert/explorer/testnet/contract/CADMWQPCCQP27UHQU4JG3C6V5I3UFNNC4DVOMSK2GUJFA6Q2PNW36S52"
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.8rem', textDecoration: 'none' }}
              >
                <ExternalLink size={14} />
                <span>View Contract</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
