export interface Milestone {
  id: number;
  bounty_id: number;
  contract_milestone_id: number;
  description: string;
  reward_amount: number;
  recipient_address: string;
  status: 'pending' | 'submitted' | 'under_review' | 'approved' | 'paid' | 'rejected';
  approval_threshold: number;
  approvals: number;
  rejections: number;
  submission_reference?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Verification {
  id: number;
  milestone_id: number;
  reviewer_address: string;
  decision: 'approve' | 'reject';
  transaction_hash?: string | null;
  created_at: string;
}

export interface ContractEvent {
  id: number;
  event_key: string;
  event_type: string;
  bounty_id?: number | null;
  milestone_id?: number | null;
  transaction_hash?: string | null;
  ledger?: number | null;
  payload: any;
  created_at: string;
}

export interface Bounty {
  id: number;
  contract_id?: string;
  title: string;
  description: string;
  creator_address: string;
  target_amount: number;
  funded_amount: number;
  status: 'open' | 'funded' | 'settled' | 'cancelled';
  created_at: string;
  updated_at: string;
  milestones?: Milestone[];
  contributions?: Contribution[];
  events?: ContractEvent[];
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

export interface CreateMilestonePayload {
  description: string;
  reward_amount: number;
  recipient_address: string;
  approval_threshold?: number;
}
