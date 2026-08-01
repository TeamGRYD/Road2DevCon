---
sidebar_position: 3
title: "3. Privacy on Ethereum"
---

# 🔒 Your Data, Your Rules: Privacy on Ethereum

> Privacy isn't about hiding — it's about choosing what you share.

**CROPS Pillar:** Privacy (P)

---

## Privacy in the Digital Age

You share data with over 100 companies every single day. Your location (Google Maps), your conversations (WhatsApp), your purchases (Amazon), your health data (fitness apps), your browsing habits (every website with cookies).

**The uncomfortable truth:**

- In 2023, there were 3,200+ data breaches exposing 353 million records in the US alone
- India's Aadhaar database has faced multiple reported leaks affecting millions
- Cambridge Analytica used Facebook data to influence elections without users' knowledge
- Surveillance capitalism is a $300+ billion industry — your data IS the product

**Privacy isn't about "having something to hide."** You close the bathroom door not because you're doing anything wrong — but because some things are simply yours. Privacy is about **agency**: the right to choose what you share, with whom, and when.

This is especially important for vulnerable populations: activists, journalists, domestic abuse survivors, political dissidents, and LGBTQ+ individuals in hostile environments.

## The Blockchain Transparency Paradox

Here's the irony: blockchains were designed for transparency, but that creates a privacy problem.

**On Ethereum, everything is public:**

- Every transaction (amount, sender, receiver) is visible to everyone
- Your wallet address isn't your name, but it's a consistent identity
- Blockchain analytics firms (Chainalysis, Elliptic) specialize in linking wallet addresses to real identities
- If you've ever used a centralized exchange with KYC (Know Your Customer), your wallet is linked to your passport

**The spectrum of identity:**

| Level | Description | Example |
|-------|------------|---------|
| **Transparency** | Everyone sees everything | Default blockchain |
| **Pseudonymity** | Consistent alias, no real name | Wallet address |
| **Privacy** | Specific details hidden, system verifiable | ZK-proofs |
| **Anonymity** | No link between identity and actions | Tor + privacy coins |

**Pseudonymity ≠ Privacy**: Just because your wallet address isn't your name doesn't mean you're private. One slip — connecting to a KYC exchange, receiving a payment from a known address — and your entire transaction history is exposed.

## Zero-Knowledge Proofs: The "Magic Trick"

**Zero-Knowledge Proofs (ZKPs)** are perhaps the most important cryptographic invention of the last decade. They let you prove something is true WITHOUT revealing the underlying data.

**The analogy**: Imagine you want to prove you're over 18 to buy a movie ticket. Today, you show your ID — which also reveals your exact birthday, home address, and full name. With a ZKP, you could prove "I am over 18" without revealing any other information. The verifier learns only one fact: "Yes, this person is over 18."

**How it works (conceptually):**

1. The **Prover** has some secret data (e.g., their age)
2. The Prover generates a mathematical **proof** that the statement is true
3. The **Verifier** checks the proof and learns only "true" or "false"
4. The Verifier learns NOTHING else about the secret data

**Types of ZKPs:**

| Type | Full Name | Pros | Cons |
|------|-----------|------|------|
| **zk-SNARKs** | Succinct Non-interactive Arguments of Knowledge | Small proof, fast verification | Requires trusted setup |
| **zk-STARKs** | Scalable Transparent Arguments of Knowledge | No trusted setup, post-quantum safe | Larger proof size |

**This is real math, not magic**: ZKPs are based on elliptic curve cryptography and polynomial commitments. They're computationally proven to be secure — not "trust us" secure, but "we can mathematically prove this reveals nothing" secure.

## ZK in Practice on Ethereum

ZK technology is being deployed RIGHT NOW on Ethereum for two purposes: **scaling** and **privacy**.

### ZK-Rollups (Layer 2 Scaling)

- Instead of processing every transaction on Ethereum (slow, expensive), ZK-Rollups batch thousands of transactions off-chain
- They generate a tiny validity proof (the ZKP) that mathematically guarantees all transactions are correct
- This proof is submitted to Ethereum — one proof verifies thousands of transactions at once
- Result: 10-100x cheaper fees, near-instant transactions, with Ethereum's security

**Live ZK-Rollups:**

| Project | Description |
|---------|-------------|
| [zkSync Era](https://zksync.io/) | General-purpose ZK-Rollup |
| [Scroll](https://scroll.io/) | EVM-equivalent ZK-Rollup |
| [Polygon zkEVM](https://polygon.technology/polygon-zkevm) | Polygon's ZK scaling solution |
| [StarkNet](https://www.starknet.io/) | STARK-based scaling (Cairo language) |
| [Linea](https://linea.build/) | ConsenSys ZK-Rollup |

### Privacy Applications

- **Commit-Reveal Schemes**: Hash your data (commit), reveal it later — you'll build one in [Workshop Quest 2](/quests/quest-2)!
- **Railgun**: Private transfers on Ethereum using ZK proofs
- **Aztec Network**: Full privacy-preserving smart contracts
- **Semaphore**: Anonymous group membership proofs (prove "I'm in this group" without revealing which member you are)

## Why Privacy Enables Freedom

Privacy isn't a luxury — it's foundational to a functioning society.

**Without privacy, you can't have:**

- **Fair elections**: If votes are public, voters face coercion and retaliation
- **Salary negotiation**: If everyone's salary is public, bargaining power disappears
- **Medical confidentiality**: Your health conditions shouldn't affect your job prospects
- **Free speech**: Activists in authoritarian regimes depend on privacy for their safety
- **Personal autonomy**: The chilling effect — people self-censor when they know they're being watched

**Article 12 of the Universal Declaration of Human Rights**: "No one shall be subjected to arbitrary interference with his privacy."

**India's Puttaswamy judgment (2017)**: The Supreme Court of India ruled that privacy is a fundamental right under Article 21 of the Constitution. This landmark ruling affirmed that informational privacy, including data protection, is constitutionally protected.

:::note Privacy vs. Secrecy
A system can be auditable (anyone can verify the rules are followed) while being private (individual details are hidden). ZK proofs enable exactly this combination.
:::

## The Engineering Challenge

ZK technology is one of the most active areas of research in computer science and cryptography.

**The technical challenges:**

- ZK circuits are computationally expensive — proving time is a major bottleneck
- Trade-offs between proof size, proving time, verification time, and security assumptions
- Writing ZK circuits requires specialized languages (Circom, Noir, Cairo) and a different mental model
- Hardware acceleration (GPUs, FPGAs, ASICs) for ZK proving is an emerging field

**Career opportunities:**

- ZK engineers are among the highest-paid in the entire tech industry
- The field combines mathematics, cryptography, and systems engineering
- Companies like StarkWare, Polygon, Scroll, Aztec, and others are actively hiring
- Research opportunities in academia and industry are abundant

---

## Key Concepts

| Concept | Definition |
|---------|-----------|
| **Zero-Knowledge Proof** | Prove a statement is true without revealing the underlying data |
| **zk-SNARK** | Succinct proof, small size, requires trusted setup |
| **zk-STARK** | Transparent proof, no trusted setup, post-quantum secure |
| **ZK-Rollup** | Layer 2 scaling using ZK proofs to batch transactions |
| **Commit-Reveal** | Two-phase scheme: submit hash first, reveal data later |
| **Pseudonymity** | Using a consistent alias (wallet address) without real identity |
| **Semaphore** | Protocol for anonymous group membership proofs |

## Further Reading

- [ZKPs Explained — ethereum.org](https://ethereum.org/en/zero-knowledge-proofs/) — Official introduction to ZK proofs
- [What Are ZK-Rollups?](https://ethereum.org/en/developers/docs/scaling/zk-rollups/) — Layer 2 scaling explainer
- [Vitalik: An Incomplete Guide to Rollups](https://vitalik.eth.limo/general/2021/01/05/rollup.html) — Deep dive from Vitalik
- [ZK Podcast](https://zeroknowledge.fm/) — Interviews with ZK researchers
- [Circom Language](https://docs.circom.io/) — Write ZK circuits
- [Noir Language](https://noir-lang.org/) — Aztec's ZK DSL
- [Semaphore Protocol](https://semaphore.pse.dev/) — Anonymous signaling
- [Railgun](https://railgun.org/) — Private transactions on Ethereum
- [Puttaswamy Judgment](https://indiankanoon.org/doc/127517806/) — India's privacy ruling
- [Commit-Reveal Pattern](https://medium.com/coinmonks/commit-reveal-scheme-in-solidity-c06eba032240) — Implementing the pattern in Solidity

## Discussion Questions

1. Why is pseudonymity NOT the same as privacy on a blockchain?
2. How would you explain Zero-Knowledge Proofs to a non-technical person?
3. Can you think of a real-world scenario where commit-reveal would be useful outside of voting?
4. How does India's Puttaswamy judgment relate to blockchain privacy?
