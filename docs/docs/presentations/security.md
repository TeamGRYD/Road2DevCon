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

## 📖 Extended Learning

:::info
The sections below go deeper than the 25-minute presentation. They're designed for self-study so you can prepare for **Quiz 4 (Security)**, which draws from this entire page including the extended material.
:::

### MEV (Maximal Extractable Value)

**MEV** is the profit validators (or block builders) can extract by reordering, inserting, or censoring transactions within a block. It's one of the most significant security and fairness challenges in Ethereum today.

**Common MEV attacks:**

| Attack | How It Works |
|--------|-------------|
| **Front-running** | Attacker sees your profitable pending tx, submits the same tx with higher gas to execute first |
| **Sandwich attack** | Attacker places one tx *before* yours (front-run) and one *after* (back-run) to profit from the price impact |
| **Back-running** | Attacker places their tx immediately after yours to capture arbitrage opportunities you created |
| **Liquidation sniping** | Bots compete to be first to liquidate undercollateralized DeFi positions |

**The solution ecosystem:**

- **Flashbots Protect**: A private mempool that prevents front-running by hiding your pending tx from public view
- **MEV-Boost**: Separates block building from proposing — validators outsource block construction to specialized "builders" via an auction
- **PBS (Proposer-Builder Separation)**: A protocol-level design where proposers (validators) only select blocks, not construct them
- **Private Order Flow**: Services that route transactions directly to validators, bypassing the public mempool

### Proxy Patterns & Upgradability

Smart contracts are immutable, but what if you need to fix a bug? **Proxy patterns** enable "upgradeable" contracts:

**How it works**: Users interact with a **proxy contract** that delegates all calls (`delegatecall`) to a separate **implementation contract**. To "upgrade," you deploy a new implementation and point the proxy at it. The proxy's storage is preserved.

| Pattern | Description | Risk |
|---------|-------------|------|
| **Transparent Proxy** | Admin can upgrade, users can only call logic | Admin key compromise = full control |
| **UUPS (Universal Upgradeable Proxy Standard)** | Upgrade logic lives in the implementation contract | If you forget the upgrade function, the contract is permanently locked |
| **Beacon Proxy** | Multiple proxies share a single beacon for upgrades | Single point of failure for all proxies |

**Storage collision** is the most dangerous risk: if the proxy and implementation use the same storage slot for different variables, data gets corrupted silently. EIP-1967 standardizes storage slot positions to prevent this.

**Diamond Pattern (EIP-2535)**: Allows a single proxy to delegate to multiple implementation contracts ("facets"), enabling modular upgrades.

### Advanced Testing & Formal Verification

Beyond unit tests, advanced techniques catch bugs that manual testing misses:

- **Fuzzing (Fuzz Testing)**: Automated tool generates random inputs and checks if invariants are violated. Foundry's `forge fuzz` and [Echidna](https://github.com/crytic/echidna) are leading tools.
- **Invariant Testing**: Define properties that must ALWAYS hold (e.g., "total supply equals sum of all balances") and let the fuzzer try to break them.
- **Symbolic Execution (Mythril)**: Explores ALL possible execution paths mathematically, finding bugs in code paths you never thought to test.
- **Formal Verification**: Uses mathematical proofs to guarantee code behaves as specified. [Certora](https://www.certora.com/) and the [K Framework](https://kframework.org/) are leading tools. This is the gold standard — but expensive and slow.

**Coverage spectrum**: Unit tests < Integration tests < Fuzz tests < Symbolic execution < Formal verification

### More Attack Case Studies

| Hack | Year | Amount | Vulnerability |
|------|------|--------|---------------|
| **Wormhole Bridge** | 2022 | $320M | Attacker bypassed signature verification by calling a deprecated function that returned a valid "guardian set" |
| **Parity Multi-sig** | 2017 | $150M | A user accidentally became the "owner" of the library contract and called `selfdestruct`, destroying all Parity multi-sig wallets |
| **Cream Finance** | 2021 | $130M | Flash loan oracle manipulation — attacker inflated the price of a collateral token and borrowed against the inflated value |
| **Poly Network** | 2021 | $611M | Cross-chain message could change the `keeper` role, granting full control |
| **Nomad Bridge** | 2022 | $190M | Faulty upgrade made every message valid — anyone could copy a successful tx, change the recipient, and replay it |

### Rug Pulls & Economic Attacks

Not all attacks are technical — some are social or economic:

- **Rug Pull**: Project creator deploys a token, generates hype, collects investment, then removes all liquidity or sells their allocation. A purely social/economic attack.
- **Honeypot**: Token contract that allows buying but prevents selling through hidden `transfer()` restrictions.
- **Flash Loan Attack**: Borrowing a massive amount of tokens in a single transaction (no collateral needed), manipulating prices, profiting, and repaying the loan — all in one atomic transaction.
- **Governance Attack**: Accumulating enough governance tokens (via flash loan or market purchase) to pass a malicious proposal that drains the treasury.

**How to protect yourself**: Check if the contract is verified on Etherscan, look for locked liquidity, use tools like [Token Sniffer](https://tokensniffer.com/) or [RugDoc](https://rugdoc.io/).

### Gas-Based Attacks

Gas mechanics create unique attack vectors:

- **Gas Griefing**: Attacker causes a function to consume excessive gas by making external calls fail or triggering expensive loops. For example, a contract that iterates over an array controlled by users — an attacker can grow the array until the function exceeds the block gas limit.
- **Block Stuffing**: Attacker fills entire blocks with their own transactions to prevent competing transactions from being included (used in MEV).
- **Denial of Service (DoS)**: If a contract sends ETH to an address that rejects it (`receive()` reverts), the entire function fails. The "Pull over Push" pattern prevents this.

### Function Selector Collisions

Every function call in Solidity is identified by the first 4 bytes of the `keccak256` hash of its signature. A **function selector collision** occurs when two different function signatures produce the same 4-byte selector.

In proxy contracts, this can be exploited: if a proxy function and an implementation function have the same selector, the proxy intercepts the call. The transparent proxy pattern mitigates this by routing admin calls and user calls differently.

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
| **MEV** | Profit extracted by reordering/inserting transactions in a block |
| **Proxy Pattern** | Delegatecall-based upgradability for immutable contracts |
| **Storage Collision** | When proxy and implementation use the same storage slot for different data |
| **Fuzzing** | Automated random-input testing to discover invariant violations |
| **Formal Verification** | Mathematical proof that code meets its specification |
| **Flash Loan** | Uncollateralized loan that must be repaid within a single transaction |
| **Rug Pull** | Creator deploys, hypes, then drains a project's funds |

## Further Reading

- [Ethereum Smart Contract Security Best Practices](https://consensys.github.io/smart-contract-best-practices/) — ConsenSys guide
- [SWC Registry](https://swcregistry.io/) — Smart Contract Weakness Classification
- [Damn Vulnerable DeFi](https://www.damnvulnerabledefi.xyz/) — CTF for learning smart contract exploits
- [Ethernaut](https://ethernaut.openzeppelin.com/) — OpenZeppelin's Solidity security wargame
- [Rekt News](https://rekt.news/) — Post-mortems of crypto hacks
- [Cyfrin Updraft](https://updraft.cyfrin.io/) — Free smart contract security course
- [Trail of Bits Blog](https://blog.trailofbits.com/) — Security research articles
- [OpenZeppelin Docs](https://docs.openzeppelin.com/) — Audited contract library
- [Immunefi Bug Bounty](https://immunefi.com/) — Earn rewards for finding bugs
- [Slither Documentation](https://github.com/crytic/slither/wiki) — Static analysis tool
- [Mythril](https://github.com/Consensys/mythril) — Symbolic execution engine
- [Echidna](https://github.com/crytic/echidna) — Smart contract fuzzer
- [Flashbots](https://www.flashbots.net/) — MEV research and protection
- [EIP-1967: Proxy Storage Slots](https://eips.ethereum.org/EIPS/eip-1967) — Standard proxy storage layout
- [EIP-2535: Diamond Standard](https://eips.ethereum.org/EIPS/eip-2535) — Multi-facet proxy pattern
- [Certora](https://www.certora.com/) — Formal verification platform
- [Foundry Fuzz Testing](https://book.getfoundry.sh/forge/fuzz-testing) — Foundry's fuzzing guide

## Discussion Questions

1. Why is immutability both a feature and a challenge for smart contract security?
2. How does the DAO hack compare to traditional software breaches?
3. What would you do differently if you were designing the Ronin bridge's validator setup?
4. Why is "Pull over Push" safer than sending funds directly to users?
5. How does MEV affect the fairness of DeFi for regular users? Is it a bug or a feature?
6. If you can upgrade a smart contract via a proxy, does it still count as "trustless"?
