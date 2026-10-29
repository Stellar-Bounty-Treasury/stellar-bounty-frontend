# Stellar Asset Contracts (SAC) Integration Guide

Soroban smart contracts interact with native XLM and classic issued assets through the **Stellar Asset Contract (SAC)** interface.

---

## SAC Interface in Rust

```rust
use soroban_sdk::token::Client as TokenClient;

// Initialize token client
let client = TokenClient::new(&env, &token_contract_address);

// Transfer tokens into escrow
client.transfer(&sender, &env.current_contract_address(), &amount);
```

## Compatibility
- **Native XLM**: Available on all networks with canonical SAC contract ID.
- **Circle USDC**: Fully supported on Testnet and Mainnet.
- **Custom DAO Governance Tokens**: Interoperable with zero code changes.
