# Changelog

All notable changes to the **Stellar Bounty Treasury Web Application** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [4.0.0] - 2026-10-29

### Added
- **Interactive 1-Click Judge Demo Mode**: Added `DemoModeContext`, `DemoModeToggle`, `PersonaSwitcher`, `OneClickFaucet`, and `JudgeQuickTour` allowing instant evaluation across Alice (Creator), Bob (Contributor), and Charlie (Arbitrator) personas without requiring external wallet installations.
- **Multi-Wallet Connector**: Extended `WalletContext.tsx` and `WalletConnectModal.tsx` with support for **Freighter**, **Albedo**, **xBull**, and a local Testnet Developer signer.
- **Soroban Pre-Flight Gas & CPU Simulation**: Implemented `SimulationModal.tsx` querying backend Soroban simulation proxy to display CPU instruction footprint, memory read bytes, and ledger fees before transaction signing.
- **Dynamic 10,000 Basis Points Settlement Split Calculator**: Built `SettlementSplitCalculator.tsx` with visual proportional split bar, auto-balancing allocation math, and strict integer conservation validation.
- **Decentralized Dispute Resolution Suite**: Added `DisputeModal.tsx` for contributors to challenge unfair milestone reviews and `ArbitrationResolveModal.tsx` for governance arbitrators to issue verdicts.
- **Milestone Lifecycle Progress Stepper**: Implemented `MilestoneTimeline.tsx` visualizing real-time milestone transitions (`Draft` ➔ `Submitted` ➔ `Review` ➔ `Approved` ➔ `Settled`).
- **Multi-Currency Conversion Engine**: Added `currencyService.ts`, `CurrencyToggle.tsx`, and `useCurrency.ts` hook supporting real-time currency switching between XLM, USD fiat, USDC, and EURC with `localStorage` memory.
- **Dark / Light Theme Switcher**: Added `ThemeToggle.tsx` with modern CSS variable tokens in `index.css`.
- **WCAG AA Accessibility Engine**: Implemented `useFocusTrap.ts` for modal focus management and `useKeyboardShortcuts.ts` supporting `Escape`, `Ctrl+K`, and `/` shortcuts.
- **Interactive Command Palette**: Added `CommandPalette.tsx` for quick fuzzy-searching across all bounties, documentation, and tools.
- **Ecosystem Showcase & SEP Standards**: Mounted `EcosystemShowcase.tsx` and `Footer.tsx` in `App.tsx` showcasing SEP-0001 discovery, SEP-0007 URIs, and SEP-0010 authentication.
- **Production Deployment Configuration**: Added `netlify.toml` and `vercel.json` with SPA rewrite rules and immutable cache headers.
- **Comprehensive Hackathon Documentation Suite**: Published `docs/JUDGES_GUIDE.md`, `docs/DEMO_WALKTHROUGH.md`, `docs/STELLAR_COMMUNITY_FUND_PROPOSAL.md`, `docs/PITCH_DECK_OUTLINE.md`, `docs/COMPARATIVE_ANALYSIS.md`, and `docs/PROJECT_IMPACT_REPORT.md`.

### Changed
- Upgraded project version to `4.0.0` with enhanced metadata in `package.json`.
- Streamlined `Navbar.tsx` integrating Judge Demo controls, theme toggling, network badge, and multi-wallet balance pills.
- Enhanced `BountyDetailModal.tsx` with milestone deadline extensions and resubmission workflows.

### Fixed
- Fixed mobile navigation drawer layout responsiveness and touch targets.
- Fixed currency toggle rounding precision to 2 decimal places for fiat and 4 for crypto.
- Fixed clipboard copy state timeouts on transaction hash buttons.

---

## [3.0.0] - 2026-10-08

### Added
- Level 3 Settlement Router interface for multi-recipient disbursements.
- Real-time Server-Sent Events (SSE) update notifications.
- Filter bar for bounties (categories, status, funding level).

---

## [2.0.0] - 2026-10-01

### Added
- Freighter wallet connection and account status telemetry.
- Bounty creation modal and milestone review voting interface.

---

## [1.0.0] - 2026-09-15

### Added
- Initial React 18 web application with basic dashboard.
