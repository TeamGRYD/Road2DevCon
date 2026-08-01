export const presentations = [
  {
    id: 1,
    time: '',
    title: 'Why Blockchain Matters: Censorship Resistance & Resistance to Capture',
    tagline: 'Understanding the foundations of decentralized trust - from zero to clarity.',
    icon: '🛡️',
    sections: [
      {
        heading: 'The Problem: Trusted Third Parties',
        content: `Every day, you trust intermediaries with your most important assets. Your bank holds your money - and can freeze your account without warning. Social media platforms host your content - and can delete it overnight. Governments control currencies - and can devalue them through inflation.

These aren't hypothetical risks. In 2016, India demonetized 86% of its currency overnight. In 2022, Canadian authorities froze bank accounts of peaceful protestors. In 2023, Silicon Valley Bank collapsed, and depositors couldn't access their funds for days.

**The core problem**: when a single entity controls a system, that entity becomes a single point of failure - and a single point of censorship.`
      },
      {
        heading: 'How Does a Blockchain Work?',
        content: `A blockchain is a distributed ledger - a database that's copied across thousands of computers (called "nodes") around the world. No single entity owns or controls it.

**Think of it like this**: Imagine a Google Doc that everyone on Earth can read, anyone can add to, but nobody can edit or delete what's already written. That's essentially what a blockchain does for financial transactions and code.

**Key properties:**
• **Distributed**: Data is stored on thousands of computers worldwide, not one server
• **Immutable**: Once data is written, it can't be changed or deleted - ever
• **Transparent**: Anyone can verify any transaction at any time
• **Consensus-based**: New data is only added when the majority of nodes agree it's valid

Each "block" contains a batch of transactions, linked to the previous block using cryptographic hashes (think of it as a unique digital fingerprint). Changing any historical record would require re-computing every subsequent block across the majority of the network - which is computationally impossible.`
      },
      {
        heading: 'What is Ethereum?',
        content: `Bitcoin (2009) proved you could send money without a bank. But **Ethereum** (2015, created by Vitalik Buterin) took this further: it's a "world computer" that can run programmable logic called **smart contracts**.

A smart contract is just code that runs on the blockchain. Once deployed, it executes exactly as written - no one can change it, pause it, or shut it down. Think of it like a vending machine: you put in your input, and the code automatically executes the output. No human middleman needed.

**Ethereum runs on Proof-of-Stake (PoS)**: Instead of energy-intensive mining, "validators" stake (lock up) 32 ETH as collateral. If they try to cheat, they lose their stake. This makes the network secure while using 99.95% less energy than Bitcoin.

Today, Ethereum processes ~1 million transactions per day, secures $400+ billion in assets, and powers everything from decentralized finance (DeFi) to digital identity systems.`
      },
      {
        heading: 'Censorship Resistance: The Core Property',
        content: `**Censorship resistance** means no single entity - not a government, not a corporation, not even the Ethereum Foundation itself - can block a valid transaction from being processed.

**How it works technically:**
• Ethereum has ~900,000+ validators worldwide. To censor a transaction, you'd need to coordinate the majority of them - practically impossible.
• Even if one validator ignores your transaction, another validator will include it in the next block.
• FOCIL (Fork Choice-enforced Inclusion Lists) - ongoing protocol research to guarantee that censored transactions get included within a bounded number of blocks.

**Real-world example - Tornado Cash (2022):**
The US Treasury's OFAC sanctioned Tornado Cash, a privacy tool on Ethereum. Some validators chose not to include Tornado Cash transactions. But the smart contract itself **kept running**: because no one can "turn off" deployed code on Ethereum. This demonstrated both the power and the controversy of censorship resistance.

**Why this matters**: In a world where platforms can deplatform, banks can freeze, and governments can restrict - censorship-resistant systems provide a neutral layer that treats all valid transactions equally.`
      },
      {
        heading: 'Resistance to Capture',
        content: `"Capture" means when a small group gains disproportionate control over a system. Ethereum is specifically designed to resist this.

**How Ethereum resists capture:**
• **No CEO, no board**: Ethereum has no corporate structure. It's maintained by a global community of developers, researchers, and validators.
• **Governance by rough consensus**: Changes are proposed through EIPs (Ethereum Improvement Proposals). Anyone can propose, anyone can debate. Changes only happen when there's broad agreement.
• **Client diversity**: Ethereum runs on multiple independent software implementations (Geth, Nethermind, Besu, Erigon). No single codebase has a monopoly.
• **The Ethereum Foundation's mandate**: The EF explicitly states its role is to "subtract itself" over time - to make Ethereum so decentralized that it doesn't need the Foundation at all.

**Contrast with traditional systems**: A company CEO can pivot a product overnight. A government can change laws. But no single entity can "take over" Ethereum - because there's nothing to take over. The protocol is the rules, and the rules are enforced by math and consensus.`
      },
      {
        heading: 'Why This Matters to YOU',
        content: `As engineering students, you build systems. Understanding how to design for decentralized trust isn't just a "crypto thing" - it's a fundamental shift in how systems can work.

**Career relevance:**
• Web3 developer salaries are 30-50% higher than Web2 equivalents
• Companies like JPMorgan, Visa, and HSBC are building on Ethereum
• India has the largest Web3 developer community in Asia
• DevCon 8 is in Mumbai - the ecosystem is investing in India

**The bigger picture**: Whether you build on Ethereum or not, the concepts of censorship resistance, decentralized consensus, and trustless systems will shape the next generation of infrastructure. Understanding these principles makes you a more versatile and valuable engineer.`
      }
    ]
  },
  {
    id: 2,
    time: '',
    title: 'Building in the Open: Open Source & the Ethereum Ecosystem',
    tagline: 'From Linux to Ethereum - how open source powers the decentralized revolution.',
    icon: '🌐',
    sections: [
      {
        heading: 'You Already Use Open Source - Every Day',
        content: `Open source software (OSS) has source code that anyone can inspect, modify, and distribute. You've been using it your entire tech journey:

• **Linux**: powers 96% of the world's top servers, Android phones, and most cloud infrastructure
• **Python, JavaScript, Rust**: the languages you code in are open source
• **Git & GitHub**: the tools you use to collaborate are themselves open source
• **VS Code**: Microsoft's most popular editor is open source
• **Android**: the OS on most phones in India is open source

Open source isn't charity - it's the most powerful development model in history. It enables global collaboration, peer review, and innovation at a scale no single company can match.

**The key idea**: Open source builds trust through transparency. When you can read the code, you can verify it does what it claims.`
      },
      {
        heading: 'Why Ethereum is Radically Open',
        content: `Ethereum takes open source to an extreme:

• **Every line of protocol code** is public on GitHub - the consensus rules, the execution engine, everything
• **Every smart contract's bytecode** is on-chain and readable by anyone - you can literally see what any contract does
• **The entire blockchain state** is transparent - every transaction, every balance, every contract interaction is publicly verifiable
• **Anyone can run a node**: you can download the software and independently verify every transaction since Ethereum's genesis (Block 0 in 2015)

**This isn't a choice - it's a requirement.** A system that asks you to "trust the code" must let you read the code. If Ethereum's code were proprietary, you'd have to trust the developers. With open source, you trust the mathematics and the logic instead.

**Etherscan** (etherscan.io) is the "Google" of Ethereum - it lets you explore any transaction, contract, or address on the network. Many contracts are "verified" on Etherscan, meaning the source code is published and matches the deployed bytecode.`
      },
      {
        heading: 'How Ethereum Evolves: The EIP Process',
        content: `With no CEO or roadmap dictated by a single company, how does Ethereum change? Through **Ethereum Improvement Proposals (EIPs)**: a structured, democratic process.

**How it works:**
1. **Anyone proposes**: Any developer, researcher, or community member can write an EIP
2. **Public debate**: Proposals are discussed on Ethereum Magicians forum and GitHub
3. **Technical review**: Core developers evaluate feasibility, security, and trade-offs
4. **Rough consensus**: No "coin vote" - changes happen when the community broadly agrees
5. **Implementation**: Accepted EIPs are coded into the next network upgrade

**Types of EIPs:**
• **Core EIPs**: Protocol-level changes (e.g., EIP-1559 - changed how transaction fees work, introducing fee burning)
• **ERCs** (Ethereum Request for Comments): Application standards that developers follow
  - **ERC-20**: The standard for fungible tokens (every "token" you've heard of follows this)
  - **ERC-721**: The standard for NFTs (non-fungible tokens)
  - **ERC-4337**: Account abstraction (making wallets smarter and more user-friendly)

**Analogy**: EIPs are like RFCs (Request for Comments) that built the internet. HTTP, TCP/IP, and DNS all started as RFCs. Ethereum's standards follow the same collaborative model.`
      },
      {
        heading: 'The Developer Toolbox',
        content: `Ethereum has a rich ecosystem of open-source development tools. Here are the ones you'll use today:

**🔧 Remix IDE** (remix.ethereum.org)
• Browser-based - zero installation required
• Write, compile, test, and deploy smart contracts in your browser
• Built-in debugger, static analysis, and template contracts
• Perfect for learning and rapid prototyping
• *You'll use this in both Workshop Quests today!*

**📝 Solidity**
• The primary programming language for Ethereum smart contracts
• Syntax similar to JavaScript/C++ - if you know either, you'll pick it up fast
• Statically typed, supports inheritance, libraries, and complex data structures
• Current stable version: 0.8.x (with built-in integer overflow protection)

**🛡️ OpenZeppelin**
• The industry-standard library of audited, reusable smart contract components
• Think of it like importing \`numpy\` or \`express\` - but for security-critical code
• Provides tested implementations of ERC-20, ERC-721, access control, and more
• Used by projects securing billions of dollars in value

**🏗️ Hardhat & Foundry** (for reference)
• Professional development frameworks for larger projects
• Local blockchain for testing, debugging tools, automated testing
• Hardhat uses JavaScript/TypeScript, Foundry uses Solidity for tests
• You'd use these for production projects - today we'll stick with Remix`
      },
      {
        heading: 'Your First 5 Minutes on Ethereum',
        content: `Here's what "deploying a smart contract" actually looks like:

\`\`\`solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract HelloDevcon {
    string public greeting = "Hello, DevCon 8! 🇮🇳";

    function setGreeting(string memory _greeting) public {
        greeting = _greeting;
    }
}
\`\`\`

**Steps in Remix:**
1. Go to remix.ethereum.org
2. Create a new file: \`HelloDevcon.sol\`
3. Paste the code above
4. Click "Compile" (left sidebar)
5. Switch to "Deploy & Run" tab
6. Select "Injected Provider - MetaMask" (connects your wallet)
7. Click "Deploy" → MetaMask pops up → Confirm transaction
8. Your contract is now **permanently deployed** on Ethereum! 🎉

The contract address you receive is your code's permanent home on the blockchain. Anyone in the world can interact with it, verify it, and build on top of it - forever.`
      },
      {
        heading: 'How Students Can Contribute',
        content: `Open source isn't just for "experts." Here's how you can start contributing today:

• **Documentation**: Fix typos, improve explanations in ethereum.org - it's all on GitHub
• **Translation**: Ethereum.org is translated into 50+ languages - help add or improve Hindi, Tamil, Telugu, etc.
• **Bug Reports**: Found something weird in Remix? Report it on GitHub
• **Hackathons**: ETHIndia, ETHGlobal - build projects, win prizes, learn with peers
• **Devcon**: DevCon 8 is in Mumbai this November! Apply to volunteer, speak, or attend

**Why this matters for your career**: Your GitHub profile IS your portfolio. Open-source contributions are visible, verifiable, and valued by employers worldwide. A single meaningful PR to an Ethereum project demonstrates more skill than a dozen certificates.`
      }
    ]
  },
  {
    id: 3,
    time: '',
    title: 'Your Data, Your Rules: Privacy on Ethereum',
    tagline: 'Privacy isn\'t about hiding - it\'s about choosing what you share.',
    icon: '🔒',
    sections: [
      {
        heading: 'Privacy in the Digital Age',
        content: `You share data with over 100 companies every single day. Your location (Google Maps), your conversations (WhatsApp), your purchases (Amazon), your health data (fitness apps), your browsing habits (every website with cookies).

**The uncomfortable truth:**
• In 2023, there were 3,200+ data breaches exposing 353 million records in the US alone
• India's Aadhaar database has faced multiple reported leaks affecting millions
• Cambridge Analytica used Facebook data to influence elections without users' knowledge
• Surveillance capitalism is a $300+ billion industry - your data IS the product

**Privacy isn't about "having something to hide."** You close the bathroom door not because you're doing anything wrong - but because some things are simply yours. Privacy is about **agency**: the right to choose what you share, with whom, and when.

This is especially important for vulnerable populations: activists, journalists, domestic abuse survivors, political dissidents, and LGBTQ+ individuals in hostile environments.`
      },
      {
        heading: 'The Blockchain Transparency Paradox',
        content: `Here's the irony: blockchains were designed for transparency, but that creates a privacy problem.

**On Ethereum, everything is public:**
• Every transaction - amount, sender, receiver - is visible to everyone
• Your wallet address isn't your name, but it's a consistent identity
• Blockchain analytics firms (Chainalysis, Elliptic) specialize in linking wallet addresses to real identities
• If you've ever used a centralized exchange with KYC (Know Your Customer), your wallet is linked to your passport

**The spectrum of identity:**
• **Transparency**: Everyone sees everything (default blockchain)
• **Pseudonymity**: You use a consistent alias (wallet address), but your real name isn't directly attached
• **Privacy**: Specific transaction details are hidden while the system remains verifiable
• **Anonymity**: No link between your identity and your actions at all

**Pseudonymity ≠ Privacy**: Just because your wallet address isn't your name doesn't mean you're private. One slip - connecting to a KYC exchange, receiving a payment from a known address - and your entire transaction history is exposed.`
      },
      {
        heading: 'Zero-Knowledge Proofs: The "Magic Trick"',
        content: `**Zero-Knowledge Proofs (ZKPs)** are perhaps the most important cryptographic invention of the last decade. They let you prove something is true WITHOUT revealing the underlying data.

**The analogy**: Imagine you want to prove you're over 18 to buy a movie ticket. Today, you show your ID - which also reveals your exact birthday, home address, and full name. With a ZKP, you could prove "I am over 18" without revealing any other information. The verifier learns only one fact: "Yes, this person is over 18."

**How it works (conceptually):**
1. The **Prover** has some secret data (e.g., their age)
2. The Prover generates a mathematical **proof** that the statement is true
3. The **Verifier** checks the proof and learns only "true" or "false"
4. The Verifier learns NOTHING else about the secret data

**Types of ZKPs:**
• **zk-SNARKs** (Succinct Non-interactive Arguments of Knowledge): Small proof size, fast verification, but requires a "trusted setup" ceremony
• **zk-STARKs** (Scalable Transparent Arguments of Knowledge): No trusted setup needed, but larger proof sizes. Developed by StarkWare

**This is real math, not magic**: ZKPs are based on elliptic curve cryptography and polynomial commitments. They're computationally proven to be secure - not "trust us" secure, but "we can mathematically prove this reveals nothing" secure.`
      },
      {
        heading: 'ZK in Practice on Ethereum',
        content: `ZK technology is being deployed RIGHT NOW on Ethereum for two purposes: **scaling** and **privacy**.

**ZK-Rollups (Layer 2 Scaling):**
• Instead of processing every transaction on Ethereum (slow, expensive), ZK-Rollups batch thousands of transactions off-chain
• They generate a tiny validity proof (the ZKP) that mathematically guarantees all transactions are correct
• This proof is submitted to Ethereum - one proof verifies thousands of transactions at once
• Result: 10-100x cheaper fees, near-instant transactions, with Ethereum's security
• **Live examples**: zkSync Era, Scroll, Polygon zkEVM, StarkNet, Linea

**Privacy Applications:**
• **Commit-Reveal Schemes**: Hash your data (commit), reveal it later - you'll build one in Workshop Quest 2!
• **Railgun**: Private transfers on Ethereum using ZK proofs
• **Aztec Network**: Full privacy-preserving smart contracts
• **Semaphore**: Anonymous group membership proofs (prove "I'm in this group" without revealing which member you are)

**Private Voting**: Imagine an election where everyone can verify the total count is correct, but no one can see how any individual voted. That's what ZK-proofs enable.`
      },
      {
        heading: 'Why Privacy Enables Freedom',
        content: `Privacy isn't a luxury - it's foundational to a functioning society.

**Without privacy, you can't have:**
• **Fair elections**: If votes are public, voters face coercion and retaliation
• **Salary negotiation**: If everyone's salary is public, bargaining power disappears
• **Medical confidentiality**: Your health conditions shouldn't affect your job prospects
• **Free speech**: Activists in authoritarian regimes depend on privacy for their safety
• **Personal autonomy**: The chilling effect - people self-censor when they know they're being watched

**Article 12 of the Universal Declaration of Human Rights**: "No one shall be subjected to arbitrary interference with his privacy."

**India's Puttaswamy judgment (2017)**: The Supreme Court of India ruled that privacy is a fundamental right under Article 21 of the Constitution. This landmark ruling affirmed that informational privacy, including data protection, is constitutionally protected.

**The nuance**: Privacy is not the same as secrecy. A system can be auditable (anyone can verify the rules are followed) while being private (individual details are hidden). ZK proofs enable exactly this combination.`
      },
      {
        heading: 'The Engineering Challenge',
        content: `ZK technology is one of the most active areas of research in computer science and cryptography. Here's why it's exciting for engineers:

**The technical challenges:**
• ZK circuits are computationally expensive - proving time is a major bottleneck
• Trade-offs between proof size, proving time, verification time, and security assumptions
• Writing ZK circuits requires specialized languages (Circom, Noir, Cairo) and a different mental model than traditional programming
• Hardware acceleration (GPUs, FPGAs, ASICs) for ZK proving is an emerging field

**Career opportunities:**
• ZK engineers are among the highest-paid in the entire tech industry
• The field combines mathematics, cryptography, and systems engineering
• Companies like StarkWare, Polygon, Scroll, Aztec, and others are actively hiring
• Research opportunities in academia and industry are abundant

**For today**: You don't need to understand the math to use ZK-based systems. In Workshop Quest 2, you'll implement a simpler privacy technique (commit-reveal) that demonstrates the core idea: proving something without revealing it.`
      }
    ]
  },
  {
    id: 4,
    time: '',
    title: 'Building Unbreakable Code: Security in Smart Contracts',
    tagline: 'When code handles real money, every line is a potential attack vector.',
    icon: '🔐',
    sections: [
      {
        heading: 'Why Security is Existential in Web3',
        content: `Smart contract security isn't like traditional software security. The stakes are fundamentally different:

**Why it's harder:**
• **Real money at stake**: Smart contracts directly handle financial assets. A bug doesn't just crash an app - it loses real money. Permanently.
• **Immutable code**: Once deployed, smart contracts CANNOT be patched, updated, or hotfixed. There's no "Patch Tuesday," no "we'll push a fix tonight." The code is permanent.
• **Public source code**: Unlike traditional software, smart contract code is visible to everyone - including attackers. They can study your code at their leisure and find the perfect exploit.
• **Composability risk**: Smart contracts interact with other smart contracts. A bug in one contract can cascade through the entire ecosystem.

**The numbers are staggering:**
• In 2022 alone, **$3.8 billion** was stolen from crypto protocols
• The top 10 hacks in history have stolen over **$5 billion** combined
• The average DeFi hack in 2023 resulted in a loss of **$37 million**

**The good news**: Most hacks exploit a small set of well-known vulnerability patterns. Learn these patterns, and you can write significantly safer code.`
      },
      {
        heading: 'The DAO Hack (2016) - The Reentrancy Attack',
        content: `**The story**: "The DAO" was a decentralized venture capital fund on Ethereum. Investors deposited ETH into a smart contract and voted on which projects to fund. It raised $150 million - the largest crowdfund in history at the time.

**The vulnerability - Reentrancy:**
The withdraw function sent ETH to the user BEFORE updating their balance in the contract:

\`\`\`solidity
// ❌ VULNERABLE CODE (simplified)
function withdraw() public {
    uint amount = balances[msg.sender];
    // Step 1: Send ETH (BEFORE updating balance!)
    msg.sender.call{value: amount}("");
    // Step 2: Update balance (TOO LATE!)
    balances[msg.sender] = 0;
}
\`\`\`

**The exploit**: The attacker deployed a malicious contract that, upon receiving ETH, immediately called \`withdraw()\` again. Because the balance hadn't been updated yet, the contract "thought" the attacker still had funds and sent more ETH. This loop repeated until the contract was drained.

**The damage**: 3.6 million ETH stolen (~$60 million at the time). The event was so devastating that the Ethereum community performed a "hard fork" - splitting into **Ethereum (ETH)** (which reversed the hack) and **Ethereum Classic (ETC)** (which kept the original chain).

**The fix - Checks-Effects-Interactions pattern:**
\`\`\`solidity
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
\`\`\``
      },
      {
        heading: 'The Ronin Bridge Hack (2022) - Centralization Risk',
        content: `**The story**: Ronin was a "bridge" connecting Ethereum to the Ronin sidechain (used by the game Axie Infinity, hugely popular in the Philippines). It used a multi-signature scheme requiring 5 out of 9 validators to approve transactions.

**The vulnerability - Key compromise + Centralization:**
• 4 of the 9 validator keys were controlled by a single company (Sky Mavis)
• 1 additional key was given temporary access to a third-party validator - and that access was never revoked
• The attackers (linked to North Korea's Lazarus Group) compromised these 5 keys through social engineering

**The result**: With 5/9 keys, the attackers authorized two fake withdrawals:
• 173,600 ETH + 25.5 million USDC
• Total: ~$625 million - one of the largest hacks in history
• **The hack went unnoticed for 6 days.** It was only discovered when a user tried to withdraw and couldn't.

**The lesson**: This wasn't a "code bug" - it was a centralization failure. When 5 out of 9 keys are controlled by related entities, you don't really have a 5-of-9 multi-sig - you have a 1-of-1 with extra steps. **Decentralization isn't just ideology - it's a security requirement.**`
      },
      {
        heading: 'Common Vulnerabilities You MUST Know',
        content: `Most smart contract hacks exploit a small set of well-known patterns. Here are the critical ones:

**1. Reentrancy** (The DAO Hack)
• External call before state update → attacker re-enters the function
• **Fix**: Checks-Effects-Interactions pattern, ReentrancyGuard from OpenZeppelin

**2. Access Control Flaws**
• Forgetting to restrict sensitive functions (like \`mint()\`, \`withdraw()\`, \`pause()\`)
• Without \`require(msg.sender == owner)\`, ANYONE can call admin functions
• **Fix**: Use OpenZeppelin's \`Ownable\` or role-based \`AccessControl\`

**3. Integer Overflow/Underflow**
• Before Solidity 0.8.0: adding 1 to the maximum uint256 gave you 0
• An attacker could manipulate balances to wrap around
• **Fix**: Solidity ≥0.8.0 has built-in overflow checks. Use \`unchecked\` blocks intentionally only when safe.

**4. Front-Running**
• Attackers see your pending transaction in the mempool (waiting room)
• They submit the same trade with higher gas to execute before you
• Example: You're buying a token → attacker buys first → price rises → you buy at higher price → attacker sells
• **Fix**: Commit-reveal schemes (you'll build one in Quest 2!), private mempools, batch auctions

**5. Oracle Manipulation**
• If your contract relies on external price data (an "oracle"), attackers can manipulate that data
• Flash loan attacks: borrow millions, manipulate price, exploit contract, repay loan - all in one transaction
• **Fix**: Use decentralized oracle networks like Chainlink, TWAP (time-weighted average prices)`
      },
      {
        heading: 'Defensive Patterns and Tools',
        content: `You don't need to be a security expert to write safe code. You need to follow established patterns and use battle-tested tools.

**Patterns:**
• **Checks-Effects-Interactions**: Always validate inputs (Checks), update contract state (Effects), THEN make external calls (Interactions)
• **Pull over Push**: Instead of sending funds to users, let them withdraw. This prevents reentrancy and failed-transfer issues
• **Principle of Least Privilege**: Functions should only be callable by the entities that need them
• **Fail-Safe Defaults**: When in doubt, deny access. Require explicit permission, don't assume it

**Tools for security analysis:**
• **Slither** (by Trail of Bits): Static analysis tool that detects common vulnerabilities automatically. Runs on your code in seconds.
• **Mythril** (by ConsenSys): Symbolic execution - explores all possible execution paths to find bugs
• **Aderyn** (by Cyfrin): Rust-based detector for Solidity vulnerabilities
• **Foundry Fuzz Testing**: Throws thousands of random inputs at your functions to find edge cases

**The audit process:**
1. Write code → 2. Test thoroughly → 3. Use automated tools → 4. Get a professional audit → 5. Launch bug bounty
• **Immunefi**: The largest bug bounty platform in web3. Has paid $100M+ to ethical hackers.
• Audits typically cost $50K-$500K and take 2-6 weeks. Every serious project gets audited.`
      },
      {
        heading: 'Your Security Mindset',
        content: `Security isn't a feature - it's a mindset. Here's how to think about it as an engineer:

**The golden rules:**
1. **"Every line of code is a potential attack vector"**: Think adversarially. What could go wrong?
2. **Don't reinvent the wheel**: Use OpenZeppelin's audited contracts. They've been reviewed by hundreds of experts.
3. **Keep it simple**: Complex code has more bugs. Simpler code is easier to audit and verify.
4. **Test extensively**: Unit tests, integration tests, fuzz tests. If you haven't tested it, it's broken.
5. **Get a second pair of eyes**: Code review isn't optional. Even the best developers make mistakes.

**Career in smart contract security:**
• Security auditors and researchers are the highest-paid roles in web3
• Average senior auditor salary: $200K-$500K+
• Top bug bounty hunters earn millions per year
• The field combines deep technical knowledge with creative, adversarial thinking
• Companies like Trail of Bits, OpenZeppelin, Cyfrin, and Spearbit are always hiring

**What you'll build today**: In Workshop Quest 2, you'll implement real security patterns (access control, input validation, Checks-Effects-Interactions) in a voting contract. You'll also intentionally discuss what happens when these patterns are removed, building your adversarial thinking muscle.`
      }
    ]
  },
  {
    id: 5,
    time: '',
    title: 'DevCon 8: What to Expect & How to Participate',
    tagline: 'The biggest Ethereum gathering comes to India. Here is everything you need to know.',
    icon: '🎪',
    sections: [
      {
        heading: 'What is DevCon?',
        content: `DevCon is the Ethereum Foundation's flagship conference, bringing together the entire Ethereum ecosystem under one roof. DevCon 8 will be held at the **Jio World Centre in Mumbai, India** in November 2026.

This is not your average tech conference. DevCon features:
• **Talks and presentations** from the leading minds in Ethereum and decentralized technology
• **Hands-on workshops** where you build real projects with expert guidance
• **Community Hubs** organized by community groups around specific topics
• **Co-working spaces** to hack, collaborate, and build with other attendees
• **Discussion corners** for deep, interactive conversations on Ethereum's future
• **Side events** happening all across Mumbai during DevCon week

Whether you are a beginner or an experienced developer, DevCon has something for every skill level and interest.`
      },
      {
        heading: 'For All Profiles and Skill Levels',
        content: `DevCon covers the full breadth of the Ethereum ecosystem:

• **Censorship Resistance** and open governance
• **Open Source** development and public goods funding
• **AI and Ethereum** intersections
• **Consumer Apps** built on decentralized infrastructure
• **Privacy** technologies and zero-knowledge proofs
• **Security** auditing and smart contract safety
• **DAOs and Governance** for community-led organizations
• **Nodes and Staking** for network participation
• **DeSci** (Decentralized Science) and open research
• **ReFi** (Regenerative Finance) for climate and sustainability
• **Biotech, Gaming, On-chain Art, Social Media** and more
• **Finance and Stablecoins** for global payments
• **Interoperability, ZK, Solidity** and other core technical tracks

No matter your background or interest area, you will find sessions, people, and ideas that resonate with your goals.`
      },
      {
        heading: 'Why DevCon Matters for You',
        content: `**Skills in Action**
DevCon is a hands-on event. Beyond just watching talks, you can participate in hackathons, coding challenges, and guided workshops. This is where you move from learning to building.

**Career Opportunities**
The Ethereum ecosystem is hiring. DevCon brings together startups, established companies, and DAOs that are actively looking for talent. Explore career paths, jobs, and internships. Scholarships, accelerators, and recruiters are on-site.

**Network with the Global Community**
DevCon is the biggest gathering of Ethereum talent and developers globally. Connect with people who are building the decentralized future, including protocol researchers, smart contract developers, UX designers, community builders, and founders.

**Get Inspired**
See what is possible when thousands of builders come together. From public goods to cutting-edge research, DevCon showcases the best of what the Ethereum community is creating.`
      },
      {
        heading: 'Ways to Participate',
        content: `DevCon is built by and for the community. Here is how you can get involved:

**Community Hubs**
Spaces led by the community around specific topics or regions. If you have a group or idea, you can propose a Hub.

**DIPs (DevCon Improvement Proposals)**
Just like Ethereum has EIPs, DevCon has DIPs. Submit ideas to level up the attendee experience.

**Volunteer**
Help run the event and experience DevCon from the inside. Volunteers get full access and are part of the team that makes it all happen.

**Creative Crew**
Spread the word globally. Join the creative crew to help with outreach, content creation, and community engagement.

**Music Stage**
Open call for musicians and artists to co-create and organize performances during DevCon.

**Apply as a Speaker, Supporter, or Media Partner**
Share your expertise, support the event, or cover it for your audience.

> "DevCon is a space to learn, create, co-create, experiment, and connect."

Visit **devcon.org** for applications and details.`
      },
      {
        heading: 'DevCon 8 India: Be Part of It',
        content: `DevCon 8 coming to India is a milestone for the South Asian Ethereum community. Mumbai will host thousands of developers, researchers, and builders from around the world.

**How to prepare:**
• Follow DevCon on social media for announcements and updates
• Check **devcon.org** regularly for ticket sales and application deadlines
• Start building: the best way to prepare for DevCon is to have a project or skill to bring
• Connect with local Ethereum communities: ETHIndia, ETHMumbai, and university blockchain clubs

**Stay connected:**
• Website: devcon.org
• X (Twitter): @EFDevcon
• Join the Ethereum community forums and Discord channels

The Ethereum ecosystem is investing in India. DevCon 8 is your chance to be at the center of it all.`
      }
    ]
  }
];
