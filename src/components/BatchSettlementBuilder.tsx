import React, { useState } from 'react';
import { Milestone } from '../types';
import { CheckSquare, Square, Layers, Coins } from 'lucide-react';
import { formatXlm } from '../utils/formatters';

interface BatchSettlementBuilderProps {
  approvedMilestones: Milestone[];
  onExecuteBatch: (selectedIds: number[]) => Promise<void>;
}

export const BatchSettlementBuilder: React.FC<BatchSettlementBuilderProps> = ({
  approvedMilestones,
  onExecuteBatch,
}) => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const selectAll = () => {
    if (selectedIds.length === approvedMilestones.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(approvedMilestones.map((m) => m.id));
    }
  };

  const totalSelectedXlm = approvedMilestones
    .filter((m) => selectedIds.includes(m.id))
    .reduce((sum, m) => sum + m.reward_amount, 0);

  if (approvedMilestones.length === 0) return null;

  return (
    <div className="glass-panel" style={{ padding: '16px 20px', borderRadius: 10, marginBottom: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Layers size={18} color="#38bdf8" />
          <span style={{ fontWeight: 600, color: '#fff', fontSize: '0.9rem' }}>Batch Milestone Settlement</span>
          <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: 999, background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
            {selectedIds.length} of {approvedMilestones.length} selected
          </span>
        </div>

        <button
          onClick={selectAll}
          style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '0.78rem', cursor: 'pointer' }}
        >
          {selectedIds.length === approvedMilestones.length ? 'Deselect All' : 'Select All'}
        </button>
      </div>

      <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {approvedMilestones.map((m) => {
          const isSelected = selectedIds.includes(m.id);
          return (
            <div
              key={m.id}
              onClick={() => toggleSelect(m.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                borderRadius: 6,
                background: isSelected ? 'rgba(56, 189, 248, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {isSelected ? <CheckSquare size={16} color="#38bdf8" /> : <Square size={16} color="var(--text-muted)" />}
                <span style={{ fontSize: '0.82rem', color: '#fff' }}>{m.description}</span>
              </div>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#34d399' }}>{formatXlm(m.reward_amount)} XLM</span>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 10 }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Batch Total: <strong style={{ color: '#fff' }}>{formatXlm(totalSelectedXlm)} XLM</strong>
        </span>
        <button
          disabled={selectedIds.length === 0 || isExecuting}
          onClick={() => {
            setIsExecuting(true);
            onExecuteBatch(selectedIds).finally(() => setIsExecuting(false));
          }}
          className="btn btn-primary"
          style={{ fontSize: '0.82rem', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <Coins size={14} />
          {isExecuting ? 'Settling...' : 'Settle ' + selectedIds.length + ' Milestones Batch'}
        </button>
      </div>
    </div>
  );
};
