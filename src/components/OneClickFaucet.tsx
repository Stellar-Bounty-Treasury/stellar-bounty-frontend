import React, { useState } from 'react';
import { useDemoMode } from '../context/DemoModeContext';
import { Droplets, Check } from 'lucide-react';

export const OneClickFaucet: React.FC = () => {
  const { isDemoMode, fundMockBalance, activePersona } = useDemoMode();
  const [funded, setFunded] = useState(false);

  if (!isDemoMode) return null;

  const handleFund = () => {
    fundMockBalance(1000);
    setFunded(true);
    setTimeout(() => setFunded(false), 2000);
  };

  return (
    <button
      onClick={handleFund}
      className="btn"
      id="one-click-demo-faucet-btn"
      style={{
        padding: '6px 12px',
        fontSize: '0.8rem',
        borderRadius: '8px',
        background: 'rgba(56, 189, 248, 0.1)',
        border: '1px solid rgba(56, 189, 248, 0.3)',
        color: '#38bdf8',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        cursor: 'pointer',
      }}
      title="Boost current persona balance with +1,000 Testnet XLM"
    >
      {funded ? <Check size={14} color="#10b981" /> : <Droplets size={14} color="#38bdf8" />}
      <span>{funded ? '+1,000 XLM Added!' : '+1,000 Demo XLM'}</span>
    </button>
  );
};
