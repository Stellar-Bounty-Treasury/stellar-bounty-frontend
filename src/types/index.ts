export interface Bounty {
  id: number;
  title: string;
  description: string;
  creator_address: string;
  target_amount: number;
  funded_amount: number;
  status: 'open' | 'funded' | 'settled' | 'cancelled';
  created_at: string;
  updated_at: string;
  contributions?: Contribution[];
}

export interface Contribution {
  id: number;
  bounty_id: number;
  contributor_address: string;
  amount: number;
  transaction_hash: string;
  status: 'pending' | 'confirmed' | 'failed';
  created_at: string;
}

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  balance: number | null;
  isLoading: boolean;
  error: string | null;
  walletType: 'freighter' | 'testnet_signer' | null;
}

export interface CreateBountyPayload {
  title: string;
  description: string;
  creator_address: string;
  target_amount: number;
}
