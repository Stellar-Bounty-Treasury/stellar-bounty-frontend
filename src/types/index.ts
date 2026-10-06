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
  settlement?: Settlement | null;
}

export interface Verification {
  id: number;
  milestone_id: number;
  reviewer_address: string;
  decision: 'approve' | 'reject';
  transaction_hash?: string | null;
  created_at: string;
}

export interface SettlementRecipient {
  recipient: string;
  amount: number;
  percentage_bps?: number;
  label?: string;
}

export interface Settlement {
  id: number;
  bounty_id: number;
  milestone_id: number;
  allocation_type: 'fixed' | 'percentage';
  total_amount: number;
  recipients: SettlementRecipient[];
  status: 'pending' | 'authorized' | 'executing' | 'settled' | 'failed';
  transaction_hash?: string | null;
  created_at: string;
  updated_at: string;
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
  status: 'open' | 'funded' | 'completed' | 'cancelled' | 'settled';
  created_at: string;
  updated_at: string;
  milestones?: Milestone[];
  contributions?: Contribution[];
  settlements?: Settlement[];
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

export interface ConfigureSettlementPayload {
  allocation_type: 'fixed' | 'percentage';
  recipients: SettlementRecipient[];
}

export interface TreasuryStats {
  total_funds: number;
  total_bounties: number;
  active_bounties: number;
  completed_bounties: number;
  pending_milestones: number;
  pending_settlements: number;
  total_distributed: number;
}
