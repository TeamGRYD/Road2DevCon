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
| **License** | MIT |
| **Solidity Version** | ^0.8.19 |
| **Network** | Ethereum Sepolia Testnet |
| **Source** | [`contracts/QuizScores.sol`](https://github.com/TeamGRYD/RoadToDevcon8/blob/main/contracts/QuizScores.sol) |

## Architecture

```
┌─────────────────────────────────────────────────┐
│                  QuizScores.sol                   │
├─────────────────────────────────────────────────┤
│  Participant Struct:                             │
│    - name (string)                               │
│    - xUsername (string)                           │
│    - quizScores[4] (uint256 array)              │
│    - registered (bool)                           │
├─────────────────────────────────────────────────┤
│  Storage:                                        │
│    - mapping(address => Participant)              │
│    - address[] participantAddresses              │
├─────────────────────────────────────────────────┤
│  Functions:                                      │
│    - registerAndSubmitScore()                     │
│    - getParticipant()                            │
│    - isRegistered()                              │
│    - getAllParticipants()                         │
│    - getParticipantCount()                       │
│    - getLeaderboardBatch()                       │
└─────────────────────────────────────────────────┘
```

## Data Model

### Participant Struct

```solidity
struct Participant {
    string name;
    string xUsername;
    uint256[4] quizScores;  // Highest scores for Quiz 0-3
    bool registered;
}
```

Each participant is mapped to their wallet address (`msg.sender`). The `quizScores` array stores the **highest score** achieved for each of the 4 quizzes.

## Functions

### `registerAndSubmitScore`

```solidity
function registerAndSubmitScore(
    string calldata _name,
    string calldata _xUsername,
    uint8 _quizId,
    uint256 _score
) external
```

The primary function called by the portal. It:

1. **Registers** the participant if they haven't been registered yet
2. **Updates** name and X username on subsequent calls
3. **Stores the score** only if it's higher than the existing score for that quiz

**Validation:**
- `_quizId` must be 0-3
- `_name` cannot be empty
- `_xUsername` cannot be empty
- `_score` cannot exceed 2000

**Events emitted:**
- `ParticipantRegistered` (on first registration)
- `ScoreSubmitted` (on every call)

### `getParticipant`

```solidity
function getParticipant(address _wallet) external view
    returns (string memory name, string memory xUsername, uint256[4] memory quizScores)
```

Returns a participant's full data by wallet address. Reverts if the address is not registered.

### `isRegistered`

```solidity
function isRegistered(address _wallet) external view returns (bool)
```

Check if an address has been registered.

### `getAllParticipants`

```solidity
function getAllParticipants() external view returns (address[] memory)
```

Returns all registered wallet addresses for leaderboard enumeration.

### `getParticipantCount`

```solidity
function getParticipantCount() external view returns (uint256)
```

Returns the total number of registered participants.

### `getLeaderboardBatch`

```solidity
function getLeaderboardBatch(uint256 _start, uint256 _count) external view
    returns (
        address[] memory wallets,
        string[] memory names,
        string[] memory xUsernames,
        uint256[4][] memory scores
    )
```

Batch-read participant data for the leaderboard. Returns parallel arrays for efficient off-chain processing. Supports pagination via `_start` and `_count`.

## Deployment

### Using Remix IDE

1. Open [remix.ethereum.org](https://remix.ethereum.org)
2. Create a new file: `QuizScores.sol`
3. Paste the contract source code
4. Compile with Solidity **0.8.19+**
5. Select **"Injected Provider - MetaMask"** (Sepolia network)
6. Click **Deploy** → Confirm in MetaMask
7. Copy the deployed contract address

### Configure the Portal

After deployment, set the contract address in your `.env` file:

```env
VITE_CONTRACT_ADDRESS=0xYourDeployedContractAddress
```

Restart the dev server for the change to take effect.

## Security Considerations

- **No admin functions**: The contract has no owner or admin. Anyone can submit scores.
- **Highest-score-wins**: Scores can only increase, never decrease. This prevents accidental overwrites.
- **Input validation**: All inputs are validated (quiz ID range, non-empty strings, max score cap).
- **Gas efficiency**: `getLeaderboardBatch` uses pagination to avoid gas limits on large datasets.

## Full Source Code

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract QuizScores {
    struct Participant {
        string name;
        string xUsername;
        uint256[4] quizScores;
        bool registered;
    }

    mapping(address => Participant) private participants;
    address[] private participantAddresses;

    event ScoreSubmitted(
        address indexed wallet, string name,
        string xUsername, uint8 quizId, uint256 score
    );
    event ParticipantRegistered(
        address indexed wallet, string name, string xUsername
    );

    function registerAndSubmitScore(
        string calldata _name, string calldata _xUsername,
        uint8 _quizId, uint256 _score
    ) external {
        require(_quizId < 4, "Invalid quiz ID (must be 0-3)");
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_xUsername).length > 0, "X username cannot be empty");
        require(_score <= 2000, "Score exceeds maximum (2000)");

        Participant storage p = participants[msg.sender];
        if (!p.registered) {
            p.registered = true;
            p.name = _name;
            p.xUsername = _xUsername;
            participantAddresses.push(msg.sender);
            emit ParticipantRegistered(msg.sender, _name, _xUsername);
        } else {
            p.name = _name;
            p.xUsername = _xUsername;
        }

        if (_score > p.quizScores[_quizId]) {
            p.quizScores[_quizId] = _score;
        }
        emit ScoreSubmitted(msg.sender, _name, _xUsername, _quizId, _score);
    }

    function getParticipant(address _wallet) external view
        returns (string memory, string memory, uint256[4] memory)
    {
        Participant storage p = participants[_wallet];
        require(p.registered, "Participant not found");
        return (p.name, p.xUsername, p.quizScores);
    }

    function isRegistered(address _wallet) external view returns (bool) {
        return participants[_wallet].registered;
    }

    function getAllParticipants() external view returns (address[] memory) {
        return participantAddresses;
    }

    function getParticipantCount() external view returns (uint256) {
        return participantAddresses.length;
    }

    function getLeaderboardBatch(uint256 _start, uint256 _count) external view
        returns (address[] memory, string[] memory, string[] memory, uint256[4][] memory)
    {
        uint256 total = participantAddresses.length;
        if (_start >= total) {
            return (new address[](0), new string[](0), new string[](0), new uint256[4][](0));
        }
        uint256 end = _start + _count;
        if (end > total) end = total;
        uint256 len = end - _start;

        address[] memory wallets = new address[](len);
        string[] memory names = new string[](len);
        string[] memory xUsernames = new string[](len);
        uint256[4][] memory scores = new uint256[4][](len);

        for (uint256 i = 0; i < len; i++) {
            address addr = participantAddresses[_start + i];
            Participant storage p = participants[addr];
            wallets[i] = addr;
            names[i] = p.name;
            xUsernames[i] = p.xUsername;
            scores[i] = p.quizScores;
        }
        return (wallets, names, xUsernames, scores);
    }
}
```
