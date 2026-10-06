# 🏦 Stellar Bounty Treasury — Web Application

[![Stellar Testnet](https://img.shields.io/badge/Stellar-Testnet-blue.svg)](https://stellar.org)
[![Soroban Escrow](https://img.shields.io/badge/Soroban-Smart%20Contracts-7c3aed.svg)](https://soroban.stellar.org)
[![Netlify Status](https://img.shields.io/badge/Netlify-Deployed%20Live-00c7b7.svg)](https://stellar-bounty-treasury-2676.netlify.app)
[![CI/CD](https://img.shields.io/badge/CI%2FCD-Passing-brightgreen.svg)](https://github.com/Stellar-Bounty-Treasury/stellar-bounty-frontend/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**Stellar Bounty Treasury** is a decentralized, community-funded bounty treasury and programmable settlement platform built on the Stellar network. It couples community milestone governance directly with Soroban smart contracts to enable trustless escrow, verification quorums, multi-recipient split payments, and real-time blockchain event synchronization.

---

## 🎬 Live Product Demonstration

Experience the complete end-to-end journey: from wallet funding and milestone review to the multi-recipient Settlement Router and atomic payout:

![Stellar Bounty Treasury Walkthrough](docs/evidence/level3_demo.gif)

* **Direct Video Links**: [Download High-Definition MP4](docs/evidence/level3_demo.mp4) • [Watch WebM Video](docs/evidence/level3_demo.webm)
* **Live Deployment**: [https://stellar-bounty-treasury-2676.netlify.app](https://stellar-bounty-treasury-2676.netlify.app)
* **Contract on Stellar.Expert**: [`CADMWQPCCQP27UHQU4JG3C6V5I3UFNNC4DVOMSK2GUJFA6Q2PNW36S52`](https://stellar.expert/explorer/testnet/contract/CADMWQPCCQP27UHQU4JG3C6V5I3UFNNC4DVOMSK2GUJFA6Q2PNW36S52)

---

## 🌟 Key Features

### 1. 📊 Treasury Dashboard
* Real-time financial telemetry tracking **Total Funds in Escrow**, **Total Bounties**, **Active Bounties**, **Completed Bounties**, **Pending Milestones**, and **Total Distributed XLM**.
* Automatic synchronization with on-chain Soroban contract state and backend indexing.

### 2. 🔀 Programmable Settlement Router
* **Multi-Recipient Allocations**: Configure rewards split across multiple contributors (e.g., 70% Lead Developer, 20% UI/UX Designer, 10% Auditor).
* **Dual Distribution Modes**:
  * **Percentage Splits**: Validated to sum to exactly 100.0% (10,000 basis points).
  * **Fixed Amounts**: Validated to match the exact approved milestone reward.
* **Interactive Visualizer**: Tree diagram showing fund routing from Escrow through the Settlement Router to each recipient.
* **Immutability Protection**: Pre-flight locking upon community approval prevents front-running or malicious modification.

### 3. 🔍 Settlement Preview & Atomic Execution
* **Pre-Flight Condition Verification**: Checks verification quorum, escrow balance solvency, allocation mathematical soundness, and contract state before transaction submission.
* **Atomic On-Chain Execution**: Calls the Soroban contract's `execute_settlement` method to disburse tokens simultaneously across all recipients.

### 4. ⚡ Realtime Reactive UI (Server-Sent Events)
* Native integration with the backend SSE event stream (`/api/events/stream`).
* State updates (bounty funding, milestone votes, settlement completions) appear instantly across connected clients without page reloads.

### 5. 💳 Frictionless Wallet Support
* **Freighter Extension**: Official Stellar wallet integration for secure user-signed transactions.
* **Instant Testnet Account**: One-click testnet keypair generation with automatic Friendbot funding (10,000 XLM) for rapid testing.

### 6. 🛡️ Lifecycle Governance & Recovery
* **Milestone Verification Quorums**: Contributor deliverable submissions, evidence review, and threshold approvals.
* **Escrow Refund**: Authorized reclaim of unspent bounty funds for cancelled or failed bounties.
* **Contract-Enforced Completion**: Automated verification that all milestones are resolved before marking a bounty completed.
* **Blockchain Explorer Integration**: Clickable links to [Stellar.Expert](https://stellar.expert/explorer/testnet) for every transaction hash.

---

## 🏗️ System Architecture

```text
┌────────────────────────────────────────────────────────┐
│             Stellar Bounty Treasury UI                 │
│        (React 18 / Vite / TypeScript / CSS)            │
└───────────────┬────────────────────────┬───────────────┘
                │                        │
       Wallet / Horizon API     REST API / SSE Stream
                │                        │
                ▼                        ▼
┌──────────────────────────────┐ ┌───────────────────────┐
│       Soroban Contracts      │ │    Backend Service    │
│  • Escrow Vault              │ │  • Event Indexer      │
│  • Milestone Governance      │ │  • SSE Realtime Hub   │
│  • Settlement Router         │ │  • State Reconciler   │
└──────────────────────────────┘ └───────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites
* Node.js 18+ and npm
* (Optional) [Freighter Wallet](https://www.freighter.app/) browser extension configured for Stellar Testnet

### Installation

```bash
# Clone the repository
git clone https://github.com/Stellar-Bounty-Treasury/stellar-bounty-frontend.git
cd stellar-bounty-frontend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
```

### Environment Configuration (`.env`)

```env
VITE_API_URL=http://localhost:5000
VITE_SOROBAN_CONTRACT_ID=CADMWQPCCQP27UHQU4JG3C6V5I3UFNNC4DVOMSK2GUJFA6Q2PNW36S52
```

### Running Locally

```bash
# Start Vite development server
npm run dev
# Application will be accessible at http://localhost:5173
```

### Running Tests & Building

```bash
# Run unit & component tests with Vitest
npm test -- --run

# Compile TypeScript and build production bundle
npm run build
```

---

## 🧪 Testing Suite

The frontend suite validates critical business logic and allocation rules:
* `src/test/validation.test.ts`: Validates bounty title, amounts, descriptions, Stellar addresses, and thresholds.
* `src/test/settlementValidation.test.ts`: Tests multi-recipient allocations, percentage basis points summing to 10,000, fixed reward matching, duplicate recipient rejection, and address sanity.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
