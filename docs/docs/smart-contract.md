---
sidebar_position: 5
title: Smart Contract
---

# 📜 QuizScores Smart Contract

The `QuizScores.sol` contract is the on-chain backbone of the portal's quiz and leaderboard system. Deployed on the **Ethereum Sepolia testnet**, it stores participant data and quiz scores in a transparent, tamper-proof manner.

## Contract Overview

| Property | Value |
|----------|-------|
| **Name** | QuizScores |
| **License** | Apache-2.0 |
| **Solidity Version** | ^0.8.19 |
| **Network** | Ethereum Sepolia Testnet |
| **Source** | [`contracts/QuizScores.sol`](https://github.com/TeamGRYD/Road2DevCon/blob/main/contracts/QuizScores.sol) |

## Architecture

```
┌───────────────────────────────────────────────────────────┐
│                     QuizScores.sol                         │
├───────────────────────────────────────────────────────────┤
│  Immutable:                                               │
│    - admin (address) — set in constructor                 │
├───────────────────────────────────────────────────────────┤
│  Participant Struct:                                      │
│    - name (string)                                        │
│    - xUsername (string)                                    │
│    - quizScores[4] (uint256 array)                       │
│    - registered (bool)                                    │
├───────────────────────────────────────────────────────────┤
│  Storage Mappings:                                        │
│    - mapping(address => Participant)                       │
│    - mapping(bytes32 => address) xUsernameTaken           │
│    - mapping(address => mapping(uint8 => bool)) attempted │
│    - mapping(address => uint256) nonces                   │
│    - address[] participantAddresses                       │
├───────────────────────────────────────────────────────────┤
│  Functions:                                               │
│    - register(name, xUsername)           [student tx]     │
│    - submitScore(quizId, score, nonce, sig) [student tx]  │
│    - getParticipant()                    [view]           │
│    - isRegistered()                      [view]           │
│    - hasAttempted()                       [view]           │
│    - nonces()                            [view]           │
│    - getAllParticipants()                 [view]           │
│    - getParticipantCount()               [view]           │
│    - getLeaderboardBatch()               [view]           │
└───────────────────────────────────────────────────────────┘
```

## Anti-Cheat Security Model

The contract implements a multi-layered anti-cheat system:

### 1. ECDSA Signature Verification

Scores are **signed by an admin wallet** on the server after the student completes the quiz server-side. The contract verifies the signature using `ecrecover`. Without a valid admin signature, `submitScore()` reverts.

```
Student completes quiz → Server grades answers → Server signs score → Student submits signed score on-chain → Contract verifies signature
```

### 2. One Attempt Per Quiz

Each wallet can only attempt each quiz **once**. The `hasAttempted` mapping tracks this:

```solidity
mapping(address => mapping(uint8 => bool)) public hasAttempted;
// In submitScore(): require(!hasAttempted[msg.sender][_quizId], "Already attempted");
```

### 3. Unique X Usernames

Each X (Twitter) username can only be registered to **one wallet**. The comparison is case-insensitive:

```solidity
mapping(bytes32 => address) public xUsernameTaken; // keccak256(lowercase(username)) => wallet
```

### 4. Nonce-Based Replay Protection

Each wallet has an incrementing nonce to prevent replaying old signatures:

```solidity
mapping(address => uint256) public nonces;
// In submitScore(): require(_nonce == nonces[msg.sender], "Invalid nonce");
```

## Data Model

### Participant Struct

```solidity
struct Participant {
    string name;
    string xUsername;
    uint256[4] quizScores;  // Scores for Quiz 0-3
    bool registered;
}
```

Each participant is mapped to their wallet address. Registration is permanent — once set, name and X username cannot be changed.

## Functions

### `register`

```solidity
function register(string calldata _name, string calldata _xUsername) external
```

Called by the **student** from their own wallet. Permanently links their name and X username to their Ethereum address.

**Validation:**
- Wallet must not be already registered
- Name: 1-64 characters
- X username: 1-32 characters
- X username must not already be taken (case-insensitive)

**Events emitted:** `ParticipantRegistered`

### `submitScore`

```solidity
function submitScore(
    uint8 _quizId,
    uint256 _score,
    uint256 _nonce,
    bytes calldata _signature
) external
```

Called by the **student** after completing a quiz. The `_signature` is provided by the server backend.

**Validation:**
- Wallet must be registered
- `_quizId` must be 0-3
- `_score` must be ≤ 2000
- Must not have already attempted this quiz
- `_nonce` must match the wallet's current nonce
- `_signature` must be a valid ECDSA signature from the admin wallet

**Events emitted:** `ScoreSubmitted`

### View Functions

| Function | Description |
|----------|-------------|
| `getParticipant(address)` | Returns name, X username, and quiz scores |
| `isRegistered(address)` | Check if a wallet is registered |
| `hasAttempted(address, uint8)` | Check if a wallet has attempted a quiz |
| `nonces(address)` | Get current nonce for a wallet |
| `getAllParticipants()` | Get all registered wallet addresses |
| `getParticipantCount()` | Get total number of participants |
| `getLeaderboardBatch(start, count)` | Paginated leaderboard data |

## Deployment

### Prerequisites

- A designated **admin wallet** for signing quiz scores
- The admin wallet's **address** (used in constructor)
- The admin wallet's **private key** (stored server-side in Vercel env vars)

### Using Remix IDE

1. Open [remix.ethereum.org](https://remix.ethereum.org)
2. Create a new file: `QuizScores.sol`
3. Paste the contract source code
4. Compile with Solidity **0.8.19+**
5. Select **"Injected Provider - MetaMask"** (Sepolia network)
6. In the Deploy section, enter the **admin wallet address** as the constructor argument
7. Click **Deploy** → Confirm in MetaMask
8. Copy the deployed contract address

### Configure the Portal

After deployment, set these environment variables:

**Client-side** (in `.env` file):
```env
VITE_CONTRACT_ADDRESS=0xYourDeployedContractAddress
```

**Server-side** (in Vercel Dashboard → Settings → Environment Variables):
```
ADMIN_PRIVATE_KEY=0xYourAdminPrivateKey
ADMIN_ADDRESS=0xYourAdminAddress
JWT_SECRET=any-random-string-32-chars-min
RPC_URL=https://rpc.sepolia.org
```

:::warning
Never put `ADMIN_PRIVATE_KEY` in your `.env` file or any file with a `VITE_` prefix. It must only exist as a server-side Vercel environment variable.
:::

## Security Considerations

| Feature | Protection |
|---------|-----------|
| **Admin-signed scores** | Prevents score forging via manual transactions |
| **One attempt per quiz** | `hasAttempted` mapping prevents retakes |
| **Unique X usernames** | Prevents one person registering multiple times with the same X handle |
| **Nonce replay protection** | Prevents reusing captured signatures |
| **Permanent registration** | Name and X username locked to wallet after registration |
| **Score cap (2000)** | Maximum score enforced at contract level |
| **Server-side grading** | Correct answers never reach the browser |
| **Input length limits** | Name ≤ 64 chars, X username ≤ 32 chars |
