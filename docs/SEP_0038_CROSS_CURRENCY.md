# SEP-0038 Cross-Currency Anchor RFQ Quotes

Specification for cross-currency settlement releases utilizing **SEP-0038 Anchor RFQ Quotes**.

---

## Overview
Allows contributors to receive rewards in their local currency (e.g., EURC, BRL, NGN) even when the bounty escrow was originally funded in XLM or USDC.

## Workflow
1. Client requests firm quote for pair `stellar:USDC` to `stellar:EURC`.
2. Settlement router executes atomic path payment or AMM swap.
3. Contributor receives exact quoted amount in target asset.
