import React, { useState } from 'react';
import { X, Calendar, AlertCircle } from 'lucide-react';

interface ExtendDeadlineModalProps {
  isOpen: boolean;
  onClose: () => void;
  milestoneId: number;
  onExtend: (additionalDays: number) => Promise<void>;
}

export const ExtendDeadlineModal: React.FC<ExtendDeadlineModalProps> = ({
  isOpen,
  onClose,
  milestoneId,
  onExtend,
}) => {
  const [days, setDays] = useState(7);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (days <= 0 || days > 90) {
      setError('Please choose between 1 and 90 extension days.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await onExtend(days);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to extend deadline');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} id="extend-modal-overlay">
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 400 }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calendar size={20} color="#38bdf8" />
            </div>
            <div>
              <h2 className="modal-title">Extend Deadline</h2>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Grant contributor additional milestone days</div>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="error-banner" style={{ marginTop: 14 }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#fff', marginBottom: 6 }}>
              Additional Calendar Days
            </label>
            <input
              type="number"
              min="1"
              max="90"
              value={days}
              onChange={(e) => setDays(parseInt(e.target.value, 10) || 1)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 8,
                border: '1px solid var(--border-color)',
                background: 'rgba(0,0,0,0.3)',
                color: '#fff',
                fontSize: '0.9rem',
              }}
            />
          </div>

          <div className="modal-footer" style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 10 }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isLoading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Grant +' + days + ' Days'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
