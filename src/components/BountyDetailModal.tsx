import React, { useState, useEffect } from 'react';
import { Bounty, Milestone, ContractEvent } from '../types';
import { api } from '../services/api';
import { MilestoneCard } from './MilestoneCard';
import { CreateMilestoneModal } from './CreateMilestoneModal';
import { SubmitMilestoneModal } from './SubmitMilestoneModal';
import { SettlementBuilderModal } from './SettlementBuilderModal';
import { SettlementPreviewModal } from './SettlementPreviewModal';
import { ActivityFeed } from './ActivityFeed';
import {
  X,
  Plus,
  RefreshCw,
  ExternalLink,
  Target,
  Activity,
  Layers,
  Coins,
  Copy,
  Check,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import { CONTRACT_EXPLORER_BASE_URL, SOROBAN_CONTRACT_ID } from '../services/stellar';

interface BountyDetailModalProps {
  bounty: Bounty | null;
  isOpen: boolean;
  onClose: () => void;
  onBountyUpdated: (updated: Bounty) => void;
  onFundClick: (bounty: Bounty) => void;
}

export const BountyDetailModal: React.FC<BountyDetailModalProps> = ({
  bounty,
  isOpen,
  onClose,
  onBountyUpdated,
  onFundClick,
}) => {
  const [activeTab, setActiveTab] = useState<'milestones' | 'activity'>('milestones');
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [events, setEvents] = useState<ContractEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [reconciling, setReconciling] = useState(false);
  const [copiedContract, setCopiedContract] = useState(false);

  // Sub-modals
  const [isCreateMilestoneOpen, setIsCreateMilestoneOpen] = useState(false);
  const [selectedMilestoneToSubmit, setSelectedMilestoneToSubmit] = useState<Milestone | null>(null);
  const [selectedMilestoneToConfigureRouter, setSelectedMilestoneToConfigureRouter] = useState<Milestone | null>(null);
  const [selectedMilestoneToPreviewSettlement, setSelectedMilestoneToPreviewSettlement] = useState<Milestone | null>(null);

  const contractAddress = bounty?.contract_id || SOROBAN_CONTRACT_ID;

  const loadDetails = async () => {
    if (!bounty) return;
    setLoading(true);
    try {
      const detailed = await api.getBounty(bounty.id);
      setMilestones(detailed.milestones || []);
      setEvents(detailed.events || []);
      onBountyUpdated(detailed);
    } catch (err) {
      console.error('Failed to load bounty details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && bounty) {
      loadDetails();
    }
  }, [isOpen, bounty?.id]);

  if (!isOpen || !bounty) return null;

  const handleReconcile = async () => {
    setReconciling(true);
    try {
      await api.reconcileBounty(bounty.id);
      await loadDetails();
    } catch (err) {
      console.error('Reconciliation failed:', err);
    } finally {
      setReconciling(false);
    }
  };

  const handleCopyContract = () => {
    navigator.clipboard.writeText(contractAddress);
    setCopiedContract(true);
    setTimeout(() => setCopiedContract(false), 2000);
  };

  const handleMilestoneCreated = (newMilestone: Milestone) => {
    setMilestones([...milestones, newMilestone]);
    loadDetails();
  };

  const handleMilestoneUpdated = (updated: Milestone) => {
    setMilestones(milestones.map((m) => (m.id === updated.id ? updated : m)));
    loadDetails();
  };

  const handleCompleteBounty = async () => {
    try {
      const completed = await api.completeBounty(bounty.id);
      onBountyUpdated(completed);
      loadDetails();
    } catch (err: any) {
      alert(err.message || 'Failed to complete bounty');
    }
  };

  const handleRefundBounty = async () => {
    if (!confirm('Are you sure you want to refund this bounty? Remaining escrow funds will be returned.')) return;
    try {
      const refunded = await api.refundBounty(bounty.id);
      onBountyUpdated(refunded);
      loadDetails();
    } catch (err: any) {
      alert(err.message || 'Failed to refund bounty');
    }
  };

  const allMilestonesPaid = milestones.length > 0 && milestones.every((m) => m.status === 'paid');
  const canRefund = bounty.status !== 'completed' && bounty.status !== 'cancelled' && bounty.funded_amount > 0;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 900,
        padding: '1rem',
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: 850,
          maxHeight: '92vh',
          overflowY: 'auto',
          padding: '2rem',
          borderRadius: 20,
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.95))',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.75)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span
                style={{
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: '#fff',
                  padding: '3px 8px',
                  borderRadius: 12,
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                }}
              >
                LEVEL 3 TREASURY
              </span>
              <span className={`status-badge status-${bounty.status}`}>
                {bounty.status.toUpperCase()}
              </span>
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginTop: 8, color: '#f8fafc' }}>
              {bounty.title}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: 4 }}>
              {bounty.description}
            </p>
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

        {/* Contract & Escrow Card */}
        <div
          style={{
            padding: '14px 16px',
            marginBottom: 20,
            borderRadius: 12,
            background: 'rgba(0, 0, 0, 0.35)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>
              Soroban Escrow Vault
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
              <span style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: '#e2e8f0' }}>
                {contractAddress.substring(0, 10)}...{contractAddress.substring(contractAddress.length - 8)}
              </span>
              <button
                onClick={handleCopyContract}
                style={{
                  background: 'none',
                  border: 'none',
                  color: copiedContract ? '#10b981' : '#94a3b8',
                  cursor: 'pointer',
                  padding: 2,
                }}
              >
                {copiedContract ? <Check size={14} /> : <Copy size={14} />}
              </button>
              <a
                href={`${CONTRACT_EXPLORER_BASE_URL}/${contractAddress}`}
                target="_blank"
                rel="noreferrer"
                style={{ color: '#38bdf8', display: 'flex', alignItems: 'center', textDecoration: 'none' }}
              >
                <ExternalLink size={14} />
              </a>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>
              Escrow Balance / Target
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', marginTop: 2 }}>
              <span style={{ color: '#fbbf24' }}>{bounty.funded_amount}</span> / {bounty.target_amount} XLM
            </div>
          </div>
        </div>

        {/* Tabs & Controls */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
            borderBottom: '1px solid var(--border-color)',
            paddingBottom: 8,
          }}
        >
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              style={{
                background: 'none',
                border: 'none',
                padding: '6px 12px',
                fontSize: '0.88rem',
                fontWeight: 600,
                color: activeTab === 'milestones' ? '#38bdf8' : '#94a3b8',
                borderBottom: activeTab === 'milestones' ? '2px solid #38bdf8' : 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
              onClick={() => setActiveTab('milestones')}
            >
              <Layers size={14} />
              <span>Milestones ({milestones.length})</span>
            </button>
            <button
              style={{
                background: 'none',
                border: 'none',
                padding: '6px 12px',
                fontSize: '0.88rem',
                fontWeight: 600,
                color: activeTab === 'activity' ? '#38bdf8' : '#94a3b8',
                borderBottom: activeTab === 'activity' ? '2px solid #38bdf8' : 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
              onClick={() => setActiveTab('activity')}
            >
              <Activity size={14} />
              <span>Live Events ({events.length})</span>
            </button>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className="btn btn-secondary"
              style={{ padding: '6px 10px', fontSize: '0.78rem' }}
              onClick={handleReconcile}
              disabled={reconciling}
              title="Reconcile contract state"
            >
              <RefreshCw size={13} className={reconciling ? 'spinner' : ''} />
              <span>Reconcile</span>
            </button>
            {activeTab === 'milestones' && bounty.status !== 'completed' && (
              <button
                className="btn btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                onClick={() => setIsCreateMilestoneOpen(true)}
                id="add-milestone-btn"
              >
                <Plus size={13} />
                <span>Add Milestone</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'milestones' ? (
          <div>
            {milestones.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--text-muted)' }}>
                <Target size={36} style={{ margin: '0 auto 10px', opacity: 0.5 }} />
                <p style={{ margin: 0 }}>No milestones created for this bounty yet.</p>
              </div>
            ) : (
              <div>
                {milestones.map((m) => (
                  <MilestoneCard
                    key={m.id}
                    milestone={m}
                    onUpdate={handleMilestoneUpdated}
                    onSubmitClick={(mTarget) => setSelectedMilestoneToSubmit(mTarget)}
                    onConfigureRouterClick={(mTarget) => setSelectedMilestoneToConfigureRouter(mTarget)}
                    onPreviewSettlementClick={(mTarget) => setSelectedMilestoneToPreviewSettlement(mTarget)}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <ActivityFeed events={events} loading={loading} />
        )}

        {/* Level 3 Completion & Refund Actions */}
        <div
          style={{
            marginTop: 20,
            paddingTop: 16,
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 10,
          }}
        >
          <div style={{ display: 'flex', gap: 8 }}>
            {allMilestonesPaid && bounty.status !== 'completed' && (
              <button
                className="btn btn-primary"
                style={{ background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', padding: '8px 14px', fontSize: '0.82rem' }}
                onClick={handleCompleteBounty}
                id="complete-bounty-btn"
              >
                <CheckCircle2 size={14} />
                <span>Mark Bounty Completed</span>
              </button>
            )}

            {canRefund && (
              <button
                className="btn btn-secondary"
                style={{ borderColor: 'rgba(239, 68, 68, 0.4)', color: '#f87171', padding: '8px 14px', fontSize: '0.82rem' }}
                onClick={handleRefundBounty}
                id="refund-bounty-btn"
              >
                <RotateCcw size={14} />
                <span>Refund Unspent Escrow</span>
              </button>
            )}
          </div>

          <button
            className="btn btn-primary"
            onClick={() => onFundClick(bounty)}
            id="detail-fund-bounty-btn"
          >
            <Coins size={15} />
            <span>Fund Bounty Escrow</span>
          </button>
        </div>

        {/* Sub Modals */}
        <CreateMilestoneModal
          bountyId={bounty.id}
          isOpen={isCreateMilestoneOpen}
          onClose={() => setIsCreateMilestoneOpen(false)}
          onMilestoneCreated={handleMilestoneCreated}
        />

        <SubmitMilestoneModal
          milestone={selectedMilestoneToSubmit}
          isOpen={!!selectedMilestoneToSubmit}
          onClose={() => setSelectedMilestoneToSubmit(null)}
          onMilestoneSubmitted={handleMilestoneUpdated}
        />

        {selectedMilestoneToConfigureRouter && (
          <SettlementBuilderModal
            bountyId={bounty.id}
            milestone={selectedMilestoneToConfigureRouter}
            isOpen={!!selectedMilestoneToConfigureRouter}
            onClose={() => setSelectedMilestoneToConfigureRouter(null)}
            onSuccess={loadDetails}
          />
        )}

        {selectedMilestoneToPreviewSettlement && (
          <SettlementPreviewModal
            milestone={selectedMilestoneToPreviewSettlement}
            settlement={selectedMilestoneToPreviewSettlement.settlement}
            isOpen={!!selectedMilestoneToPreviewSettlement}
            onClose={() => setSelectedMilestoneToPreviewSettlement(null)}
            onSuccess={loadDetails}
          />
        )}
      </div>
    </div>
  );
};
