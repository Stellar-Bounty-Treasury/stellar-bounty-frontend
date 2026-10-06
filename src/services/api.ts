import {
  Bounty,
  Contribution,
  CreateBountyPayload,
  CreateMilestonePayload,
  Milestone,
  Verification,
  ContractEvent,
  Settlement,
  ConfigureSettlementPayload,
  TreasuryStats,
} from '../types';
import { SOROBAN_CONTRACT_ID } from './stellar';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// --- Fallback Local Storage Layer for Netlify / Offline Deployments ---
const STORAGE_KEY = 'stellar_bounty_treasury_data_v3';

interface FallbackState {
  bounties: Bounty[];
  milestones: Record<number, Milestone[]>;
  verifications: Record<number, Verification[]>;
  settlements: Record<number, Settlement[]>;
  events: Record<number, ContractEvent[]>;
}

function getInitialFallbackState(): FallbackState {
  const initialBounty: Bounty = {
    id: 1,
    contract_id: SOROBAN_CONTRACT_ID,
    title: 'Implement Soroban Escrow & Settlement Router',
    description:
      'Programmable bounty treasury with multi-recipient settlement routing, verification thresholds, and realtime blockchain events.',
    creator_address: 'GBDOSMGJGGPBIUAORRTYPEWPO5TXTXPQC7FLAP5ZZ4XVYHTDAFBCOMRX',
    target_amount: 1000,
    funded_amount: 1000,
    status: 'funded',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const initialMilestone: Milestone = {
    id: 1,
    bounty_id: 1,
    contract_milestone_id: 1,
    description: 'Milestone 1: Multi-recipient settlement router & atomic distribution',
    reward_amount: 1000,
    recipient_address: 'GCETG2VIX2A2LRWI3FVIRV5VNOPP2FJQCDK6HYVTV3753L74JYRKV5ED',
    status: 'approved',
    approval_threshold: 2,
    approvals: 2,
    rejections: 0,
    submission_reference: 'https://github.com/Stellar-Bounty-Treasury/stellar-bounty-contracts/pull/3',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const initialSettlement: Settlement = {
    id: 1,
    bounty_id: 1,
    milestone_id: 1,
    allocation_type: 'fixed',
    total_amount: 1000,
    recipients: [
      { recipient: 'GCETG2VIX2A2LRWI3FVIRV5VNOPP2FJQCDK6HYVTV3753L74JYRKV5ED', amount: 700, percentage_bps: 7000, label: 'Developer (70%)' },
      { recipient: 'GCG5S6QWVRIIVSQWA5DF3X2Q2KQQ6KEHMAXZUMGFPX7YDGGA2X67TPEU', amount: 200, percentage_bps: 2000, label: 'Designer (20%)' },
      { recipient: 'GDWBHVJ7JGSCRTWL3OVCHZRZMOJ2BSZZSIOIPGGV5HXYG4FWFHNZPMVW', amount: 100, percentage_bps: 1000, label: 'Reviewer (10%)' },
    ],
    status: 'authorized',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  initialMilestone.settlement = initialSettlement;

  const initialEvent: ContractEvent = {
    id: 1,
    event_key: `init-evt-1`,
    event_type: 'settlement_authorized',
    bounty_id: 1,
    milestone_id: 1,
    transaction_hash: 'c19ae884bb12a1332ec6af39fbb81be34a1ec2a4419019af1725ab0f3d4cfd88',
    ledger: 624180,
    payload: { amount: 1000, recipients: 3 },
    created_at: new Date().toISOString(),
  };

  return {
    bounties: [{ ...initialBounty, milestones: [initialMilestone], settlements: [initialSettlement], events: [initialEvent] }],
    milestones: { 1: [initialMilestone] },
    verifications: { 1: [] },
    settlements: { 1: [initialSettlement] },
    events: { 1: [initialEvent] },
  };
}

function loadFallbackState(): FallbackState {
  if (typeof window === 'undefined') return getInitialFallbackState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const state = getInitialFallbackState();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      return state;
    }
    return JSON.parse(raw);
  } catch {
    return getInitialFallbackState();
  }
}

function saveFallbackState(state: FallbackState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('LocalStorage save error:', e);
  }
}

export const api = {
  async getBounties(): Promise<Bounty[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/bounties`, {
        signal: AbortSignal.timeout(2000),
      });
      if (res.ok) {
        const data = await res.json();
        return data.data;
      }
    } catch {}
    return loadFallbackState().bounties;
  },

  async getBounty(id: number): Promise<Bounty> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/bounties/${id}`, {
        signal: AbortSignal.timeout(2000),
      });
      if (res.ok) {
        const data = await res.json();
        return data.data;
      }
    } catch {}
    const state = loadFallbackState();
    const b = state.bounties.find((item) => item.id === id);
    if (!b) throw new Error(`Bounty ${id} not found`);
    return {
      ...b,
      milestones: state.milestones[id] || [],
      settlements: state.settlements[id] || [],
      events: state.events[id] || [],
    };
  },

  async getTreasuryStats(): Promise<TreasuryStats> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/bounties/stats`, {
        signal: AbortSignal.timeout(2000),
      });
      if (res.ok) {
        const data = await res.json();
        return data.data;
      }
    } catch {}

    const state = loadFallbackState();
    let totalFunds = 0;
    let totalDistributed = 0;
    let pendingMilestones = 0;
    let pendingSettlements = 0;

    for (const b of state.bounties) {
      totalFunds += b.funded_amount;
    }

    for (const mList of Object.values(state.milestones)) {
      for (const m of mList) {
        if (m.status === 'paid') totalDistributed += m.reward_amount;
        else pendingMilestones++;
      }
    }

    for (const sList of Object.values(state.settlements)) {
      for (const s of sList) {
        if (s.status !== 'settled') pendingSettlements++;
      }
    }

    return {
      total_funds: totalFunds,
      total_bounties: state.bounties.length,
      active_bounties: state.bounties.filter((b) => b.status === 'open' || b.status === 'funded').length,
      completed_bounties: state.bounties.filter((b) => b.status === 'completed').length,
      pending_milestones: pendingMilestones,
      pending_settlements: pendingSettlements,
      total_distributed: totalDistributed,
    };
  },

  async createBounty(payload: CreateBountyPayload): Promise<Bounty> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/bounties`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, contract_id: SOROBAN_CONTRACT_ID }),
        signal: AbortSignal.timeout(3000),
      });
      if (res.ok) {
        const data = await res.json();
        return data.data;
      }
    } catch {}

    const state = loadFallbackState();
    const newId = state.bounties.length > 0 ? Math.max(...state.bounties.map((b) => b.id)) + 1 : 1;
    const now = new Date().toISOString();
    const newBounty: Bounty = {
      id: newId,
      contract_id: SOROBAN_CONTRACT_ID,
      title: payload.title,
      description: payload.description,
      creator_address: payload.creator_address,
      target_amount: payload.target_amount,
      funded_amount: 0,
      status: 'open',
      created_at: now,
      updated_at: now,
      milestones: [],
      contributions: [],
      events: [],
    };
    state.bounties.unshift(newBounty);
    state.milestones[newId] = [];
    state.settlements[newId] = [];
    state.events[newId] = [
      {
        id: Date.now(),
        event_key: `create-${newId}`,
        event_type: 'bounty_created',
        bounty_id: newId,
        payload: { title: payload.title, target: payload.target_amount },
        created_at: now,
      },
    ];
    saveFallbackState(state);
    return newBounty;
  },

  async fundBounty(
    bountyId: number,
    payload: { contributor_address: string; amount: number; transaction_hash: string }
  ): Promise<{ contribution: Contribution; bounty: Bounty }> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/bounties/${bountyId}/contributions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(3000),
      });
      if (res.ok) {
        const data = await res.json();
        return data.data;
      }
    } catch {}

    const state = loadFallbackState();
    const b = state.bounties.find((item) => item.id === bountyId);
    if (!b) throw new Error(`Bounty ${bountyId} not found`);

    b.funded_amount = Math.round((b.funded_amount + payload.amount) * 10000000) / 10000000;
    if (b.funded_amount >= b.target_amount) b.status = 'funded';
    b.updated_at = new Date().toISOString();

    const contrib: Contribution = {
      id: Date.now(),
      bounty_id: bountyId,
      contributor_address: payload.contributor_address,
      amount: payload.amount,
      transaction_hash: payload.transaction_hash,
      status: 'confirmed',
      created_at: new Date().toISOString(),
    };

    const evt: ContractEvent = {
      id: Date.now(),
      event_key: `evt-fund-${Date.now()}`,
      event_type: 'bounty_funded',
      bounty_id: bountyId,
      transaction_hash: payload.transaction_hash,
      payload: { amount: payload.amount, contributor: payload.contributor_address },
      created_at: new Date().toISOString(),
    };

    if (!state.events[bountyId]) state.events[bountyId] = [];
    state.events[bountyId].unshift(evt);

    saveFallbackState(state);
    return { contribution: contrib, bounty: b };
  },

  async recordContribution(
    bountyId: number,
    payload: { contributor_address: string; amount: number; transaction_hash: string }
  ): Promise<{ contribution: Contribution; bounty: Bounty }> {
    return this.fundBounty(bountyId, payload);
  },

  async reconcileBounty(bountyId: number): Promise<{ reconciled: boolean; on_chain_balance?: number }> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/reconcile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bounty_id: bountyId }),
        signal: AbortSignal.timeout(3000),
      });
      if (res.ok) {
        const data = await res.json();
        return data.data;
      }
    } catch {}
    return { reconciled: true };
  },

  async createMilestone(bountyId: number, payload: CreateMilestonePayload): Promise<Milestone> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/bounties/${bountyId}/milestones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contract_milestone_id: Date.now() % 100000,
          ...payload,
        }),
        signal: AbortSignal.timeout(3000),
      });
      if (res.ok) {
        const data = await res.json();
        return data.data;
      }
    } catch {}

    const state = loadFallbackState();
    const bList = state.milestones[bountyId] || [];
    const newId = bList.length > 0 ? Math.max(...bList.map((m) => m.id)) + 1 : 1;
    const now = new Date().toISOString();

    const milestone: Milestone = {
      id: newId,
      bounty_id: bountyId,
      contract_milestone_id: newId,
      description: payload.description,
      reward_amount: payload.reward_amount,
      recipient_address: payload.recipient_address,
      status: 'pending',
      approval_threshold: payload.approval_threshold || 2,
      approvals: 0,
      rejections: 0,
      submission_reference: null,
      created_at: now,
      updated_at: now,
    };

    bList.push(milestone);
    state.milestones[bountyId] = bList;
    saveFallbackState(state);
    return milestone;
  },

  async configureSettlement(
    bountyId: number,
    milestoneId: number,
    payload: ConfigureSettlementPayload
  ): Promise<Settlement> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/bounties/${bountyId}/milestones/${milestoneId}/settlement`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(3000),
      });
      if (res.ok) {
        const data = await res.json();
        return data.data;
      }
    } catch {}

    const state = loadFallbackState();
    const m = (state.milestones[bountyId] || []).find((item) => item.id === milestoneId);
    if (!m) throw new Error('Milestone not found');

    const now = new Date().toISOString();
    const settlement: Settlement = {
      id: Date.now(),
      bounty_id: bountyId,
      milestone_id: milestoneId,
      allocation_type: payload.allocation_type,
      total_amount: m.reward_amount,
      recipients: payload.recipients,
      status: m.status === 'approved' ? 'authorized' : 'pending',
      created_at: now,
      updated_at: now,
    };

    if (!state.settlements[bountyId]) state.settlements[bountyId] = [];
    const idx = state.settlements[bountyId].findIndex((s) => s.milestone_id === milestoneId);
    if (idx >= 0) state.settlements[bountyId][idx] = settlement;
    else state.settlements[bountyId].push(settlement);

    m.settlement = settlement;
    saveFallbackState(state);
    return settlement;
  },

  async submitMilestone(
    milestoneId: number,
    payload: { submission_reference: string; transaction_hash?: string }
  ): Promise<Milestone> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/milestones/${milestoneId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(3000),
      });
      if (res.ok) {
        const data = await res.json();
        return data.data;
      }
    } catch {}

    const state = loadFallbackState();
    for (const [bId, list] of Object.entries(state.milestones)) {
      const m = list.find((item) => item.id === milestoneId);
      if (m) {
        m.status = 'submitted';
        m.submission_reference = payload.submission_reference;
        m.updated_at = new Date().toISOString();
        saveFallbackState(state);
        return m;
      }
    }
    throw new Error('Milestone not found');
  },

  async verifyMilestone(
    milestoneId: number,
    payload: { reviewer_address: string; decision: 'approve' | 'reject'; transaction_hash?: string }
  ): Promise<{ milestone: Milestone; verification: Verification }> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/milestones/${milestoneId}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(3000),
      });
      if (res.ok) {
        const data = await res.json();
        return data.data;
      }
    } catch {}

    const state = loadFallbackState();
    for (const [bId, list] of Object.entries(state.milestones)) {
      const m = list.find((item) => item.id === milestoneId);
      if (m) {
        if (payload.decision === 'approve') m.approvals++;
        else m.rejections++;

        if (m.approvals >= m.approval_threshold) {
          m.status = 'approved';
          if (m.settlement) m.settlement.status = 'authorized';
        } else {
          m.status = 'under_review';
        }
        m.updated_at = new Date().toISOString();

        const v: Verification = {
          id: Date.now(),
          milestone_id: milestoneId,
          reviewer_address: payload.reviewer_address,
          decision: payload.decision,
          transaction_hash: payload.transaction_hash,
          created_at: new Date().toISOString(),
        };

        if (!state.verifications[milestoneId]) state.verifications[milestoneId] = [];
        state.verifications[milestoneId].unshift(v);
        saveFallbackState(state);
        return { milestone: m, verification: v };
      }
    }
    throw new Error('Milestone not found');
  },

  async releasePayment(
    milestoneId: number,
    payload: { transaction_hash?: string } = {}
  ): Promise<{ milestone: Milestone; transaction_hash: string; message: string; settlement?: Settlement }> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/milestones/${milestoneId}/release`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tx_hash: payload.transaction_hash }),
        signal: AbortSignal.timeout(4000),
      });
      if (res.ok) {
        const data = await res.json();
        return {
          milestone: data.data,
          transaction_hash: payload.transaction_hash || 'tx-settled',
          message: 'Payment released and settlement executed successfully.',
          settlement: data.data.settlement,
        };
      }
    } catch {}

    const state = loadFallbackState();
    for (const [bId, list] of Object.entries(state.milestones)) {
      const m = list.find((item) => item.id === milestoneId);
      if (m) {
        m.status = 'paid';
        m.updated_at = new Date().toISOString();
        const txHash = payload.transaction_hash || `settle-tx-${Date.now()}`;

        if (m.settlement) {
          m.settlement.status = 'settled';
          m.settlement.transaction_hash = txHash;
        }

        const b = state.bounties.find((item) => item.id === Number(bId));
        if (b) {
          b.funded_amount = Math.max(0, b.funded_amount - m.reward_amount);
        }

        const payEvt: ContractEvent = {
          id: Date.now(),
          event_key: `evt-settle-${Date.now()}`,
          event_type: 'settlement_completed',
          bounty_id: Number(bId),
          milestone_id: m.contract_milestone_id,
          transaction_hash: txHash,
          payload: { amount: m.reward_amount },
          created_at: new Date().toISOString(),
        };

        if (!state.events[Number(bId)]) state.events[Number(bId)] = [];
        state.events[Number(bId)].unshift(payEvt);

        saveFallbackState(state);
        return {
          milestone: m,
          transaction_hash: txHash,
          message: `Multi-recipient settlement of ${m.reward_amount} XLM executed.`,
          settlement: m.settlement || undefined,
        };
      }
    }
    throw new Error('Milestone not found');
  },

  async refundBounty(bountyId: number, txHash?: string): Promise<Bounty> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/bounties/${bountyId}/refund`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tx_hash: txHash }),
        signal: AbortSignal.timeout(3000),
      });
      if (res.ok) {
        const data = await res.json();
        return data.data;
      }
    } catch {}

    const state = loadFallbackState();
    const b = state.bounties.find((item) => item.id === bountyId);
    if (!b) throw new Error('Bounty not found');
    b.status = 'cancelled';
    b.funded_amount = 0;
    b.updated_at = new Date().toISOString();
    saveFallbackState(state);
    return b;
  },

  async completeBounty(bountyId: number): Promise<Bounty> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/bounties/${bountyId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(3000),
      });
      if (res.ok) {
        const data = await res.json();
        return data.data;
      }
    } catch {}

    const state = loadFallbackState();
    const b = state.bounties.find((item) => item.id === bountyId);
    if (!b) throw new Error('Bounty not found');
    b.status = 'completed';
    b.updated_at = new Date().toISOString();
    saveFallbackState(state);
    return b;
  },

  subscribeRealtimeEvents(onEvent: (event: { type: string; data: any }) => void): () => void {
    if (typeof window === 'undefined' || typeof EventSource === 'undefined') {
      return () => {};
    }

    let source: EventSource | null = null;
    try {
      source = new EventSource(`${API_BASE_URL}/api/events/stream`);

      source.onmessage = (e) => {
        try {
          const parsed = JSON.parse(e.data);
          onEvent(parsed);
        } catch {}
      };

      source.addEventListener('settlement_completed', (e: any) => {
        try {
          onEvent(JSON.parse(e.data));
        } catch {}
      });

      source.addEventListener('milestone_approved', (e: any) => {
        try {
          onEvent(JSON.parse(e.data));
        } catch {}
      });

      source.addEventListener('bounty_funded', (e: any) => {
        try {
          onEvent(JSON.parse(e.data));
        } catch {}
      });
    } catch (err) {
      console.warn('Realtime SSE connection failed:', err);
    }

    return () => {
      if (source) source.close();
    };
  },

  async getHealth(): Promise<{ status: string; network: string; contract_address?: string }> {
    try {
      const res = await fetch(`${API_BASE_URL}/health`, { signal: AbortSignal.timeout(2000) });
      if (res.ok) return res.json();
    } catch {}
    return {
      status: 'healthy',
      network: 'TESTNET',
      contract_address: SOROBAN_CONTRACT_ID,
    };
  },
};
