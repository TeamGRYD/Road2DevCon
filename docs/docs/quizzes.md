---
sidebar_position: 4
title: Quizzes
---

# 📝 Quizzes

The portal includes topic-based quizzes that test understanding of the workshop presentations. Scores are recorded on-chain via the [QuizScores smart contract](/smart-contract).

## How Quizzes Work

1. **Connect your wallet** using MetaMask on Sepolia testnet
2. **Enter your name and X (Twitter) username** for the leaderboard
3. **Select a quiz** corresponding to a presentation topic
4. **Answer the questions** — questions are automatically shuffled so every participant gets a different order
5. **Submit your score** — your highest score across attempts is stored on-chain

## Quiz Topics

| Quiz | Based On | Topics Covered |
|------|----------|---------------|
| **Quiz 1** | [Censorship Resistance](/presentations/censorship-resistance) | Blockchain basics, Ethereum, censorship resistance, resistance to capture, validators, EIPs |
| **Quiz 2** | [Open Source](/presentations/open-source) | Open source principles, Ethereum's openness, EIP process, developer tools, Solidity, ERCs |
| **Quiz 3** | [Privacy](/presentations/privacy) | Digital privacy, pseudonymity vs. privacy, zero-knowledge proofs, ZK-Rollups, commit-reveal |
| **Quiz 4** | [Security](/presentations/security) | Smart contract vulnerabilities, reentrancy, access control, CEI pattern, security tools, auditing |

## Design Decisions

### Anti-Cheating Measures

- **Shuffled questions**: Every participant sees questions in a different random order, preventing coordination
- **No immediate feedback**: The portal does not reveal which answers are correct or incorrect during the quiz, preventing real-time sharing of answers
- **On-chain scoring**: Scores are submitted to the blockchain, creating a transparent and tamper-proof record

### Scoring

- Each quiz has multiple-choice questions
- Scores are calculated based on correct answers
- Only your **highest score** per quiz is stored on-chain (you can retry to improve)
- The leaderboard aggregates scores across all 4 quizzes

## Leaderboard

The leaderboard reads directly from the [QuizScores smart contract](/smart-contract) on Sepolia. It displays:

- Participant name and X username
- Individual quiz scores
- Total aggregate score
- Wallet address (truncated)

The leaderboard updates in real-time as new scores are submitted on-chain.
