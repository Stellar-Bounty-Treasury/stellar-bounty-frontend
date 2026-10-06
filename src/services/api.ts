import { Bounty, Contribution, CreateBountyPayload } from '../types';

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

  async getHealth(): Promise<{ status: string; network: string }> {
    const res = await fetch(`${API_BASE_URL}/health`);
    if (!res.ok) throw new Error('Backend unhealthy');
    return res.json();
  },
};
