# Stellar Bounty Treasury — Hackathon Evaluation & Judge Guide

Welcome, Hackathon Judges! This guide provides an accelerated walkthrough to evaluate the **Stellar Bounty Treasury** protocol, smart contracts, backend indexer, and web application.

---

## 1. Executive Summary

| Attribute | Details |
|---|---|
| **Protocol Name** | Stellar Bounty Treasury |
| **Track** | Infrastructure, DAOs & Governance / Public Goods Grants |
| **Blockchain** | Stellar Network (Soroban WASM v22.0.11) |
| **Tokens Supported** | Native XLM, USDC, EURC via Stellar Asset Contracts (SAC) |
| **Standard Implementations** | SEP-0001 (`stellar.toml`), SEP-0007 (URIs), SEP-0010 (Web Auth), SEP-0024/0038 |
| **Frontend** | React 18, TypeScript, Vite, Freighter / Albedo / xBull multi-wallet |
| **Backend** | Node 25, native SQLite, Soroban RPC pre-flight simulation proxy, SSE events |

---

## 2. Quickstart for Judges

### Option A: Interactive Judge Demo Mode (Instant, No Wallet Required)
1. Open the web app.
2. Click **Judge Demo Mode** in the top navigation bar.
3. Switch effortlessly between **Creator** (Alice), **Contributor** (Bob), and **Arbitrator** (Charlie).
4. Experience escrow creation, milestone submissions, gas simulations, and dispute arbitrations in real time!

### Option B: Run Locally
```bash
# 1. Smart Contracts
cd stellar-bounty-contracts
cargo test --lib

# 2. Backend & Indexer
cd stellar-bounty-backend
npm install
npm test
npm run dev

# 3. Frontend Web App
cd stellar-bounty-frontend
npm install
npm test
npm run dev
```

---

## 3. High-Leverage Differentiators

1. **Deterministic 10,000 Basis Points Math**: Multi-contributor milestone split calculation with exact integer conservation.
2. **Soroban Pre-Flight Gas Simulation**: Real-time simulation of CPU instructions and ledger footprint before user signs transactions.
3. **Decentralized Multi-Party Dispute Arbitration**: On-chain conflict resolution allowing appointed arbitrators to protect contributors and treasuries.
4. **SEP-0001 & SEP-0010 Native**: Discovers treasury endpoints via `.well-known/stellar.toml` and authenticates sessions cryptographically.
