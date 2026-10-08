# Contributing to Stellar Bounty Frontend

Thank you for helping build **Stellar Bounty Frontend**! This web application provides non-custodial bounty escrow funding, milestone approvals, multi-recipient settlement routing, and live SSE event streaming on Stellar.

---

## Code of Conduct

All contributors must follow our [Code of Conduct](CODE_OF_CONDUCT.md).

---

## Prerequisites

* **Node.js**: v20+ with npm v10+
* **Git**: with conventional commit discipline

---

## Local Development Workflow

### 1. Setup Dependencies
```bash
npm install
```

### 2. Run Tests
```bash
npm test
```
Validates input forms and multi-recipient allocation arithmetic.

### 3. Build & Validate Bundle
```bash
npm run build
```

### 4. Start Local Development Server
```bash
npm run dev
```

---

## Non-Custodial Security & Design System

* **Non-Custodial Integrity:** Never store, transmit, or log user secret keys (`S...` keys). Signing is handled exclusively by browser wallet extensions (Freighter).
* **Safe Basis Points:** Settlement distribution percentages must sum to exactly $10,000 \text{ bps} = 100.00\%$.
* **Accessibility:** Ensure buttons have descriptive `aria-label` tags and interactive elements support keyboard navigation.

---

## Pull Request Guidelines

1. Create a feature branch: `feat/bounty-filter` or `fix/wallet-disconnect`.
2. Follow Conventional Commits format (`feat(ui): ...`, `fix(settlement): ...`).
3. Ensure `npm test` and `npm run build` pass before opening your PR.
4. Reference related issues (`Closes #...`).

---

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
