import React from 'react';
import { Coins } from 'lucide-react';

export interface SupportedAsset {
  code: string;
  name: string;
  issuer?: string;
  contractId?: string;
  symbol: string;
}

export const SUPPORTED_ASSETS: SupportedAsset[] = [
  { code: 'XLM', name: 'Stellar Lumens', symbol: 'XLM' },
  { code: 'USDC', name: 'Circle USD Coin', symbol: 'USDC', issuer: 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5' },
  { code: 'EURC', name: 'Circle Euro Coin', symbol: 'EURC', issuer: 'GD6WFGQC3WXB5JR7JLD4S4Q4A5JUGM3L2R32XQ4Q6XGVO4774BOMM3HQ' },
];

interface AssetSelectorProps {
  selectedAsset: string;
  onSelect: (assetCode: string) => void;
}

export const AssetSelector: React.FC<AssetSelectorProps> = ({ selectedAsset, onSelect }) => {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {SUPPORTED_ASSETS.map((asset) => {
        const isSelected = selectedAsset === asset.code;
        return (
          <button
            key={asset.code}
            type="button"
            onClick={() => onSelect(asset.code)}
            style={{
              padding: '6px 12px',
              borderRadius: 8,
              background: isSelected ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              border: `1px solid ${isSelected ? '#38bdf8' : 'rgba(255, 255, 255, 0.1)'}`,
              color: isSelected ? '#38bdf8' : 'var(--text-muted)',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {asset.code}
          </button>
        );
      })}
    </div>
  );
};
