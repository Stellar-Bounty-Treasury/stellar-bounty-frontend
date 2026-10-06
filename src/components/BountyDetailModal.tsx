import React, { useState, useEffect } from 'react';
import { Bounty, Milestone, ContractEvent } from '../types';
import { api } from '../services/api';
import { MilestoneCard } from './MilestoneCard';
import { CreateMilestoneModal } from './CreateMilestoneModal';
import { SubmitMilestoneModal } from './SubmitMilestoneModal';
import { ActivityFeed } from './ActivityFeed';
import {
  X,
  Plus,
  RefreshCw,
  Shield,
  ExternalLink,
  Target,
  Activity,
  Layers,
  Coins,
  Copy,
  Check,
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

  const handleMilestoneCreated = (newMilestone: Milestone) => {
    setMilestones((prev) => [...prev, newMilestone]);
    loadDetails();
  };

  const handleMilestoneUpdated = (updated: Milestone) => {
    setMilestones((prev) =>
      prev.map((m) => (m.id === updated.id ? updated : m))
    );
    loadDetails();
  };

  const handleCopyContract = () => {
    navigator.clipboard.writeText(contractAddress);
    setCopiedContract(true);
    setTimeout(() => setCopiedContract(false), 2000);
  };

  const completedMilestones = milestones.filter((m) => m.status === 'paid').length;
  const totalMilestones = milestones.length;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="glass-panel modal-content"
        style={{ maxWidth: 740, maxHeight: '90vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="modal-header" style={{ alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <span className="status-badge status-open">
                Bounty #{bounty.id}
              </span>
              <span className="pill pill-network" style={{ fontSize: '0.72rem' }}>
                Soroban Escrow
              </span>
            </div>
            <h2 className="modal-title" style={{ fontSize: '1.4rem' }}>{bounty.title}</h2>
          </div>
          <button className="btn-icon" onClick={onClose} id="close-bounty-detail-modal">
            <X size={18} />
          </button>
        </div>

        {/* Contract Info Banner */}
        <div
          style={{
            padding: '10px 14px',
            borderRadius: 8,
            background: 'rgba(56, 189, 248, 0.05)',
            border: '1px solid rgba(56, 189, 248, 0.2)',
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.8rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Shield size={16} color="#38bdf8" />
            <span style={{ color: 'var(--text-muted)' }}>Contract Escrow:</span>
            <span style={{ fontFamily: 'monospace', color: '#38bdf8' }}>
              {contractAddress.slice(0, 8)}...{contractAddress.slice(-8)}
            </span>
            <button
              className="copy-btn"
              onClick={handleCopyContract}
              title="Copy Contract ID"
              style={{ padding: 4 }}
            >
              {copiedContract ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
            </button>
          </div>
          <a
            href={`${CONTRACT_EXPLORER_BASE_URL}/${contractAddress}`}
            target="_blank"
            rel="noreferrer"
            style={{ color: '#38bdf8', display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}
          >
            <span>Explorer</span>
            <ExternalLink size={12} />
          </a>
        </div>

        {/* Bounty Overview */}
        <div style={{ marginBottom: 18 }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: 14 }}>
            {bounty.description}
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: 12,
              padding: 14,
              borderRadius: 8,
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-color)',
            }}
          >
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Target Funding</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{bounty.target_amount} XLM</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Locked in Escrow</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)' }}>
                {bounty.funded_amount} XLM
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Milestone Progress</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--success)' }}>
                {completedMilestones} / {totalMilestones} Complete
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Creator</div>
              <div style={{ fontSize: '0.85rem', fontFamily: 'monospace', marginTop: 4 }}>
                {bounty.creator_address.slice(0, 4)}...{bounty.creator_address.slice(-4)}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation & Controls */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid var(--border-color)',
            marginBottom: 16,
            paddingBottom: 8,
          }}
        >
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              className={`pill ${activeTab === 'milestones' ? 'pill-network' : 'pill-balance'}`}
              style={{ cursor: 'pointer', border: activeTab === 'milestones' ? '1px solid var(--primary)' : undefined }}
              onClick={() => setActiveTab('milestones')}
              id="tab-milestones-btn"
            >
              <Target size={14} style={{ marginRight: 6 }} />
              <span>Milestones ({milestones.length})</span>
            </button>
            <button
              className={`pill ${activeTab === 'activity' ? 'pill-network' : 'pill-balance'}`}
              style={{ cursor: 'pointer', border: activeTab === 'activity' ? '1px solid var(--primary)' : undefined }}
              onClick={() => setActiveTab('activity')}
              id="tab-activity-btn"
            >
              <Activity size={14} style={{ marginRight: 6 }} />
              <span>Activity Feed ({events.length})</span>
            </button>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className="btn btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.78rem' }}
              onClick={handleReconcile}
              disabled={reconciling}
              title="Reconcile indexed database records against authoritative on-chain contract state"
              id="reconcile-bounty-btn"
            >
              <RefreshCw size={13} className={reconciling ? 'spinner' : ''} />
              <span>Reconcile On-Chain</span>
            </button>

            {activeTab === 'milestones' && (
              <button
                className="btn btn-primary"
                style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                onClick={() => setIsCreateMilestoneOpen(true)}
                id="add-milestone-btn"
              >
                <Plus size={14} />
                <span>Add Milestone</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'milestones' ? (
          <div>
            {milestones.length === 0 ? (
              <div
                style={{
                  padding: 30,
                  textAlign: 'center',
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: 8,
                  border: '1px dashed var(--border-color)',
                }}
              >
                <Target size={24} color="var(--text-muted)" style={{ marginBottom: 8 }} />
                <div style={{ fontWeight: 600, marginBottom: 4 }}>No Milestones Defined Yet</div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 14 }}>
                  Break down this bounty into enforceable deliverables with locked XLM rewards.
                </p>
                <button
                  className="btn btn-primary"
                  style={{ padding: '6px 14px', fontSize: '0.82rem' }}
                  onClick={() => setIsCreateMilestoneOpen(true)}
                >
                  <Plus size={14} />
                  <span>Create First Milestone</span>
                </button>
              </div>
            ) : (
              <div>
                {milestones.map((m) => (
                  <MilestoneCard
                    key={m.id}
                    milestone={m}
                    onUpdate={handleMilestoneUpdated}
                    onSubmitClick={(mTarget) => setSelectedMilestoneToSubmit(mTarget)}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <ActivityFeed events={events} loading={loading} />
        )}

        {/* Footer Actions */}
        <div
          style={{
            marginTop: 20,
            paddingTop: 16,
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Contract enforces. Backend observes. Frontend orchestrates.
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
      </div>
    </div>
  );
};
