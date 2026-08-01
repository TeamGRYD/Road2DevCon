---
sidebar_position: 4
title: "4. Security in Smart Contracts"
---

# 🔐 Building Unbreakable Code: Security in Smart Contracts

> When code handles real money, every line is a potential attack vector.

**CROPS Pillar:** Security (S)

---

## Why Security is Existential in Web3

Smart contract security isn't like traditional software security. The stakes are fundamentally different:

**Why it's harder:**

- **Real money at stake**: Smart contracts directly handle financial assets. A bug doesn't just crash an app — it loses real money. Permanently.
- **Immutable code**: Once deployed, smart contracts CANNOT be patched, updated, or hotfixed. There's no "Patch Tuesday," no "we'll push a fix tonight." The code is permanent.
- **Public source code**: Unlike traditional software, smart contract code is visible to everyone — including attackers. They can study your code at their leisure and find the perfect exploit.
- **Composability risk**: Smart contracts interact with other smart contracts. A bug in one contract can cascade through the entire ecosystem.

**The numbers are staggering:**

| Year | Total Stolen | Notable Incident |
|------|-------------|-----------------|
| 2022 | **$3.8 billion** | Ronin Bridge ($625M) |
| 2023 | ~$1.7 billion | Various DeFi exploits |
| All time | **$5+ billion** (top 10 hacks) | DAO Hack, Ronin, Wormhole |

**The good news**: Most hacks exploit a small set of well-known vulnerability patterns. Learn these patterns, and you can write significantly safer code.

## The DAO Hack (2016) — The Reentrancy Attack

**The story**: "The DAO" was a decentralized venture capital fund on Ethereum. Investors deposited ETH into a smart contract and voted on which projects to fund. It raised $150 million — the largest crowdfund in history at the time.

**The vulnerability — Reentrancy:**

The withdraw function sent ETH to the user BEFORE updating their balance:

```solidity
// ❌ VULNERABLE CODE (simplified)
function withdraw() public {
    uint amount = balances[msg.sender];
    // Step 1: Send ETH (BEFORE updating balance!)
    msg.sender.call{value: amount}("");
    // Step 2: Update balance (TOO LATE!)
    balances[msg.sender] = 0;
}
```

**The exploit**: The attacker deployed a malicious contract that, upon receiving ETH, immediately called `withdraw()` again. Because the balance hadn't been updated yet, the contract "thought" the attacker still had funds and sent more ETH. This loop repeated until the contract was drained.

**The damage**: 3.6 million ETH stolen (~$60 million at the time). The event was so devastating that the Ethereum community performed a "hard fork" — splitting into **Ethereum (ETH)** (which reversed the hack) and **Ethereum Classic (ETC)** (which kept the original chain).

**The fix — Checks-Effects-Interactions pattern:**

```solidity
// ✅ SAFE CODE
function withdraw() public {
    uint amount = balances[msg.sender];
    // Step 1: CHECK conditions
    require(amount > 0, "No balance");
    // Step 2: UPDATE state (EFFECTS first!)
    balances[msg.sender] = 0;
    // Step 3: External INTERACTION (last!)
    (bool ok, ) = msg.sender.call{value: amount}("");
    require(ok, "Transfer failed");
}
```

## The Ronin Bridge Hack (2022) — Centralization Risk

**The story**: Ronin was a "bridge" connecting Ethereum to the Ronin sidechain (used by the game Axie Infinity). It used a multi-signature scheme requiring 5 out of 9 validators to approve transactions.

**The vulnerability — Key compromise + Centralization:**

- 4 of the 9 validator keys were controlled by a single company (Sky Mavis)
- 1 additional key was given temporary access to a third-party validator — and that access was never revoked
- The attackers (linked to North Korea's Lazarus Group) compromised these 5 keys

**The result**:

- 173,600 ETH + 25.5 million USDC
- Total: ~$625 million — one of the largest hacks in history
- **The hack went unnoticed for 6 days**

:::warning Key Lesson
When 5 out of 9 keys are controlled by related entities, you don't really have a 5-of-9 multi-sig — you have a 1-of-1 with extra steps. **Decentralization isn't just ideology — it's a security requirement.**
:::

## Common Vulnerabilities You MUST Know

| # | Vulnerability | Description | Fix |
|---|-------------|-------------|-----|
| 1 | **Reentrancy** | External call before state update | Checks-Effects-Interactions, `ReentrancyGuard` |
| 2 | **Access Control** | Forgetting to restrict sensitive functions | OpenZeppelin `Ownable` or `AccessControl` |
| 3 | **Integer Overflow** | Pre-0.8.0: max uint + 1 = 0 | Solidity ≥0.8.0 has built-in checks |
| 4 | **Front-Running** | Attacker sees pending tx, inserts theirs first | Commit-reveal, private mempools |
| 5 | **Oracle Manipulation** | Manipulating external price data | Chainlink, TWAP (time-weighted averages) |

## Defensive Patterns and Tools

### Patterns

- **Checks-Effects-Interactions**: Validate inputs (Checks), update state (Effects), THEN make external calls (Interactions)
- **Pull over Push**: Let users withdraw funds instead of pushing to them
- **Principle of Least Privilege**: Functions should only be callable by entities that need them
- **Fail-Safe Defaults**: When in doubt, deny access

### Security Analysis Tools

| Tool | By | Type | Description |
|------|----|------|-------------|
| [Slither](https://github.com/crytic/slither) | Trail of Bits | Static analysis | Detects common vulnerabilities automatically |
| [Mythril](https://github.com/Consensys/mythril) | ConsenSys | Symbolic execution | Explores all possible execution paths |
| [Aderyn](https://github.com/Cyfrin/aderyn) | Cyfrin | Static analysis | Rust-based Solidity vulnerability detector |
| [Foundry](https://book.getfoundry.sh/) | Paradigm | Fuzz testing | Random input testing for edge cases |

### The Audit Process

1. Write code → 2. Test thoroughly → 3. Use automated tools → 4. Get a professional audit → 5. Launch bug bounty

**[Immunefi](https://immunefi.com/)**: The largest bug bounty platform in web3. Has paid $100M+ to ethical hackers. Audits typically cost $50K-$500K and take 2-6 weeks.

## Your Security Mindset

**The golden rules:**

1. **"Every line of code is a potential attack vector"**: Think adversarially.
2. **Don't reinvent the wheel**: Use OpenZeppelin's audited contracts.
3. **Keep it simple**: Complex code has more bugs.
4. **Test extensively**: Unit tests, integration tests, fuzz tests.
5. **Get a second pair of eyes**: Code review isn't optional.

**Career in smart contract security:**

- Security auditors are the highest-paid roles in web3
- Average senior auditor salary: $200K-$500K+
- Top bug bounty hunters earn millions per year
- Companies: Trail of Bits, OpenZeppelin, Cyfrin, Spearbit

---

## Key Concepts

| Concept | Definition |
|---------|-----------|
| **Reentrancy** | Exploiting a contract by re-entering a function before state updates |
| **Checks-Effects-Interactions** | The safe ordering pattern: validate → update state → call external |
| **Access Control** | Restricting who can call sensitive functions |
| **Front-Running** | Inserting a transaction before a known pending transaction |
| **Oracle** | External data feed used by smart contracts (e.g., price data) |
| **Bug Bounty** | Reward program for finding and reporting vulnerabilities |

## Further Reading

- [Ethereum Smart Contract Security Best Practices](https://consensys.github.io/smart-contract-best-practices/) — ConsenSys guide
- [SWC Registry](https://swcregistry.io/) — Smart Contract Weakness Classification
- [Damn Vulnerable DeFi](https://www.damnvulnerabledefi.xyz/) — Practice exploiting vulnerabilities (CTF)
- [Ethernaut](https://ethernaut.openzeppelin.com/) — OpenZeppelin's Solidity wargame
- [Rekt News](https://rekt.news/) — Post-mortems of crypto hacks
- [Cyfrin Updraft](https://updraft.cyfrin.io/) — Free smart contract security course
- [Trail of Bits Blog](https://blog.trailofbits.com/) — Security research articles
- [OpenZeppelin Docs](https://docs.openzeppelin.com/) — Audited contract library
- [Immunefi Bug Bounty](https://immunefi.com/) — Earn rewards for finding bugs
- [Slither Documentation](https://github.com/crytic/slither/wiki) — Static analysis tool

## Discussion Questions

1. Why is immutability both a feature and a challenge for smart contract security?
2. How does the DAO hack compare to traditional software breaches?
3. What would you do differently if you were designing the Ronin bridge's validator setup?
4. Why is "Pull over Push" safer than sending funds directly to users?
