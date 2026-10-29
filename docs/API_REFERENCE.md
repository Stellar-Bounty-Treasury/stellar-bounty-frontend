# Stellar Bounty Treasury REST API Reference

Base URL: `https://api.bounties.stellar.org`

---

## Endpoints

### 1. Bounties
- `GET /api/bounties`: List filtered bounties with pagination.
- `POST /api/bounties`: Create new bounty escrow record.
- `GET /api/bounties/:id`: Fetch bounty details with milestones and settlements.

### 2. Settlements
- `POST /api/bounties/:id/milestones/:mId/settlement`: Configure 10,000 BPS distribution split.
- `GET /api/settlements/:id`: Get settlement execution details.

### 3. Simulation & Realtime
- `POST /api/bounties/soroban/simulate`: Pre-flight Soroban gas & CPU simulation.
- `GET /api/events/stream`: Server-Sent Events (SSE) live blockchain event feed.
- `GET /metrics`: Prometheus metric exposition.
