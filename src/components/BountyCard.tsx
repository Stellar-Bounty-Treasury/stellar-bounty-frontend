import React, { useState } from 'react';
import { Bounty } from '../types';
import { Copy, Check, ArrowUpRight } from 'lucide-react';

interface BountyCardProps {
  bounty: Bounty;
  onFundClick: (bounty: Bounty) => void;
}

export const BountyCard: React.FC<BountyCardProps> = ({ bounty, onFundClick }) => {
  const [copied, setCopied] = useState(false);

  const shortenAddress = (addr: string) => {
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(bounty.creator_address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const percentage = Math.min(
    100,
    Math.round((bounty.funded_amount / (bounty.target_amount || 1)) * 100)
  );

  const isFunded = bounty.status === 'funded' || bounty.funded_amount >= bounty.target_amount;

  return (
    <div className="glass-panel bounty-card" id={`bounty-card-${bounty.id}`}>
      <div>
        <div className="card-header">
          <h3 className="card-title">{bounty.title}</h3>
          <span
            className={`status-badge ${isFunded ? 'status-funded' : 'status-open'}`}
            id={`bounty-status-${bounty.id}`}
          >
            {isFunded ? 'Funded' : 'Open'}
          </span>
        </div>

        <p className="card-desc">{bounty.description}</p>
      </div>

      <div>
        {/* Funding Progress Section */}
        <div className="progress-section">
          <div className="progress-header">
            <div>
              <span className="progress-current" id={`bounty-funded-${bounty.id}`}>
                {bounty.funded_amount} XLM
              </span>
              <span className="progress-target"> / {bounty.target_amount} XLM</span>
            </div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              {percentage}%
            </span>
          </div>
          <div className="progress-bar-bg">
            <div
              className="progress-bar-fill"
              style={{ width: `${percentage}%` }}
              id={`bounty-progress-bar-${bounty.id}`}
            ></div>
          </div>
        </div>

        {/* Footer with Creator & Fund Action */}
        <div className="card-footer">
          <div className="creator-info" title={`Creator: ${bounty.creator_address}`}>
            <span>by</span>
            <span>{shortenAddress(bounty.creator_address)}</span>
            <button
              className="copy-btn"
              onClick={handleCopy}
              title="Copy creator address"
              id={`copy-creator-${bounty.id}`}
            >
              {copied ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
            </button>
          </div>

          <button
            className="btn btn-primary"
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            onClick={() => onFundClick(bounty)}
            disabled={isFunded}
            id={`fund-bounty-btn-${bounty.id}`}
          >
            <span>{isFunded ? 'Completed' : 'Fund Bounty'}</span>
            {!isFunded && <ArrowUpRight size={14} />}
          </button>
        </div>
      </div>
    </div>
  );
};
