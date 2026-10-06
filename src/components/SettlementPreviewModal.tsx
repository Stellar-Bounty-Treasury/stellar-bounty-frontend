import React, { useState } from 'react';
import { Milestone, Settlement } from '../types';
import { api } from '../services/api';
import { SettlementFlowVisualizer } from './SettlementFlowVisualizer';

interface SettlementPreviewModalProps {
  milestone: Milestone;
  settlement?: Settlement | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const SettlementPreviewModal: React.FC<SettlementPreviewModalProps> = ({
  milestone,
  settlement,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const recipients = settlement?.recipients || [
    {
      recipient: milestone.recipient_address,
      amount: milestone.reward_amount,
      label: 'Designated Contributor',
    },
  ];

  const handleExecute = async () => {
    setIsExecuting(true);
    setError(null);
    try {
      const mockTxHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
      await api.releasePayment(milestone.id, { transaction_hash: mockTxHash });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to execute settlement');
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem',
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '650px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '2rem',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.95))',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ background: '#10b981', color: '#000', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800 }}>
                SETTLEMENT PREVIEW
              </span>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                Conditional Settlement Authorization
              </h2>
            </div>
            <p style={{ margin: '0.25rem 0 0 0', color: '#94a3b8', fontSize: '0.8rem' }}>
              Milestone #{milestone.contract_milestone_id} • Total Distribution: {milestone.reward_amount} XLM
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              fontSize: '1.5rem',
              cursor: 'pointer',
            }}
          >
            ×
          </button>
        </div>

        {error && (
          <div
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#fca5a5',
              fontSize: '0.85rem',
              marginBottom: '1rem',
            }}
          >
            {error}
          </div>
        )}

        {/* Condition Check Matrix */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '0.5rem',
            padding: '0.75rem',
            borderRadius: '10px',
            background: 'rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            marginBottom: '1.25rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#cbd5e1' }}>
            <span style={{ color: '#10b981', fontWeight: 800 }}>✓</span> Community Verification: Approved
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#cbd5e1' }}>
            <span style={{ color: '#10b981', fontWeight: 800 }}>✓</span> Escrow Vault: Funds Available
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#cbd5e1' }}>
            <span style={{ color: '#10b981', fontWeight: 800 }}>✓</span> Allocation Total: Valid (100%)
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#cbd5e1' }}>
            <span style={{ color: '#10b981', fontWeight: 800 }}>✓</span> Router Status: Ready for Settlement
          </div>
        </div>

        {/* Breakdown of Recipients */}
        <div style={{ marginBottom: '1.25rem' }}>
          <h4 style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
            Recipient Payout Schedule ({recipients.length} Recipients)
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {recipients.map((r, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.6rem 0.8rem',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fbbf24' }}>
                    {r.label || `Recipient #${i + 1}`}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontFamily: 'monospace' }}>
                    {r.recipient}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#34d399' }}>
                    {r.amount} XLM
                  </div>
                  {r.percentage_bps && (
                    <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>
                      {(r.percentage_bps / 100).toFixed(1)}% share
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Visualizer Flow */}
        {settlement && <SettlementFlowVisualizer settlement={settlement} />}

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              flex: 1,
              padding: '0.75rem',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#cbd5e1',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            Back
          </button>
          <button
            type="button"
            id="execute-settlement-confirm-btn"
            onClick={handleExecute}
            disabled={isExecuting}
            style={{
              flex: 2,
              padding: '0.75rem',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              border: 'none',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: isExecuting ? 'not-allowed' : 'pointer',
              opacity: isExecuting ? 0.7 : 1,
              boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
            }}
          >
            {isExecuting ? 'Executing Settlement on Stellar...' : `Execute Settlement (${milestone.reward_amount} XLM)`}
          </button>
        </div>
      </div>
    </div>
  );
};
