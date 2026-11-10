# Stellar Community Fund (SCF) Grant Proposal — Stellar Bounty Treasury

- **Project Name**: Stellar Bounty Treasury
- **Track**: Infrastructure & Developer Tooling / Public Goods
- **Target Network**: Stellar Mainnet & Soroban Testnet
- **Deployed Contract ID (Testnet)**: `CADMWQPCCQP27UHQU4JG3C6V5I3UFNNC4DVOMSK2GUJFA6Q2PNW36S52`
- **Funding Tier**: SCF Drips / Build Wave
- **Requested Funding**: $15,000 (USDC / XLM)

---

## 1. Executive Summary

**Stellar Bounty Treasury** is a decentralized, milestone-based conditional escrow protocol built natively on Soroban smart contracts. It enables DAOs, foundations, open-source projects, and grant committees to lock treasury funds, establish multi-threshold work verification, and execute atomic multi-recipient reward distributions (using 10,000 basis points fixed or proportional splits) in a single transaction on the Stellar network.

Unlike off-chain bounty boards that rely on manual payment processing and centralized admin control, Stellar Bounty Treasury guarantees on-chain atomicity, tamper-proof work review quorums, state rent TTL management, and transparent dispute resolution.

---

## 2. Problem Statement & Market Opportunity

Ecosystem grants and developer bounties across Web3 face severe operational bottlenecks:
1. **Capital Inefficiency & Non-Payment Risk**: Contributors risk non-payment after weeks of engineering, while grant programs risk paying upfront for incomplete deliverables.
2. **Multi-Contributor Allocation Complexity**: Modern software deliverables involve cross-functional teams (lead developer, designer, auditor). Existing tools cannot split single milestone rewards trustlessly without multiple separate gas-intensive transfers.
3. **Dispute Vulnerability**: Traditional bounty platforms rely on unilateral platform decisions without cryptographic appeal mechanisms or on-chain recourse.
4. **State Expiration Neglect on Soroban**: Many prototype contracts fail on Stellar Testnet and Mainnet because they lack proactive ledger storage rent (TTL) management, resulting in archived state when long-running bounties sit idle during deliverable review.

---

## 3. The Solution: Architecture & Soroban Advantages

Stellar Bounty Treasury leverages Soroban’s state machine, deterministic resource model, and Stellar Asset Contract (SAC) standards:

```text
       ┌────────────────────────────────────────────────────────┐
       │              Stellar Bounty Treasury Core              │
       │           (Soroban Smart Contract Protocol)            │
       └───────────────────────────┬────────────────────────────┘
                                   │
         ┌─────────────────────────┴─────────────────────────┐
         ▼                                                   ▼
┌───────────────────────────────┐   ┌───────────────────────────────┐
│     Milestone Governance      │   │   Atomic Settlement Router    │
│  • Work Submission Hashes     │   │  • 10,000 BPS Basis Point Math│
│  • Quorum Verification Votes  │   │  • Multi-Recipient Execution  │
│  • Threshold State Machine    │   │  • Automatic Storage Rent TTL │
└───────────────────────────────┘   └───────────────┬───────────────┘
                                                    │
                                ┌───────────────────┴───────────────────┐
                                ▼                   ▼                   ▼
                         ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
                         │ Contributor │     │ Reviewer /  │     │ Co-Dev /    │
                         │ Lead (70%)  │     │ QA (20%)    │     │ Docs (10%)  │
                         └─────────────┘     └─────────────┘     └─────────────┘
```

### Core Technical Pillars:
* **Programmable Settlement Router**: Supports both fixed-denomination payouts and proportional basis point allocations (10,000 BPS = 100.00%). The smart contract strictly enforces zero residue and zero over-allocation.
* **Proactive State Rent Management**: Storage TTL is automatically bumped on key state mutations (`create_bounty`, `fund_bounty`, `create_milestone`, `execute_settlement`), ensuring bounty vaults and milestone records survive long review periods without risk of state archival.
* **Soroban RPC Resource Simulation**: The frontend and TypeScript SDK perform pre-flight transaction simulations via `SorobanRpc.Server.simulateTransaction` to determine footprint read/write sets and exact CPU/memory resource requirements before user signature prompts.
* **Standard Compliant (SEP Standards)**:
  * **SEP-0001 (`stellar.toml`)**: Structured discoverability metadata.
  * **SEP-0007**: URI scheme for transaction signing and wallet interactions.
  * **SEP-0010**: Stellar Web Authentication challenge flow for off-chain API indexing.

---

## 4. Deliverables & Milestones (SCF Roadmap)

### Milestone 1: Production Contracts & On-Chain Settlement Hardening
- **Deliverables**:
  - Full Soroban SDK v22+ test suite with 39 passing unit and invariant tests.
  - Formally verified invariants: escrow solvency, basis point conservation, circuit breaker freeze, and role-based access control.
  - Automated storage rent TTL bumping across all state mutation paths.
  - Testnet verification on Stellar.Expert with reproducible build artifacts.
- **Verification Evidence**: Passing GitHub Actions CI pipeline, contract deployed at `CADMWQPCCQP27UHQU4JG3C6V5I3UFNNC4DVOMSK2GUJFA6Q2PNW36S52`, passing invariant test logs.

### Milestone 2: Developer Tooling SDK & Event Indexing Node
- **Deliverables**:
  - Standalone TypeScript Client SDK (`@stellar-bounty-treasury/sdk`) for headless integration into CLI tools and bots.
  - Server-Sent Events (SSE) streaming indexer tracking real-time Soroban events.
  - Idempotent transaction receipt recording with zero duplicate payouts.
  - Security-audited dependencies with automated dependency checking.
- **Verification Evidence**: Published SDK exports, backend test suite passing with 100% test coverage on API routes.

### Milestone 3: Ecosystem Web App & DAO Pilot Integration
- **Deliverables**:
  - React 18 production frontend with Freighter, Albedo, and xBull wallet integration.
  - Interactive 1-click Judge Demo Mode allowing immediate evaluation across Creator, Contributor, and Arbitrator roles.
  - Real-time gas simulation preview calculating Stroops and CPU instructions before wallet confirmation.
  - Pilot bounty launch with 3 active Stellar developer tooling projects.
- **Verification Evidence**: Live deployment URL on Netlify, demo recording walkthrough, pilot bounty transaction ledger records.

---

## 5. Budget Allocation & Sustainability

| Category | Description | Amount (USD) |
|:---|:---|:---:|
| **Smart Contract Engineering** | Soroban settlement router refinement, formal invariant testing, TTL management | $6,000 |
| **Full-Stack & Wallet Integration** | Freighter / xBull / Albedo wallet connectors, Soroban RPC simulation engine, SSE indexer | $5,000 |
| **SDK & Documentation** | TypeScript client SDK, interactive demo mode, developer tutorials | $2,500 |
| **Ecosystem Pilot & Liquidity** | Initial testnet/mainnet seed bounties to onboard first 10 Stellar developers | $1,500 |
| **Total** | | **$15,000** |

---

## 6. Conclusion

Stellar Bounty Treasury provides essential infrastructure for the next generation of decentralized organizations building on Stellar. By replacing manual grant payouts with atomic Soroban smart contracts, the protocol guarantees safety for funders and swift, trustless compensation for contributors.
