export interface DemoBountySeed {
  id: number;
  title: string;
  description: string;
  category: string;
  target_amount: number;
  funded_amount: number;
  status: 'open' | 'funded' | 'completed';
  token_symbol: string;
}

export const DEMO_SHOWCASE_BOUNTIES: DemoBountySeed[] = [
  {
    id: 101,
    title: 'Soroban Rust SDK Security Invariant Test Suite',
    description: 'Implement formal invariant tests verifying escrow solvency and reentrancy protection on Soroban.',
    category: 'Security',
    target_amount: 5000,
    funded_amount: 5000,
    status: 'funded',
    token_symbol: 'XLM',
  },
  {
    id: 102,
    title: 'SEP-0024 Cross-Currency Fiat On-Ramp Integration',
    description: 'Build interactive deposit and withdrawal flow connecting Stellar anchors to local bank accounts.',
    category: 'DeFi',
    target_amount: 12000,
    funded_amount: 12000,
    status: 'open',
    token_symbol: 'USDC',
  },
  {
    id: 103,
    title: 'Flutter Mobile Wallet Freighter & Albedo Bridge',
    description: 'Cross-platform mobile signing wrapper for Freighter webview and Albedo deep links.',
    category: 'Mobile',
    target_amount: 7500,
    funded_amount: 7500,
    status: 'completed',
    token_symbol: 'XLM',
  },
  {
    id: 104,
    title: 'Automated Soroban Contract Event Indexer',
    description: 'Real-time SSE event indexing engine connecting Soroban RPC to native SQLite storage.',
    category: 'Infrastructure',
    target_amount: 8000,
    funded_amount: 8000,
    status: 'funded',
    token_symbol: 'XLM',
  },
];
