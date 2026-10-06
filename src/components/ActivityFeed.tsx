import React from 'react';
import { ContractEvent } from '../types';
import { EXPLORER_BASE_URL } from '../services/stellar';
import {
  Activity,
  Coins,
  Send,
  CheckCircle2,
  XCircle,
  ExternalLink,
  PlusCircle,
  Zap,
} from 'lucide-react';

interface ActivityFeedProps {
  events: ContractEvent[];
  loading?: boolean;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ events, loading }) => {
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'bounty_created':
        return <PlusCircle size={15} color="#38bdf8" />;
      case 'bounty_funded':
        return <Coins size={15} color="#10b981" />;
      case 'milestone_submitted':
        return <Send size={15} color="#f59e0b" />;
      case 'milestone_approved':
        return <CheckCircle2 size={15} color="#10b981" />;
      case 'milestone_paid':
        return <Zap size={15} color="#8b5cf6" />;
      case 'milestone_rejected':
        return <XCircle size={15} color="#ef4444" />;
      default:
        return <Activity size={15} color="#94a3b8" />;
    }
  };

  const formatEventDescription = (evt: ContractEvent) => {
    const p = evt.payload || {};
    switch (evt.event_type) {
      case 'bounty_created':
        return `Bounty created by ${p.creator ? `${p.creator.slice(0, 4)}...${p.creator.slice(-4)}` : 'Creator'}`;
      case 'bounty_funded':
        return `Bounty funded with +${p.amount || ''} XLM`;
      case 'milestone_submitted':
        return `Milestone #${evt.milestone_id} deliverable submitted`;
      case 'milestone_approved':
        return `Milestone #${evt.milestone_id} reached approval threshold and was approved`;
      case 'milestone_paid':
        return `Milestone #${evt.milestone_id} payment released to contributor`;
      case 'milestone_rejected':
        return `Milestone #${evt.milestone_id} was rejected during review`;
      default:
        return `Contract Event: ${evt.event_type}`;
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '20px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        Loading on-chain events...
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div
        style={{
          padding: '24px 16px',
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontSize: '0.85rem',
          background: 'rgba(255, 255, 255, 0.02)',
          borderRadius: 8,
          border: '1px dashed var(--border-color)',
        }}
      >
        No contract events recorded yet.
      </div>
    );
  }

  return (
    <div className="activity-feed" id="activity-feed-list">
      {events.map((evt) => (
        <div
          key={evt.id}
          className="glass-panel"
          style={{
            padding: '10px 14px',
            marginBottom: 8,
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.83rem',
            background: 'rgba(255, 255, 255, 0.02)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                padding: 6,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {getEventIcon(evt.event_type)}
            </div>
            <div>
              <div style={{ fontWeight: 500, color: 'var(--text-main)' }}>
                {formatEventDescription(evt)}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                {new Date(evt.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                {evt.ledger ? ` • Ledger #${evt.ledger}` : ''}
              </div>
            </div>
          </div>

          {evt.transaction_hash && (
            <a
              href={`${EXPLORER_BASE_URL}/${evt.transaction_hash}`}
              target="_blank"
              rel="noreferrer"
              style={{
                color: '#38bdf8',
                fontSize: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
              title="View on Stellar Expert"
            >
              <span>{evt.transaction_hash.slice(0, 6)}...</span>
              <ExternalLink size={12} />
            </a>
          )}
        </div>
      ))}
    </div>
  );
};
