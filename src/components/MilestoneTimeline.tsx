import React from 'react';
import { CheckCircle2, Clock, Eye, AlertCircle, Coins, Scale } from 'lucide-react';

export type MilestoneLifecycleStep = 'created' | 'submitted' | 'under_review' | 'approved' | 'settled';

interface MilestoneTimelineProps {
  currentStatus: string;
  isDisputed?: boolean;
}

export const MilestoneTimeline: React.FC<MilestoneTimelineProps> = ({ currentStatus, isDisputed }) => {
  const steps = [
    { key: 'created', label: 'Created', icon: <Clock size={14} /> },
    { key: 'submitted', label: 'Submitted', icon: <Eye size={14} /> },
    { key: 'under_review', label: 'Review', icon: <Clock size={14} /> },
    { key: 'approved', label: 'Approved', icon: <CheckCircle2 size={14} /> },
    { key: 'settled', label: 'Settled', icon: <Coins size={14} /> },
  ];

  const getStepStatus = (stepKey: string) => {
    const order = ['pending', 'submitted', 'under_review', 'approved', 'paid'];
    const currentIdx = order.indexOf(currentStatus === 'settled' ? 'paid' : currentStatus);
    const stepIdx = order.indexOf(stepKey === 'created' ? 'pending' : stepKey === 'settled' ? 'paid' : stepKey);

    if (currentIdx > stepIdx) return 'completed';
    if (currentIdx === stepIdx) return 'active';
    return 'upcoming';
  };

  return (
    <div style={{ width: '100%', margin: '14px 0 8px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 12, left: '5%', right: '5%', height: 2, background: 'rgba(255,255,255,0.1)', zIndex: 0 }} />

        {steps.map((step) => {
          const status = getStepStatus(step.key);
          const isDone = status === 'completed';
          const isActive = status === 'active';

          return (
            <div key={step.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 1, minWidth: 60 }}>
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isDone ? '#10b981' : isActive ? '#6366f1' : '#1e293b',
                  border: `2px solid ${isDone ? '#34d399' : isActive ? '#818cf8' : 'rgba(255,255,255,0.2)'}`,
                  color: isDone || isActive ? '#fff' : '#94a3b8',
                }}
              >
                {step.icon}
              </div>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#fff' : isDone ? '#34d399' : 'var(--text-muted)',
                  marginTop: 6,
                }}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {isDisputed && (
        <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: '0.75rem', color: '#facc15' }}>
          <Scale size={14} /> Arbitration dispute in progress
        </div>
      )}
    </div>
  );
};
