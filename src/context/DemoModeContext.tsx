import React, { createContext, useContext, useState, ReactNode } from 'react';

export type PersonaRole = 'creator' | 'contributor' | 'arbitrator';

export interface Persona {
  id: PersonaRole;
  name: string;
  title: string;
  address: string;
  xlmBalance: number;
  usdcBalance: number;
  avatarBg: string;
}

export const DEMO_PERSONAS: Record<PersonaRole, Persona> = {
  creator: {
    id: 'creator',
    name: 'Alice Henderson',
    title: 'Stellar Foundation Grants Lead',
    address: 'GAALICE777TREASURYFOUNDATIONSTELLAR2026DEMO',
    xlmBalance: 25000,
    usdcBalance: 50000,
    avatarBg: '#38bdf8',
  },
  contributor: {
    id: 'contributor',
    name: 'Bob Chen',
    title: 'Senior Soroban / Rust Engineer',
    address: 'GBBOB888SOROBANDEVCONTRIBUTORSTELLAR2026',
    xlmBalance: 1250,
    usdcBalance: 2400,
    avatarBg: '#10b981',
  },
  arbitrator: {
    id: 'arbitrator',
    name: 'Charlie Vance',
    title: 'DeFi Governance Committee Arbitrator',
    address: 'GCCHARLIE999ARBITRATORGOVERNANCESTELLAR',
    xlmBalance: 8400,
    usdcBalance: 15000,
    avatarBg: '#f59e0b',
  },
};

interface DemoModeContextType {
  isDemoMode: boolean;
  activePersona: Persona;
  setPersonaRole: (role: PersonaRole) => void;
  toggleDemoMode: () => void;
  fundMockBalance: (amountXlm: number) => void;
}

const DemoModeContext = createContext<DemoModeContextType | undefined>(undefined);

export const DemoModeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [currentRole, setCurrentRole] = useState<PersonaRole>('creator');
  const [balances, setBalances] = useState<Record<PersonaRole, { xlm: number; usdc: number }>>({
    creator: { xlm: 25000, usdc: 50000 },
    contributor: { xlm: 1250, usdc: 2400 },
    arbitrator: { xlm: 8400, usdc: 15000 },
  });

  const toggleDemoMode = () => setIsDemoMode((prev) => !prev);

  const setPersonaRole = (role: PersonaRole) => {
    setCurrentRole(role);
  };

  const fundMockBalance = (amountXlm: number) => {
    setBalances((prev) => ({
      ...prev,
      [currentRole]: {
        ...prev[currentRole],
        xlm: prev[currentRole].xlm + amountXlm,
      },
    }));
  };

  const activePersona: Persona = {
    ...DEMO_PERSONAS[currentRole],
    xlmBalance: balances[currentRole].xlm,
    usdcBalance: balances[currentRole].usdc,
  };

  return (
    <DemoModeContext.Provider
      value={{
        isDemoMode,
        activePersona,
        setPersonaRole,
        toggleDemoMode,
        fundMockBalance,
      }}
    >
      {children}
    </DemoModeContext.Provider>
  );
};

export const useDemoMode = () => {
  const ctx = useContext(DemoModeContext);
  if (!ctx) {
    throw new Error('useDemoMode must be used within DemoModeProvider');
  }
  return ctx;
};
