import React, { useState } from 'react';
import { Compass, CheckCircle2, ChevronRight, X } from 'lucide-react';

export const JudgeQuickTour: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const steps = [
    { id: 1, title: 'Choose Persona', desc: 'Select Alice (Creator), Bob (Contributor), or Charlie (Arbitrator).' },
    { id: 2, title: 'Inspect Bounties', desc: 'Filter by category, funding status, and token type (XLM / USDC).' },
    { id: 3, title: 'Simulate Gas & CPU', desc: 'Click Soroban RPC Simulation to preview execution instructions.' },
    { id: 4, title: 'Test Settlement Split', desc: 'Configure 10,000 BPS multi-recipient payout in Milestone details.' },
    { id: 5, title: 'Arbitrate Dispute', desc: 'Switch to Arbitrator and issue on-chain final verdict.' },
  ];

  const toggleStep = (id: number) => {
    setCompletedSteps((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="btn"
        id="judge-tour-btn"
        style={{
          padding: '6px 12px',
          fontSize: '0.8rem',
          borderRadius: '9999px',
          background: 'rgba(245, 158, 11, 0.1)',
          border: '1px solid rgba(245, 158, 11, 0.4)',
          color: '#fbbf24',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
        title="Open interactive hackathon judge evaluation tour"
      >
        <Compass size={14} color="#fbbf24" />
        <span>Judge Tour ({completedSteps.length}/{steps.length})</span>
      </button>

      {isOpen && (
        <div className="modal-backdrop" onClick={() => setIsOpen(false)}>
          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '480px', padding: '1.5rem' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Compass size={20} color="#fbbf24" />
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Hackathon Judge Guided Tour</h3>
              </div>
              <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1.2rem' }}>
              Complete the 5 key milestone flows to verify full Stellar Soroban integration:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {steps.map((s) => {
                const done = completedSteps.includes(s.id);
                return (
                  <div
                    key={s.id}
                    onClick={() => toggleStep(s.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                      padding: '10px',
                      borderRadius: '8px',
                      background: done ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                      border: done ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(255, 255, 255, 0.08)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <CheckCircle2 size={18} color={done ? '#10b981' : '#64748b'} style={{ marginTop: '2px', flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: done ? '#10b981' : '#f8fafc' }}>
                        {s.id}. {s.title}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' }}>
                        {s.desc}
                      </div>
                    </div>
                    <ChevronRight size={14} color="#64748b" style={{ marginTop: '4px' }} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
