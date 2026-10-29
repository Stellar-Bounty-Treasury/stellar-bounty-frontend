import React from 'react';
import { useDemoMode } from '../context/DemoModeContext';
import { Sparkles } from 'lucide-react';

export const DemoModeToggle: React.FC = () => {
  const { isDemoMode, toggleDemoMode } = useDemoMode();

  return (
    <button
      onClick={toggleDemoMode}
      className="btn"
      id="demo-mode-toggle-btn"
      style={{
        padding: '6px 12px',
        fontSize: '0.8rem',
        fontWeight: 600,
        borderRadius: '9999px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        background: isDemoMode
          ? 'linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(14, 165, 233, 0.2))'
          : 'rgba(255, 255, 255, 0.05)',
        border: isDemoMode ? '1px solid rgba(56, 189, 248, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
        color: isDemoMode ? '#38bdf8' : 'var(--text-muted, #94a3b8)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
      title="Toggle Judge Demo Mode with preloaded Stellar personas"
    >
      <Sparkles size={14} color={isDemoMode ? '#38bdf8' : '#94a3b8'} />
      <span>{isDemoMode ? 'Demo Mode: ON' : 'Demo Mode'}</span>
    </button>
  );
};
