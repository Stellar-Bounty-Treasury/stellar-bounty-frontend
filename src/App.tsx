import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { BountyCard } from './components/BountyCard';
import { CreateBountyModal } from './components/CreateBountyModal';
import { FundBountyModal } from './components/FundBountyModal';
import { BountyDetailModal } from './components/BountyDetailModal';
import { WalletConnectModal } from './components/WalletConnectModal';
import { useWallet } from './context/WalletContext';
import { api } from './services/api';
import { Bounty } from './types';
import { Plus, Search, Sparkles, AlertCircle, RefreshCw, Shield, Target } from 'lucide-react';
import { SOROBAN_CONTRACT_ID, CONTRACT_EXPLORER_BASE_URL } from './services/stellar';

export const App: React.FC = () => {
  const { isConnected } = useWallet();
  const [bounties, setBounties] = useState<Bounty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modals state
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedBountyToFund, setSelectedBountyToFund] = useState<Bounty | null>(null);
  const [selectedBountyForDetail, setSelectedBountyForDetail] = useState<Bounty | null>(null);

  // Filtering & search
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'funded'>('all');

  const loadBounties = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getBounties();
      setBounties(data);
    } catch (err: any) {
      console.error('Failed to load bounties:', err);
      setError(err.message || 'Unable to connect to backend service.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBounties();
  }, []);

  const handleBountyCreated = (newBounty: Bounty) => {
    setBounties((prev) => [newBounty, ...prev]);
    setSelectedBountyForDetail(newBounty);
  };

  const handleBountyUpdated = (updatedBounty: Bounty) => {
    setBounties((prev) =>
      prev.map((b) => (b.id === updatedBounty.id ? { ...b, ...updatedBounty } : b))
    );
    if (selectedBountyForDetail?.id === updatedBounty.id) {
      setSelectedBountyForDetail(updatedBounty);
    }
  };

  // Stats
  const totalFunded = bounties.reduce((sum, b) => sum + (b.funded_amount || 0), 0);
  const openBountiesCount = bounties.filter((b) => b.status === 'open').length;
  const totalMilestonesCount = bounties.reduce((sum, b) => sum + (b.milestones?.length || 0), 0);

  // Filtered bounties
  const filteredBounties = bounties.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterStatus === 'all'
        ? true
        : filterStatus === 'funded'
        ? b.status === 'funded' || b.funded_amount >= b.target_amount
        : b.status === 'open' && b.funded_amount < b.target_amount;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="app-container">
      {/* Navigation */}
      <Navbar onOpenConnectModal={() => setIsConnectModalOpen(true)} />

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <span className="pill pill-network" style={{ padding: '4px 12px', fontSize: '0.78rem' }}>
              Level 2 Yellow Belt
            </span>
            <a
              href={`${CONTRACT_EXPLORER_BASE_URL}/${SOROBAN_CONTRACT_ID}`}
              target="_blank"
              rel="noreferrer"
              style={{
                fontSize: '0.75rem',
                color: '#38bdf8',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                textDecoration: 'none',
              }}
            >
              <Shield size={12} />
              <span>Contract: {SOROBAN_CONTRACT_ID.slice(0, 6)}...{SOROBAN_CONTRACT_ID.slice(-4)}</span>
            </a>
          </div>

          <h1 className="hero-title">Soroban-Enforced Bounty Treasury</h1>
          <p className="hero-subtitle">
            Community-funded bounties with conditional on-chain milestone escrow. Funds remain strictly
            locked until decentralized community verification thresholds are satisfied.
          </p>

          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 28 }}>
            <button
              className="btn btn-primary"
              onClick={() => setIsCreateModalOpen(true)}
              id="hero-create-bounty-btn"
            >
              <Plus size={18} />
              <span>Create Bounty</span>
            </button>
            {!isConnected && (
              <button
                className="btn btn-secondary"
                onClick={() => setIsConnectModalOpen(true)}
                id="hero-connect-wallet-btn"
              >
                <Sparkles size={18} color="#f59e0b" />
                <span>Connect Wallet</span>
              </button>
            )}
          </div>

          <div className="hero-stats">
            <div className="hero-stat-item">
              <span className="hero-stat-value" id="stats-total-bounties">
                {bounties.length}
              </span>
              <span className="hero-stat-label">Total Bounties</span>
            </div>
            <div className="hero-stat-item">
              <span className="hero-stat-value" id="stats-total-funded" style={{ color: '#38bdf8' }}>
                {totalFunded.toFixed(1)} XLM
              </span>
              <span className="hero-stat-label">Locked Escrow</span>
            </div>
            <div className="hero-stat-item">
              <span className="hero-stat-value" id="stats-open-bounties" style={{ color: '#10b981' }}>
                {openBountiesCount}
              </span>
              <span className="hero-stat-label">Active Bounties</span>
            </div>
            <div className="hero-stat-item">
              <span className="hero-stat-value" id="stats-milestones-count" style={{ color: '#f59e0b' }}>
                {totalMilestonesCount}
              </span>
              <span className="hero-stat-label">On-Chain Milestones</span>
            </div>
          </div>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <div className="filter-bar">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search bounties by title or deliverable..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            id="search-bounties-input"
          />
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {(['all', 'open', 'funded'] as const).map((status) => (
            <button
              key={status}
              className={`pill ${
                filterStatus === status ? 'pill-network' : 'pill-balance'
              }`}
              style={{
                cursor: 'pointer',
                opacity: filterStatus === status ? 1 : 0.6,
                border: filterStatus === status ? '1px solid var(--primary)' : undefined,
              }}
              onClick={() => setFilterStatus(status)}
              id={`filter-${status}-btn`}
            >
              {status.toUpperCase()}
            </button>
          ))}

          <button
            className="btn btn-secondary"
            onClick={loadBounties}
            title="Refresh bounty dashboard"
            id="refresh-bounties-btn"
            style={{ padding: '8px 12px' }}
          >
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      {/* Backend connection warning if any */}
      {error && (
        <div className="error-banner" style={{ marginBottom: 24 }}>
          <AlertCircle size={20} />
          <span>{error} — Make sure the backend server is running on port 5000.</span>
        </div>
      )}

      {/* Bounty Dashboard Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          Loading Stellar Bounties & On-Chain Milestones...
        </div>
      ) : filteredBounties.length === 0 ? (
        <div
          className="glass-panel"
          style={{ textAlign: 'center', padding: '60px 20px', borderRadius: 'var(--radius-xl)' }}
          id="empty-bounties-state"
        >
          <h3 style={{ fontSize: '1.25rem', marginBottom: 8 }}>No Bounties Found</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: 20 }}>
            {bounties.length === 0
              ? 'Be the first to launch a community-funded bounty on Stellar!'
              : 'No bounties match your current search query or filter.'}
          </p>
          <button
            className="btn btn-primary"
            onClick={() => setIsCreateModalOpen(true)}
            id="empty-create-bounty-btn"
          >
            <Plus size={16} />
            <span>Create First Bounty</span>
          </button>
        </div>
      ) : (
        <main className="bounty-grid" id="bounty-grid-container">
          {filteredBounties.map((bounty) => (
            <BountyCard
              key={bounty.id}
              bounty={bounty}
              onFundClick={(b) => setSelectedBountyToFund(b)}
              onViewDetailsClick={(b) => setSelectedBountyForDetail(b)}
            />
          ))}
        </main>
      )}

      {/* Modals */}
      <WalletConnectModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
      />

      <CreateBountyModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onBountyCreated={handleBountyCreated}
      />

      <FundBountyModal
        bounty={selectedBountyToFund}
        isOpen={!!selectedBountyToFund}
        onClose={() => setSelectedBountyToFund(null)}
        onSuccess={handleBountyUpdated}
        onOpenConnectModal={() => {
          setSelectedBountyToFund(null);
          setIsConnectModalOpen(true);
        }}
      />

      <BountyDetailModal
        bounty={selectedBountyForDetail}
        isOpen={!!selectedBountyForDetail}
        onClose={() => setSelectedBountyForDetail(null)}
        onBountyUpdated={handleBountyUpdated}
        onFundClick={(b) => {
          setSelectedBountyForDetail(null);
          setSelectedBountyToFund(b);
        }}
      />
    </div>
  );
};
