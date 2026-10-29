import React from 'react';
import { Zap, ShieldCheck, DollarSign, Globe } from 'lucide-react';

export const EcosystemShowcase: React.FC = () => {
  const features = [
    {
      title: '5-Second Finality',
      desc: 'Sub-second consensus via Stellar Consensus Protocol (SCP) with immediate ledger settlement.',
      icon: <Zap size={22} color="#38bdf8" />,
    },
    {
      title: '$0.00001 Gas Fees',
      desc: 'Near-zero resource fees ensuring 100% of bounty funding reaches builders rather than miners.',
      icon: <DollarSign size={22} color="#34d399" />,
    },
    {
      title: 'Soroban Smart Contracts',
      desc: 'WASM-native, deterministic execution with atomic reentrancy protection and programmable routing.',
      icon: <ShieldCheck size={22} color="#818cf8" />,
    },
    {
      title: 'SEP Standards Native',
      desc: 'Built on SEP-0001, SEP-0007, and SEP-0010 for turnkey Freighter, Albedo, and mobile wallet support.',
      icon: <Globe size={22} color="#facc15" />,
    },
  ];

  return (
    <div style={{ margin: '40px 0 20px 0' }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', margin: 0 }}>
          Powered 100% by Stellar & Soroban
        </h2>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 6 }}>
          Next-generation treasury infrastructure designed for high-performance open-source ecosystems
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
        {features.map((f, i) => (
          <div key={i} className="glass-panel" style={{ padding: '20px', borderRadius: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
              {f.icon}
            </div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', margin: '0 0 6px 0' }}>{f.title}</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
