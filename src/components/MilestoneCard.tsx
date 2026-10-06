import React, { useState } from 'react';
import { Milestone, Verification } from '../types';
import { useWallet } from '../context/WalletContext';
import { api } from '../services/api';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Lock,
  Unlock,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  Loader2,
  Send,
  AlertCircle,
  Shield,
  Coins,
} from 'lucide-react';

interface MilestoneCardProps {
  milestone: Milestone;
  onUpdate: (updated: Milestone) => void;
  onSubmitClick: (milestone: Milestone) => void;
}

export const MilestoneCard: React.FC<MilestoneCardProps> = ({
  milestone,
  onUpdate,
  onSubmitClick,
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
        return <span className="status-badge" style={{ background: 'rgba(16, 185, 129, 0.25)', color: '#10b981' }}>PAID</span>;
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

  const handleReleasePayment = async () => {
    if (!isThresholdMet || milestone.status === 'paid') return;

    setLoadingAction('release');
    setActionError(null);
    setActionSuccess(null);

    try {
      const res = await api.releaseMilestonePayment(milestone.id, {
        caller_address: address || undefined,
        transaction_hash: `settle-tx-${Date.now()}`,
      });

      onUpdate(res.milestone);
      setActionSuccess(`Payment released! ${milestone.reward_amount} XLM transferred to ${shortenAddress(milestone.recipient_address)}`);
    } catch (err: any) {
      setActionError(err.message || 'Payment release failed.');
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
            to {shortenAddress(milestone.recipient_address)}
          </div>
        </div>
      </div>

      {/* Submission Evidence */}
      {milestone.submission_reference && (
        <div
          style={{
            padding: '8px 12px',
            borderRadius: 8,
            background: 'rgba(56, 189, 248, 0.06)',
            border: '1px solid rgba(56, 189, 248, 0.2)',
            fontSize: '0.8rem',
            marginBottom: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, overflow: 'hidden', textOverflow: 'ellipsis' }}>
            <span style={{ color: 'var(--text-muted)' }}>Deliverable Evidence:</span>
            <a
              href={milestone.submission_reference}
              target="_blank"
              rel="noreferrer"
              style={{ color: '#38bdf8', textDecoration: 'underline', display: 'flex', alignItems: 'center', gap: 4 }}
            >
              <span style={{ maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {milestone.submission_reference}
              </span>
              <ExternalLink size={12} />
            </a>
          </div>
          <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600 }}>SUBMITTED</span>
        </div>
      )}

      {/* Approval Threshold Progress */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 4 }}>
          <span>Community Approvals: {approvalCount} / {threshold} required</span>
          <span>{approvalPercent}%</span>
        </div>
        <div className="progress-bar-bg" style={{ height: 6 }}>
          <div
            className="progress-bar-fill"
            style={{
              width: `${approvalPercent}%`,
              backgroundColor: isThresholdMet ? 'var(--success)' : '#f59e0b',
            }}
          />
        </div>
      </div>

      {/* Feedback Messages */}
      {actionError && (
        <div className="error-banner" style={{ marginBottom: 10, padding: 8, fontSize: '0.8rem' }}>
          <AlertCircle size={14} />
          <span>{actionError}</span>
        </div>
      )}

      {actionSuccess && (
        <div
          className="glass-panel"
          style={{
            marginBottom: 10,
            padding: 8,
            fontSize: '0.8rem',
            background: 'rgba(16, 185, 129, 0.1)',
            borderColor: 'var(--success)',
            color: 'var(--success)',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <CheckCircle2 size={14} />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Conditional Settlement Status Banner */}
      <div
        style={{
          padding: 10,
          borderRadius: 8,
          marginBottom: 12,
          fontSize: '0.82rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: milestone.status === 'paid'
            ? 'rgba(16, 185, 129, 0.1)'
            : isThresholdMet
            ? 'rgba(16, 185, 129, 0.08)'
            : 'rgba(239, 68, 68, 0.08)',
          border: `1px solid ${
            milestone.status === 'paid' || isThresholdMet ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.25)'
          }`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {milestone.status === 'paid' ? (
            <>
              <CheckCircle2 size={16} color="var(--success)" />
              <span style={{ color: 'var(--success)', fontWeight: 600 }}>Payment Settled On-Chain</span>
            </>
          ) : isThresholdMet ? (
            <>
              <Unlock size={16} color="var(--success)" />
              <span style={{ color: 'var(--success)', fontWeight: 600 }}>✓ Verification requirement satisfied</span>
            </>
          ) : (
            <>
              <Lock size={16} color="#ef4444" />
              <span style={{ color: '#ef4444', fontWeight: 600 }}>
                🔒 Payment Locked — {threshold - approvalCount} additional approval required
              </span>
            </>
          )}
        </div>

        {/* Conditional Settlement Action */}
        {milestone.status === 'approved' && isThresholdMet && (
          <button
            className="btn btn-primary"
            style={{ padding: '6px 12px', fontSize: '0.78rem' }}
            onClick={handleReleasePayment}
            disabled={loadingAction === 'release'}
            id={`release-payment-btn-${milestone.id}`}
          >
            {loadingAction === 'release' ? (
              <>
                <Loader2 size={13} className="spinner" />
                <span>Releasing...</span>
              </>
            ) : (
              <>
                <Coins size={13} />
                <span>Release Payment</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
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
      </div>
    </div>
  );
};
