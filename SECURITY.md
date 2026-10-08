# Security Policy — Stellar Bounty Frontend

The Stellar Bounty Treasury team takes client-side security, wallet integration safety, and user fund protection seriously.

---

## Supported Versions

Only the `main` branch and the live production Netlify deployment are actively maintained with security patches.

| Target | Supported |
| :--- | :--- |
| `main` branch | :white_check_mark: |
| Production ([https://stellar-bounty-treasury-2676.netlify.app](https://stellar-bounty-treasury-2676.netlify.app)) | :white_check_mark: |
| Outdated local builds | :x: |

---

## Reporting a Vulnerability

**Please do not report vulnerabilities via public GitHub issues.**

Privately report vulnerabilities to:
1. Email: **`security@stellar-bounty-treasury.org`**
2. GitHub Private Advisory: [Report a vulnerability](https://github.com/Stellar-Bounty-Treasury/stellar-bounty-frontend/security/advisories)

### Response SLA
* **Initial Response:** Within 24 hours.
* **Triage & Classification:** Within 48 hours.
* **Remediation:** Coordinated private patch within 7 days.

---

## Frontend Security Principles

* **Non-Custodial Safety:** The frontend never stores, requests, or transmits private keys. All signing is delegated directly to user wallets (Freighter).
* **Sanitization:** All dynamic bounty descriptions, links, and user inputs are strictly sanitized to prevent Cross-Site Scripting (XSS).
* **Safe External Navigation:** Links leading to Stellar.Expert or GitHub include `rel="noreferrer noopener"` and `target="_blank"`.
