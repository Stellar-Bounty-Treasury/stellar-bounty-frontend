# 5-Minute Interactive Judge Demo Script

Follow this step-by-step evaluation script to test all core functionalities of the Stellar Bounty Treasury.

---

### Step 1: Persona Selection (Grants Manager — Alice)
1. Toggle **Judge Demo Mode** in the navbar.
2. Select **Alice (Grants Lead)** from the persona switcher.
3. Review treasury stats: Total Escrow, Active Bounties, and Pending Settlements.

### Step 2: Milestone Verification & Simulation Preview
1. Click on **Soroban Rust SDK Security Audit** bounty.
2. Review Milestone 1: *Implement Fuzzing Harness*.
3. Click **Simulate Gas & CPU**: Observe real-time RPC footprint calculation (CPU instructions, read bytes, fee estimate).
4. Click **Approve Milestone**.

### Step 3: Multi-Recipient 10,000 BPS Settlement
1. Open **Settlement Split Calculator**.
2. Allocate: 70% Lead Auditor, 20% Junior Reviewer, 10% Community Tester.
3. Verify that the sum is validated to exactly 10,000 BPS.
4. Execute payout.

### Step 4: Dispute Resolution (Arbitrator — Charlie)
1. Switch persona to **Charlie (Governance Arbitrator)**.
2. View active dispute on Milestone 2.
3. Review submission deliverables and audit evidence.
4. Issue verdict (**Favor Contributor** or **Refund Creator**).
5. Watch SSE event indicator reflect resolution instantly.
