/**
 * Server-side question bank for Road to DevCon 8 quizzes.
 * 
 * IMPORTANT: This file lives in /api/lib/ and is ONLY loaded by
 * Vercel serverless functions. It is NEVER bundled into the frontend.
 * Correct answer indices are server-side secrets.
 * 
 * Each quiz has 100+ questions. The server selects 10 at random per attempt.
 * 
 * Format: { question: string, options: string[4], correct: 0|1|2|3 }
 */

export const serverQuestions = [
  // ============================================================
  // QUIZ 0: Censorship Resistance & Resistance to Capture
  // ============================================================
  {
    quizId: 0,
    title: 'Censorship Resistance & Resistance to Capture',
    icon: '🛡️',
    questions: [
      // --- Fundamentals of Trust & Intermediaries ---
      { question: 'What is the core problem that blockchain technology aims to solve?', options: ['Making computers faster', 'Eliminating the need for trusted third parties', 'Replacing all traditional currencies', 'Creating digital art'], correct: 1 },
      { question: 'What happened during the 2016 Indian demonetization?', options: ['India banned cryptocurrency', 'India demonetized 86% of its currency overnight', 'India adopted Bitcoin as legal tender', 'India introduced a central bank digital currency'], correct: 1 },
      { question: 'In 2022, which country froze bank accounts of peaceful protestors?', options: ['United States', 'United Kingdom', 'Canada', 'Australia'], correct: 2 },
      { question: 'What is a "single point of failure" in a centralized system?', options: ['A backup server', 'One entity whose compromise can bring down the entire system', 'A redundant network node', 'A secondary authentication method'], correct: 1 },
      { question: 'Which bank collapsed in 2023, leaving depositors unable to access funds for days?', options: ['Deutsche Bank', 'Silicon Valley Bank', 'Goldman Sachs', 'HSBC'], correct: 1 },

      // --- How Blockchain Works ---
      { question: 'What is a blockchain often described as?', options: ['A centralized database', 'A distributed ledger replicated across thousands of nodes', 'A single encrypted file', 'A type of cloud storage'], correct: 1 },
      { question: 'What analogy best describes a blockchain?', options: ['A private diary', 'A Google Doc everyone can read and add to, but nobody can edit or delete past entries', 'A WhatsApp group chat', 'An Excel spreadsheet on a USB drive'], correct: 1 },
      { question: 'What does "immutability" mean in blockchain context?', options: ['Data can be freely modified', 'Past records cannot be retroactively altered', 'Only admins can change data', 'Data expires after a set time'], correct: 1 },
      { question: 'Why is it nearly impossible to alter past blockchain data?', options: ['Government regulations prevent it', 'Each block is cryptographically linked to the previous one', 'The database is password-protected', 'Only one copy exists worldwide'], correct: 1 },
      { question: 'How many copies of the Ethereum blockchain exist worldwide?', options: ['One master copy', 'About 100', 'Thousands across independent nodes', 'Two (primary and backup)'], correct: 2 },

      // --- Ethereum Specifics ---
      { question: 'What consensus mechanism does Ethereum currently use?', options: ['Proof-of-Work (mining)', 'Delegated Proof-of-Stake', 'Proof-of-Stake (validators)', 'Proof-of-Authority'], correct: 2 },
      { question: 'When did Ethereum transition from Proof-of-Work to Proof-of-Stake?', options: ['June 2021', 'September 2022', 'January 2023', 'March 2020'], correct: 1 },
      { question: 'How much ETH must a validator stake on Ethereum?', options: ['1 ETH', '10 ETH', '32 ETH', '100 ETH'], correct: 2 },
      { question: 'By how much did "The Merge" reduce Ethereum\'s energy consumption?', options: ['50%', '75%', '90%', '99.95%'], correct: 3 },
      { question: 'What is "slashing" in Proof-of-Stake?', options: ['Reducing transaction fees', 'Penalizing validators who act maliciously by destroying part of their stake', 'Splitting a blockchain into two chains', 'Reducing block size'], correct: 1 },

      // --- Censorship Resistance Concepts ---
      { question: 'What does "censorship resistance" mean in blockchain?', options: ['The ability to censor inappropriate content', 'No single entity can block a valid transaction from being processed', 'The blockchain cannot store censored information', 'Only governments can censor transactions'], correct: 1 },
      { question: 'What happened with Tornado Cash in 2022?', options: ['The smart contract was deleted from Ethereum', 'The US Treasury sanctioned it, but the smart contract kept running on-chain', 'All Tornado Cash transactions were reversed', 'The Ethereum Foundation shut it down'], correct: 1 },
      { question: 'Why couldn\'t Tornado Cash be shut down despite US sanctions?', options: ['It was hosted on a foreign server', 'Deployed smart contracts on Ethereum cannot be turned off by anyone', 'The developers refused to comply', 'It moved to a different blockchain'], correct: 1 },
      { question: 'What is a "permissionless" system?', options: ['A system that requires admin approval to join', 'A system anyone can use without needing authorization from a gatekeeper', 'A system with no security', 'A system where all data is public'], correct: 1 },
      { question: 'Why is censorship resistance valuable for dissidents in authoritarian regimes?', options: ['It makes internet faster', 'It allows them to transact and communicate without government interference', 'It provides free storage', 'It encrypts their emails'], correct: 1 },

      // --- Resistance to Capture ---
      { question: 'What does "resistance to capture" mean?', options: ['Physical security of servers', 'No single group can take control of the protocol\'s governance or direction', 'Anti-theft measures for cryptocurrency', 'Ability to catch hackers'], correct: 1 },
      { question: 'What is the "Nakamoto coefficient"?', options: ['The price of the first Bitcoin transaction', 'The minimum number of entities needed to collude to compromise a network', 'The ratio of Bitcoin to Ethereum market cap', 'The speed of block production'], correct: 1 },
      { question: 'A higher Nakamoto coefficient indicates:', options: ['Faster transactions', 'Greater decentralization and resilience', 'Higher energy consumption', 'More expensive transactions'], correct: 1 },
      { question: 'Why does Ethereum aim for "credible neutrality"?', options: ['To avoid paying taxes', 'So the protocol doesn\'t favor any particular user, use case, or ideology', 'To compete with Bitcoin', 'To reduce gas fees'], correct: 1 },
      { question: 'What is "capture" in the context of decentralized systems?', options: ['Physical theft of nodes', 'When a small group gains outsized influence or control over the protocol', 'Capturing network traffic', 'Downloading the blockchain'], correct: 1 },

      // --- Ethereum Community & Governance ---
      { question: 'What is an EIP?', options: ['Ethereum Insurance Protocol', 'Ethereum Improvement Proposal', 'Encrypted Information Package', 'Ethereum Initial Price'], correct: 1 },
      { question: 'How are changes to the Ethereum protocol decided?', options: ['Vitalik Buterin decides alone', 'Through open EIP discussion, community debate, and rough consensus', 'By shareholder vote', 'By the highest bidder'], correct: 1 },
      { question: 'Who can submit an EIP?', options: ['Only Ethereum Foundation members', 'Only node operators', 'Anyone in the community', 'Only large ETH holders'], correct: 2 },
      { question: 'What role does the Ethereum Foundation play?', options: ['It controls the Ethereum network', 'It supports ecosystem growth through grants and coordination but cannot unilaterally change the protocol', 'It mines Ethereum blocks', 'It sets the price of ETH'], correct: 1 },
      { question: 'What is "rough consensus" in Ethereum governance?', options: ['A 51% majority vote', 'General agreement among stakeholders without requiring unanimity', 'Consensus reached by AI', 'A mathematical proof'], correct: 1 },

      // --- Real-World Examples ---
      { question: 'What does Wikipedia\'s model demonstrate about censorship resistance?', options: ['Centralized editing is best', 'Open, transparent systems with many editors are more resistant to manipulation', 'Only experts should edit knowledge', 'Paywalls improve content quality'], correct: 1 },
      { question: 'Why is Bitcoin often called "digital gold"?', options: ['It is yellow', 'It is a scarce, censorship-resistant store of value', 'It can be physically mined', 'It was invented by a goldsmith'], correct: 1 },
      { question: 'What is a "fork" in blockchain?', options: ['A utensil for eating', 'When the blockchain splits because participants disagree on protocol changes', 'A type of cryptocurrency wallet', 'A hacking technique'], correct: 1 },
      { question: 'What caused the Ethereum Classic fork?', options: ['A software bug', 'Disagreement over whether to reverse the DAO hack transactions', 'A government order', 'Vitalik left the project'], correct: 1 },
      { question: 'What is the difference between a hard fork and a soft fork?', options: ['Hard forks are illegal, soft forks are legal', 'Hard forks create incompatible changes; soft forks are backward-compatible', 'There is no difference', 'Hard forks are faster'], correct: 1 },

      // --- Network Effects & Decentralization ---
      { question: 'Why does geographic distribution of nodes matter?', options: ['For time zone coverage', 'So no single government can shut down the entire network', 'To reduce latency', 'For marketing purposes'], correct: 1 },
      { question: 'What is "client diversity" in Ethereum?', options: ['Having clients in many countries', 'Multiple independent software implementations of the Ethereum protocol', 'Different wallet apps', 'Various token standards'], correct: 1 },
      { question: 'Why is client diversity important for censorship resistance?', options: ['It makes Ethereum faster', 'A bug in one client won\'t bring down the entire network', 'It reduces gas fees', 'It improves user experience'], correct: 1 },
      { question: 'What is a "light node" in Ethereum?', options: ['A node that runs on solar power', 'A node that verifies block headers without storing the full chain', 'A node with a small hard drive', 'A testnet node'], correct: 1 },
      { question: 'Why is it valuable that anyone can run an Ethereum node?', options: ['Free cryptocurrency', 'It increases decentralization and makes the network harder to censor', 'It speeds up transactions', 'Tax benefits'], correct: 1 },

      // --- Deeper Concepts ---
      { question: 'What is "MEV" (Maximal Extractable Value)?', options: ['A cryptocurrency ticker', 'The profit validators can extract by reordering, including, or excluding transactions', 'Maximum Ethereum Volume', 'A consensus algorithm'], correct: 1 },
      { question: 'How can MEV potentially threaten censorship resistance?', options: ['It slows down transactions', 'Validators might censor transactions that compete with their own profitable strategies', 'It increases gas prices', 'It reduces block size'], correct: 1 },
      { question: 'What is "PBS" (Proposer-Builder Separation)?', options: ['A television network', 'Separating block building from block proposing to reduce validator centralization', 'A programming language', 'A token standard'], correct: 1 },
      { question: 'What is a 51% attack?', options: ['When 51% of users sell their tokens', 'When an entity controls the majority of network\'s consensus power, enabling censorship or double-spending', 'When 51% of nodes go offline', 'When gas fees exceed 51 gwei'], correct: 1 },
      { question: 'What makes a 51% attack on Ethereum\'s PoS extremely expensive?', options: ['Government protection', 'An attacker would need to stake over $10 billion worth of ETH, which would be slashed if caught', 'Strong passwords', 'Antivirus software'], correct: 1 },

      // --- Practical Understanding ---
      { question: 'If a government orders all exchanges to freeze your account, can your on-chain ETH still be moved?', options: ['No, exchanges control all ETH', 'Yes, you can send it directly from your wallet without any exchange involvement', 'Only with government permission', 'Only if you use a VPN'], correct: 1 },
      { question: 'What is a "self-custodial" wallet?', options: ['A bank-managed wallet', 'A wallet where only you hold the private keys', 'A hardware device', 'A browser extension'], correct: 1 },
      { question: 'What is a "seed phrase"?', options: ['A password for a website', 'A set of words that can recover your entire wallet and all accounts', 'A type of cryptocurrency', 'An API key'], correct: 1 },
      { question: 'Why should you never share your seed phrase?', options: ['It\'s copyrighted', 'Anyone with it can access and drain all your funds', 'It\'s too long to type', 'It expires after sharing'], correct: 1 },
      { question: 'What is the main advantage of on-chain transactions vs. bank transfers?', options: ['They are free', 'They are permissionless, borderless, and cannot be reversed by a third party', 'They are always faster', 'They are anonymous'], correct: 1 },

      // --- Blockchain Trivia ---
      { question: 'Who created Bitcoin?', options: ['Vitalik Buterin', 'Satoshi Nakamoto', 'Elon Musk', 'Mark Zuckerberg'], correct: 1 },
      { question: 'Who co-founded Ethereum?', options: ['Satoshi Nakamoto', 'Vitalik Buterin', 'Charles Hoskinson', 'Both Vitalik Buterin and Charles Hoskinson'], correct: 3 },
      { question: 'In what year was the Ethereum whitepaper published?', options: ['2008', '2013', '2015', '2017'], correct: 1 },
      { question: 'What is the native currency of the Ethereum network?', options: ['Bitcoin', 'Ether (ETH)', 'Solana', 'USDT'], correct: 1 },
      { question: 'What does "gas" represent on Ethereum?', options: ['Physical fuel', 'The computational cost of executing operations on the network', 'A cryptocurrency token', 'Network bandwidth'], correct: 1 },

      // --- Smart Contracts Basics ---
      { question: 'What is a smart contract?', options: ['A legal document stored digitally', 'Self-executing code deployed on the blockchain that runs exactly as programmed', 'An AI-powered contract generator', 'A verbal agreement recorded on video'], correct: 1 },
      { question: 'Once a smart contract is deployed on Ethereum, who can modify it?', options: ['The developer who wrote it', 'The Ethereum Foundation', 'No one, unless the contract is specifically designed with upgrade mechanisms', 'Any node operator'], correct: 2 },
      { question: 'What makes smart contracts "trustless"?', options: ['They don\'t handle money', 'Their behavior is deterministic and verifiable by anyone, eliminating the need to trust a counterparty', 'They are approved by auditors', 'They run on government servers'], correct: 1 },
      { question: 'What is the difference between EOA and a contract account on Ethereum?', options: ['There is no difference', 'EOAs are controlled by private keys; contract accounts are controlled by their code', 'EOAs are for businesses; contracts are for individuals', 'EOAs are faster'], correct: 1 },
      { question: 'What is a "reentrancy attack"?', options: ['Logging in twice', 'When a malicious contract calls back into the calling contract before the first invocation completes', 'A type of DDoS attack', 'Rewriting a contract after deployment'], correct: 1 },

      // --- Blockchain Philosophy ---
      { question: 'What principle does "don\'t trust, verify" embody?', options: ['Never use blockchain', 'Users should independently verify claims rather than relying on authority', 'Trust is more important than code', 'Only trust verified accounts'], correct: 1 },
      { question: 'What is "sovereign money"?', options: ['Money issued by a king', 'Money that the holder fully controls without dependency on any institution', 'Government bonds', 'A type of stablecoin'], correct: 1 },
      { question: 'Why do some people call blockchain technology a "trust machine"?', options: ['Because it stores trust scores', 'Because it creates trust between strangers through mathematics and code rather than institutions', 'Because it is trusted by governments', 'Because it was invented by a trustworthy person'], correct: 1 },
      { question: 'What is "financial inclusion" in the context of blockchain?', options: ['Including blockchain companies in stock indexes', 'Providing access to financial services for the ~1.4 billion unbanked people worldwide', 'Including all tokens in a portfolio', 'Financial regulations'], correct: 1 },
      { question: 'What percentage of the world\'s population lacks access to basic banking services?', options: ['About 5%', 'About 10%', 'About 18-20%', 'About 50%'], correct: 2 },

      // --- Layer 2 & Scaling ---
      { question: 'What is a Layer 2 (L2) solution?', options: ['A second blockchain unrelated to Ethereum', 'A protocol built on top of Ethereum that inherits its security while offering lower fees and higher throughput', 'A new consensus algorithm', 'A Layer 1 competitor'], correct: 1 },
      { question: 'How do rollups maintain censorship resistance?', options: ['They run their own validators', 'Users can always force-include transactions via the L1 if the L2 sequencer censors them', 'They have their own governance', 'They use different cryptography'], correct: 1 },
      { question: 'What is a "sequencer" in a rollup?', options: ['A music app', 'The entity that orders and batches L2 transactions before posting them to L1', 'A type of validator', 'A sorting algorithm'], correct: 1 },
      { question: 'Why is "forced inclusion" important for L2 censorship resistance?', options: ['It speeds up transactions', 'It ensures users can bypass a censoring sequencer by submitting directly to L1', 'It reduces fees', 'It improves privacy'], correct: 1 },
      { question: 'What are "data availability layers"?', options: ['Cloud storage for dApps', 'Systems ensuring that transaction data is accessible so anyone can verify L2 state', 'Marketing databases', 'User analytics platforms'], correct: 1 },

      // --- Governance Deep Dive ---
      { question: 'What is "token voting" governance?', options: ['Voting on which token to list', 'Governance where each token held represents a vote on protocol decisions', 'Voting with physical tokens', 'Token exchange elections'], correct: 1 },
      { question: 'What is a potential problem with token voting governance?', options: ['It is too slow', 'Wealthy token holders (whales) can dominate decisions, concentrating power', 'It is too expensive', 'It requires internet access'], correct: 1 },
      { question: 'What is "quadratic voting"?', options: ['Voting four times', 'A system where the cost of additional votes increases quadratically, giving smaller holders more proportional influence', 'Voting in four rounds', 'A type of consensus'], correct: 1 },
      { question: 'What is a DAO?', options: ['Data Analysis Organization', 'Decentralized Autonomous Organization, a collectively-owned, blockchain-governed entity', 'Digital Asset Office', 'Distributed Application Output'], correct: 1 },
      { question: 'What is the main risk of a centralized development team for a blockchain protocol?', options: ['Faster development', 'They can introduce backdoors, be coerced, or become a single point of capture', 'Better user experience', 'Lower gas fees'], correct: 1 },

      // --- Security & Cryptography Basics ---
      { question: 'What is a "hash function" in blockchain?', options: ['A function that hashes food', 'A mathematical function that converts any input into a fixed-size, unique, irreversible output', 'A database query', 'A type of encryption that can be reversed'], correct: 1 },
      { question: 'What hash function does Ethereum use?', options: ['MD5', 'SHA-256', 'Keccak-256', 'BLAKE2'], correct: 2 },
      { question: 'What is a "Merkle tree"?', options: ['A type of tree', 'A data structure that efficiently summarizes and verifies large datasets using hashes', 'A family tree of blockchain developers', 'A graphical chart'], correct: 1 },
      { question: 'What is "finality" in blockchain?', options: ['The end of a blockchain', 'The guarantee that a confirmed transaction cannot be reversed or altered', 'The final price of a token', 'The last block ever mined'], correct: 1 },
      { question: 'How long does it take for a transaction to reach finality on Ethereum PoS?', options: ['Instantly', 'About 12-15 minutes (2 epochs)', 'About 1 hour', 'About 24 hours'], correct: 1 },

      // --- Ethereum Ecosystem ---
      { question: 'What is DeFi?', options: ['Definitely Finance', 'Decentralized Finance: financial services built on blockchain without intermediaries', 'A cryptocurrency exchange', 'A type of stablecoin'], correct: 1 },
      { question: 'What is an NFT?', options: ['New Financial Token', 'Non-Fungible Token: a unique digital asset that cannot be identically replicated', 'Network File Transfer', 'A type of gas fee'], correct: 1 },
      { question: 'What is a "dApp"?', options: ['A downloaded app', 'A decentralized application that runs on a blockchain network', 'A digital approximation', 'A debugging application'], correct: 1 },
      { question: 'What is an "oracle" in blockchain?', options: ['A fortune teller', 'A service that brings real-world data (prices, weather, etc.) onto the blockchain', 'A type of node', 'A consensus algorithm'], correct: 1 },
      { question: 'Why are oracles sometimes called the "oracle problem"?', options: ['They are expensive', 'They introduce a trust assumption: the blockchain must trust the oracle\'s data is accurate', 'They are slow', 'They use too much gas'], correct: 1 },

      // --- Contemporary Issues ---
      { question: 'What is OFAC in the context of crypto sanctions?', options: ['A cryptocurrency', 'The US Office of Foreign Assets Control, which sanctioned Tornado Cash', 'An Ethereum client', 'A DeFi protocol'], correct: 1 },
      { question: 'Can an Ethereum validator choose not to include certain transactions?', options: ['No, all transactions must be included', 'Yes, individual validators can choose, but another validator will likely include the transaction in a subsequent block', 'Only with government permission', 'Only for spam transactions'], correct: 1 },
      { question: 'What is "base layer censorship resistance"?', options: ['Censoring the base layer', 'The guarantee that the L1 protocol itself will not discriminate against valid transactions', 'A type of firewall', 'An encryption standard'], correct: 1 },
      { question: 'What is "network neutrality" and how does it relate to blockchain?', options: ['All networks are the same', 'The principle that all network traffic should be treated equally, mirroring blockchain\'s permissionless nature', 'Blockchain replaces the internet', 'Network speed optimization'], correct: 1 },
      { question: 'What is the "right to transact" in the blockchain context?', options: ['A legal copyright', 'The fundamental ability to send and receive value without requiring permission from any authority', 'A trading license', 'A smart contract function'], correct: 1 },

      // --- Indian Context ---
      { question: 'What is India\'s stance on crypto as of 2024-2026?', options: ['Completely banned', 'Legal to hold and trade but taxed at 30% on gains with 1% TDS', 'Fully unregulated', 'Only Bitcoin is legal'], correct: 1 },
      { question: 'What is the CBDC that India has been developing?', options: ['Indian Crypto', 'Digital Rupee (e₹) by the Reserve Bank of India', 'IndiaChain', 'RupeeToken'], correct: 1 },
      { question: 'How does a CBDC differ from a cryptocurrency like Ethereum?', options: ['They are identical', 'CBDCs are centrally controlled by a central bank; Ethereum is decentralized and permissionless', 'CBDCs are faster', 'Ethereum is controlled by India'], correct: 1 },
      { question: 'Why might India\'s large unbanked population benefit from blockchain technology?', options: ['Blockchain requires bank accounts', 'Blockchain enables financial access with just a smartphone, no bank account needed', 'It replaces cash entirely', 'It increases banking fees'], correct: 1 },
      { question: 'What is UPI and how does it compare to blockchain payments?', options: ['UPI is a blockchain', 'UPI is a centralized instant payment system; blockchain offers similar speed but is decentralized and global', 'They are the same technology', 'UPI runs on Ethereum'], correct: 1 },

      // --- Advanced Concepts ---
      { question: 'What is "account abstraction" (ERC-4337)?', options: ['Deleting accounts', 'Making smart contract wallets as easy to use as regular accounts, with social recovery and gas sponsorship', 'Abstract art on blockchain', 'A privacy feature'], correct: 1 },
      { question: 'What is "social recovery" in a smart contract wallet?', options: ['Recovering social media accounts', 'Trusted contacts can help you regain access to your wallet if you lose your keys', 'A social network on blockchain', 'Group chat recovery'], correct: 1 },
      { question: 'What is the "Byzantine Generals Problem"?', options: ['A military strategy', 'The challenge of reaching consensus among distributed parties when some may be faulty or malicious', 'A coding challenge', 'A blockchain game'], correct: 1 },
      { question: 'How does blockchain solve the Byzantine Generals Problem?', options: ['It doesn\'t', 'Through consensus mechanisms (PoS/PoW) that make it economically irrational to act maliciously', 'By using a central server', 'Through AI arbitration'], correct: 1 },
      { question: 'What is "credible neutrality" as defined by Vitalik Buterin?', options: ['Being politically neutral', 'A mechanism that does not discriminate for or against any specific people, and is designed so it\'s clear this is the case', 'Staying neutral in token wars', 'Not supporting any dApp'], correct: 1 },

      // --- More Fundamentals ---
      { question: 'What is a "genesis block"?', options: ['A block containing religious text', 'The very first block in a blockchain', 'A block with the highest value', 'The last block in a blockchain'], correct: 1 },
      { question: 'What is a "nonce" in blockchain?', options: ['A meaningless word', 'A number used once, often to find a valid block hash or prevent replay attacks', 'A type of cryptocurrency', 'A consensus vote'], correct: 1 },
      { question: 'What is the difference between "public" and "private" blockchains?', options: ['Public ones are more secure', 'Public blockchains are permissionless and open; private blockchains restrict who can participate', 'Private ones are faster', 'There is no difference'], correct: 1 },
      { question: 'What is "state" in Ethereum?', options: ['A US state', 'The complete snapshot of all account balances, contract storage, and nonces at a given block', 'A state machine diagram', 'The network status page'], correct: 1 },
      { question: 'What is the "EVM" (Ethereum Virtual Machine)?', options: ['An electric vehicle manufacturer', 'The runtime environment that executes smart contract bytecode on every Ethereum node', 'An email verification method', 'A virtual reality platform'], correct: 1 },
    ]
  },

  // ============================================================
  // QUIZ 1: Open Source & the Ethereum Ecosystem
  // ============================================================
  {
    quizId: 1,
    title: 'Open Source & the Ethereum Ecosystem',
    icon: '🌐',
    questions: [
      // --- Open Source Fundamentals ---
      { question: 'What does "open source" mean?', options: ['Software you pay to access', 'Software whose source code is freely available for anyone to view, modify, and distribute', 'Software made by open communities', 'Software with open APIs'], correct: 1 },
      { question: 'What is the key difference between open source and proprietary software?', options: ['Open source is always free of charge', 'Open source allows anyone to inspect, modify, and contribute to the codebase', 'Proprietary software is always better', 'Open source lacks documentation'], correct: 1 },
      { question: 'What license does most Ethereum software use?', options: ['Proprietary', 'MIT, Apache 2.0, or GPL family licenses', 'Creative Commons', 'No license'], correct: 1 },
      { question: 'What is "copyleft" in open source licensing?', options: ['Copyright infringement', 'A license requiring derivative works to also be open source', 'Copying left-handed text', 'A type of DRM'], correct: 1 },
      { question: 'What is the significance of the MIT License?', options: ['It was created at MIT', 'It is a permissive license allowing reuse with minimal restrictions', 'It requires all modifications to be published', 'It only allows non-commercial use'], correct: 1 },

      // --- Why Open Source Matters ---
      { question: 'Why is open source critical for blockchain trust?', options: ['It reduces development costs', 'Anyone can verify the code does what it claims, enabling "don\'t trust, verify"', 'It looks more professional', 'It is required by law'], correct: 1 },
      { question: 'What is "security through transparency"?', options: ['Sharing passwords publicly', 'The principle that publicly auditable code is more secure because vulnerabilities are found and fixed faster', 'Transparent firewalls', 'Publishing security reports'], correct: 1 },
      { question: 'How many developers contribute to the Ethereum ecosystem?', options: ['About 100', 'About 1,000', 'Tens of thousands across hundreds of teams', 'About 50'], correct: 2 },
      { question: 'What does "composability" mean in the Ethereum ecosystem?', options: ['Writing music on blockchain', 'Smart contracts can interact with and build upon each other, like LEGO bricks', 'Composing emails', 'Combining tokens'], correct: 1 },
      { question: 'Why is composability sometimes called "DeFi LEGO"?', options: ['DeFi protocols look like LEGOs', 'Different protocols can snap together to create new financial products', 'LEGO sponsors DeFi', 'Users build virtual LEGO sets'], correct: 1 },

      // --- Development Tools ---
      { question: 'What is Solidity?', options: ['A physics concept', 'The primary programming language for Ethereum smart contracts', 'A blockchain consensus protocol', 'A hardware wallet'], correct: 1 },
      { question: 'What is Remix IDE?', options: ['A music remix tool', 'A browser-based IDE for writing, testing, and deploying Solidity smart contracts', 'A text editor', 'An Ethereum wallet'], correct: 1 },
      { question: 'What is Hardhat?', options: ['Construction equipment', 'An Ethereum development environment for compiling, deploying, testing, and debugging', 'A mining software', 'A blockchain browser'], correct: 1 },
      { question: 'What is Foundry?', options: ['A metal casting facility', 'A fast Solidity development toolkit written in Rust', 'A token launchpad', 'A blockchain explorer'], correct: 1 },
      { question: 'What is OpenZeppelin?', options: ['A music band', 'A library of audited, reusable smart contract standards', 'A blockchain', 'A DeFi protocol'], correct: 1 },

      // --- Git & Collaboration ---
      { question: 'What is Git?', options: ['A blockchain', 'A distributed version control system for tracking code changes', 'A programming language', 'A smart contract standard'], correct: 1 },
      { question: 'What is GitHub?', options: ['A social media platform', 'A web-based platform for hosting Git repositories and collaborative development', 'A cryptocurrency exchange', 'A blockchain explorer'], correct: 1 },
      { question: 'What is a "pull request" (PR)?', options: ['Pulling data from the blockchain', 'A proposal to merge code changes into a project, enabling review and discussion', 'Requesting a token transfer', 'Downloading a repository'], correct: 1 },
      { question: 'What is "code review" in open source?', options: ['Reviewing exam answers', 'The process where other developers examine proposed code changes for bugs, security issues, and quality', 'Reading a book about coding', 'Reviewing app store ratings'], correct: 1 },
      { question: 'What is a "fork" in open source software?', options: ['A dining utensil', 'Creating an independent copy of a repository to develop separately', 'Breaking the software', 'A type of merge conflict'], correct: 1 },

      // --- Ethereum Standards ---
      { question: 'What is ERC-20?', options: ['The 20th Ethereum update', 'A standard interface for fungible tokens on Ethereum', 'A security protocol', 'A consensus algorithm'], correct: 1 },
      { question: 'What is ERC-721?', options: ['An Ethereum wallet', 'The standard for non-fungible tokens (NFTs) on Ethereum', 'A gas optimization technique', 'A Layer 2 protocol'], correct: 1 },
      { question: 'What is ERC-1155?', options: ['A type of bridge', 'A multi-token standard supporting both fungible and non-fungible tokens in one contract', 'An oracle standard', 'A governance framework'], correct: 1 },
      { question: 'Why are token standards important?', options: ['They are required by law', 'They ensure interoperability so any wallet, exchange, or dApp can interact with the token', 'They reduce gas fees', 'They look professional'], correct: 1 },
      { question: 'What is ABI (Application Binary Interface)?', options: ['A social media platform', 'The standard way to interact with contracts, defining function signatures and data encoding', 'An alternative blockchain', 'An encryption method'], correct: 1 },

      // --- Smart Contract Patterns ---
      { question: 'What is the "proxy pattern" in smart contracts?', options: ['A privacy technique', 'A design pattern allowing contract logic to be upgraded while keeping the same address and storage', 'Using a proxy server', 'A testing methodology'], correct: 1 },
      { question: 'What is an "interface" in Solidity?', options: ['A user interface', 'A contract that defines function signatures without implementation, enabling standardized interactions', 'A graphical element', 'A network protocol'], correct: 1 },
      { question: 'What is "inheritance" in Solidity?', options: ['Receiving tokens from a will', 'A mechanism where a contract can inherit functions and state variables from parent contracts', 'A consensus mechanism', 'A gas optimization'], correct: 1 },
      { question: 'What is the "Checks-Effects-Interactions" pattern?', options: ['A testing framework', 'A security pattern: first check conditions, then update state, then call external contracts', 'A UI design pattern', 'A deployment sequence'], correct: 1 },
      { question: 'What does the `external` visibility modifier mean in Solidity?', options: ['The function is on a different chain', 'The function can only be called from outside the contract, not internally', 'The function uses external data', 'The function is public'], correct: 1 },

      // --- Ethereum Clients ---
      { question: 'What is an Ethereum "client"?', options: ['A customer', 'Software that implements the Ethereum protocol and runs as a node', 'A web browser', 'A mobile app'], correct: 1 },
      { question: 'Name two Ethereum execution layer clients.', options: ['Chrome and Firefox', 'Geth and Nethermind', 'MetaMask and Trust Wallet', 'Solidity and Vyper'], correct: 1 },
      { question: 'Name two Ethereum consensus layer clients.', options: ['Prysm and Lighthouse', 'Bitcoin Core and Litecoin', 'Remix and Hardhat', 'Truffle and Ganache'], correct: 0 },
      { question: 'Why should the Ethereum community avoid using one dominant client?', options: ['Competition is bad', 'A critical bug in the dominant client could cause network-wide outages or finality failures', 'Multiple clients are expensive', 'It confuses users'], correct: 1 },
      { question: 'What programming language is Geth written in?', options: ['Rust', 'JavaScript', 'Go', 'Python'], correct: 2 },

      // --- Contributing to Open Source ---
      { question: 'How can a beginner contribute to Ethereum open source?', options: ['Only by writing code', 'Documentation, testing, bug reports, translations, and code contributions', 'Only by donating money', 'By mining'], correct: 1 },
      { question: 'What is a "good first issue" on GitHub?', options: ['The first bug ever reported', 'An issue labeled as beginner-friendly, suitable for new contributors', 'The most popular issue', 'An issue with a bounty'], correct: 1 },
      { question: 'What is "Gitcoin"?', options: ['A cryptocurrency', 'A platform for funding open source projects through quadratic funding and bounties', 'A GitHub competitor', 'A mining pool'], correct: 1 },
      { question: 'What is "quadratic funding"?', options: ['Funding by four donors', 'A matching mechanism where small individual contributions are amplified with matching funds', 'Raising funds four times', 'A type of token sale'], correct: 1 },
      { question: 'What is the Ethereum Foundation Grants program?', options: ['Loans for developers', 'Financial support for teams building public goods in the Ethereum ecosystem', 'A scholarship for students', 'A venture capital fund'], correct: 1 },

      // --- Public Goods ---
      { question: 'What is a "public good" in the context of Ethereum?', options: ['A government building', 'Infrastructure and tools that benefit everyone but are hard to monetize (like roads or open source code)', 'A publicly traded company', 'A public blockchain'], correct: 1 },
      { question: 'What is "retroactive public goods funding" (RPGF)?', options: ['Funding for retro games', 'Rewarding projects after they have demonstrated value, rather than funding promises', 'A type of ICO', 'A governance vote'], correct: 1 },
      { question: 'Which project pioneered retroactive public goods funding?', options: ['Ethereum Foundation', 'Optimism (with their RetroPGF program)', 'Bitcoin Foundation', 'Uniswap'], correct: 1 },
      { question: 'What is the "tragedy of the commons" and how does it relate to open source?', options: ['A Shakespeare play', 'Shared resources get overused and underfunded because everyone benefits but few contribute; open source faces the same funding challenge', 'A blockchain scaling issue', 'A consensus failure'], correct: 1 },
      { question: 'What is Protocol Guild?', options: ['A gaming guild', 'A collective funding mechanism that distributes donations to Ethereum core protocol contributors', 'A trading group', 'A DAO for validators'], correct: 1 },

      // --- DevCon & Community ---
      { question: 'What is DevCon?', options: ['A developer conference for a specific company', 'The Ethereum Foundation\'s flagship annual developer conference', 'A hackathon', 'A blockchain summit'], correct: 1 },
      { question: 'Where is DevCon 8 being held?', options: ['Berlin', 'Bangkok', 'Mumbai', 'Bogotá'], correct: 2 },
      { question: 'What is ETHGlobal?', options: ['A global Ethereum price tracker', 'A series of hackathons and events fostering Ethereum ecosystem development worldwide', 'An Ethereum exchange', 'A government initiative'], correct: 1 },
      { question: 'What is the purpose of "Road to DevCon" events?', options: ['Tourist attractions', 'Community-organized events leading up to DevCon that spread Ethereum education globally', 'Marketing campaigns', 'Token airdrops'], correct: 1 },
      { question: 'What does the CROPS framework stand for?', options: ['Crypto, Revenue, Operations, Products, Sales', 'Censorship Resistance, Resistance to Capture, Open Source, Privacy, Security', 'Code, Review, Optimize, Publish, Ship', 'Community, Research, Outreach, Partnerships, Support'], correct: 1 },

      // --- Ecosystem Tools ---
      { question: 'What is Etherscan?', options: ['An antivirus for Ethereum', 'A block explorer that lets you view transactions, contracts, and addresses on Ethereum', 'A security scanner for smart contracts', 'An Ethereum mining tool'], correct: 1 },
      { question: 'What is IPFS?', options: ['Internet Protocol for Secure Servers', 'InterPlanetary File System: a decentralized file storage protocol', 'An Ethereum upgrade', 'A Layer 2 solution'], correct: 1 },
      { question: 'What is The Graph?', options: ['A graphing calculator', 'A decentralized protocol for indexing and querying blockchain data', 'A price chart tool', 'A social network'], correct: 1 },
      { question: 'What is ENS (Ethereum Name Service)?', options: ['An email service', 'A decentralized naming system that maps human-readable names (like alice.eth) to Ethereum addresses', 'An Ethereum news service', 'A DNS replacement'], correct: 1 },
      { question: 'What is a "testnet"?', options: ['A test for internet speed', 'A separate blockchain network for testing that uses tokens with no real value', 'A security testing tool', 'A type of firewall'], correct: 1 },

      // --- Vyper & Beyond Solidity ---
      { question: 'What is Vyper?', options: ['A snake species', 'A Python-inspired smart contract language that prioritizes simplicity and security', 'A blockchain', 'A hardware wallet'], correct: 1 },
      { question: 'How does Vyper differ from Solidity?', options: ['They are identical', 'Vyper intentionally lacks some features (like inheritance) to reduce complexity and attack surface', 'Vyper is faster', 'Solidity is deprecated'], correct: 1 },
      { question: 'What is "formal verification" in smart contracts?', options: ['Verifying a developer\'s identity', 'Mathematically proving that contract code behaves correctly according to its specification', 'A KYC process', 'Code formatting'], correct: 1 },
      { question: 'What is Yul?', options: ['A holiday', 'An intermediate language for Ethereum that compiles to EVM bytecode, used for low-level optimization', 'A testing framework', 'A token standard'], correct: 1 },
      { question: 'What is the advantage of having multiple smart contract languages?', options: ['More confusion', 'Reduces the risk of a single language bug affecting the entire ecosystem; different languages suit different use cases', 'No advantage', 'Faster execution'], correct: 1 },

      // --- DeFi Composability ---
      { question: 'What is a "flash loan"?', options: ['A fast bank loan', 'An uncollateralized loan that must be borrowed and repaid within a single transaction', 'A small microloan', 'A type of mortgage'], correct: 1 },
      { question: 'What is a "liquidity pool"?', options: ['A swimming pool', 'A smart contract holding paired tokens that enables decentralized trading', 'A savings account', 'A token burn address'], correct: 1 },
      { question: 'What is an AMM (Automated Market Maker)?', options: ['A type of ATM', 'A smart contract that algorithmically determines token prices and facilitates trades using liquidity pools', 'A mining algorithm', 'An automated message system'], correct: 1 },
      { question: 'What made Uniswap revolutionary?', options: ['It was the first cryptocurrency', 'It proved that decentralized, permissionless token trading could work without order books or intermediaries', 'It replaced Bitcoin', 'It was endorsed by a government'], correct: 1 },
      { question: 'What is a "yield aggregator"?', options: ['A farming tool', 'A protocol that automatically moves funds between DeFi protocols to maximize returns', 'A bond fund', 'A token tracker'], correct: 1 },

      // --- More Advanced ---
      { question: 'What is "gas optimization" in Solidity?', options: ['Making cars more fuel-efficient', 'Writing code that minimizes the computational cost (and thus transaction fees) of executing functions', 'Reducing natural gas usage', 'Compressing blockchain data'], correct: 1 },
      { question: 'What is a "mapping" in Solidity?', options: ['A GPS feature', 'A hash table data structure that maps keys to values, similar to dictionaries in other languages', 'A visual diagram', 'A routing protocol'], correct: 1 },
      { question: 'What is the difference between `memory` and `storage` in Solidity?', options: ['They are the same', '`storage` is persistent on-chain state; `memory` is temporary data that exists only during function execution', '`memory` is cheaper', '`storage` is faster'], correct: 1 },
      { question: 'What is an "event" in Solidity?', options: ['A blockchain party', 'A mechanism for smart contracts to emit logs that external applications can listen to', 'A consensus event', 'A scheduling feature'], correct: 1 },
      { question: 'What does `require()` do in Solidity?', options: ['Imports a library', 'Checks a condition and reverts the transaction with an error message if the condition is false', 'Requires user authentication', 'Requests more gas'], correct: 1 },

      // --- Governance & DAOs ---
      { question: 'What is "on-chain governance"?', options: ['Government regulation of blockchains', 'Governance where proposals and votes are recorded and executed directly on the blockchain', 'Managing chain links', 'A consensus algorithm'], correct: 1 },
      { question: 'What is a governance token?', options: ['A token that governs other tokens', 'A token that gives holders voting rights over protocol decisions like parameter changes and treasury allocation', 'A government-issued token', 'A stable coin'], correct: 1 },
      { question: 'What is a "Snapshot" vote?', options: ['A photograph', 'An off-chain gasless voting mechanism that uses token balances at a specific block number as voting weight', 'A backup system', 'A consensus mechanism'], correct: 1 },
      { question: 'What is "quadratic voting"?', options: ['Voting four times', 'A voting mechanism where the cost of additional votes increases quadratically, giving broader support more weight', 'A mathematical formula', 'A type of election'], correct: 1 },
      { question: 'What is a "timelock" in DAO governance?', options: ['A clock', 'A delay period between when a governance proposal passes and when it executes, allowing users to react', 'A timestamp function', 'A lock mechanism'], correct: 1 },
      { question: 'What is "delegation" in token governance?', options: ['Appointing a CEO', 'Transferring your voting power to another address while retaining token ownership', 'Delegating tasks to employees', 'A network routing mechanism'], correct: 1 },
      { question: 'What is a "multisig wallet"?', options: ['A wallet with multiple currencies', 'A wallet requiring multiple private key signatures to authorize a transaction', 'A multi-user wallet', 'A wallet with many addresses'], correct: 1 },

      // --- DeFi Composability ---
      { question: 'What does "DeFi composability" mean?', options: ['Musical composition on blockchain', 'The ability to combine and build upon existing DeFi protocols like interchangeable building blocks', 'Composing smart contracts', 'A design pattern'], correct: 1 },
      { question: 'What is a "flash loan"?', options: ['A very fast bank loan', 'An uncollateralized loan that must be borrowed and repaid within the same blockchain transaction', 'A loan with flashy terms', 'A lightning network feature'], correct: 1 },
      { question: 'What is an AMM (Automated Market Maker)?', options: ['A trading bot', 'A protocol that uses mathematical formulas (like x*y=k) to price and facilitate token swaps without order books', 'A centralized exchange', 'An arbitrage tool'], correct: 1 },
      { question: 'What is "impermanent loss"?', options: ['A temporary file loss', 'The difference in value between holding tokens in an AMM liquidity pool versus simply holding them in a wallet', 'A hardware failure', 'A network disconnect'], correct: 1 },
      { question: 'What is "yield farming"?', options: ['Agricultural technology', 'Strategically providing liquidity or staking tokens across DeFi protocols to maximize returns', 'Growing crops on blockchain', 'A mining technique'], correct: 1 },
      { question: 'What is a "liquidity pool"?', options: ['A swimming pool', 'A smart contract containing locked token pairs that enables decentralized trading and lending', 'A storage mechanism', 'A network buffer'], correct: 1 },
      { question: 'What is a "DEX aggregator"?', options: ['A stock market tool', 'A service that routes trades across multiple decentralized exchanges to find the best price and lowest slippage', 'A data collector', 'A blockchain explorer'], correct: 1 },

      // --- ERCs & Standards ---
      { question: 'What is ERC-721?', options: ['A token standard for fungible tokens', 'The standard for non-fungible tokens (NFTs) on Ethereum, where each token is unique', 'A consensus algorithm', 'A network protocol'], correct: 1 },
      { question: 'What is ERC-1155?', options: ['An upgrade to ERC-20', 'A multi-token standard that supports both fungible and non-fungible tokens in a single contract', 'A staking standard', 'A bridge protocol'], correct: 1 },
      { question: 'What is ERC-4626?', options: ['A gaming standard', 'A tokenized vault standard that provides a unified API for yield-bearing vault strategies', 'A governance standard', 'A naming standard'], correct: 1 },
      { question: 'What is an EIP vs an ERC?', options: ['They are the same thing', 'EIPs are Ethereum Improvement Proposals (any type); ERCs are specifically about application-level standards', 'ERCs are older than EIPs', 'EIPs are for Layer 2 only'], correct: 1 },
      { question: 'What is EIP-1559 known for?', options: ['Creating NFTs', 'Introducing a base fee that is burned and a priority tip, making gas pricing more predictable', 'Launching proof of stake', 'Creating the ERC-20 standard'], correct: 1 },

      // --- Developer Tools ---
      { question: 'What is Foundry?', options: ['A metal workshop', 'A fast Solidity development toolkit written in Rust, featuring forge (testing) and cast (CLI)', 'A JavaScript framework', 'A blockchain explorer'], correct: 1 },
      { question: 'What is The Graph protocol used for?', options: ['Creating charts', 'Indexing and querying blockchain data efficiently using GraphQL, acting as a decentralized data layer', 'Drawing graphs on-chain', 'A consensus mechanism'], correct: 1 },
      { question: 'What is IPFS?', options: ['An internet provider', 'InterPlanetary File System — a peer-to-peer distributed file system for storing and sharing content-addressed data', 'A file format', 'A programming language'], correct: 1 },
      { question: 'What is a "subgraph" in The Graph?', options: ['A small graph', 'A defined schema that specifies which smart contract events to index and how to store the data', 'A mathematical concept', 'A network partition'], correct: 1 },
      { question: 'What is Tenderly used for in Ethereum development?', options: ['A cooking app', 'Transaction simulation, debugging, monitoring, and alerts for smart contracts', 'A wallet app', 'A consensus tool'], correct: 1 },
      { question: 'What is "Chainlink" primarily known for?', options: ['A chain manufacturer', 'A decentralized oracle network that provides reliable external data feeds to smart contracts', 'A Layer 2 solution', 'A wallet provider'], correct: 1 },
      { question: 'What is "account abstraction" (ERC-4337)?', options: ['Abstracting account details', 'Enabling smart contract wallets with features like gas sponsorship, batch transactions, and social recovery', 'An accounting standard', 'A privacy feature'], correct: 1 },

      // --- Ethereum Ecosystem ---
      { question: 'What is the "Ethereum Virtual Machine" (EVM)?', options: ['A virtual reality platform', 'The runtime environment that executes smart contract bytecode on every Ethereum node', 'A development IDE', 'A testing framework'], correct: 1 },
      { question: 'What is "EVM compatibility"?', options: ['Backward compatible software', 'The ability of other blockchains to run Ethereum smart contracts and use Ethereum developer tools', 'A hardware specification', 'A file format'], correct: 1 },
      { question: 'What are "precompiled contracts" in Ethereum?', options: ['Contracts compiled before deployment', 'Built-in contracts at predefined addresses that perform complex cryptographic operations at lower gas cost', 'Template contracts', 'Beta contracts'], correct: 1 },
      { question: 'What is "ENS" (Ethereum Name Service)?', options: ['An email service', 'A decentralized naming system that maps human-readable names (like vitalik.eth) to Ethereum addresses', 'A notification service', 'A consensus protocol'], correct: 1 },
    ]
  },

  // ============================================================
  // QUIZ 2: Privacy on Ethereum
  // ============================================================
  {
    quizId: 2,
    title: 'Privacy on Ethereum',
    icon: '🔒',
    questions: [
      // --- Privacy Fundamentals ---
      { question: 'Is Ethereum anonymous by default?', options: ['Yes, completely', 'No, it is pseudonymous: addresses are visible but not directly tied to real identities', 'Yes, with VPN', 'Only for large transactions'], correct: 1 },
      { question: 'What is the difference between "privacy" and "anonymity"?', options: ['They are the same', 'Privacy is controlling what information you share; anonymity is hiding your identity entirely', 'Anonymity is legal; privacy is not', 'Privacy is for companies; anonymity is for individuals'], correct: 1 },
      { question: 'Why is privacy a fundamental right?', options: ['It protects criminals', 'It protects individuals from surveillance, discrimination, and abuse of power', 'It is not a right', 'Only for government officials'], correct: 1 },
      { question: 'What is "metadata leakage" on Ethereum?', options: ['Data about music metadata', 'When transaction patterns, timing, and amounts reveal information about users despite pseudonymous addresses', 'Memory leaks in smart contracts', 'Lost private keys'], correct: 1 },
      { question: 'Why is financial privacy important?', options: ['To hide illegal activity', 'To prevent discrimination, protect competitive information, and preserve personal safety', 'It is not important', 'Only for wealthy people'], correct: 1 },

      // --- Zero-Knowledge Proofs ---
      { question: 'What is a zero-knowledge proof (ZKP)?', options: ['A proof that you know nothing', 'A cryptographic method to prove a statement is true without revealing any information beyond the statement itself', 'A blockchain with zero transactions', 'A test with zero questions'], correct: 1 },
      { question: 'What is the classic "Ali Baba cave" analogy for ZKPs?', options: ['A treasure hunting story', 'Proving you know the secret word to open a cave passage without revealing the word itself', 'An encryption method', 'A mining algorithm'], correct: 1 },
      { question: 'What is a "zk-SNARK"?', options: ['A type of shark', 'Zero-Knowledge Succinct Non-Interactive Argument of Knowledge: a compact, efficient ZKP', 'A smart contract language', 'A consensus mechanism'], correct: 1 },
      { question: 'What does "succinct" mean in zk-SNARK?', options: ['Slow and complex', 'The proof is small and quick to verify regardless of how complex the computation', 'The proof is detailed', 'The proof requires interaction'], correct: 1 },
      { question: 'What does "non-interactive" mean in zk-SNARK?', options: ['No user input needed', 'The prover and verifier don\'t need to communicate back and forth; one message suffices', 'The proof is static', 'No internet required'], correct: 1 },

      // --- ZKP Applications ---
      { question: 'How can ZKPs help with identity verification?', options: ['By storing your passport on-chain', 'By proving you are over 18 or a citizen without revealing your actual date of birth or passport number', 'By encrypting your identity', 'By deleting your records'], correct: 1 },
      { question: 'What is a zk-rollup?', options: ['A type of sushi roll', 'A Layer 2 scaling solution that uses zero-knowledge proofs to verify batched transactions', 'A privacy coin', 'A smart contract pattern'], correct: 1 },
      { question: 'How do zk-rollups improve scalability?', options: ['By using faster hardware', 'By batching hundreds of transactions into one proof that is verified on L1, reducing per-transaction cost', 'By removing security', 'By using bigger blocks'], correct: 1 },
      { question: 'What is a "validity proof" in zk-rollups?', options: ['A proof of identity', 'A cryptographic proof that all transactions in the rollup batch were executed correctly', 'A legal document', 'A block header'], correct: 1 },
      { question: 'Name a major zk-rollup project on Ethereum.', options: ['Bitcoin Lightning', 'zkSync, StarkNet, Polygon zkEVM, or Scroll', 'Dogecoin', 'Litecoin'], correct: 1 },

      // --- Privacy Coins & Protocols ---
      { question: 'What is Tornado Cash?', options: ['A weather app', 'A smart contract protocol that breaks the on-chain link between source and destination addresses', 'A cryptocurrency exchange', 'A Layer 2 network'], correct: 1 },
      { question: 'How does Tornado Cash achieve privacy?', options: ['By encrypting transactions', 'Users deposit a fixed amount into a pool and withdraw from a different address, breaking the transaction trail', 'By deleting transaction history', 'By using a VPN'], correct: 1 },
      { question: 'What is a "mixer" or "tumbler" in crypto?', options: ['A kitchen appliance', 'A service that mixes multiple users\' funds together to obscure the trail back to the original sender', 'A type of consensus', 'A token swap'], correct: 1 },
      { question: 'What is Zcash?', options: ['A cash register app', 'A cryptocurrency that uses zk-SNARKs to enable fully private transactions', 'An Ethereum token', 'A fiat currency'], correct: 1 },
      { question: 'What is a "shielded transaction"?', options: ['A protected bank transfer', 'A transaction where the sender, receiver, and amount are all hidden using zero-knowledge proofs', 'An insured transaction', 'A confirmed transaction'], correct: 1 },

      // --- Privacy Challenges ---
      { question: 'What is "on-chain analysis"?', options: ['Analyzing a physical chain', 'Examining blockchain transaction patterns to trace fund flows and potentially identify users', 'Smart contract testing', 'Code review'], correct: 1 },
      { question: 'What company is known for blockchain surveillance and analysis?', options: ['Google', 'Chainalysis', 'Meta', 'OpenAI'], correct: 1 },
      { question: 'What is a "dusting attack"?', options: ['Cleaning a computer', 'Sending tiny amounts of crypto to many wallets to trace their transaction patterns', 'A DDoS attack', 'A type of spam'], correct: 1 },
      { question: 'Why is ENS (alice.eth) potentially privacy-reducing?', options: ['ENS is encrypted', 'It links a human-readable name to an Ethereum address, making it easier to identify the owner', 'ENS is anonymous', 'ENS hides transactions'], correct: 1 },
      { question: 'What is "address reuse" and why is it bad for privacy?', options: ['Using the same address twice', 'Using the same address for multiple transactions makes it easier to link all your activity together', 'It is good for privacy', 'It saves gas'], correct: 1 },

      // --- Cryptographic Primitives ---
      { question: 'What is "homomorphic encryption"?', options: ['Encryption for homes', 'Encryption that allows computations to be performed on encrypted data without decrypting it first', 'A type of hash function', 'A consensus mechanism'], correct: 1 },
      { question: 'What is a "commitment scheme"?', options: ['A marriage proposal', 'A cryptographic protocol where you commit to a value without revealing it, then reveal it later', 'A subscription service', 'A governance vote'], correct: 1 },
      { question: 'What is a "Merkle proof"?', options: ['A proof of concept', 'A proof that a specific piece of data is part of a Merkle tree without revealing the entire tree', 'A legal proof', 'A mathematical theorem'], correct: 1 },
      { question: 'What is a "nullifier" in privacy protocols?', options: ['Something that makes things null', 'A unique value that prevents double-spending without revealing the user\'s identity', 'A cancellation token', 'A zero-value transaction'], correct: 1 },
      { question: 'What is "Pedersen commitment"?', options: ['A commitment by someone named Pedersen', 'A cryptographic commitment scheme used in confidential transactions to hide amounts', 'A governance proposal', 'A staking commitment'], correct: 1 },

      // --- Privacy Infrastructure ---
      { question: 'What is a "stealth address"?', options: ['A hidden website', 'A one-time address generated for each transaction so the receiver\'s main address stays private', 'An address with no balance', 'A burned address'], correct: 1 },
      { question: 'What is EIP-5564?', options: ['A gas optimization', 'A proposal for stealth addresses on Ethereum enabling private receiving', 'A new token standard', 'A consensus change'], correct: 1 },
      { question: 'What is a "viewing key" in privacy systems?', options: ['A key to view a website', 'A key that allows reading transaction details without the ability to spend funds', 'A public key', 'A password'], correct: 1 },
      { question: 'What is "MPC" (Multi-Party Computation)?', options: ['Multiple Party Chat', 'A technique where multiple parties jointly compute a function while keeping their inputs private', 'A mining pool coordinator', 'A token distribution method'], correct: 1 },
      { question: 'What is the role of a "trusted setup" in some ZKP systems?', options: ['Setting up trust between users', 'Generating initial cryptographic parameters; if compromised, fake proofs could be created', 'Installing software', 'Creating a blockchain'], correct: 1 },

      // --- Privacy & Identity ---
      { question: 'What is a "DID" (Decentralized Identifier)?', options: ['A digital identity document', 'A self-owned identifier not controlled by any central authority, stored on a blockchain', 'A data import/export', 'A debugging tool'], correct: 1 },
      { question: 'What are "Verifiable Credentials"?', options: ['Verified social media accounts', 'Digital credentials (diplomas, licenses) that can be cryptographically verified without contacting the issuer', 'Password managers', 'KYC documents'], correct: 1 },
      { question: 'What is "selective disclosure"?', options: ['Selecting which files to share', 'Revealing only specific attributes (e.g., "over 18") without sharing the full credential (e.g., date of birth)', 'Choosing a token', 'Selective mining'], correct: 1 },
      { question: 'What is "Soulbound Token" (SBT)?', options: ['A gaming token', 'A non-transferable token representing commitments, credentials, or affiliations', 'A type of NFT that can be traded', 'A staking token'], correct: 1 },
      { question: 'What privacy concern do Soulbound Tokens raise?', options: ['They are too expensive', 'Since they are publicly visible and non-transferable, they could create a permanent, public record of your history', 'They consume too much gas', 'They are difficult to mint'], correct: 1 },

      // --- Regulatory Landscape ---
      { question: 'What is GDPR?', options: ['A blockchain protocol', 'The EU\'s General Data Protection Regulation governing personal data privacy', 'A DeFi protocol', 'A token standard'], correct: 1 },
      { question: 'How does GDPR\'s "right to be forgotten" conflict with blockchain?', options: ['It doesn\'t', 'Blockchain is immutable, making it difficult to delete personal data as GDPR requires', 'GDPR supports blockchain', 'Blockchain automatically complies'], correct: 1 },
      { question: 'What is "compliance without compromise"?', options: ['Following all rules exactly', 'Using ZKPs to prove regulatory compliance without revealing underlying private data', 'Ignoring regulations', 'A legal framework'], correct: 1 },
      { question: 'What is KYC (Know Your Customer)?', options: ['A Korean cryptocurrency', 'Identity verification requirements imposed on financial services to prevent fraud and money laundering', 'A key exchange protocol', 'A smart contract standard'], correct: 1 },
      { question: 'How could ZKPs change KYC?', options: ['By eliminating it entirely', 'By allowing proof of identity requirements without revealing actual identity documents to every service', 'By making it mandatory on-chain', 'By encrypting all data'], correct: 1 },

      // --- Advanced Privacy ---
      { question: 'What is a "zk-STARK"?', options: ['A superhero', 'Zero-Knowledge Scalable Transparent Argument of Knowledge: a ZKP that needs no trusted setup', 'A staking token', 'A smart contract language'], correct: 1 },
      { question: 'How do zk-STARKs differ from zk-SNARKs?', options: ['They are identical', 'zk-STARKs don\'t require a trusted setup and are quantum-resistant, but proofs are larger', 'zk-STARKs are faster', 'zk-SNARKs are newer'], correct: 1 },
      { question: 'What is a "ring signature"?', options: ['A signature on a ring', 'A signature that proves a message was signed by one member of a group without revealing which member', 'A circular hash', 'A multi-sig signature'], correct: 1 },
      { question: 'What is "differential privacy"?', options: ['Different types of privacy', 'A mathematical framework for quantifying privacy loss when releasing aggregate data about a dataset', 'Private vs. public keys', 'Privacy settings'], correct: 1 },
      { question: 'What is the "privacy trilemma" in blockchain?', options: ['Three types of privacy', 'The difficulty of simultaneously achieving privacy, scalability, and decentralization', 'A three-step encryption', 'Three privacy settings'], correct: 1 },

      // --- Practical Privacy ---
      { question: 'What is the simplest privacy practice for Ethereum users?', options: ['Using the same address for everything', 'Using a new address for each transaction or category of activity', 'Sharing your seed phrase', 'Using a centralized exchange for everything'], correct: 1 },
      { question: 'What is a "burner wallet"?', options: ['A wallet that self-destructs', 'A temporary wallet used for specific interactions to avoid linking to your main address', 'A wallet for burning tokens', 'A stolen wallet'], correct: 1 },
      { question: 'What is "Railgun" on Ethereum?', options: ['A weapon', 'A privacy system that uses ZKPs to enable private DeFi transactions on Ethereum', 'A Layer 2 solution', 'A consensus mechanism'], correct: 1 },
      { question: 'What is "Aztec Network"?', options: ['An ancient civilization\'s network', 'A privacy-focused Layer 2 on Ethereum using ZK technology for private smart contracts', 'A social network', 'A VPN service'], correct: 1 },
      { question: 'What is the main challenge of implementing privacy on a public blockchain?', options: ['It is illegal', 'Balancing transparent verification (needed for consensus) with hiding transaction details', 'It is too expensive', 'Privacy is not possible'], correct: 1 },

      // --- Privacy Ethics & Philosophy ---
      { question: 'Who said "Arguing that you don\'t care about privacy because you have nothing to hide..."?', options: ['Vitalik Buterin', 'Edward Snowden', 'Satoshi Nakamoto', 'Elon Musk'], correct: 1 },
      { question: 'What was the completion of Snowden\'s quote about privacy?', options: ['"...is wrong"', '"...is like arguing you don\'t care about free speech because you have nothing to say"', '"...is a personal choice"', '"...is understandable"'], correct: 1 },
      { question: 'What is "surveillance capitalism"?', options: ['Investing in security cameras', 'An economic system where personal data is extracted and used for profit without meaningful consent', 'Government monitoring', 'Crypto market surveillance'], correct: 1 },
      { question: 'Why is privacy sometimes called a "social good"?', options: ['It benefits companies', 'Privacy protects minorities, enables free speech, and prevents power imbalances in society', 'It is good for social media', 'It helps governments'], correct: 1 },
      { question: 'What is the "chilling effect" of surveillance?', options: ['Temperature drop', 'People self-censor and avoid legal activities when they know they are being watched', 'A blockchain cooling mechanism', 'A DDoS mitigation technique'], correct: 1 },

      // --- More ZKP ---
      { question: 'What is a "proof of solvency"?', options: ['Proof that a solvent works', 'A cryptographic proof that an exchange holds enough assets to cover all deposits without revealing exact holdings', 'A chemistry proof', 'A balance check'], correct: 1 },
      { question: 'What is "Semaphore" in the Ethereum privacy ecosystem?', options: ['A traffic signal', 'A zero-knowledge protocol for anonymous signaling and voting on Ethereum', 'A network monitoring tool', 'A token standard'], correct: 1 },
      { question: 'What is a "PLONK" proof system?', options: ['A sound effect', 'A universal zk-SNARK system with a single trusted setup that works for any circuit', 'A programming language', 'A testing tool'], correct: 1 },
      { question: 'What is "Groth16"?', options: ['A car model', 'An efficient zk-SNARK proof system requiring a circuit-specific trusted setup', 'A Solidity version', 'A consensus algorithm'], correct: 1 },
      { question: 'What is a "circuit" in the context of ZKPs?', options: ['An electrical circuit', 'A mathematical representation of the computation being proved, expressed as constraints', 'A racing track', 'A network path'], correct: 1 },

      // --- Contemporary Issues ---
      { question: 'What is "private by default" in blockchain design?', options: ['All blockchains are private', 'Designing systems where transaction details are hidden unless explicitly made public', 'Default privacy settings', 'Private key generation'], correct: 1 },
      { question: 'What is "progressive disclosure" in privacy design?', options: ['Gradually showing more UI', 'Revealing only the minimum information needed for each interaction, adding more only when required', 'A step-by-step tutorial', 'A data migration process'], correct: 1 },
      { question: 'What is the future vision for privacy on Ethereum according to Vitalik Buterin?', options: ['Remove all privacy features', 'Default privacy for transactions with optional disclosure for compliance and transparency', 'Make everything fully anonymous', 'Only use centralized solutions'], correct: 1 },
      { question: 'What is "FHE" (Fully Homomorphic Encryption)?', options: ['Fast Hash Encoding', 'Encryption enabling arbitrary computations on encrypted data, the "holy grail" of privacy tech', 'Functional Hash Environment', 'A file format'], correct: 1 },
      { question: 'Why is FHE considered the "holy grail" of privacy?', options: ['It is very expensive', 'It would allow private smart contracts where computation happens on encrypted data without ever decrypting', 'It is the oldest encryption', 'It uses the most gas'], correct: 1 },

      // --- Advanced Privacy Techniques ---
      { question: 'What is "MPC" (Multi-Party Computation)?', options: ['Multiple processor computing', 'A technique where multiple parties jointly compute a function over their inputs without revealing individual inputs to each other', 'Multi-platform compatibility', 'A consensus algorithm'], correct: 1 },
      { question: 'What are "stealth addresses"?', options: ['Hidden blockchain nodes', 'One-time addresses generated for each transaction so the recipient\'s public address is never visible on-chain', 'Tor exit nodes', 'Private DNS addresses'], correct: 1 },
      { question: 'How do stealth addresses protect privacy?', options: ['By encrypting the blockchain', 'They break the link between a recipient\'s known public address and incoming transactions', 'By hiding block data', 'By changing the sender address'], correct: 1 },
      { question: 'What is a "shielded pool" in privacy protocols?', options: ['A private swimming pool', 'An encrypted pool of assets where balances and transactions are hidden using zero-knowledge proofs', 'A liquidity pool', 'A mining pool'], correct: 1 },
      { question: 'What is "plausible deniability" in privacy?', options: ['Denying you use crypto', 'The ability to deny involvement in a transaction because an observer cannot definitively prove your participation', 'A legal defense', 'A consensus mechanism'], correct: 1 },
      { question: 'What is the difference between "privacy" and "anonymity"?', options: ['They are identical', 'Privacy hides what you do; anonymity hides who you are — they are related but distinct concepts', 'Privacy is stronger', 'Anonymity is illegal'], correct: 1 },
      { question: 'What is "data minimization" as a privacy principle?', options: ['Compressing data', 'Collecting and storing only the minimum data necessary for a specific purpose', 'Deleting all data', 'Minimizing disk space'], correct: 1 },

      // --- Privacy Coins & Protocols ---
      { question: 'What technique does Monero use for privacy?', options: ['Zero-knowledge proofs', 'Ring signatures, stealth addresses, and RingCT to obscure sender, receiver, and amount', 'Encryption only', 'Private keys only'], correct: 1 },
      { question: 'What is a "ring signature"?', options: ['A digital ring', 'A signature that proves a message was signed by someone in a group, without revealing which member signed it', 'A circular hash', 'A multisig scheme'], correct: 1 },
      { question: 'What is "RingCT" (Ring Confidential Transactions)?', options: ['Ring token transfers', 'A technique that hides transaction amounts while still allowing the network to verify that inputs equal outputs', 'Confidential token swaps', 'Ring-based consensus'], correct: 1 },
      { question: 'What is the main privacy mechanism in Zcash?', options: ['Ring signatures', 'zk-SNARKs that allow fully shielded transactions where sender, receiver, and amount are all hidden', 'Mixing services', 'Stealth addresses only'], correct: 1 },
      { question: 'What is "Railgun" on Ethereum?', options: ['A weapon', 'A smart contract privacy system that uses zk-SNARKs to shield ERC-20 token transfers on Ethereum', 'A Layer 2 network', 'A gas optimization tool'], correct: 1 },
      { question: 'What is "Aztec Network"?', options: ['An ancient civilization', 'A privacy-focused Layer 2 on Ethereum that uses ZK-rollups to enable private transactions and smart contracts', 'A blockchain explorer', 'A token standard'], correct: 1 },

      // --- Regulatory & Ethical Privacy ---
      { question: 'What is GDPR?', options: ['A blockchain protocol', 'The General Data Protection Regulation — EU law governing how personal data must be collected, stored, and processed', 'A gas fee standard', 'A governance framework'], correct: 1 },
      { question: 'Can blockchain comply with GDPR\'s "right to be forgotten"?', options: ['Yes, easily', 'It is challenging because blockchain data is immutable, but solutions like off-chain data with on-chain hashes exist', 'No, blockchains must ignore GDPR', 'GDPR does not apply to blockchain'], correct: 1 },
      { question: 'What is "selective disclosure"?', options: ['Choosing which blockchain to use', 'Sharing only specific pieces of personal information required for a given interaction, rather than revealing everything', 'Selecting transaction amounts', 'Choosing a validator'], correct: 1 },
      { question: 'Why might privacy be important even if you have "nothing to hide"?', options: ['It is not important', 'Privacy is a fundamental right; it protects against future policy changes, data breaches, discrimination, and power imbalances', 'Only criminals need privacy', 'Privacy slows down transactions'], correct: 1 },
      { question: 'What is "surveillance capitalism"?', options: ['Investing in security cameras', 'An economic system where personal data is extracted, predicted, and sold as a commodity for profit', 'A type of DAO', 'Government blockchain monitoring'], correct: 1 },
      { question: 'What is "OFAC" in the context of crypto privacy?', options: ['A DeFi protocol', 'The Office of Foreign Assets Control — a US agency that sanctions addresses and privacy protocols like Tornado Cash', 'A token standard', 'An oracle network'], correct: 1 },

      // --- Privacy-Preserving Identity ---
      { question: 'What is a "DID" (Decentralized Identifier)?', options: ['A new token type', 'A globally unique identifier that enables verifiable, decentralized digital identity without a central authority', 'A database ID', 'A DNS record'], correct: 1 },
      { question: 'What is a "verifiable credential"?', options: ['A college degree', 'A cryptographically signed claim about a subject that can be verified without contacting the issuer', 'A password', 'A blockchain certificate'], correct: 1 },
      { question: 'What is "Soulbound Token" (SBT)?', options: ['A gaming item', 'A non-transferable NFT that represents identity, credentials, or affiliations, bound to a specific wallet', 'A staking mechanism', 'A consensus token'], correct: 1 },
      { question: 'How can ZKPs help with age verification?', options: ['By storing age on-chain', 'By proving you are over a certain age without revealing your exact birth date or any other personal information', 'By checking government IDs on-chain', 'They cannot help with age verification'], correct: 1 },
      { question: 'What is "self-sovereign identity" (SSI)?', options: ['Government-issued digital ID', 'An identity model where individuals own and control their personal data without relying on centralized authorities', 'A single sign-on system', 'A biometric system'], correct: 1 },

      // --- Technical Privacy Concepts ---
      { question: 'What is a "nullifier" in ZK-proof systems?', options: ['A deletion tool', 'A unique value derived from private inputs that prevents double-spending without revealing the spender\'s identity', 'A null pointer', 'A consensus vote'], correct: 1 },
      { question: 'What is "differential privacy"?', options: ['The difference between two passwords', 'A mathematical framework for adding calibrated noise to data to protect individual records while preserving statistical patterns', 'A privacy comparison tool', 'A blockchain fork'], correct: 1 },
      { question: 'What is an "accumulator" in privacy cryptography?', options: ['A battery', 'A compact cryptographic data structure that can represent a large set and prove membership without revealing the set', 'A counter', 'A storage pool'], correct: 1 },
      { question: 'What is "onion routing" and how does Tor use it?', options: ['Routing through vegetables', 'Encrypting messages in multiple layers, each peeled by a different node, so no single node knows both sender and destination', 'A consensus algorithm', 'A blockchain bridge'], correct: 1 },
      { question: 'What is the "nothing up my sleeve" principle in cryptography?', options: ['A magic trick', 'Using publicly verifiable, deterministic constants (like digits of pi) so no one can secretly embed backdoors', 'A security audit technique', 'A transparency report'], correct: 1 },
      { question: 'What is "k-anonymity"?', options: ['Using the letter K as a password', 'A privacy model where each record is indistinguishable from at least k-1 other records in a dataset', 'An encryption algorithm', 'A network topology'], correct: 1 },
    ]
  },

  // ============================================================
  // QUIZ 3: Security in Smart Contracts
  // ============================================================
  {
    quizId: 3,
    title: 'Security in Smart Contracts',
    icon: '🔐',
    questions: [
      // --- Security Fundamentals ---
      { question: 'Why is smart contract security especially important?', options: ['Because code is hard to write', 'Because deployed contracts are immutable and handle real value; bugs cannot be easily patched', 'Because Ethereum is slow', 'Because gas fees are high'], correct: 1 },
      { question: 'What is the largest smart contract exploit in history?', options: ['Mt. Gox ($460M)', 'The DAO hack (~$60M at the time)', 'Ronin Bridge ($625M)', 'FTX collapse'], correct: 2 },
      { question: 'What caused the DAO hack in 2016?', options: ['A phishing attack', 'A reentrancy vulnerability that allowed the attacker to drain funds repeatedly', 'A stolen private key', 'A DNS hijack'], correct: 1 },
      { question: 'What is the total estimated value lost to smart contract exploits?', options: ['About $10 million', 'About $100 million', 'Several billion dollars', 'About $1 million'], correct: 2 },
      { question: 'What is the "code is law" philosophy?', options: ['All code must follow laws', 'The behavior of deployed smart contracts is the final authority, regardless of developer intent', 'Laws should be written in code', 'Coding is mandatory'], correct: 1 },

      // --- Common Vulnerabilities ---
      { question: 'What is a reentrancy attack?', options: ['Entering a building twice', 'When a malicious contract recursively calls back into the vulnerable contract before state changes are saved', 'A network re-entry', 'A login loop'], correct: 1 },
      { question: 'How does the Checks-Effects-Interactions pattern prevent reentrancy?', options: ['By using a mutex', 'By updating state variables before making external calls, so re-entrant calls see the updated state', 'By limiting gas', 'By using encryption'], correct: 1 },
      { question: 'What is an "integer overflow" vulnerability?', options: ['When a number gets too large for the screen', 'When a number exceeds its maximum value and wraps around to zero (or minimum)', 'A floating point error', 'A database overflow'], correct: 1 },
      { question: 'How does Solidity 0.8+ handle integer overflow?', options: ['It ignores it', 'It automatically reverts on overflow/underflow by default', 'It logs a warning', 'It truncates the value'], correct: 1 },
      { question: 'What is a "front-running" attack?', options: ['Running in front of someone', 'Observing a pending transaction in the mempool and submitting a similar transaction with higher gas to execute first', 'A racing condition in code', 'A UI bug'], correct: 1 },

      // --- More Vulnerabilities ---
      { question: 'What is an "access control" vulnerability?', options: ['A door lock problem', 'When critical functions lack proper permission checks, allowing unauthorized users to call them', 'An API rate limit', 'A network firewall issue'], correct: 1 },
      { question: 'What is a "flash loan attack"?', options: ['A quick bank robbery', 'Using an uncollateralized flash loan to manipulate prices or exploit vulnerabilities within a single transaction', 'A fast lending platform', 'A loan default'], correct: 1 },
      { question: 'What is "oracle manipulation"?', options: ['Manipulating fortune tellers', 'Artificially changing the price data provided by an oracle to profit from contracts that depend on that data', 'Oracle database hacking', 'Changing weather data'], correct: 1 },
      { question: 'What is a "denial-of-service" (DoS) vulnerability in smart contracts?', options: ['Denying service requests', 'A bug that allows an attacker to make a contract permanently unusable or stuck', 'Server downtime', 'Network congestion'], correct: 1 },
      { question: 'What is "tx.origin" and why is it dangerous?', options: ['The original transaction', '`tx.origin` returns the original sender (EOA) of the transaction chain, which can be exploited via phishing contracts', 'A safe authentication method', 'The first Ethereum transaction'], correct: 1 },

      // --- Security Patterns ---
      { question: 'What is the "pull over push" payment pattern?', options: ['Pulling cables instead of pushing them', 'Instead of sending funds to recipients, let them withdraw, preventing DoS if one transfer fails', 'A data transfer method', 'A consensus mechanism'], correct: 1 },
      { question: 'What is a "reentrancy guard" (mutex)?', options: ['A security guard', 'A modifier that prevents a function from being called again before its first invocation completes', 'A firewall rule', 'A password check'], correct: 1 },
      { question: 'What is the purpose of the `onlyOwner` modifier?', options: ['To identify the owner', 'To restrict function access so only the contract owner (admin) can call it', 'To log ownership changes', 'To transfer ownership'], correct: 1 },
      { question: 'What is "rate limiting" in smart contracts?', options: ['Limiting the exchange rate', 'Restricting how often or how much a function can be called within a time period', 'Limiting network speed', 'Controlling gas prices'], correct: 1 },
      { question: 'What is a "timelock"?', options: ['A lock that tells time', 'A mechanism that delays execution of critical operations, giving users time to react to changes', 'A blockchain timestamp', 'A scheduling feature'], correct: 1 },

      // --- Auditing ---
      { question: 'What is a smart contract audit?', options: ['A financial audit', 'A systematic review of smart contract code to identify vulnerabilities, logic errors, and optimization opportunities', 'A government inspection', 'A user survey'], correct: 1 },
      { question: 'How much does a professional smart contract audit typically cost?', options: ['About $100', 'Typically $5,000 to $100,000+ depending on complexity', 'It is always free', 'About $10'], correct: 1 },
      { question: 'Does a passed audit guarantee a contract is secure?', options: ['Yes, absolutely', 'No, audits reduce risk but cannot guarantee the absence of all vulnerabilities', 'Yes, legally', 'Only if it is certified'], correct: 1 },
      { question: 'What is a "bug bounty" program?', options: ['Paying for insects', 'Offering rewards to security researchers who find and responsibly disclose vulnerabilities', 'A debugging tool', 'A game development concept'], correct: 1 },
      { question: 'What is "Immunefi"?', options: ['An immunity booster', 'A major Web3 bug bounty platform connecting projects with security researchers', 'An antivirus', 'A DeFi protocol'], correct: 1 },

      // --- Testing & Tools ---
      { question: 'What is "fuzz testing" (fuzzing)?', options: ['Making things fuzzy', 'Automatically generating random or semi-random inputs to find edge cases and crashes', 'Manual testing', 'Performance testing'], correct: 1 },
      { question: 'What is "Slither"?', options: ['A snake game', 'A static analysis tool for Solidity that detects common vulnerabilities automatically', 'A programming language', 'A blockchain explorer'], correct: 1 },
      { question: 'What is "Mythril"?', options: ['A mythical creature', 'A security analysis tool that uses symbolic execution to find vulnerabilities in EVM bytecode', 'A smart contract language', 'A token standard'], correct: 1 },
      { question: 'What is "symbolic execution"?', options: ['Using symbols in code', 'Analyzing code by treating inputs as symbolic values and exploring all possible execution paths', 'A type of encryption', 'A compilation step'], correct: 1 },
      { question: 'What is the difference between static and dynamic analysis?', options: ['Static is for images, dynamic is for videos', 'Static analyzes code without executing it; dynamic analyzes code during execution', 'They are the same', 'Static is faster; dynamic is more accurate'], correct: 1 },

      // --- Real Attack Case Studies ---
      { question: 'What was the Poly Network hack ($611M)?', options: ['A network cable theft', 'An exploit of a cross-chain bridge where the attacker found a way to forge transaction proofs', 'A Ponzi scheme', 'A rug pull'], correct: 1 },
      { question: 'What was notable about the Poly Network hacker?', options: ['They were never caught', 'They returned most of the funds and were offered a security role', 'They were a government', 'They burned the tokens'], correct: 1 },
      { question: 'What is a "rug pull"?', options: ['Pulling a carpet', 'When project developers abandon the project and drain all invested funds', 'A type of exploit', 'A governance vote'], correct: 1 },
      { question: 'What was the Wormhole bridge exploit?', options: ['A space exploration hack', 'A signature verification bypass that allowed the attacker to mint 120,000 wETH on Solana', 'A worm virus', 'A DNS attack'], correct: 1 },
      { question: 'Why are cross-chain bridges frequent targets for attacks?', options: ['They are less popular', 'They hold large amounts of locked funds and have complex, multi-chain logic with larger attack surfaces', 'They are not audited', 'They use outdated code'], correct: 1 },

      // --- Solidity Security Features ---
      { question: 'What does `require()` do if the condition is false?', options: ['Logs a warning', 'Reverts the transaction and refunds remaining gas', 'Continues execution', 'Pauses the contract'], correct: 1 },
      { question: 'What is the difference between `require()` and `assert()`?', options: ['They are identical', '`require()` is for input validation (refunds gas); `assert()` is for invariants (consumes all gas on failure)', '`assert()` is deprecated', '`require()` is slower'], correct: 1 },
      { question: 'What is a "modifier" in Solidity?', options: ['A CSS property', 'Reusable code that wraps function logic, typically for access control or precondition checks', 'A mathematical operation', 'A deployment tool'], correct: 1 },
      { question: 'What is the `receive()` function in Solidity?', options: ['A function to receive messages', 'A special function called when the contract receives ETH with empty calldata', 'A constructor', 'An event handler'], correct: 1 },
      { question: 'What is `selfdestruct` and why was it deprecated?', options: ['A debugging function', 'It deleted a contract and sent remaining ETH to an address; deprecated because it breaks assumptions about contract permanence', 'A testing utility', 'An upgrade mechanism'], correct: 1 },

      // --- DeFi Security ---
      { question: 'What is "price manipulation" in DeFi?', options: ['Changing sticker prices', 'Artificially moving an asset\'s price (e.g., via flash loans) to exploit protocols that rely on that price', 'Government price controls', 'Exchange rate adjustment'], correct: 1 },
      { question: 'What is a "TWAP" (Time-Weighted Average Price)?', options: ['A type of token', 'A price oracle that averages prices over time, making manipulation more expensive', 'A transaction wait time', 'A trading volume metric'], correct: 1 },
      { question: 'What is "impermanent loss"?', options: ['A permanent loss', 'The temporary reduction in value experienced by liquidity providers when token prices diverge from their initial ratio', 'A hacking loss', 'A transaction fee loss'], correct: 1 },
      { question: 'What is a "sandwich attack"?', options: ['A food-related exploit', 'Placing a buy order before and a sell order after a victim\'s pending transaction to profit from the price impact', 'A three-layer encryption', 'A multi-sig exploit'], correct: 1 },
      { question: 'What is "slippage" in DeFi?', options: ['Falling down', 'The difference between the expected price of a trade and the actual price when executed', 'A code error', 'A network delay'], correct: 1 },

      // --- Advanced Security ---
      { question: 'What is a "proxy upgrade" vulnerability?', options: ['A server upgrade bug', 'When the upgrade mechanism of a proxy contract can be exploited to replace logic with malicious code', 'A version conflict', 'A gas optimization issue'], correct: 1 },
      { question: 'What is "storage collision" in proxy contracts?', options: ['Physical storage crashing', 'When the proxy and implementation contracts use the same storage slots for different variables, corrupting data', 'Running out of disk space', 'A database error'], correct: 1 },
      { question: 'What is "EIP-1967"?', options: ['A token standard', 'A standard for proxy storage slots that prevents storage collision by using predefined, unlikely slot positions', 'A consensus change', 'A wallet standard'], correct: 1 },
      { question: 'What is a "logic bomb" in a smart contract?', options: ['A physical bomb', 'Hidden malicious code that activates under specific conditions (e.g., after a certain date or balance threshold)', 'A type of DDoS', 'A gas optimization'], correct: 1 },
      { question: 'What is "unchecked return value" vulnerability?', options: ['Not checking exam results', 'Failing to check if a low-level call (e.g., `call`, `send`) succeeded, potentially ignoring failed transfers', 'An unchecked checkbox', 'A UI bug'], correct: 1 },

      // --- Wallet & Key Security ---
      { question: 'What is a "hardware wallet"?', options: ['A wallet made of metal', 'A physical device that stores private keys offline, protecting them from software attacks', 'A digital wallet', 'A browser extension'], correct: 1 },
      { question: 'What is a "multi-signature" (multisig) wallet?', options: ['A wallet with multiple addresses', 'A wallet requiring multiple private key signatures to authorize a transaction (e.g., 3-of-5)', 'A wallet with many tokens', 'A shared password wallet'], correct: 1 },
      { question: 'What is "social engineering" in the context of crypto security?', options: ['Building social networks', 'Manipulating people through deception to gain access to their keys, passwords, or accounts', 'Social media marketing', 'Community building'], correct: 1 },
      { question: 'What is a "phishing attack" in crypto?', options: ['Catching fish', 'Creating fake websites, emails, or messages that trick users into revealing private keys or signing malicious transactions', 'A network attack', 'A smart contract bug'], correct: 1 },
      { question: 'What should you NEVER do with your private keys?', options: ['Store them in a hardware wallet', 'Share them with anyone, paste them into websites, or store them in plain text files', 'Write them on paper', 'Back them up'], correct: 1 },

      // --- Upgradability & Governance Attacks ---
      { question: 'What is a "governance attack"?', options: ['A political coup', 'Acquiring enough voting power (tokens) to pass malicious proposals that drain the protocol\'s treasury', 'A government hack', 'A voting machine bug'], correct: 1 },
      { question: 'What was the Beanstalk governance attack?', options: ['A farm attack', 'An attacker used a flash loan to acquire enough voting tokens to pass a malicious proposal that drained $182M', 'A rug pull', 'A hack on a farming app'], correct: 1 },
      { question: 'How can governance attacks be mitigated?', options: ['Remove governance entirely', 'Implementing timelock delays, vote escrow, and snapshot-based voting power', 'Making all proposals free', 'Reducing voter turnout'], correct: 1 },
      { question: 'What is a "timelock" in governance?', options: ['A countdown timer', 'A mandatory delay between proposal approval and execution, giving users time to exit if the proposal is malicious', 'A lock on time-sensitive functions', 'A scheduling mechanism'], correct: 1 },
      { question: 'What is "emergency shutdown" (also called "circuit breaker")?', options: ['Turning off the computer', 'A mechanism to pause critical contract functions in case of an active exploit or emergency', 'A power outage', 'A network shutdown'], correct: 1 },

      // --- Security Best Practices ---
      { question: 'What is the "principle of least privilege"?', options: ['Giving everyone admin access', 'Granting each component only the minimum permissions necessary to perform its function', 'A type of access token', 'A governance model'], correct: 1 },
      { question: 'What is a "honeypot" contract?', options: ['A contract that stores honey', 'A deceptive contract that appears vulnerable to lure attackers but actually traps them', 'A charity contract', 'A staking contract'], correct: 1 },
      { question: 'What is "defense in depth"?', options: ['Deep sea security', 'Using multiple layers of security controls so that if one fails, others still protect the system', 'Deep code analysis', 'Depth-first search'], correct: 1 },
      { question: 'What is the importance of "event logging" for security?', options: ['Recording live events', 'Events create an auditable, immutable trail of all important state changes for monitoring and incident response', 'Logging in to events', 'Creating event invitations'], correct: 1 },
      { question: 'What is a "canary" in smart contract security?', options: ['A bird', 'A small test contract or value that is monitored; changes to it signal a potential exploit', 'A token name', 'A testing framework'], correct: 1 },

      // --- Practical Security ---
      { question: 'Before interacting with a new DeFi protocol, what should you check?', options: ['Only the APY', 'Audit reports, code verification on Etherscan, team reputation, TVL history, and community feedback', 'Only the token price', 'Only the website design'], correct: 1 },
      { question: 'What does "DYOR" mean in crypto?', options: ['Do Your Own Research', 'Don\'t Yield On Returns', 'Decentralized Yield On Risk', 'Digital Yield Optimization Rate'], correct: 0 },
      { question: 'What is "token approval" and why can it be dangerous?', options: ['Approving a token listing', 'Granting a smart contract permission to spend your tokens; unlimited approvals can be exploited if the contract is compromised', 'Verifying token authenticity', 'A governance vote'], correct: 1 },
      { question: 'What tool can you use to revoke token approvals?', options: ['MetaMask settings', 'Revoke.cash or Etherscan token approval checker', 'A hardware wallet', 'The token contract itself'], correct: 1 },
      { question: 'What is the safest way to interact with a new smart contract?', options: ['Use the maximum amount immediately', 'Start with a small test transaction, verify the behavior, and gradually increase amounts', 'Ask a friend to try first', 'Only interact on mainnet'], correct: 1 },

      // --- MEV & Transaction Ordering ---
      { question: 'What is "MEV" (Maximal Extractable Value)?', options: ['Maximum Ethereum Value', 'The profit that block producers can extract by reordering, inserting, or censoring transactions within a block', 'A gas optimization technique', 'A token metric'], correct: 1 },
      { question: 'What is a "sandwich attack"?', options: ['A food metaphor', 'An MEV attack where a searcher places transactions before and after a victim\'s swap to profit from the price impact', 'An encryption technique', 'A consensus attack'], correct: 1 },
      { question: 'What is "frontrunning" in the blockchain context?', options: ['Running faster', 'Observing a pending transaction in the mempool and submitting a similar transaction with higher gas to execute first', 'A startup competition', 'Leading a project'], correct: 1 },
      { question: 'What is "backrunning"?', options: ['Running backwards', 'Placing a transaction immediately after a target transaction to profit from the state change it creates', 'Undo a transaction', 'A rollback mechanism'], correct: 1 },
      { question: 'What is "Flashbots"?', options: ['Fast robots', 'A research organization and MEV auction system that allows searchers to submit bundles directly to block builders', 'A testing framework', 'A type of bot'], correct: 1 },
      { question: 'How can a commit-reveal scheme prevent frontrunning?', options: ['It cannot prevent frontrunning', 'By hiding the actual action in a hash (commit phase) and only revealing it later (reveal phase), so observers cannot see what to frontrun', 'By encrypting the blockchain', 'By using higher gas'], correct: 1 },
      { question: 'What is a "private mempool"?', options: ['A secret pool', 'A mechanism where transactions are submitted privately to block builders instead of the public mempool, preventing MEV extraction', 'A mining pool', 'A liquidity pool'], correct: 1 },

      // --- Bridge & Cross-Chain Security ---
      { question: 'Why are blockchain bridges high-value attack targets?', options: ['Bridges are small', 'Bridges hold large amounts of locked assets and have complex cross-chain logic, making them both lucrative and vulnerable', 'Bridges are well-audited', 'Bridges are decentralized'], correct: 1 },
      { question: 'What happened in the Ronin Bridge hack (2022)?', options: ['A smart contract bug', 'Attackers compromised 5 of 9 validator private keys and drained $625M by signing fraudulent withdrawals', 'A flash loan attack', 'A gas manipulation'], correct: 1 },
      { question: 'What happened in the Wormhole Bridge exploit?', options: ['A frontrunning attack', 'An attacker exploited a signature verification bypass to mint 120,000 wETH ($320M) without depositing collateral', 'A reentrancy attack', 'A price oracle manipulation'], correct: 1 },
      { question: 'What is a "light client" verification in bridges?', options: ['A small application', 'Verifying the source chain\'s consensus on the destination chain using block headers, without trusting a third party', 'A browser extension', 'A mobile wallet'], correct: 1 },

      // --- Formal Verification & Testing ---
      { question: 'What is "formal verification" of smart contracts?', options: ['A review by lawyers', 'Mathematically proving that a contract\'s behavior matches its specification for ALL possible inputs, not just test cases', 'Manual code review', 'Unit testing'], correct: 1 },
      { question: 'What is "fuzzing" in smart contract testing?', options: ['Making code fuzzy', 'Automatically generating random or semi-random inputs to test for unexpected behaviors and edge cases', 'A debugging technique', 'A deployment method'], correct: 1 },
      { question: 'What is "invariant testing"?', options: ['Testing constants', 'Defining properties that must ALWAYS hold true (e.g., total supply equals sum of balances) and testing them across many states', 'Testing variables', 'Static analysis'], correct: 1 },
      { question: 'What is "symbolic execution"?', options: ['Using symbols in code', 'Analyzing code by representing inputs as symbolic variables and exploring all possible execution paths mathematically', 'A naming convention', 'A design pattern'], correct: 1 },
      { question: 'What tool is commonly used for Solidity fuzzing?', options: ['Jest', 'Foundry\'s forge fuzz testing or Echidna, which generate random inputs to find breaking conditions', 'Webpack', 'ESLint'], correct: 1 },

      // --- Real-World Exploits ---
      { question: 'What was "The DAO" hack (2016)?', options: ['A DNS attack', 'An attacker exploited a reentrancy vulnerability to drain ~$60M from The DAO, leading to the Ethereum/Ethereum Classic fork', 'A 51% attack', 'A phishing attack'], correct: 1 },
      { question: 'What caused the Poly Network hack ($611M)?', options: ['A brute force attack', 'A vulnerability in cross-chain signature verification allowed the attacker to forge transactions', 'A social engineering attack', 'A DDoS attack'], correct: 1 },
      { question: 'What was the Parity multisig wallet bug?', options: ['A UI glitch', 'A user accidentally became the owner of the Parity library contract and called selfdestruct, freezing $150M+ in funds', 'A network outage', 'A gas issue'], correct: 1 },
      { question: 'What caused the Cream Finance exploit?', options: ['A phishing attack', 'A flash loan was used to manipulate token prices and drain lending pools through oracle manipulation', 'A password leak', 'A 51% attack'], correct: 1 },
      { question: 'What is a "rug pull"?', options: ['Removing a carpet', 'When project developers suddenly withdraw all liquidity or funds, leaving users with worthless tokens', 'A consensus mechanism', 'A valid exit strategy'], correct: 1 },

      // --- Advanced Security Patterns ---
      { question: 'What is a "proxy pattern" and what security risks does it introduce?', options: ['A proxy server', 'Separating logic from storage for upgradeability; risks include storage collision, uninitialized proxies, and centralized upgrade keys', 'A load balancer', 'A firewall'], correct: 1 },
      { question: 'What is "storage collision" in proxy contracts?', options: ['Hard drive crash', 'When the proxy and implementation contracts use the same storage slot for different variables, causing data corruption', 'Two files with the same name', 'A network conflict'], correct: 1 },
      { question: 'What is the "transparent proxy pattern"?', options: ['A see-through contract', 'A proxy pattern where admin calls go to the proxy logic and non-admin calls are delegated to the implementation', 'A debugging tool', 'A visualization tool'], correct: 1 },
      { question: 'What is a "UUPS" (Universal Upgradeable Proxy Standard)?', options: ['A file format', 'An upgrade pattern where the upgrade logic lives in the implementation contract rather than the proxy, reducing gas costs', 'A token standard', 'A consensus mechanism'], correct: 1 },
      { question: 'What is "gas griefing"?', options: ['Complaining about gas prices', 'An attack where a malicious contract intentionally consumes all forwarded gas in a sub-call, causing the parent transaction to fail', 'A mining technique', 'A gas optimization'], correct: 1 },
      { question: 'What is the "pull over push" payment pattern?', options: ['A type of door', 'Instead of sending ETH to recipients (push), let recipients withdraw their funds (pull), avoiding reentrancy and DoS risks', 'A code review method', 'A deployment strategy'], correct: 1 },
      { question: 'What is "function selector collision"?', options: ['Two functions colliding', 'When two different function signatures produce the same 4-byte selector hash, potentially causing the wrong function to execute', 'A naming conflict', 'A compilation error'], correct: 1 },
      { question: 'What is "immutable" in the context of smart contracts?', options: ['A data type', 'Once deployed, the contract code cannot be changed — bugs and all — which is why auditing and testing are critical', 'A keyword for constants', 'A design pattern'], correct: 1 },
      { question: 'What is a "time-based attack" on randomness?', options: ['An attack using time travel', 'Using block.timestamp as a source of randomness allows miners/validators to manipulate the outcome by adjusting the timestamp', 'A DDoS attack', 'A scheduling attack'], correct: 1 },
    ]
  }
];
