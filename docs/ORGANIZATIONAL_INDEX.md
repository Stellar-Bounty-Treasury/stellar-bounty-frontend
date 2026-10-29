# Stellar Bounty Treasury Organization Index

A unified directory indexing the three repositories comprising the **Stellar Bounty Treasury** project:

---

## 1. `stellar-bounty-contracts`
- **Path**: `stellar-bounty-contracts/`
- **Tech Stack**: Rust, Soroban SDK v22.0.11, Cargo
- **Key Modules**:
  - `src/lib.rs`: Main contract entrypoint with 25+ public Soroban methods.
  - `src/types.rs`: Typed errors, status enums, and data schemas.
  - `src/test.rs`: Comprehensive unit tests.
  - `src/test_invariants.rs`: Formal mathematical and security invariant tests.
  - `docs/SECURITY_THREAT_MODEL.md`: Formal STRIDE threat analysis.
  - `docs/DISASTER_RECOVERY_RUNBOOK.md`: Operational incident response guide.

---

## 2. `stellar-bounty-backend`
- **Path**: `stellar-bounty-backend/`
- **Tech Stack**: Node 25, Express, TypeScript, native SQLite, Stellar SDK
- **Key Modules**:
  - `src/services/sorobanRpcService.ts`: Gas & CPU pre-flight simulation engine.
  - `src/services/sep10.ts`: Cryptographic Web Authentication challenge service.
  - `src/services/webhookService.ts`: Exponential backoff webhook dispatcher.
  - `src/services/metricsService.ts`: Prometheus metrics exporter.
  - `src/sdk/`: Shared TypeScript client SDK.

---

## 3. `stellar-bounty-frontend`
- **Path**: `stellar-bounty-frontend/`
- **Tech Stack**: React 18, TypeScript, Vite, Lucide icons, Freighter API
- **Key Modules**:
  - `src/context/WalletContext.tsx`: Multi-wallet connection engine.
  - `src/context/DemoModeContext.tsx`: Interactive judge evaluation personas.
  - `src/components/SettlementSplitCalculator.tsx`: 10,000 BPS split visualizer.
  - `src/components/SimulationModal.tsx`: Soroban gas and CPU preview.
  - `docs/JUDGES_GUIDE.md`: Master hackathon evaluation guide.
