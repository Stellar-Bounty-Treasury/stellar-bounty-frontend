import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { BountyCard } from './components/BountyCard';
import { BountyCardSkeleton } from './components/BountyCardSkeleton';
import { CreateBountyModal } from './components/CreateBountyModal';
import { FundBountyModal } from './components/FundBountyModal';
import { BountyDetailModal } from './components/BountyDetailModal';
import { WalletConnectModal } from './components/WalletConnectModal';
import { TreasuryDashboard } from './components/TreasuryDashboard';
import { VideoModal } from './components/VideoModal';
import { useWallet } from './context/WalletContext';
import { api } from './services/api';
import { Bounty, TreasuryStats } from './types';
import { Plus, Search, Sparkles, AlertCircle, RefreshCw, Radio, Play } from 'lucide-react';
import { SOROBAN_CONTRACT_ID } from './services/stellar';

export const App: React.FC = () => {
  const { isConnected } = useWallet();
  const [bounties, setBounties] = useState<Bounty[]>([]);
  const [stats, setStats] = useState<TreasuryStats>({
    total_funds: 0,
    total_bounties: 0,
    active_bounties: 0,
    completed_bounties: 0,
    pending_milestones: 0,
    pending_settlements: 0,
    total_distributed: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [realtimeNotice, setRealtimeNotice] = useState<string | null>(null);

  // Modals state
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [selectedBountyToFund, setSelectedBountyToFund] = useState<Bounty | null>(null);
  const [selectedBountyForDetail, setSelectedBountyForDetail] = useState<Bounty | null>(null);

  // Filtering & search
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'funded' | 'completed'>('all');

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [bData, sData] = await Promise.all([api.getBounties(), api.getTreasuryStats()]);
      setBounties(bData);
      setStats(sData);
    } catch (err: any) {
      console.error('Failed to load bounties and stats:', err);
      setError(err.message || 'Unable to connect to backend service.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Subscribe to backend realtime SSE stream
    const unsubscribe = api.subscribeRealtimeEvents((event) => {
      console.log('⚡ Realtime event received:', event);
      setRealtimeNotice(`Live Blockchain Event: ${event.type || 'state_update'}`);
      setTimeout(() => setRealtimeNotice(null), 4000);
      loadData();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleBountyCreated = (newBounty: Bounty) => {
    setBounties((prev) => [newBounty, ...prev]);
    setSelectedBountyForDetail(newBounty);
    loadData();
  };

  const handleBountyUpdated = (updatedBounty: Bounty) => {
    setBounties((prev) =>
      prev.map((b) => (b.id === updatedBounty.id ? { ...b, ...updatedBounty } : b))
    );
    if (selectedBountyForDetail?.id === updatedBounty.id) {
      setSelectedBountyForDetail(updatedBounty);
    }
    loadData();
  };

  // Filtered bounties
  const filteredBounties = bounties.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterStatus === 'all'
        ? true
        : filterStatus === 'completed'
        ? b.status === 'completed'
        : filterStatus === 'funded'
        ? b.status === 'funded'
        : b.status === 'open';

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="app-container">
      {/* Navigation */}
      <Navbar
        onOpenConnectModal={() => setIsConnectModalOpen(true)}
        onOpenVideoModal={() => setIsVideoModalOpen(true)}
      />

      {/* Realtime Notification Banner */}
      {realtimeNotice && (
        <div
          style={{
            background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.9), rgba(217, 119, 6, 0.9))',
            color: '#000',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '0.82rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '1rem',
            boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)',
          }}
        >
          <Radio size={14} className="spinner" />
          <span>{realtimeNotice}</span>
        </div>
      )}

      {/* Treasury Dashboard Metric Bar */}
      <TreasuryDashboard stats={stats} network="Stellar Testnet" onRefresh={loadData} />

      {/* Hero Section */}
      <section className="hero" style={{ padding: '2rem 0', marginBottom: '1.5rem' }}>
        <div className="hero-content">
          <h1 className="hero-title" style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>
            Programmable Bounty Treasury & Settlement Router
          </h1>
          <p className="hero-subtitle" style={{ maxWidth: '800px', margin: '0 auto 1.5rem auto' }}>
            Community-funded bounty escrow on Stellar. Milestone deliverables trigger cryptographic community
            verification, routing released funds across multiple contributors through authoritative Soroban settlement contracts.
          </p>

          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              className="btn btn-primary"
              onClick={() => setIsCreateModalOpen(true)}
              id="hero-create-bounty-btn"
            >
              <Plus size={18} />
              <span>Create Programmable Bounty</span>
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setIsVideoModalOpen(true)}
              id="hero-watch-demo-btn"
              style={{
                borderColor: 'rgba(245, 158, 11, 0.4)',
                color: '#fbbf24',
              }}
            >
              <Play size={18} fill="#fbbf24" />
              <span>Watch Video Walkthrough</span>
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
        </div>
      </section>

      {/* Filter & Search Bar */}
      <div className="filter-bar">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search bounties by title, recipient, or deliverable..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            id="search-bounties-input"
          />
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          {(['all', 'open', 'funded', 'completed'] as const).map((status) => (
            <button
              key={status}
              className={`pill ${
                filterStatus === status ? 'pill-network' : 'pill-balance'
              }`}
              style={{
                cursor: 'pointer',
                opacity: filterStatus === status ? 1 : 0.6,
                border: filterStatus === status ? '1px solid var(--primary)' : undefined,
                textTransform: 'uppercase',
              }}
              onClick={() => setFilterStatus(status)}
              id={`filter-${status}-btn`}
            >
              {status}
            </button>
          ))}

          <button
            className="btn btn-secondary"
            onClick={loadData}
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
          <span>{error} — Running in offline / autonomous smart contract fallback mode.</span>
        </div>
      )}

      {/* Bounty Dashboard Grid */}
      {loading ? (
        <main className="bounty-grid" id="bounty-grid-loading" aria-busy="true">
          <span className="visually-hidden">Loading Stellar Bounties &amp; Settlement Routers...</span>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <BountyCardSkeleton key={`skeleton-${i}`} index={i} />
          ))}
        </main>
      ) : filteredBounties.length === 0 ? (
        <div
          className="glass-panel"
          style={{ textAlign: 'center', padding: '60px 20px', borderRadius: 'var(--radius-xl)' }}
          id="empty-bounties-state"
        >
          <h3 style={{ fontSize: '1.25rem', marginBottom: 8 }}>No Bounties Found</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: 20 }}>
            {bounties.length === 0
              ? 'Be the first to launch a programmable community-funded bounty on Stellar!'
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

      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
      />
    </div>
  );
};
