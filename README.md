# 🖥️ Stellar Bounty Treasury — Frontend Application

Modern React & TypeScript user interface for **Stellar Bounty Treasury**, demonstrating wallet connection, bounty creation, live XLM balance queries, and real **Stellar Testnet** funding transactions.

---

## 📌 Project Overview

At **Level 1 (White Belt)**, this application proves the end-to-end payment flow on the Stellar Testnet:

**Connect Wallet → View XLM Balance → Create Bounty → Discover Bounties → Fund Bounty → Confirm On-Chain Transaction**

* ❌ **No fake transactions**: Every contribution is an authentic on-chain Stellar transaction signed and submitted to the Testnet ledger.
* ❌ **No mocked hashes**: Resulting hashes are verifiable on Stellar.Expert testnet explorer.

---

## 📸 Level 1 Evidence & Screenshots

### 1. Wallet Connected & Live XLM Testnet Balance
The user connects via Freighter or instant Testnet signer. The address is displayed in shortened form (`GD6D...F2DN`) with 1-click clipboard copy, and their authentic XLM balance (`9975.00 XLM`) is fetched directly from the Stellar Horizon RPC.

![Wallet Connected & Balance](docs/evidence/wallet_connected.png)

### 2. Transaction Confirmed on Stellar Testnet
Upon entering a contribution (15 XLM) and signing, the transaction is submitted directly to the Stellar network ledger. The resulting transaction hash (`d0ed248c8119...`) is displayed with a direct link to Stellar Expert Explorer.

![Transaction Confirmed & Explorer Link](docs/evidence/fund_confirmation.png)

### 3. Responsive Mobile View
The dashboard automatically scales to mobile viewports with flexible cards, responsive navbar, and full touch accessibility.

![Responsive Mobile Dashboard](docs/evidence/mobile_view.png)

---

## ✨ Features

1. **Stellar Wallet Integration**:
   * Connect via **Freighter Wallet** browser extension.
   * Instant **Testnet Dev Signer** mode with 1-click Friendbot funding (10,000 testnet XLM).
   * Shortened address display (`GAB3...X7KD`) with 1-click clipboard copy.
   * Graceful disconnect and reconnect without breaking application state.

2. **Live XLM Balance**:
   * Directly queries the Stellar Horizon Testnet RPC (`https://horizon-testnet.stellar.org`).
   * Auto-refreshes balance after transaction confirmation.

3. **Bounty Creation**:
   * Create community bounties with title, description, target amount, and creator address.

4. **Bounty Discovery & Filtering**:
   * Real-time search across titles and descriptions.
   * Status filter pills: `ALL`, `OPEN`, `FUNDED`.
   * Dynamic progress bar showing % funded and remaining target.

5. **Real Stellar Testnet Funding**:
   * Amount input with balance validation and reserve fee protection.
   * Builds and submits native XLM payment operations to the Stellar Testnet.
   * Displays confirmed transaction hash and direct link to Stellar Expert Explorer.

---

## 🏗️ Architecture & Component Hierarchy

```text
stellar-bounty-frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.tsx             # Wallet status, balance pill, network badge
│   │   ├── BountyCard.tsx         # Bounty card, progress bar, creator copy, fund trigger
│   │   ├── CreateBountyModal.tsx  # Bounty creation form & validation
│   │   ├── FundBountyModal.tsx    # Payment input, fee checks, Testnet signer, explorer link
│   │   └── WalletConnectModal.tsx # Freighter & Testnet Keypair connection options
│   ├── context/
│   │   └── WalletContext.tsx      # Global wallet state & Horizon balance sync
│   ├── services/
│   │   ├── api.ts                 # Backend REST client (port 5000)
│   │   └── stellar.ts             # Stellar Horizon RPC, Freighter API, transaction builder
│   ├── test/
│   │   └── validation.test.ts     # Vitest suite covering amounts, reserves, address shortening
│   ├── types/
│   │   └── index.ts               # Bounty, Contribution, WalletState interfaces
│   ├── index.css                  # Custom design system with glassmorphic tokens & dark mode
│   ├── App.tsx                    # Main dashboard layout, stats counters, search filters
│   └── main.tsx                   # React root entrypoint
├── docs/
│   └── evidence/                  # Working application screenshots
├── .env.example
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

* Node.js `v20+`
* npm `v10+`
* *(Optional)* [Freighter Wallet](https://www.freighter.app/) extension

### Installation

```bash
npm install
```

### Environment Setup

Create `.env` based on `.env.example`:

```bash
VITE_API_URL=http://localhost:5000
VITE_STELLAR_NETWORK=TESTNET
VITE_HORIZON_URL=https://horizon-testnet.stellar.org
VITE_EXPLORER_URL=https://stellar.expert/explorer/testnet/tx
```

### Development Server

```bash
npm run dev
```

Application runs on `http://localhost:3000`.

### Running Unit Tests

```bash
npm test
```

---

## 🔄 Progression to Level 2 and Level 3

* **Level 2**:
  - Connect to Soroban Escrow Smart Contracts via contract invocations rather than direct peer-to-peer transfers.
  - Add milestone submission forms for bounty claimers.
  - Add community voting and attestation interfaces.
* **Level 3**:
  - Conditional settlement router interface.
  - Multi-recipient milestone distributions.
  - Realtime WebSocket updates for on-chain contract events.

---

## 📄 License

MIT
