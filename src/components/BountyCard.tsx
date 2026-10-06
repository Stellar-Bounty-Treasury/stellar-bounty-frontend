import React, { useState } from 'react';
import { Bounty } from '../types';
import { Copy, Check, ArrowUpRight, Target, ShieldCheck, ChevronRight } from 'lucide-react';

interface BountyCardProps {
  bounty: Bounty;
  onFundClick: (bounty: Bounty) => void;
  onViewDetailsClick: (bounty: Bounty) => void;
}

export const BountyCard: React.FC<BountyCardProps> = ({
  bounty,
  onFundClick,
  onViewDetailsClick,
}) => {
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
  const milestones = bounty.milestones || [];
  const completedMilestones = milestones.filter((m) => m.status === 'paid').length;
  const totalMilestones = milestones.length;

  return (
    <div
      className="glass-panel bounty-card"
      id={`bounty-card-${bounty.id}`}
      style={{ cursor: 'pointer' }}
      onClick={() => onViewDetailsClick(bounty)}
    >
      <div>
        <div className="card-header">
          <div>
            <h3 className="card-title">{bounty.title}</h3>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 4 }}>
              <span className="pill pill-network" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
                Soroban Escrow
              </span>
            </div>
          </div>
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

        {/* Milestone Indicator */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 10px',
            marginBottom: 12,
            borderRadius: 6,
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-color)',
            fontSize: '0.78rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)' }}>
            <Target size={13} color="#38bdf8" />
            <span>Milestone Progress:</span>
          </div>
          <span style={{ fontWeight: 600, color: totalMilestones > 0 ? '#38bdf8' : 'var(--text-muted)' }}>
            {totalMilestones > 0 ? `${completedMilestones} / ${totalMilestones} complete` : 'No milestones yet'}
          </span>
        </div>

        {/* Footer with Creator & Actions */}
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

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className="btn btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.8rem' }}
              onClick={(e) => {
                e.stopPropagation();
                onViewDetailsClick(bounty);
              }}
              id={`view-bounty-btn-${bounty.id}`}
            >
              <span>Details</span>
              <ChevronRight size={13} />
            </button>

            <button
              className="btn btn-primary"
              style={{ padding: '6px 14px', fontSize: '0.8rem' }}
              onClick={(e) => {
                e.stopPropagation();
                onFundClick(bounty);
              }}
              disabled={isFunded}
              id={`fund-bounty-btn-${bounty.id}`}
            >
              <span>{isFunded ? 'Funded' : 'Fund'}</span>
              {!isFunded && <ArrowUpRight size={13} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
