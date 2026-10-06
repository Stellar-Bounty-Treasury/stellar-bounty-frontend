import {
  Bounty,
  Contribution,
  CreateBountyPayload,
  CreateMilestonePayload,
  Milestone,
  Verification,
  ContractEvent,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const api = {
  async getBounties(): Promise<Bounty[]> {
    const res = await fetch(`${API_BASE_URL}/api/bounties`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to fetch bounties (${res.status})`);
    }
    const data = await res.json();
    return data.data || [];
  },

  async getBounty(id: number): Promise<Bounty> {
    const res = await fetch(`${API_BASE_URL}/api/bounties/${id}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to fetch bounty details (${res.status})`);
    }
    const data = await res.json();
    return data.data;
  },

  async createBounty(payload: CreateBountyPayload): Promise<Bounty> {
    const res = await fetch(`${API_BASE_URL}/api/bounties`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to create bounty (${res.status})`);
    }
    const data = await res.json();
    return data.data;
  },

  async recordContribution(
    bountyId: number,
    payload: { contributor_address: string; amount: number; transaction_hash: string }
  ): Promise<{ contribution: Contribution; bounty: Bounty }> {
    const res = await fetch(`${API_BASE_URL}/api/bounties/${bountyId}/contributions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to record contribution (${res.status})`);
    }
    const data = await res.json();
    return data.data;
  },

  // --- Level 2 Milestones & Verification Endpoints ---

  async createMilestone(bountyId: number, payload: CreateMilestonePayload): Promise<Milestone> {
    const res = await fetch(`${API_BASE_URL}/api/bounties/${bountyId}/milestones`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to create milestone (${res.status})`);
    }
    const data = await res.json();
    return data.data;
  },

  async getBountyMilestones(bountyId: number): Promise<Milestone[]> {
    const res = await fetch(`${API_BASE_URL}/api/bounties/${bountyId}/milestones`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to fetch milestones (${res.status})`);
    }
    const data = await res.json();
    return data.data || [];
  },

  async getMilestone(id: number): Promise<Milestone> {
    const res = await fetch(`${API_BASE_URL}/api/milestones/${id}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to fetch milestone (${res.status})`);
    }
    const data = await res.json();
    return data.data;
  },

  async submitMilestone(
    milestoneId: number,
    payload: { submission_reference: string; transaction_hash?: string }
  ): Promise<Milestone> {
    const res = await fetch(`${API_BASE_URL}/api/milestones/${milestoneId}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to submit milestone (${res.status})`);
    }
    const data = await res.json();
    return data.data;
  },

  async verifyMilestone(
    milestoneId: number,
    payload: { reviewer_address: string; decision: 'approve' | 'reject'; transaction_hash?: string }
  ): Promise<{ verification: Verification; milestone: Milestone }> {
    const res = await fetch(`${API_BASE_URL}/api/milestones/${milestoneId}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to record verification vote (${res.status})`);
    }
    const data = await res.json();
    return data.data;
  },

  async getMilestoneVerifications(milestoneId: number): Promise<Verification[]> {
    const res = await fetch(`${API_BASE_URL}/api/milestones/${milestoneId}/verifications`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to fetch verifications (${res.status})`);
    }
    const data = await res.json();
    return data.data || [];
  },

  async releaseMilestonePayment(
    milestoneId: number,
    payload: { caller_address?: string; transaction_hash?: string }
  ): Promise<{ milestone: Milestone; transaction_hash: string; message: string }> {
    const res = await fetch(`${API_BASE_URL}/api/milestones/${milestoneId}/release-payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to release payment (${res.status})`);
    }
    const data = await res.json();
    return data.data;
  },

  async getBountyEvents(bountyId: number): Promise<ContractEvent[]> {
    const res = await fetch(`${API_BASE_URL}/api/bounties/${bountyId}/events`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to fetch events (${res.status})`);
    }
    const data = await res.json();
    return data.data || [];
  },

  async reconcileBounty(bountyId: number): Promise<{ reconciled: boolean; onchain_milestones: number }> {
    const res = await fetch(`${API_BASE_URL}/api/bounties/${bountyId}/reconcile`, {
      method: 'POST',
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Reconciliation failed (${res.status})`);
    }
    const data = await res.json();
    return data.data;
  },

  async getHealth(): Promise<{ status: string; network: string; contract_address?: string }> {
    const res = await fetch(`${API_BASE_URL}/health`);
    if (!res.ok) throw new Error('Backend unhealthy');
    return res.json();
  },
};
