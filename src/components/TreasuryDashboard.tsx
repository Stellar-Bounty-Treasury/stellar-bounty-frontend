import React from 'react';
import { TreasuryStats } from '../types';
import { SOROBAN_CONTRACT_ID } from '../services/stellar';

interface TreasuryDashboardProps {
  stats: TreasuryStats;
  network?: string;
  onRefresh?: () => void;
}

export const TreasuryDashboard: React.FC<TreasuryDashboardProps> = ({
  stats,
  network = 'Stellar Testnet',
  onRefresh,
}) => {
  return (
    <div className="treasury-dashboard-container" style={{ marginBottom: '2rem' }}>
      <div
        className="glass-panel"
        style={{
          padding: '1.5rem',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.95), rgba(30, 41, 59, 0.9))',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          boxShadow: '0 12px 30px rgba(0, 0, 0, 0.4), 0 0 20px rgba(245, 158, 11, 0.1)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '1.25rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span
                style={{
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: '#fff',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}
              >
                Settlement Engine • Protocol v1.0
              </span>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                Programmable Treasury & Settlement Router
              </h2>
            </div>
            <p style={{ margin: '0.35rem 0 0 0', color: '#94a3b8', fontSize: '0.85rem' }}>
              Automated multi-recipient routing, conditional settlement rules, and realtime blockchain event synchronization.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '6px 12px',
                borderRadius: '8px',
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#34d399',
                fontSize: '0.8rem',
                fontWeight: 600,
              }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#10b981',
                  boxShadow: '0 0 8px #10b981',
                  display: 'inline-block',
                }}
              />
              {network}
            </div>

            <a
              href={`https://stellar.expert/explorer/testnet/contract/${SOROBAN_CONTRACT_ID}`}
              target="_blank"
              rel="noreferrer"
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                background: 'rgba(59, 130, 246, 0.12)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                color: '#60a5fa',
                fontSize: '0.8rem',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Contract: {SOROBAN_CONTRACT_ID.substring(0, 4)}...{SOROBAN_CONTRACT_ID.substring(SOROBAN_CONTRACT_ID.length - 4)} ↗
            </a>

            {onRefresh && (
              <button
                onClick={onRefresh}
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#cbd5e1',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                }}
              >
                ↻ Refresh
              </button>
            )}
          </div>
        </div>

        {/* Global Treasury Metrics Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '1rem',
          }}
        >
          {/* Total Funds */}
          <div
            style={{
              padding: '1rem',
              borderRadius: '12px',
              background: 'rgba(245, 158, 11, 0.08)',
              border: '1px solid rgba(245, 158, 11, 0.25)',
            }}
          >
            <div style={{ color: '#f59e0b', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
              Total Escrowed
            </div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#fef3c7', marginTop: '0.25rem' }}>
              {stats.total_funds.toLocaleString()} <span style={{ fontSize: '0.85rem' }}>XLM</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.2rem' }}>
              Locked in Soroban vault
            </div>
          </div>

          {/* Total Distributed */}
          <div
            style={{
              padding: '1rem',
              borderRadius: '12px',
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
            }}
          >
            <div style={{ color: '#10b981', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
              Total Distributed
            </div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#d1fae5', marginTop: '0.25rem' }}>
              {stats.total_distributed.toLocaleString()} <span style={{ fontSize: '0.85rem' }}>XLM</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.2rem' }}>
              Settled to contributors
            </div>
          </div>

          {/* Total Bounties */}
          <div
            style={{
              padding: '1rem',
              borderRadius: '12px',
              background: 'rgba(99, 102, 241, 0.08)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
            }}
          >
            <div style={{ color: '#818cf8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
              Total Bounties
            </div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#e0e7ff', marginTop: '0.25rem' }}>
              {stats.total_bounties}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.2rem' }}>
              {stats.active_bounties} Active • {stats.completed_bounties} Completed
            </div>
          </div>

          {/* Pending Milestones */}
          <div
            style={{
              padding: '1rem',
              borderRadius: '12px',
              background: 'rgba(14, 165, 233, 0.08)',
              border: '1px solid rgba(14, 165, 233, 0.25)',
            }}
          >
            <div style={{ color: '#38bdf8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
              Pending Milestones
            </div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#e0f2fe', marginTop: '0.25rem' }}>
              {stats.pending_milestones}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.2rem' }}>
              In progress & review
            </div>
          </div>

          {/* Pending Settlements */}
          <div
            style={{
              padding: '1rem',
              borderRadius: '12px',
              background: 'rgba(236, 72, 153, 0.08)',
              border: '1px solid rgba(236, 72, 153, 0.25)',
            }}
          >
            <div style={{ color: '#f472b6', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
              Settlement Queues
            </div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#fce7f3', marginTop: '0.25rem' }}>
              {stats.pending_settlements}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.2rem' }}>
              Awaiting release execution
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
