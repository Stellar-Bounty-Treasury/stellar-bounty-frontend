import React, { useState } from 'react';
import { Milestone, SettlementRecipient } from '../types';
import { api } from '../services/api';
import { isValidStellarAddress } from '../services/stellar';

interface SettlementBuilderModalProps {
  bountyId: number;
  milestone: Milestone;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const SettlementBuilderModal: React.FC<SettlementBuilderModalProps> = ({
  bountyId,
  milestone,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [allocationType, setAllocationType] = useState<'fixed' | 'percentage'>('fixed');
  const [recipients, setRecipients] = useState<SettlementRecipient[]>(() => {
    if (milestone.settlement?.recipients && milestone.settlement.recipients.length > 0) {
      return milestone.settlement.recipients;
    }
    return [
      {
        recipient: milestone.recipient_address,
        amount: Math.round(milestone.reward_amount * 0.7),
        percentage_bps: 7000,
        label: 'Developer',
      },
      {
        recipient: 'GCG5S6QWVRIIVSQWA5DF3X2Q2KQQ6KEHMAXZUMGFPX7YDGGA2X67TPEU',
        amount: Math.round(milestone.reward_amount * 0.2),
        percentage_bps: 2000,
        label: 'Designer',
      },
      {
        recipient: 'GDWBHVJ7JGSCRTWL3OVCHZRZMOJ2BSZZSIOIPGGV5HXYG4FWFHNZPMVW',
        amount: Math.round(milestone.reward_amount * 0.1),
        percentage_bps: 1000,
        label: 'Reviewer',
      },
    ];
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddRecipient = () => {
    setRecipients([
      ...recipients,
      { recipient: '', amount: 0, percentage_bps: 0, label: `Recipient #${recipients.length + 1}` },
    ]);
  };

  const handleRemoveRecipient = (index: number) => {
    if (recipients.length <= 1) return;
    setRecipients(recipients.filter((_, i) => i !== index));
  };

  const handleUpdateRecipient = (index: number, field: keyof SettlementRecipient, value: any) => {
    const updated = [...recipients];
    updated[index] = { ...updated[index], [field]: value };
    setRecipients(updated);
  };

  // Calculations & Validation
  const totalAllocatedAmount = recipients.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
  const totalBps = recipients.reduce((sum, r) => sum + (Number(r.percentage_bps) || 0), 0);

  const isFixedValid = Math.abs(totalAllocatedAmount - milestone.reward_amount) < 0.001;
  const isPercentageValid = totalBps === 10000;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (allocationType === 'fixed' && !isFixedValid) {
      setError(`Allocated sum (${totalAllocatedAmount} XLM) must match milestone reward (${milestone.reward_amount} XLM).`);
      return;
    }
    if (allocationType === 'percentage' && !isPercentageValid) {
      setError(`Total percentage must equal 100.0% (currently ${(totalBps / 100).toFixed(1)}%).`);
      return;
    }

    for (let i = 0; i < recipients.length; i++) {
      const r = recipients[i];
      if (!isValidStellarAddress(r.recipient)) {
        setError(`Recipient #${i + 1} has an invalid Stellar address (must start with G and be 56 characters).`);
        return;
      }
    }

    setIsLoading(true);
    try {
      await api.configureSettlement(bountyId, milestone.id, {
        allocation_type: allocationType,
        recipients: recipients.map((r) => ({
          ...r,
          amount: Number(r.amount),
          percentage_bps: Number(r.percentage_bps),
        })),
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to configure settlement router.');
    } finally {
      setIsLoading(false);
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
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(8px)',
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
          background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.98), rgba(30, 41, 59, 0.95))',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ background: '#f59e0b', color: '#000', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800 }}>
                ROUTER BUILDER
              </span>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                Configure Settlement Router
              </h2>
            </div>
            <p style={{ margin: '0.25rem 0 0 0', color: '#94a3b8', fontSize: '0.8rem' }}>
              Milestone #{milestone.contract_milestone_id} • Total Reward: {milestone.reward_amount} XLM
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
              marginBottom: '1.25rem',
            }}
          >
            {error}
          </div>
        )}

        {/* Allocation Mode Selector */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.5rem' }}>
            Settlement Allocation Model
          </label>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              type="button"
              id="model-fixed-btn"
              onClick={() => setAllocationType('fixed')}
              style={{
                flex: 1,
                padding: '0.6rem',
                borderRadius: '8px',
                background: allocationType === 'fixed' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                border: `1px solid ${allocationType === 'fixed' ? '#f59e0b' : 'rgba(255, 255, 255, 0.1)'}`,
                color: allocationType === 'fixed' ? '#fbbf24' : '#94a3b8',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              Fixed XLM Amounts
            </button>
            <button
              type="button"
              id="model-percentage-btn"
              onClick={() => setAllocationType('percentage')}
              style={{
                flex: 1,
                padding: '0.6rem',
                borderRadius: '8px',
                background: allocationType === 'percentage' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                border: `1px solid ${allocationType === 'percentage' ? '#f59e0b' : 'rgba(255, 255, 255, 0.1)'}`,
                color: allocationType === 'percentage' ? '#fbbf24' : '#94a3b8',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              Percentage Split (%)
            </button>
          </div>
        </div>

        {/* Recipients Form List */}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1' }}>Recipients Allocation</span>
            <button
              type="button"
              id="add-recipient-btn"
              onClick={handleAddRecipient}
              style={{
                background: 'rgba(59, 130, 246, 0.15)',
                border: '1px solid rgba(59, 130, 246, 0.4)',
                color: '#60a5fa',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              + Add Recipient
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
            {recipients.map((r, index) => (
              <div
                key={index}
                style={{
                  padding: '0.75rem',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr auto', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <input
                    type="text"
                    placeholder="Role (e.g. Developer, Designer)"
                    value={r.label || ''}
                    onChange={(e) => handleUpdateRecipient(index, 'label', e.target.value)}
                    style={{
                      padding: '0.4rem 0.6rem',
                      borderRadius: '6px',
                      background: 'rgba(0, 0, 0, 0.4)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#fff',
                      fontSize: '0.78rem',
                    }}
                  />

                  {allocationType === 'fixed' ? (
                    <div style={{ position: 'relative' }}>
                      <input
                        type="number"
                        placeholder="Amount"
                        value={r.amount}
                        onChange={(e) => handleUpdateRecipient(index, 'amount', Number(e.target.value))}
                        style={{
                          width: '100%',
                          padding: '0.4rem 0.6rem',
                          borderRadius: '6px',
                          background: 'rgba(0, 0, 0, 0.4)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          color: '#fff',
                          fontSize: '0.78rem',
                        }}
                      />
                      <span style={{ position: 'absolute', right: '8px', top: '7px', fontSize: '0.7rem', color: '#94a3b8' }}>
                        XLM
                      </span>
                    </div>
                  ) : (
                    <div style={{ position: 'relative' }}>
                      <input
                        type="number"
                        placeholder="Share"
                        value={(r.percentage_bps || 0) / 100}
                        onChange={(e) =>
                          handleUpdateRecipient(index, 'percentage_bps', Math.round(Number(e.target.value) * 100))
                        }
                        style={{
                          width: '100%',
                          padding: '0.4rem 0.6rem',
                          borderRadius: '6px',
                          background: 'rgba(0, 0, 0, 0.4)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          color: '#fff',
                          fontSize: '0.78rem',
                        }}
                      />
                      <span style={{ position: 'absolute', right: '8px', top: '7px', fontSize: '0.7rem', color: '#94a3b8' }}>
                        %
                      </span>
                    </div>
                  )}

                  {recipients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveRecipient(index)}
                      style={{
                        background: 'rgba(239, 68, 68, 0.15)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        color: '#f87171',
                        padding: '0 8px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                      }}
                    >
                      ✕
                    </button>
                  )}
                </div>

                <input
                  type="text"
                  placeholder="Stellar Public Key (G...)"
                  value={r.recipient}
                  onChange={(e) => handleUpdateRecipient(index, 'recipient', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.4rem 0.6rem',
                    borderRadius: '6px',
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#cbd5e1',
                    fontSize: '0.75rem',
                    fontFamily: 'monospace',
                  }}
                />
              </div>
            ))}
          </div>

          {/* Allocation Progress & Summary */}
          <div
            style={{
              padding: '0.75rem',
              borderRadius: '8px',
              background: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              marginBottom: '1.25rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600 }}>
              <span style={{ color: '#94a3b8' }}>Total Allocated:</span>
              <span style={{ color: (allocationType === 'fixed' ? isFixedValid : isPercentageValid) ? '#34d399' : '#f87171' }}>
                {allocationType === 'fixed'
                  ? `${totalAllocatedAmount} / ${milestone.reward_amount} XLM`
                  : `${(totalBps / 100).toFixed(1)}% / 100%`}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
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
              Cancel
            </button>
            <button
              type="submit"
              id="save-settlement-btn"
              disabled={isLoading || (allocationType === 'fixed' ? !isFixedValid : !isPercentageValid)}
              style={{
                flex: 2,
                padding: '0.75rem',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                border: 'none',
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1,
              }}
            >
              {isLoading ? 'Configuring Router...' : 'Save Settlement Rules'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
