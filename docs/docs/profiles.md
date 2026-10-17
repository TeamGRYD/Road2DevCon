---
sidebar_position: 6
title: Profiles & Migration
---

# 🪪 Profile Registry & QuizScoresV2

Profiles (name + X username) used to live inside each event's `QuizScores` contract. That meant a participant had a separate profile per event, and nothing outside the quiz could use it.

Now there is one shared **`ProfileRegistry.sol`**, used by:

- **`QuizScoresV2.sol`**: one per event, stores **scores only**
- **`FeedContract.sol`**: submissions and votes on the [Feed](/feed)

The three earlier events keep their v1 [QuizScores](/smart-contract) contracts and leaderboards unchanged. They are marked `legacy: true` in `src/config/events.js`.

## How the pieces fit

```
                 ┌──────────────────────┐
                 │   ProfileRegistry    │  name + X username per wallet
                 └──────────▲───────────┘
          isRegistered /    │    getProfilesBatch
          getProfile        │
      ┌─────────────────────┼─────────────────────┐
      │                     │                     │
┌─────┴────────┐   ┌────────┴──────┐    ┌─────────┴─────┐
│ QuizScoresV2 │   │ QuizScoresV2  │    │ FeedContract  │
│  (event N)   │   │  (event N+1)  │    │               │
└──────────────┘   └───────────────┘    └───────────────┘

Legacy (read-only from the portal's point of view):
QuizScores v1 (ATLAS) · QuizScores v1 (DBIT) · QuizScores v1 (Hacktoberfest)
```

## ProfileRegistry

| Function | Who | Description |
|---|---|---|
| `register(name, xUsername)` | Anyone | Same rules as v1: name ≤ 64, X username ≤ 32, case-insensitive unique, permanent. **Only open after `finalizeMigration()`** |
| `migrateFrom(legacy, start, count)` | Owner, before finalize | Copies profiles from a v1 contract by reading `getLeaderboardBatch` on-chain |
| `finalizeMigration()` | Owner, once | Closes migration permanently and opens registration |
| `isRegistered(wallet)` | View | |
| `getProfile(wallet)` | View | Reverts if not registered |
| `getProfilesBatch(wallets[])` | View | Names, X usernames and a `registered` flag for each wallet |
| `getProfileCount()` / `getProfilesPage(start, count)` | View | Enumeration |

### Trust model

`migrateFrom` reads profile data **directly from the legacy contract**, so the owner can't insert made-up profiles. The owner only decides the order and timing. After `finalizeMigration()` the owner has no special powers left.

### Migration rules

- A wallet that is **already registered** is skipped (`MigrationSkipped`, reason `1`).
- A wallet whose **X username is already held** by another wallet is skipped (reason `2`). v1 contracts only enforced uniqueness per event, so the same handle can exist across events.
- **Migrate the newest event first.** The first write wins, so a wallet registered at several events keeps its most recent name, and a contested handle goes to its most recent claimant.
- Skipped participants still show normally on their legacy leaderboard. To use the Feed or future quizzes, they register again with a different handle.

## QuizScoresV2

Same anti-cheat model as v1, minus profile storage:

| Change vs. v1 | Detail |
|---|---|
| Constructor | `(address admin, address profileRegistry)` |
| Registration | Removed. `submitScore` requires `registry.isRegistered(msg.sender)` |
| `isRegistered(wallet)` | Pass-through to the registry (used by `api/quiz/start.js`) |
| Leaderboard | A wallet is listed after its **first** score. `getLeaderboardBatch` returns `(wallets[], batchScores[])`; names come from `registry.getProfilesBatch` |
| `getScores(wallet)` | Replaces `getParticipant` |
| Signed message | `keccak256(contract, chainId, wallet, quizId, score, nonce)` |

The signed message now includes the **contract address and chain ID**. In v1, every event contract started nonces at 0 and the message didn't name the contract, so a signature issued for one event could be replayed on another. `api/quiz/complete.js` detects whether `VITE_CONTRACT_ADDRESS` is a v1 or v2 contract (only v2 has `registry()`) and signs the matching format.

## Deployment runbook (Remix)

All contracts compile with Solidity **0.8.19+**. Use **Injected Provider - MetaMask** on Sepolia.

### 1. Wait for the last legacy event to close

Anyone who registers on a v1 contract after its migration batch has run won't be carried over. Run migration once Hacktoberfest (`rtta1cub`) registrations are closed. You can re-run `migrateFrom` with a later `start` offset at any time before finalizing.

### 2. Deploy and migrate the registry

1. Deploy `ProfileRegistry.sol` (no constructor arguments). The deploying wallet becomes the owner.
2. For each legacy contract, **newest first**, call `migrateFrom(address, start, count)` in batches of ~30–50:

   | Order | Event | Contract |
   |---|---|---|
   | 1 | Hacktoberfest Hack Day Mumbai | `0x487cb8c812e4177107884799fdbe61a2b4374c73` |
   | 2 | DBIT Mumbai | `0xb54c3d5fea76dae38e615cc1ecf7024c7afc1b2d` |
   | 3 | ATLAS SkillTech | `0xb5456aDfa33BD3c94A6E021541d73Abc26A19138` |

   Use `getParticipantCount()` on each legacy contract to know how many batches to run.
3. Check `MigrationSkipped` events on Etherscan and compare `getProfileCount()` with what you expect.
4. Call `finalizeMigration()`. **This can't be undone.**

### 3. Deploy the feed

Deploy `FeedContract.sol` with the registry address. The deploying wallet becomes the moderator (see [Feed](/feed#moderation)).

### 4. Point the portal at the new contracts

```env
VITE_PROFILE_REGISTRY_ADDRESS=0xYourProfileRegistry
VITE_FEED_CONTRACT_ADDRESS=0xYourFeedContract
```

Once `VITE_PROFILE_REGISTRY_ADDRESS` is set, the wallet connects, reads profiles and registers through the registry. Without it, the portal falls back to the old behaviour (profiles on `VITE_CONTRACT_ADDRESS`).

:::warning
Only set `VITE_PROFILE_REGISTRY_ADDRESS` **after** `finalizeMigration()`. Before that, new users can't register.
:::

### 5. Next event

1. Deploy `QuizScoresV2.sol` with `(adminAddress, registryAddress)`.
2. Append it to `src/config/events.js` **without** `legacy: true`.
3. Point `VITE_CONTRACT_ADDRESS` at it. No API change is needed; the signing format is detected automatically.

## Testing in the Remix VM

Run this before touching Sepolia (**Remix VM** environment, several accounts):

1. Deploy two v1 `QuizScores` contracts. Register overlapping wallets, including the same wallet on both with different names, and two wallets with the same X handle (different case) on different contracts.
2. Deploy `ProfileRegistry`. Confirm `register` reverts with *Registration not open yet*.
3. `migrateFrom` the newer contract, then the older one. Check that:
   - the shared wallet has the **newer** name
   - the clashing handle went to the newer contract's wallet, and the other got `MigrationSkipped` with reason `2`
   - re-running a batch changes nothing
4. `finalizeMigration`. Confirm `migrateFrom` now reverts, `register` works, and a taken handle in different case is rejected.
5. Deploy `QuizScoresV2(admin, registry)`. Sign a score from the admin account and submit it. Deploy a second V2 and confirm the **same signature is rejected** there.
6. Deploy `FeedContract(registry)` and run the checks in [Feed → Testing](/feed#testing).
