---
sidebar_position: 4
title: Quizzes
---

# 📝 Quizzes

The portal includes topic-based quizzes that test understanding of the workshop presentations. Scores are recorded on-chain via the [QuizScores smart contract](/smart-contract), with a comprehensive anti-cheat system to ensure fair competition.

## How Quizzes Work

1. **Connect your wallet** using MetaMask on Sepolia testnet
2. **Register** — enter your name and X (Twitter) username (one-time, permanent, on-chain)
3. **Select a quiz** corresponding to a presentation topic
4. **Answer 10 random questions** — selected from a pool of 100+ questions per quiz
5. **30 seconds per question** — timer auto-advances if you don't answer
6. **Score submitted on-chain** — your score is revealed only after it's stored on the blockchain
7. **No retakes** — each quiz can only be attempted once per wallet

## Quiz Topics

| Quiz | Based On | Pool Size | Topics Covered |
|------|----------|-----------|---------------|
| **Quiz 1** | [Censorship Resistance](/presentations/censorship-resistance) | 100+ questions | Blockchain basics, Ethereum, censorship resistance, resistance to capture, validators, EIPs |
| **Quiz 2** | [Open Source](/presentations/open-source) | 100+ questions | Open source principles, Ethereum's openness, EIP process, developer tools, Solidity, ERCs |
| **Quiz 3** | [Privacy](/presentations/privacy) | 100+ questions | Digital privacy, pseudonymity vs. privacy, zero-knowledge proofs, ZK-Rollups, commit-reveal |
| **Quiz 4** | [Security](/presentations/security) | 100+ questions | Smart contract vulnerabilities, reentrancy, access control, CEI pattern, security tools, auditing |

## Scoring System

| Parameter | Value |
|-----------|-------|
| Questions per attempt | 10 (randomly selected) |
| Time limit per question | 30 seconds (hard limit) |
| Correct answer | 100 base points |
| Speed bonus | Up to +100 points (faster = more) |
| Max per question | 200 points |
| Max per quiz | 2,000 points |
| Retakes | ❌ Not allowed |

**Speed bonus formula:** The bonus decreases by 4 points per second. Answering in under 1 second earns the full 100-point bonus. Answering at 25+ seconds earns 0 bonus.

## Anti-Cheat System

The quiz system uses a **server-side quiz engine** with multiple layers of protection:

### 🔒 Server-Side Grading

Correct answers are **never sent to the browser**. The server:
- Selects 10 random questions from the 100+ pool
- Sends questions to the browser **without correct answers**
- Grades each answer on the server
- Calculates the final score server-side
- Signs the score with an admin key for on-chain submission

### 🛡️ On-Chain Enforcement

The [QuizScores smart contract](/smart-contract) enforces:
- **Signature verification**: Only admin-signed scores are accepted
- **One attempt per quiz**: `hasAttempted` mapping prevents retakes
- **Unique X usernames**: Each X handle can only be used by one wallet
- **Nonce replay protection**: Prevents reusing captured signatures

### ⏱️ Server-Side Timer

The 30-second timer is enforced **on the server**, not just in the browser. Even if a student modifies the frontend code, the server will mark the answer as timed out.

### 🎲 Question Randomization

Each student receives a **different set of 10 questions** from a pool of 100+. Options within each question are also shuffled. This makes answer-sharing impractical.

### Security Summary

| Attack Vector | Status |
|--------------|--------|
| Forge score via raw transaction | ✅ Blocked (requires admin signature) |
| Extract admin key from frontend | ✅ Blocked (key is server-side only) |
| Read correct answers from source code | ✅ Blocked (answers only on server) |
| Bypass 30s timer | ✅ Blocked (enforced server-side) |
| Take quiz multiple times | ✅ Blocked (on-chain + server check) |
| Register same X username twice | ✅ Blocked (on-chain uniqueness) |
| Replay a captured signature | ✅ Blocked (nonce protection) |
| Share answers between participants | ✅ Mitigated (random 10 from 100+ pool) |

## Leaderboard

The leaderboard reads directly from the [QuizScores smart contract](/smart-contract) on Sepolia. It displays:

- Participant name and X username
- Individual quiz scores (Q1–Q4)
- Total aggregate score
- Podium for top 3 participants

The leaderboard updates automatically after each score submission.
