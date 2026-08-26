# CAMPUSX OS Kivy Client - Security Guide

This document describes the security protocols, encryption algorithms, and role-based permissions governing the native client.

---

## 1. Authentication Security

- **JWT Tokens**: Upon authentication, the Express backend generates a JSON Web Token. The Kivy client saves the JWT in memory (`ApiClient.token`).
- **HTTP Headers**: All outgoing REST calls append the JWT using the standard header `Authorization: Bearer <token>`.
- **Token Expiry**: If the backend returns a `401 Unauthorized` status (expired token), the client intercepts it, logs out the user, and redirects to the login screen.

---

## 2. Role-Based Access Control (RBAC)

The Kivy client mirrors the exact route clearance matrix defined in the web `LayoutShell.js`:

| Role | Access Permissions |
|---|---|
| **superadmin** / **platformadmin** / **admin** | Full access to all ERP modules, blockchain notaries, and SOC |
| **registrar** | Access to students list, exams scheduling, results hub, and degree SBT mint tools |
| **faculty** | Access to course directories, attendance rosters, assignments evaluations, and sports |
| **student** | Access to personal records, attendance indices, Connect feed, wallet, and sports |

---

## 3. Cryptographic Credential Audits

To guarantee transcript integrity:
1. Academic results and degree cert hashes are hashed using SHA-256.
2. The hash is validated against block headers on the consortium blockchain network using smart contracts:
   - `mintCredential()` maps student IDs to IPFS metadata hashes.
   - `verifyCredential()` checks signatures and active/inactive status.
3. The Kivy client replicates these blockchain verification steps under the **CampusX Chain** workspace panel. If the hash is not registered or was modified, verification fails immediately.
