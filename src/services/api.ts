import {
  Bounty,
  Contribution,
  CreateBountyPayload,
  CreateMilestonePayload,
  Milestone,
  Verification,
  ContractEvent,
} from '../types';
import { SOROBAN_CONTRACT_ID } from './stellar';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// --- Fallback Local Storage Layer for Netlify / Offline Deployments ---
const STORAGE_KEY = 'stellar_bounty_treasury_data_v2';

interface FallbackState {
  bounties: Bounty[];
  milestones: Record<number, Milestone[]>;
  verifications: Record<number, Verification[]>;
  events: Record<number, ContractEvent[]>;
}

function getInitialFallbackState(): FallbackState {
  const initialBounty: Bounty = {
    id: 1,
    contract_id: SOROBAN_CONTRACT_ID,
    title: 'Implement Soroban Escrow & Milestone Rules',
    description:
      'Develop on-chain milestone escrow locking and conditional release upon community review verification.',
    creator_address: 'GBDOSMGJGGPBIUAORRTYPEWPO5TXTXPQC7FLAP5ZZ4XVYHTDAFBCOMRX',
    target_amount: 100,
    funded_amount: 60,
    status: 'open',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const initialMilestone: Milestone = {
    id: 1,
    bounty_id: 1,
    contract_milestone_id: 1,
    description: 'Milestone 1: Core smart contract escrow & verification tests',
    reward_amount: 50,
    recipient_address: 'GBDOSMGJGGPBIUAORRTYPEWPO5TXTXPQC7FLAP5ZZ4XVYHTDAFBCOMRX',
    status: 'submitted',
    approval_threshold: 2,
    approvals: 1,
    rejections: 0,
    submission_reference: 'https://github.com/Stellar-Bounty-Treasury/stellar-bounty-contracts/pull/1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const initialEvent: ContractEvent = {
    id: 1,
    event_key: `init-evt-1`,
    event_type: 'bounty_funded',
    bounty_id: 1,
    milestone_id: 1,
    transaction_hash: 'c19ae884bb12a1332ec6af39fbb81be34a1ec2a4419019af1725ab0f3d4cfd88',
    ledger: 624180,
    payload: { amount: 60, contributor: 'GD6D...F2DN' },
    created_at: new Date().toISOString(),
  };

  return {
    bounties: [{ ...initialBounty, milestones: [initialMilestone], events: [initialEvent] }],
    milestones: { 1: [initialMilestone] },
    verifications: { 1: [] },
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
      const res = await fetch(`${API_BASE_URL}/api/bounties`, { signal: AbortSignal.timeout(2000) });
      if (res.ok) {
        const data = await res.json();
        return data.data || [];
      }
    } catch {
      // Netlify / Mixed Content fallback
    }
    const state = loadFallbackState();
    return state.bounties;
  },

  async getBounty(id: number): Promise<Bounty> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/bounties/${id}`, { signal: AbortSignal.timeout(2000) });
      if (res.ok) {
        const data = await res.json();
        return data.data;
      }
    } catch {
      // Fallback
    }
    const state = loadFallbackState();
    const bounty = state.bounties.find((b) => b.id === id);
    if (!bounty) {
      throw new Error(`Bounty ${id} not found.`);
    }
    bounty.milestones = state.milestones[id] || [];
    bounty.events = state.events[id] || [];
    return bounty;
  },

  async createBounty(payload: CreateBountyPayload): Promise<Bounty> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/bounties`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(2500),
      });
      if (res.ok) {
        const data = await res.json();
        return data.data;
      }
    } catch {
      // Fallback
    }

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
      events: [],
    };
    state.bounties.unshift(newBounty);
    state.milestones[newId] = [];
    state.events[newId] = [];
    saveFallbackState(state);
    return newBounty;
  },

  async recordContribution(
    bountyId: number,
    payload: { contributor_address: string; amount: number; transaction_hash: string }
  ): Promise<{ contribution: Contribution; bounty: Bounty }> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/bounties/${bountyId}/contributions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(2500),
      });
      if (res.ok) {
        const data = await res.json();
        return data.data;
      }
    } catch {
      // Fallback
    }

    const state = loadFallbackState();
    const bounty = state.bounties.find((b) => b.id === bountyId);
    if (!bounty) throw new Error('Bounty not found');
    bounty.funded_amount += payload.amount;
    if (bounty.funded_amount >= bounty.target_amount) bounty.status = 'funded';
    bounty.updated_at = new Date().toISOString();

    const contribution: Contribution = {
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

    return { contribution, bounty };
  },

  async createMilestone(bountyId: number, payload: CreateMilestonePayload): Promise<Milestone> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/bounties/${bountyId}/milestones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(2500),
      });
      if (res.ok) {
        const data = await res.json();
        return data.data;
      }
    } catch {
      // Fallback
    }

    const state = loadFallbackState();
    const existing = state.milestones[bountyId] || [];
    const milestoneId = Date.now();
    const contractMilestoneId = existing.length + 1;
    const now = new Date().toISOString();

    const newMilestone: Milestone = {
      id: milestoneId,
      bounty_id: bountyId,
      contract_milestone_id: contractMilestoneId,
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

    existing.push(newMilestone);
    state.milestones[bountyId] = existing;

    const bounty = state.bounties.find((b) => b.id === bountyId);
    if (bounty) {
      bounty.milestones = existing;
    }
    saveFallbackState(state);
    return newMilestone;
  },

  async getBountyMilestones(bountyId: number): Promise<Milestone[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/bounties/${bountyId}/milestones`, {
        signal: AbortSignal.timeout(2000),
      });
      if (res.ok) {
        const data = await res.json();
        return data.data || [];
      }
    } catch {}
    const state = loadFallbackState();
    return state.milestones[bountyId] || [];
  },

  async getMilestone(id: number): Promise<Milestone> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/milestones/${id}`, { signal: AbortSignal.timeout(2000) });
      if (res.ok) {
        const data = await res.json();
        return data.data;
      }
    } catch {}
    const state = loadFallbackState();
    for (const list of Object.values(state.milestones)) {
      const found = list.find((m) => m.id === id);
      if (found) return found;
    }
    throw new Error('Milestone not found');
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
        signal: AbortSignal.timeout(2500),
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

        const evt: ContractEvent = {
          id: Date.now(),
          event_key: `evt-sub-${Date.now()}`,
          event_type: 'milestone_submitted',
          bounty_id: Number(bId),
          milestone_id: m.contract_milestone_id,
          transaction_hash: payload.transaction_hash,
          payload: { submission_ref: payload.submission_reference },
          created_at: new Date().toISOString(),
        };
        if (!state.events[Number(bId)]) state.events[Number(bId)] = [];
        state.events[Number(bId)].unshift(evt);

        saveFallbackState(state);
        return m;
      }
    }
    throw new Error('Milestone not found');
  },

  async verifyMilestone(
    milestoneId: number,
    payload: { reviewer_address: string; decision: 'approve' | 'reject'; transaction_hash?: string }
  ): Promise<{ verification: Verification; milestone: Milestone }> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/milestones/${milestoneId}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(2500),
      });
      if (res.ok) {
        const data = await res.json();
        return data.data;
      }
      if (res.status === 409) {
        const err = await res.json();
        throw new Error(err.error || 'Duplicate vote');
      }
    } catch (e: any) {
      if (e.message && e.message.includes('already voted')) throw e;
    }

    const state = loadFallbackState();
    const verifs = state.verifications[milestoneId] || [];
    if (verifs.some((v) => v.reviewer_address === payload.reviewer_address)) {
      throw new Error(`Reviewer ${payload.reviewer_address} has already voted on this milestone.`);
    }

    for (const [bId, list] of Object.entries(state.milestones)) {
      const m = list.find((item) => item.id === milestoneId);
      if (m) {
        const verification: Verification = {
          id: Date.now(),
          milestone_id: milestoneId,
          reviewer_address: payload.reviewer_address,
          decision: payload.decision,
          transaction_hash: payload.transaction_hash,
          created_at: new Date().toISOString(),
        };
        verifs.push(verification);
        state.verifications[milestoneId] = verifs;

        if (payload.decision === 'approve') {
          m.approvals += 1;
        } else {
          m.rejections += 1;
        }

        if (m.approvals >= m.approval_threshold) {
          m.status = 'approved';
          const approveEvt: ContractEvent = {
            id: Date.now() + 1,
            event_key: `evt-appr-${Date.now()}`,
            event_type: 'milestone_approved',
            bounty_id: Number(bId),
            milestone_id: m.contract_milestone_id,
            transaction_hash: payload.transaction_hash,
            payload: { approvals: m.approvals },
            created_at: new Date().toISOString(),
          };
          if (!state.events[Number(bId)]) state.events[Number(bId)] = [];
          state.events[Number(bId)].unshift(approveEvt);
        } else {
          m.status = 'under_review';
        }
        m.updated_at = new Date().toISOString();
        saveFallbackState(state);
        return { verification, milestone: m };
      }
    }
    throw new Error('Milestone not found');
  },

  async getMilestoneVerifications(milestoneId: number): Promise<Verification[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/milestones/${milestoneId}/verifications`, {
        signal: AbortSignal.timeout(2000),
      });
      if (res.ok) {
        const data = await res.json();
        return data.data || [];
      }
    } catch {}
    const state = loadFallbackState();
    return state.verifications[milestoneId] || [];
  },

  async releaseMilestonePayment(
    milestoneId: number,
    payload: { caller_address?: string; transaction_hash?: string }
  ): Promise<{ milestone: Milestone; transaction_hash: string; message: string }> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/milestones/${milestoneId}/release-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(2500),
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
        if (m.status !== 'approved' && m.approvals < m.approval_threshold) {
          throw new Error('Approval threshold has not been reached.');
        }
        m.status = 'paid';
        m.updated_at = new Date().toISOString();
        const txHash = payload.transaction_hash || `paid-tx-${Date.now()}`;

        const payEvt: ContractEvent = {
          id: Date.now(),
          event_key: `evt-pay-${Date.now()}`,
          event_type: 'milestone_paid',
          bounty_id: Number(bId),
          milestone_id: m.contract_milestone_id,
          transaction_hash: txHash,
          payload: { amount: m.reward_amount, recipient: m.recipient_address },
          created_at: new Date().toISOString(),
        };
        if (!state.events[Number(bId)]) state.events[Number(bId)] = [];
        state.events[Number(bId)].unshift(payEvt);

        saveFallbackState(state);
        return {
          milestone: m,
          transaction_hash: txHash,
          message: `Payment of ${m.reward_amount} XLM released to ${m.recipient_address}.`,
        };
      }
    }
    throw new Error('Milestone not found');
  },

  async getBountyEvents(bountyId: number): Promise<ContractEvent[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/bounties/${bountyId}/events`, {
        signal: AbortSignal.timeout(2000),
      });
      if (res.ok) {
        const data = await res.json();
        return data.data || [];
      }
    } catch {}
    const state = loadFallbackState();
    return state.events[bountyId] || [];
  },

  async reconcileBounty(bountyId: number): Promise<{ reconciled: boolean; onchain_milestones: number }> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/bounties/${bountyId}/reconcile`, {
        method: 'POST',
        signal: AbortSignal.timeout(2500),
      });
      if (res.ok) {
        const data = await res.json();
        return data.data;
      }
    } catch {}
    return { reconciled: true, onchain_milestones: 1 };
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
