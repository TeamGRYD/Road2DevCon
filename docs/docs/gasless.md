---
sidebar_position: 8
title: Gasless Transactions
---

# Gasless Transactions

Participants don't need Sepolia ETH. Registering a profile, submitting a quiz score, posting to the Feed and voting are all paid for by the **gas station**, the admin wallet configured with `ADMIN_PRIVATE_KEY` / `ADMIN_ADDRESS`.

## How it works

The portal uses **ERC-2771 meta-transactions**:

1. The participant clicks *Register*, *Submit* or a vote button. MetaMask asks them to **sign a message** (EIP-712 typed data). No transaction, no gas.
2. The portal sends the signed request to `POST /api/relay`.
3. The gas station checks it, simulates it, and submits it to `GaslessForwarder.sol` from the admin wallet, paying the gas.
4. The forwarder verifies the signature **on-chain** and calls the target contract with the participant's address appended to the calldata.
5. `ProfileRegistry`, `QuizScoresV2` and `FeedContract` trust the forwarder and read the participant through `_msgSender()`. On-chain, the profile, score, post or vote belongs to the participant's wallet, not the gas station's.

```
Participant ──sign──▶ /api/relay ──tx (admin pays gas)──▶ GaslessForwarder ──call + from──▶ Registry / Quiz / Feed
```

### Security properties

- **The gas station can't act on anyone's behalf.** Every request carries the participant's EIP-712 signature, which the forwarder checks on-chain.
- **No replays.** Each request has a random nonce that is marked used on execution, and a deadline (1 hour).
- **The gas station only pays for portal actions.** `/api/relay` only relays `register`, `submitScore`, `submit` and `vote` on the configured contracts, and simulates every request first, so failing requests (*Already registered*, *Already submitted to this topic*, ...) cost nothing.
- **Quiz scores still need the admin's score signature.** Gasless submission doesn't change how scores are authorized.
- **Spending guards.** The relay refuses to send when gas costs more than `GAS_STATION_MAX_FEE_GWEI` (default 50) or the station holds less than `GAS_STATION_MIN_BALANCE_ETH` (default 0.005).

### Fallback

The portal falls back to a regular wallet transaction (participant pays gas) when:

- `VITE_FORWARDER_ADDRESS` isn't set,
- the target contract doesn't trust the forwarder (for example the legacy v1 contracts), or
- the gas station is unavailable (not configured, out of funds, gas too expensive).

Shipping the code before the new contracts are deployed is safe: everything keeps working as before.

## Rollout

The existing contracts read `msg.sender` directly, so they have to be redeployed with forwarder support. Deploy with Remix on Sepolia (**Injected Provider - MetaMask**).

### 1. Deploy the forwarder

Deploy `GaslessForwarder.sol` (no constructor arguments). It has no owner and no admin functions.

### 2. Deploy and migrate the registry

1. Deploy `ProfileRegistry.sol` with `(forwarderAddress)`.
2. Copy the profiles from the current registry (`0x2EE14624EF2d9c2ED151bDC2fF6Bab724bf4830D`) in batches of 50:
   `migrateFromRegistry(0x2EE1…830D, 0, 50)`, then `(…, 50, 50)`, `(…, 100, 50)`, … until you pass its `getProfileCount()`.
3. Compare `getProfileCount()` on both registries, then call `finalizeMigration()`.

:::warning
Anyone who registers on the old registry after its batch has run won't be carried over. Do this at a quiet time, and re-run `migrateFromRegistry` with a later `start` offset if needed before finalizing.
:::

### 3. Deploy the quiz and feed contracts

- `QuizScoresV2.sol` with `(adminAddress, newRegistryAddress, forwarderAddress)`. Update the active event's `contract` in `src/config/events.js`.
- `FeedContract.sol` with `(newRegistryAddress, forwarderAddress)`. Posts on the previous feed contract aren't carried over.

### 4. Configure Vercel

| Variable | Value |
|---|---|
| `VITE_FORWARDER_ADDRESS` | GaslessForwarder address |
| `VITE_PROFILE_REGISTRY_ADDRESS` | New ProfileRegistry address |
| `VITE_CONTRACT_ADDRESS` | New QuizScoresV2 address |
| `VITE_FEED_CONTRACT_ADDRESS` | New FeedContract address |
| `ADMIN_PRIVATE_KEY` / `ADMIN_ADDRESS` | Gas station wallet (already set) |
| `GAS_STATION_MAX_FEE_GWEI` | Optional, default `50` |
| `GAS_STATION_MIN_BALANCE_ETH` | Optional, default `0.005` |

Redeploy so the new `VITE_` values are bundled.

### 5. Keep the station funded

Top up the admin wallet with Sepolia ETH. Each action costs the station roughly one transaction: about 100k gas for a vote, 190k for a registration, 210k for a quiz score and 240–260k for a feed post. At 1 gwei that is 0.0001–0.00026 ETH per action. Failed relays and low balances are logged in the Vercel function logs as `relay error` and `Gas station balance low`.
