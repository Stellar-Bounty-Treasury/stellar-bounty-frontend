# Stellar Bounty Treasury Protocol Specification

## Abstract
A trustless, milestone-based conditional escrow protocol built on Soroban with multi-recipient settlement routing and decentralized dispute arbitration.

---

## State Invariants
1. **Solvency Invariant**: For every bounty $B$, the on-chain escrow balance must strictly equal or exceed the sum of all pending milestone commitments:
   $$\text{EscrowBalance}(B) \ge \sum_{m \in M(B), \text{status} \neq \text{Paid}} \text{Reward}(m)$$

2. **Settlement Invariant**: Every settlement split must sum to exactly 10,000 basis points:
   $$\sum_{i=1}^n \text{BPS}_i = 10\,000$$

3. **Reentrancy Invariant**: Any mutating external call is guarded by atomic reentrancy locks.
