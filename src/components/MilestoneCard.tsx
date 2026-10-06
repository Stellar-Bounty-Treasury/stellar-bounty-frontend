import React, { useState } from 'react';
import { Milestone } from '../types';
import { useWallet } from '../context/WalletContext';
import { api } from '../services/api';
import {
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  Loader2,
  Send,
  Coins,
} from 'lucide-react';
import { SettlementFlowVisualizer } from './SettlementFlowVisualizer';

interface MilestoneCardProps {
  milestone: Milestone;
  onUpdate: (updated: Milestone) => void;
  onSubmitClick: (milestone: Milestone) => void;
  onConfigureRouterClick?: (milestone: Milestone) => void;
  onPreviewSettlementClick?: (milestone: Milestone) => void;
}

export const MilestoneCard: React.FC<MilestoneCardProps> = ({
  milestone,
  onUpdate,
  onSubmitClick,
  onConfigureRouterClick,
  onPreviewSettlementClick,
}) => {
  const { isConnected, address } = useWallet();
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const approvalCount = milestone.approvals || 0;
  const threshold = milestone.approval_threshold || 1;
  const approvalPercent = Math.min(100, Math.round((approvalCount / threshold) * 100));
  const isThresholdMet = approvalCount >= threshold;

  const shortenAddress = (addr: string) => {
    if (!addr || addr.length < 8) return addr;
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
  };

  const getStatusBadge = () => {
    switch (milestone.status) {
      case 'pending':
        return <span className="status-badge" style={{ background: 'rgba(148, 163, 184, 0.2)', color: '#94a3b8' }}>PENDING</span>;
      case 'submitted':
        return <span className="status-badge" style={{ background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8' }}>SUBMITTED</span>;
      case 'under_review':
        return <span className="status-badge" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b' }}>UNDER REVIEW</span>;
      case 'approved':
        return <span className="status-badge status-funded">APPROVED</span>;
      case 'paid':
        return <span className="status-badge" style={{ background: 'rgba(16, 185, 129, 0.25)', color: '#10b981' }}>PAID & SETTLED</span>;
      case 'rejected':
        return <span className="status-badge" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' }}>REJECTED</span>;
      default:
        return <span className="status-badge">{milestone.status}</span>;
    }
  };

  const handleVote = async (decision: 'approve' | 'reject') => {
    if (!isConnected || !address) {
      setActionError('Please connect your Stellar wallet to vote.');
      return;
    }

    setLoadingAction(`vote-${decision}`);
    setActionError(null);
    setActionSuccess(null);

    try {
      const res = await api.verifyMilestone(milestone.id, {
        reviewer_address: address,
        decision,
        transaction_hash: `vote-tx-${Date.now()}`,
      });

      onUpdate(res.milestone);
      setActionSuccess(`Vote recorded: ${decision.toUpperCase()} by ${shortenAddress(address)}`);
    } catch (err: any) {
      setActionError(err.message || 'Verification voting failed.');
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div
      className="glass-panel"
      style={{
        padding: 16,
        marginBottom: 14,
        borderRadius: 12,
        border: '1px solid var(--border-color)',
        background: 'rgba(255, 255, 255, 0.02)',
      }}
      id={`milestone-card-${milestone.id}`}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#38bdf8' }}>
              Milestone #{milestone.contract_milestone_id}
            </span>
            {getStatusBadge()}
            {milestone.settlement && (
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '10px',
                  background: 'rgba(245, 158, 11, 0.15)',
                  border: '1px solid rgba(245, 158, 11, 0.4)',
                  color: '#fbbf24',
                }}
              >
                🔀 Router: {milestone.settlement.recipients.length} Recipients
              </span>
            )}
          </div>
          <p style={{ marginTop: 6, fontSize: '0.88rem', color: 'var(--text-main)' }}>
            {milestone.description}
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--success)' }}>
            {milestone.reward_amount} XLM
          </span>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Designated: {shortenAddress(milestone.recipient_address)}
          </div>
        </div>
      </div>

      {actionError && (
        <div style={{ padding: '6px 10px', borderRadius: 6, background: 'rgba(239, 68, 68, 0.15)', color: '#fca5a5', fontSize: '0.78rem', marginBottom: 8 }}>
          {actionError}
        </div>
      )}
      {actionSuccess && (
        <div style={{ padding: '6px 10px', borderRadius: 6, background: 'rgba(16, 185, 129, 0.15)', color: '#86efac', fontSize: '0.78rem', marginBottom: 8 }}>
          {actionSuccess}
        </div>
      )}

      {/* Deliverable Evidence */}
      {milestone.submission_reference && milestone.submission_reference !== 'none' && (
        <div
          style={{
            padding: '8px 12px',
            marginBottom: 10,
            borderRadius: 8,
            background: 'rgba(0, 0, 0, 0.25)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            fontSize: '0.8rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ color: 'var(--text-muted)' }}>Deliverable Evidence:</span>
          {milestone.submission_reference.startsWith('http') ? (
            <a
              href={milestone.submission_reference}
              target="_blank"
              rel="noreferrer"
              style={{ color: '#38bdf8', display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none', fontWeight: 600 }}
            >
              <span>View GitHub Deliverable</span>
              <ExternalLink size={12} />
            </a>
          ) : (
            <span style={{ fontFamily: 'monospace', color: '#e2e8f0' }}>{milestone.submission_reference}</span>
          )}
        </div>
      )}

      {/* Verification Voting Progress Bar */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>
          <span>Verification Threshold ({approvalCount} / {threshold} Approvals)</span>
          <span style={{ fontWeight: 600, color: isThresholdMet ? 'var(--success)' : '#f59e0b' }}>
            {approvalPercent}% {isThresholdMet ? '• Quorum Reached' : ''}
          </span>
        </div>
        <div style={{ height: 6, borderRadius: 3, background: 'rgba(255, 255, 255, 0.08)', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${approvalPercent}%`,
              background: isThresholdMet ? 'linear-gradient(90deg, #10b981, #059669)' : 'linear-gradient(90deg, #f59e0b, #d97706)',
              borderRadius: 3,
              transition: 'width 0.4s ease',
            }}
          />
        </div>
      </div>

      {/* Embedded Settlement Flow Visualizer */}
      {milestone.settlement && <SettlementFlowVisualizer settlement={milestone.settlement} />}

      {/* Actions Bar */}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', flexWrap: 'wrap', marginTop: 12 }}>
        {/* Configure Settlement Router Button */}
        {milestone.status !== 'paid' && onConfigureRouterClick && (
          <button
            className="btn btn-secondary"
            style={{ padding: '6px 12px', fontSize: '0.78rem', borderColor: 'rgba(245, 158, 11, 0.4)', color: '#fbbf24' }}
            onClick={() => onConfigureRouterClick(milestone)}
            id={`configure-router-btn-${milestone.id}`}
          >
            🔀 Configure Router
          </button>
        )}

        {/* Submit Deliverable */}
        {milestone.status === 'pending' && (
          <button
            className="btn btn-primary"
            style={{ padding: '6px 14px', fontSize: '0.8rem' }}
            onClick={() => onSubmitClick(milestone)}
            id={`submit-deliverable-btn-${milestone.id}`}
          >
            <Send size={13} />
            <span>Submit Deliverable</span>
          </button>
        )}

        {/* Community Verification Voting */}
        {(milestone.status === 'submitted' || milestone.status === 'under_review') && (
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className="btn btn-secondary"
              style={{
                padding: '6px 12px',
                fontSize: '0.8rem',
                borderColor: 'rgba(16, 185, 129, 0.4)',
                color: 'var(--success)',
              }}
              onClick={() => handleVote('approve')}
              disabled={loadingAction !== null}
              id={`vote-approve-btn-${milestone.id}`}
            >
              {loadingAction === 'vote-approve' ? (
                <Loader2 size={13} className="spinner" />
              ) : (
                <ThumbsUp size={13} />
              )}
              <span>Approve</span>
            </button>
            <button
              className="btn btn-secondary"
              style={{
                padding: '6px 12px',
                fontSize: '0.8rem',
                borderColor: 'rgba(239, 68, 68, 0.4)',
                color: '#ef4444',
              }}
              onClick={() => handleVote('reject')}
              disabled={loadingAction !== null}
              id={`vote-reject-btn-${milestone.id}`}
            >
              {loadingAction === 'vote-reject' ? (
                <Loader2 size={13} className="spinner" />
              ) : (
                <ThumbsDown size={13} />
              )}
              <span>Reject</span>
            </button>
          </div>
        )}

        {/* Preview & Execute Settlement (when approved) */}
        {milestone.status === 'approved' && onPreviewSettlementClick && (
          <button
            className="btn btn-primary"
            style={{
              padding: '6px 14px',
              fontSize: '0.8rem',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              border: 'none',
              boxShadow: '0 0 10px rgba(16, 185, 129, 0.4)',
            }}
            onClick={() => onPreviewSettlementClick(milestone)}
            id={`settlement-preview-btn-${milestone.id}`}
          >
            <Coins size={14} />
            <span>Preview & Execute Settlement</span>
          </button>
        )}
      </div>
    </div>
  );
};
