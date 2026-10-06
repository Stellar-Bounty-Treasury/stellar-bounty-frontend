import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { BountyCard } from './components/BountyCard';
import { CreateBountyModal } from './components/CreateBountyModal';
import { FundBountyModal } from './components/FundBountyModal';
import { WalletConnectModal } from './components/WalletConnectModal';
import { useWallet } from './context/WalletContext';
import { api } from './services/api';
import { Bounty } from './types';
import { Plus, Search, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';

export const App: React.FC = () => {
  const { isConnected } = useWallet();
  const [bounties, setBounties] = useState<Bounty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modals state
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedBountyToFund, setSelectedBountyToFund] = useState<Bounty | null>(null);

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
  };

  const handleBountyFunded = (updatedBounty: Bounty) => {
    setBounties((prev) =>
      prev.map((b) => (b.id === updatedBounty.id ? { ...b, ...updatedBounty } : b))
    );
  };

  // Stats
  const totalFunded = bounties.reduce((sum, b) => sum + (b.funded_amount || 0), 0);
  const openBountiesCount = bounties.filter((b) => b.status === 'open').length;

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
          <h1 className="hero-title">Community-Funded Bounties on Stellar</h1>
          <p className="hero-subtitle">
            Create decentralized bounties, reward open-source contributors, and fund milestone
            deliverables directly using real Stellar Testnet transactions.
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
              <span className="hero-stat-label">Total Funded</span>
            </div>
            <div className="hero-stat-item">
              <span className="hero-stat-value" id="stats-open-bounties" style={{ color: '#10b981' }}>
                {openBountiesCount}
              </span>
              <span className="hero-stat-label">Open Bounties</span>
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
            placeholder="Search bounties by title or keyword..."
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
          Loading Stellar Bounties...
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
        onSuccess={handleBountyFunded}
        onOpenConnectModal={() => {
          setSelectedBountyToFund(null);
          setIsConnectModalOpen(true);
        }}
      />
    </div>
  );
};
