# SEP-0010 Stellar Web Authentication Integration

Stellar Bounty Treasury utilizes **SEP-0010** to verify cryptographic wallet ownership prior to administrative actions.

---

## Authentication Flow

1. **Challenge Request**:
   Client requests an unsigned Stellar transaction envelope from:
   `GET /api/bounties/auth/challenge?public_key=<PUBLIC_KEY>`

2. **Client Signature**:
   Client signs the transaction challenge with their Freighter, Albedo, or xBull wallet.

3. **JWT Token Issuance**:
   Client submits the signed envelope to obtain a scoped JSON Web Token (JWT) authorizing session operations.
