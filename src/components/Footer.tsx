import React from 'react';
import { ExternalLink, Code2, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer style={{ marginTop: 60, padding: '30px 0', borderTop: '1px solid rgba(255, 255, 255, 0.08)', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <strong style={{ color: '#fff' }}>Stellar Bounty Treasury</strong> • Hackathon Production Edition
          <div style={{ marginTop: 4, fontSize: '0.75rem' }}>
            Built for the global Stellar & Soroban developer community.
          </div>
        </div>

        <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
          <a
            href="https://github.com/Stellar-Bounty-Treasury"
            target="_blank"
            rel="noreferrer"
            style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}
          >
            <Code2 size={14} /> GitHub Org
          </a>

          <a
            href="https://stellar.org"
            target="_blank"
            rel="noreferrer"
            style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}
          >
            <Globe size={14} /> Stellar.org
          </a>

          <a
            href="https://stellar.expert/explorer/testnet"
            target="_blank"
            rel="noreferrer"
            style={{ color: '#38bdf8', display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}
          >
            Stellar Expert <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </footer>
  );
};
