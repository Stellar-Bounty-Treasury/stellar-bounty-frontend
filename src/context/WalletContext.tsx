import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Keypair } from '@stellar/stellar-sdk';
import { stellar } from '../services/stellar';
import { WalletState } from '../types';

interface WalletContextType extends WalletState {
  connectFreighter: () => Promise<void>;
  connectTestnetKeypair: (secretOrNew?: string) => Promise<void>;
  disconnect: () => void;
  refreshBalance: () => Promise<void>;
  fundWithFriendbot: () => Promise<void>;
  secretKey: string | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    address: null,
    balance: null,
    isLoading: false,
    error: null,
    walletType: null,
  });

  const [secretKey, setSecretKey] = useState<string | null>(null);

  const fetchBalance = useCallback(async (pubKey: string) => {
    try {
      const bal = await stellar.getXlmBalance(pubKey);
      setWalletState((prev) => ({ ...prev, balance: bal, error: null }));
    } catch (err: any) {
      console.warn('Could not fetch balance:', err);
    }
  }, []);

  const refreshBalance = useCallback(async () => {
    if (walletState.address) {
      await fetchBalance(walletState.address);
    }
  }, [walletState.address, fetchBalance]);

  // Connect Freighter
  const connectFreighter = async () => {
    setWalletState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const isInstalled = await stellar.isFreighterInstalled();
      if (!isInstalled) {
        throw new Error('Freighter wallet extension is not installed. Please install it or use the Testnet Dev Keypair.');
      }
      const address = await stellar.getFreighterAddress();
      const balance = await stellar.getXlmBalance(address);

      setWalletState({
        isConnected: true,
        address,
        balance,
        isLoading: false,
        error: null,
        walletType: 'freighter',
      });
      setSecretKey(null);
    } catch (err: any) {
      setWalletState((prev) => ({
        ...prev,
        isLoading: false,
        error: err.message || 'Failed to connect Freighter wallet',
      }));
    }
  };

  // Connect / Generate Testnet Keypair
  const connectTestnetKeypair = async (secret?: string) => {
    setWalletState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      let kp: Keypair;
      if (secret && secret.trim().startsWith('S')) {
        kp = Keypair.fromSecret(secret.trim());
      } else {
        kp = Keypair.random();
        // Automatically fund brand new testnet keypair via Friendbot
        try {
          await stellar.fundWithFriendbot(kp.publicKey());
        } catch (e) {
          console.warn('Friendbot error during auto-fund:', e);
        }
      }

      const address = kp.publicKey();
      const balance = await stellar.getXlmBalance(address);

      setWalletState({
        isConnected: true,
        address,
        balance,
        isLoading: false,
        error: null,
        walletType: 'testnet_signer',
      });
      setSecretKey(kp.secret());
    } catch (err: any) {
      setWalletState((prev) => ({
        ...prev,
        isLoading: false,
        error: err.message || 'Failed to load testnet keypair',
      }));
    }
  };

  // Disconnect
  const disconnect = () => {
    setWalletState({
      isConnected: false,
      address: null,
      balance: null,
      isLoading: false,
      error: null,
      walletType: null,
    });
    setSecretKey(null);
  };

  // Friendbot faucet fund
  const fundWithFriendbot = async () => {
    if (!walletState.address) return;
    setWalletState((prev) => ({ ...prev, isLoading: true }));
    try {
      await stellar.fundWithFriendbot(walletState.address);
      await fetchBalance(walletState.address);
    } catch (err: any) {
      setWalletState((prev) => ({
        ...prev,
        error: `Friendbot funding error: ${err.message}`,
      }));
    } finally {
      setWalletState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <WalletContext.Provider
      value={{
        ...walletState,
        connectFreighter,
        connectTestnetKeypair,
        disconnect,
        refreshBalance,
        fundWithFriendbot,
        secretKey,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useWallet must be used within a WalletProvider');
  return ctx;
};
