import React from 'react';
import { X, Cpu, HardDrive, DollarSign, CheckCircle2, AlertTriangle } from 'lucide-react';

export interface SimulationDetails {
  functionName: string;
  contractId: string;
  cpuInstructions: number;
  memoryBytes: number;
  minResourceFee: string;
  success: boolean;
  error?: string;
}

interface SimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  simulation: SimulationDetails | null;
  isLoading?: boolean;
}

export const SimulationModal: React.FC<SimulationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  simulation,
  isLoading = false,
}) => {
  if (!isOpen || !simulation) return null;

  const maxCpu = 100_000_000;
  const cpuPercent = Math.min(100, Math.round((simulation.cpuInstructions / maxCpu) * 100));
  const feeXlm = (parseInt(simulation.minResourceFee || '1000', 10) / 10_000_000).toFixed(6);

  return (
    <div className="modal-overlay" onClick={onClose} id="simulation-modal-overlay">
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 480 }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Cpu size={20} color="#818cf8" />
            </div>
            <div>
              <h2 className="modal-title">Soroban Pre-Flight Simulation</h2>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Resource validation before ledger submission</div>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Method and Target */}
          <div className="glass-panel" style={{ padding: '12px 14px', borderRadius: 8 }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Contract Method</div>
            <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#fff', marginTop: 2 }}>{simulation.functionName}()</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4, fontFamily: 'monospace' }}>
              {simulation.contractId.slice(0, 10)}...{simulation.contractId.slice(-8)}
            </div>
          </div>

          {/* Metrics Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {/* CPU Instructions */}
            <div className="glass-panel" style={{ padding: '12px 14px', borderRadius: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <Cpu size={14} /> CPU Budget
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginTop: 4 }}>
                {simulation.cpuInstructions.toLocaleString()}
              </div>
              <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, marginTop: 6, overflow: 'hidden' }}>
                <div style={{ width: `${Math.max(5, cpuPercent)}%`, height: '100%', background: '#818cf8' }} />
              </div>
            </div>

            {/* Memory Footprint */}
            <div className="glass-panel" style={{ padding: '12px 14px', borderRadius: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <HardDrive size={14} /> RAM Footprint
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginTop: 4 }}>
                {(simulation.memoryBytes / 1024).toFixed(1)} KB
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>
                {simulation.memoryBytes.toLocaleString()} bytes
              </div>
            </div>
          </div>

          {/* Minimum Fee Estimation */}
          <div className="glass-panel" style={{ padding: '12px 14px', borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <DollarSign size={16} color="#34d399" />
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>Soroban Gas Resource Fee</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{simulation.minResourceFee} stroops</div>
              </div>
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#34d399' }}>~{feeXlm} XLM</div>
          </div>

          {simulation.error && (
            <div className="error-banner">
              <AlertTriangle size={18} />
              <span>Simulation error: {simulation.error}</span>
            </div>
          )}
        </div>

        <div className="modal-footer" style={{ marginTop: 20, display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={onConfirm}
            disabled={isLoading || !simulation.success}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <CheckCircle2 size={16} />
            {isLoading ? 'Executing on Soroban...' : 'Approve & Submit Tx'}
          </button>
        </div>
      </div>
    </div>
  );
};
