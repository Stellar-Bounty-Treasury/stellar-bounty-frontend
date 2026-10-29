# SEP-0024 Hosted Deposit and Withdrawal (Anchor On/Off Ramp)

This specification outlines integrating regulated Stellar Anchor services to enable fiat on-ramps directly into bounty escrows.

---

## Reference Architecture

```
+---------------------+       +----------------------+       +-----------------------+
|  Corporate Creator  | ----> |  SEP-0024 Anchor     | ----> |  Stellar Bounty       |
|  (USD Bank Wire)    |       |  (e.g., Circle, Anx) |       |  Treasury Escrow      |
+---------------------+       +----------------------+       +-----------------------+
```

## Interactive Deposit Steps
1. Discover anchor URL via `stellar.toml` (`TRANSFER_SERVER_SEP0024`).
2. Authenticate via SEP-0010 to obtain session bearer token.
3. Initiate deposit session (`POST /transactions/deposit/interactive`).
4. User completes KYC / wire transfer in anchor popup window.
5. Anchor mints USDC into designated bounty treasury escrow contract.
