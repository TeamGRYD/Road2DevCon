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

## 📖 Extended Learning

:::info
The sections below go deeper than the 25-minute presentation. They're designed for self-study so you can prepare for **Quiz 3 (Privacy)**, which draws from this entire page including the extended material.
:::

### Advanced Privacy Techniques

Beyond ZKPs, several other cryptographic techniques enable privacy:

**Multi-Party Computation (MPC)** allows multiple parties to jointly compute a function over their private inputs without revealing those inputs to each other. For example, two companies could determine which customers they share *without* either revealing their full customer list. MPC is used in threshold wallets (e.g., Fireblocks) where multiple parties hold key shares.

**Stealth Addresses** are one-time addresses generated for each transaction so the recipient's public address never appears on-chain. The sender uses the recipient's public "meta-address" to derive a fresh address for each payment. Vitalik Buterin proposed [EIP-5564](https://eips.ethereum.org/EIPS/eip-5564) to standardize stealth addresses on Ethereum.

**Fully Homomorphic Encryption (FHE)** is considered the "holy grail" of privacy — it enables computation on encrypted data without ever decrypting it. Imagine a smart contract that processes your encrypted medical records and outputs an encrypted result that only you can decrypt. FHE is currently too slow for practical use but is advancing rapidly (projects like Zama, Fhenix).

**Mixers** (like the now-sanctioned Tornado Cash) break the link between sender and receiver by pooling deposits together. When you withdraw, the protocol uses ZK proofs to prove you deposited *some amount* without revealing which deposit was yours. The concept is called a **shielded pool** — an encrypted pool of assets where balances and transfers are hidden.

### Privacy Coins & Protocols

Different blockchains take different approaches to privacy:

| Protocol | Technique | How It Works |
|----------|-----------|-------------|
| **Monero** | Ring signatures + RingCT + stealth addresses | Every transaction mixes the real input with decoys (ring signature), hides amounts (RingCT), and generates one-time recipient addresses |
| **Zcash** | zk-SNARKs | Fully shielded transactions hide sender, receiver, and amount using zero-knowledge proofs |
| **Railgun** | zk-SNARKs on Ethereum | Smart contract privacy system that shields ERC-20 transfers without leaving Ethereum |
| **Aztec Network** | ZK-rollup | Privacy-focused L2 enabling private smart contracts using "Noir" circuits |

A **ring signature** proves a message was signed by *someone* in a group without revealing which member signed it — like having 10 people put their hands in a circle, and only one pushes the button, but no observer can tell who. **RingCT** (Ring Confidential Transactions) extends this to hide amounts while still allowing the network to verify inputs equal outputs.

### Privacy-Preserving Identity

Privacy extends beyond financial transactions to *identity itself*:

- **Decentralized Identifiers (DIDs)**: Globally unique identifiers (like `did:ethr:0x1234...`) that enable verifiable digital identity *without* a central authority. You control your DID — no company can revoke it.
- **Verifiable Credentials**: Cryptographically signed claims (e.g., "this person has a degree from X university") that can be verified by anyone without contacting the issuer.
- **Soulbound Tokens (SBTs)**: Non-transferable NFTs proposed by Vitalik Buterin that represent identity, credentials, or affiliations bound to a specific wallet. They can encode reputation, membership, or qualifications on-chain.
- **Self-Sovereign Identity (SSI)**: An identity model where individuals fully own and control their personal data without relying on centralized authorities like governments or companies.

**ZKPs + Identity**: ZKPs can prove claims about identity without revealing underlying data. For example, proving "I am over 18" without revealing your exact birthday, or proving "I am a citizen of India" without revealing your passport number.

### Privacy & Regulation

The intersection of privacy technology and law creates fascinating tension:

**GDPR (General Data Protection Regulation)** — EU law that gives individuals the "right to be forgotten" (data deletion). This conflicts directly with blockchain's immutability. Solutions include storing personal data off-chain with only hashes on-chain, enabling deletion of the off-chain data.

**OFAC & Tornado Cash** — In August 2022, the US Treasury's Office of Foreign Assets Control (OFAC) sanctioned Tornado Cash smart contract addresses. This was the first time code (not a person or company) was sanctioned. It raised fundamental questions: can you sanction open-source code that runs autonomously? Several validators began censoring Tornado Cash transactions, though the smart contract itself kept running.

**Selective disclosure** is the principle of sharing only specific pieces of personal information required for a given interaction. Instead of showing your full ID to prove your age, you'd prove only the single fact needed. This is the promise of ZKP-based identity systems.

**"Nothing to hide" fallacy**: Privacy is important even when you have "nothing to hide." It protects against future policy changes, data breaches, discrimination, and power imbalances. As Bruce Schneier wrote: "Saying you don't care about privacy because you have nothing to hide is like saying you don't care about free speech because you have nothing to say."

### Technical Privacy Concepts

These concepts appear in advanced privacy systems:

- **Nullifiers**: In ZK systems (like Tornado Cash), a nullifier is a unique value derived from your private inputs that prevents double-spending. You submit the nullifier when withdrawing — the system checks it hasn't been used before, but can't link it to your deposit.
- **Differential Privacy**: A mathematical framework for adding carefully calibrated noise to data so that individual records are protected while statistical patterns are preserved. Used by Apple and Google in analytics.
- **Accumulators**: Compact cryptographic structures that represent a large set and can prove membership *without* revealing the set. Used in anonymous credential systems.
- **Onion Routing (Tor)**: Encrypting messages in multiple layers, each "peeled" by a different relay node, so no single node knows both the sender and the destination. The name "Tor" stands for "The Onion Router."
- **k-Anonymity**: A privacy model where each record in a dataset is indistinguishable from at least *k-1* other records, preventing re-identification.
- **Plausible Deniability**: The ability to deny involvement in a transaction because an observer cannot definitively prove your participation — ring signatures provide this by design.

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
| **MPC** | Multiple parties compute a function without revealing individual inputs |
| **Stealth Address** | One-time address generated per transaction to hide the recipient |
| **FHE** | Fully Homomorphic Encryption — compute on encrypted data |
| **DID** | Decentralized Identifier — self-owned digital identity |
| **SBT** | Soulbound Token — non-transferable NFT representing identity/credentials |
| **Nullifier** | Value preventing double-spending in ZK systems without revealing identity |

## Further Reading

- [ZKPs Explained — ethereum.org](https://ethereum.org/en/zero-knowledge-proofs/) — Official introduction to ZK proofs
- [What Are ZK-Rollups?](https://ethereum.org/en/developers/docs/scaling/zk-rollups/) — Layer 2 scaling explainer
- [Vitalik: An Incomplete Guide to Rollups](https://vitalik.eth.limo/general/2021/01/05/rollup.html) — Deep dive from Vitalik
- [EIP-5564: Stealth Addresses](https://eips.ethereum.org/EIPS/eip-5564) — Stealth address standard
- [Vitalik: An Incomplete Guide to Stealth Addresses](https://vitalik.eth.limo/general/2023/01/20/stealth.html) — Deep dive on stealth addresses
- [Soulbound Tokens Paper](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4105763) — Vitalik et al. on SBTs
- [GDPR and Blockchain](https://www.europarl.europa.eu/RegData/etudes/STUD/2019/634445/EPRS_STU(2019)634445_EN.pdf) — EU Parliament study
- [ZK Podcast](https://zeroknowledge.fm/) — Interviews with ZK researchers
- [Circom Language](https://docs.circom.io/) — Write ZK circuits
- [Noir Language](https://noir-lang.org/) — Aztec's ZK DSL
- [Semaphore Protocol](https://semaphore.pse.dev/) — Anonymous signaling
- [Railgun](https://railgun.org/) — Private transactions on Ethereum
- [Monero Research](https://www.getmonero.org/resources/research-lab/) — Ring signature research
- [Puttaswamy Judgment](https://indiankanoon.org/doc/127517806/) — India's privacy ruling
- [Commit-Reveal Pattern](https://medium.com/coinmonks/commit-reveal-scheme-in-solidity-c06eba032240) — Implementing the pattern in Solidity

## Discussion Questions

1. Why is pseudonymity NOT the same as privacy on a blockchain?
2. How would you explain Zero-Knowledge Proofs to a non-technical person?
3. Can you think of a real-world scenario where commit-reveal would be useful outside of voting?
4. How does India's Puttaswamy judgment relate to blockchain privacy?
5. Should code (like Tornado Cash) be sanctionable? What are the implications for open-source development?
6. How could stealth addresses and SBTs coexist — one hides identity while the other binds to it?

