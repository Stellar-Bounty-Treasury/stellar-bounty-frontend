# Competitive & Comparative Protocol Analysis

A structural comparison of **Stellar Bounty Treasury** against incumbent web3 grant platforms:

| Feature | Stellar Bounty Treasury | Gitcoin Grants (Ethereum / L2) | Superteam Earn (Solana) | Traditional (Upwork / Escrow.com) |
|---|---|---|---|---|
| **Escrow Layer** | Soroban WASM Smart Contract | EVM Contracts / Passport | Solana SPL Program | Centralized Custodial Escrow |
| **Transaction Fees** | < $0.00001 (Stellar) | $0.20 – $5.00+ | $0.001 – $0.005 | 5% – 20% platform cut |
| **Settlement Finality** | ~5 seconds (Deterministic) | 12s – 15m (Reorg risk) | 400ms – 2s | 3 – 5 Business Days |
| **Multi-Party Settlement** | Native 10,000 BPS atomic math | Custom multi-call script | Custom split | Manual bank splits |
| **Decentralized Arbitration** | On-chain RBAC Arbitrator | Off-chain Discord council | Platform admin manual veto | Internal arbitration tribunal |
| **Pre-Flight Gas Simulation** | Real-time Soroban RPC Footprint | Inaccurate estimateGas | Custom simulation | N/A |
| **Discovery Protocol** | SEP-0001 (`stellar.toml`) | DNS / ENS txt | None | Proprietary Database |
