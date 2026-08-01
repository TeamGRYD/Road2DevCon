---
sidebar_position: 1
title: Workshop Quests Overview
---

# ⚔️ Workshop Quests

Workshop Quests are hands-on, guided tutorials where you write and deploy real Solidity smart contracts to the Ethereum Sepolia testnet. Each quest reinforces concepts from the presentations.

## Available Quests

| # | Quest | Based On | Difficulty | Duration |
|---|-------|----------|-----------|----------|
| 1 | [Message Board](/quests/quest-1) | Presentations 1 & 2 (Censorship Resistance + Open Source) | Beginner | ~50 min |
| 2 | [Private Voting](/quests/quest-2) | Presentations 3 & 4 (Privacy + Security) | Beginner to Intermediate | ~50 min |

## What You'll Build

### Quest 1: Censorship-Resistant Message Board

Deploy a message board smart contract where anyone can post messages that can never be deleted, censored, or modified. Then verify the source code on Etherscan to make it fully open source.

**Key concepts practiced:**
- Smart contract deployment
- On-chain data storage
- Censorship resistance by design
- Open-source verification on Etherscan

### Quest 2: Secure Private Voting Contract

Build a voting contract that uses the **commit-reveal scheme** for privacy and implements the **Checks-Effects-Interactions** security pattern. Voters hash their vote to keep it secret, then reveal it after everyone has committed.

**Key concepts practiced:**
- Commit-reveal privacy scheme
- Access control modifiers
- Input validation
- State machine pattern
- Adversarial thinking

## Prerequisites

Before starting the quests, ensure you have:

- A laptop with a modern browser (Chrome or Brave recommended)
- [MetaMask](https://metamask.io) browser extension installed
- Some Sepolia test ETH (free from [Google Cloud Faucet](https://cloud.google.com/application/web3/faucet/ethereum/sepolia))
- Basic familiarity with programming concepts

:::tip No Solidity Experience Needed
Quest 1 starts from zero. The code is provided with detailed explanations. You'll learn Solidity by reading and deploying working contracts.
:::

## Tools Used

| Tool | Purpose | Link |
|------|---------|------|
| **MetaMask** | Ethereum wallet (browser extension) | [metamask.io](https://metamask.io) |
| **GRYD / Remix IDE** | Browser-based smart contract IDE | [gryd.wtf](https://gryd.wtf) / [remix.ethereum.org](https://remix.ethereum.org) |
| **Sepolia Etherscan** | Block explorer for the Sepolia testnet | [sepolia.etherscan.io](https://sepolia.etherscan.io) |
| **Sepolia Faucet** | Free test ETH | [Google Cloud Faucet](https://cloud.google.com/application/web3/faucet/ethereum/sepolia) |
