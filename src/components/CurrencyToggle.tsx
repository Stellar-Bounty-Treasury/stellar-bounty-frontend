import React from 'react';
import { SupportedCurrency } from '../services/currencyService';

interface CurrencyToggleProps {
  currentCurrency: SupportedCurrency;
  onChange: (currency: SupportedCurrency) => void;
}

export const CurrencyToggle: React.FC<CurrencyToggleProps> = ({ currentCurrency, onChange }) => {
  const currencies: SupportedCurrency[] = ['XLM', 'USD', 'USDC'];

  return (
    <div
      style={{
        display: 'inline-flex',
        borderRadius: 999,
        background: 'rgba(30, 41, 59, 0.7)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        padding: 2,
      }}
    >
      {currencies.map((c) => {
        const isSelected = currentCurrency === c;
        return (
          <button
            key={c}
            onClick={() => onChange(c)}
            style={{
              padding: '3px 9px',
              borderRadius: 999,
              background: isSelected ? '#38bdf8' : 'transparent',
              color: isSelected ? '#0f172a' : 'var(--text-muted)',
              border: 'none',
              fontSize: '0.72rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {c}
          </button>
        );
      })}
    </div>
  );
};
