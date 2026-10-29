# Frequently Asked Questions (FAQ)

### 1. How does the escrow guarantee solvency?
The contract requires explicit token transfers into the escrow account before a bounty transitions to `Open` or `Funded`. Funds remain locked until cryptographic approval or dispute verdict.

### 2. What happens if a contributor abandons a milestone?
Milestones have deadlines. If a milestone expires without submission, the creator can initiate a deadline expiration refund back to the treasury.

### 3. How does the 10,000 Basis Points settlement work?
All milestone percentage allocations are represented in basis points (100 BPS = 1.00%). The smart contract strictly verifies that the sum of all recipient allocations equals exactly 10,000 before executing transfer.

### 4. How does the protocol handle Soroban storage rent?
The contract includes `extend_contract_ttl` and `extend_bounty_ttl` functions to bump ledger thresholds, ensuring persistent instance and data storage are never archived.
