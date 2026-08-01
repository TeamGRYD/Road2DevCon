export const quizQuestions = [
  // ============================================================
  // QUIZ 0: Censorship Resistance & Resistance to Capture
  // ============================================================
  {
    quizId: 0,
    title: 'Censorship Resistance & Resistance to Capture',
    icon: '🛡️',
    questions: [
      {
        question: 'What is the core problem that blockchain technology aims to solve?',
        options: [
          'Making computers faster',
          'Eliminating the need for trusted third parties',
          'Replacing all traditional currencies',
          'Creating digital art'
        ],
        correct: 1,
        explanation: 'Blockchain eliminates the need for trusted intermediaries (banks, platforms, governments) by creating a system where trust is established through mathematics and consensus instead.'
      },
      {
        question: 'What consensus mechanism does Ethereum currently use?',
        options: [
          'Proof-of-Work (mining)',
          'Delegated Proof-of-Stake',
          'Proof-of-Stake (validators)',
          'Proof-of-Authority'
        ],
        correct: 2,
        explanation: 'Since "The Merge" in September 2022, Ethereum uses Proof-of-Stake where validators stake 32 ETH as collateral instead of mining. This uses 99.95% less energy than PoW.'
      },
      {
        question: 'What does "censorship resistance" mean in blockchain context?',
        options: [
          'The ability to censor inappropriate content',
          'No single entity can block a valid transaction from being processed',
          'The blockchain can\'t store censored information',
          'Only governments can censor transactions'
        ],
        correct: 1,
        explanation: 'Censorship resistance means that no single entity - not a government, corporation, or developer - can prevent a valid transaction from being included in the blockchain.'
      },
      {
        question: 'What happened with Tornado Cash in 2022 that demonstrated censorship resistance?',
        options: [
          'The smart contract was deleted from Ethereum',
          'The US Treasury sanctioned it, but the smart contract kept running on-chain',
          'All Tornado Cash transactions were reversed',
          'The Ethereum Foundation shut it down'
        ],
        correct: 1,
        explanation: 'Despite OFAC sanctions, the Tornado Cash smart contract continued to function on Ethereum because deployed code cannot be turned off. This demonstrated both the power and controversy of censorship resistance.'
      },
      {
        question: 'Why is a blockchain considered "immutable"?',
        options: [
          'Because the database is stored on one very secure server',
          'Because it uses a special programming language',
          'Because each block is cryptographically linked to the previous one, making retroactive changes computationally impossible',
          'Because government regulations prevent changes'
        ],
        correct: 2,
        explanation: 'Each block contains a cryptographic hash of the previous block, forming a chain. Changing any historical data would require re-computing every subsequent block across the majority of the network.'
      },
      {
        question: 'What is "Resistance to Capture" in the Ethereum context?',
        options: [
          'The blockchain is resistant to computer viruses',
          'No single group can gain disproportionate control over the protocol',
          'Ethereum cannot be copied or forked',
          'The network is resistant to power outages'
        ],
        correct: 1,
        explanation: 'Resistance to capture means Ethereum is designed so no single entity - company, government, or individual - can take over the protocol. This is achieved through decentralized governance, client diversity, and community consensus.'
      },
      {
        question: 'How many validators does Ethereum approximately have?',
        options: [
          'About 50',
          'About 5,000',
          'Over 900,000',
          'Over 10 million'
        ],
        correct: 2,
        explanation: 'Ethereum has over 900,000 validators worldwide. This massive distributed network makes coordinated censorship practically impossible.'
      },
      {
        question: 'What is a smart contract?',
        options: [
          'A legal document stored digitally',
          'Code that runs on the blockchain and executes automatically as written',
          'An agreement between two cryptocurrency exchanges',
          'A special type of digital signature'
        ],
        correct: 1,
        explanation: 'A smart contract is code deployed on the blockchain that executes automatically and exactly as written. Once deployed, no one can change it, pause it, or shut it down.'
      },
      {
        question: 'What is FOCIL in the context of Ethereum censorship resistance?',
        options: [
          'A type of cryptocurrency wallet',
          'Fork Choice-enforced Inclusion Lists - protocol mechanisms to guarantee transaction inclusion',
          'A decentralized exchange protocol',
          'An Ethereum testing framework'
        ],
        correct: 1,
        explanation: 'FOCIL (Fork Choice-enforced Inclusion Lists) is an ongoing protocol research initiative to ensure that even if some validators try to censor transactions, the protocol guarantees those transactions get included within a bounded number of blocks.'
      },
      {
        question: 'What makes Ethereum different from Bitcoin?',
        options: [
          'Ethereum is faster and Bitcoin is more secure',
          'Bitcoin is only for money transfers; Ethereum adds programmable logic (smart contracts)',
          'They are the same technology with different names',
          'Ethereum is controlled by a company, Bitcoin is not'
        ],
        correct: 1,
        explanation: 'While Bitcoin proved you could send money without a bank, Ethereum added programmable smart contracts - making it a "world computer" that can run any logic, not just handle payments.'
      }
    ]
  },

  // ============================================================
  // QUIZ 1: Open Source & Ethereum Ecosystem
  // ============================================================
  {
    quizId: 1,
    title: 'Open Source & the Ethereum Ecosystem',
    icon: '🌐',
    questions: [
      {
        question: 'What is an Ethereum Improvement Proposal (EIP)?',
        options: [
          'A request to the Ethereum Foundation for funding',
          'A formal design document for proposing changes to the Ethereum protocol',
          'A bug report filed on GitHub',
          'A type of smart contract template'
        ],
        correct: 1,
        explanation: 'An EIP is a standardized design document used to propose new features, protocol improvements, or application standards for Ethereum. Anyone in the community can write and submit one.'
      },
      {
        question: 'What does ERC-20 define?',
        options: [
          'The standard for non-fungible tokens (NFTs)',
          'The Ethereum mining algorithm',
          'The standard for fungible tokens on Ethereum',
          'The gas fee calculation formula'
        ],
        correct: 2,
        explanation: 'ERC-20 is the standard interface for fungible tokens. Every "token" on Ethereum (USDT, LINK, UNI, etc.) follows this standard, ensuring they all work the same way with wallets and exchanges.'
      },
      {
        question: 'Which Ethereum development tool is browser-based and requires NO installation?',
        options: [
          'Hardhat',
          'Foundry',
          'Remix IDE',
          'Truffle'
        ],
        correct: 2,
        explanation: 'Remix IDE (remix.ethereum.org) is a complete smart contract development environment that runs entirely in your browser. You can write, compile, test, and deploy contracts with zero setup.'
      },
      {
        question: 'What is OpenZeppelin?',
        options: [
          'A cryptocurrency exchange',
          'A blockchain network competing with Ethereum',
          'An open-source library of audited, reusable smart contract components',
          'A programming language for smart contracts'
        ],
        correct: 2,
        explanation: 'OpenZeppelin provides battle-tested, professionally audited smart contract libraries. Think of it like importing numpy or express - but for security-critical blockchain code. It includes implementations of ERC-20, ERC-721, access control, and more.'
      },
      {
        question: 'What is Solidity most similar to in terms of syntax?',
        options: [
          'Python and Ruby',
          'JavaScript and C++',
          'Haskell and Lisp',
          'Assembly and Fortran'
        ],
        correct: 1,
        explanation: 'Solidity uses syntax inspired by JavaScript and C++. If you know either language, you\'ll find Solidity relatively easy to pick up. It\'s statically typed and supports features like inheritance and libraries.'
      },
      {
        question: 'What does "verified" mean when a contract is verified on Etherscan?',
        options: [
          'The contract has been approved by the Ethereum Foundation',
          'The contract is guaranteed to be bug-free',
          'The published source code matches the deployed bytecode - anyone can read it',
          'The contract owner\'s identity has been verified'
        ],
        correct: 2,
        explanation: 'A verified contract on Etherscan means the human-readable source code has been published and confirmed to match the compiled bytecode deployed on-chain. This lets anyone inspect exactly what the code does.'
      },
      {
        question: 'What standard defines NFTs (Non-Fungible Tokens) on Ethereum?',
        options: [
          'ERC-20',
          'ERC-721',
          'EIP-1559',
          'ERC-1155'
        ],
        correct: 1,
        explanation: 'ERC-721 is the standard for non-fungible tokens - unique digital assets where each token is distinct. ERC-1155 is a newer multi-token standard, but ERC-721 is the original and most widely used NFT standard.'
      },
      {
        question: 'How does Ethereum decide which protocol changes to adopt?',
        options: [
          'The Ethereum Foundation CEO decides',
          'Token holders vote using their ETH',
          'Rough consensus among the community through public debate and the EIP process',
          'A fixed committee of 10 developers votes'
        ],
        correct: 2,
        explanation: 'Ethereum uses "rough consensus" - no formal voting mechanism. Changes are proposed via EIPs, publicly debated on forums and GitHub, reviewed by core developers, and implemented only when there\'s broad agreement.'
      },
      {
        question: 'What was EIP-1559 and why was it significant?',
        options: [
          'It introduced proof-of-stake to Ethereum',
          'It changed Ethereum\'s fee structure, introducing a base fee that gets burned (destroyed)',
          'It created the ERC-20 token standard',
          'It increased the block size limit'
        ],
        correct: 1,
        explanation: 'EIP-1559 (London upgrade, 2021) reformed Ethereum\'s transaction fee mechanism. It introduced a base fee that is burned (permanently destroyed), making ETH deflationary in some conditions and making gas prices more predictable.'
      },
      {
        question: 'Which of these is the BEST way for a student to start contributing to Ethereum?',
        options: [
          'Buy large amounts of ETH',
          'Wait until you have 10 years of experience',
          'Fix documentation, translate ethereum.org, report bugs, join hackathons',
          'Get a master\'s degree in cryptography first'
        ],
        correct: 2,
        explanation: 'You don\'t need to be an expert to contribute! Documentation fixes, translations (ethereum.org supports 50+ languages), bug reports, and hackathons (ETHIndia, ETHGlobal) are all accessible starting points.'
      }
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
      {
        question: 'What is a Zero-Knowledge Proof?',
        options: [
          'A proof that you own zero cryptocurrency',
          'A way to prove a statement is true without revealing the underlying data',
          'A blockchain with no transaction history',
          'An encryption method that uses no keys'
        ],
        correct: 1,
        explanation: 'A Zero-Knowledge Proof lets you prove something is true (e.g., "I am over 18") without revealing any other information (e.g., your exact birthday or address). The verifier learns only "true" or "false."'
      },
      {
        question: 'What is the difference between pseudonymity and privacy?',
        options: [
          'They mean the same thing',
          'Pseudonymity uses a consistent alias; privacy means specific details are hidden from view',
          'Privacy is illegal, pseudonymity is legal',
          'Pseudonymity is stronger than privacy'
        ],
        correct: 1,
        explanation: 'Pseudonymity means using a consistent alias (like a wallet address) that isn\'t directly your name. Privacy means hiding specific transaction details. A pseudonym can still be linked to your identity through analysis, so pseudonymity ≠ privacy.'
      },
      {
        question: 'What is a ZK-Rollup?',
        options: [
          'A way to compress blockchain data by deleting old transactions',
          'A Layer 2 solution that batches transactions off-chain and submits a validity proof to Ethereum',
          'A type of encryption used in smart contracts',
          'A method to merge two blockchains together'
        ],
        correct: 1,
        explanation: 'ZK-Rollups process thousands of transactions off-chain, generate a tiny mathematical proof that all transactions are valid, and submit just that proof to Ethereum. This makes transactions 10-100x cheaper while maintaining Ethereum\'s security.'
      },
      {
        question: 'What is a "commit-reveal" scheme?',
        options: [
          'A way to make blockchain transactions faster',
          'A two-step process: first submit a hash of your data (commit), then reveal the actual data later',
          'A method to commit code changes to GitHub and reveal them to auditors',
          'A type of cryptocurrency wallet'
        ],
        correct: 1,
        explanation: 'Commit-reveal is a privacy technique where you first submit a hash of your data (the "commit" - hiding the actual data), then later reveal the original data so others can verify the hash matches. This prevents others from seeing your choice until everyone has committed.'
      },
      {
        question: 'Why is blockchain transparency a privacy problem?',
        options: [
          'It isn\'t - transparency is always good',
          'Because every transaction is public, analytics firms can link wallet addresses to real identities',
          'Because transparent systems are easier to hack',
          'Because transparency makes transactions slower'
        ],
        correct: 1,
        explanation: 'On public blockchains, every transaction is visible. Blockchain analytics firms (like Chainalysis) specialize in linking wallet addresses to real identities, especially when addresses interact with KYC-compliant exchanges.'
      },
      {
        question: 'What are zk-SNARKs?',
        options: [
          'A type of smart contract vulnerability',
          'Succinct Non-interactive Arguments of Knowledge - a type of zero-knowledge proof',
          'A consensus mechanism used by privacy-focused blockchains',
          'A programming language for writing private smart contracts'
        ],
        correct: 1,
        explanation: 'zk-SNARKs (Succinct Non-interactive Arguments of Knowledge) are a specific type of ZKP with small proof sizes and fast verification. They require a "trusted setup" ceremony. They\'re used in many ZK-Rollups and privacy protocols.'
      },
      {
        question: 'Which Indian Supreme Court judgment affirmed privacy as a fundamental right?',
        options: [
          'Kesavananda Bharati case',
          'Puttaswamy judgment (2017)',
          'Maneka Gandhi case',
          'Vishaka case'
        ],
        correct: 1,
        explanation: 'The Justice K.S. Puttaswamy (Retd.) vs Union of India judgment (2017) established that the right to privacy is a fundamental right under Article 21 of the Indian Constitution, including informational privacy and data protection.'
      },
      {
        question: 'What does "the Prover" do in a Zero-Knowledge Proof system?',
        options: [
          'Verifies that a blockchain transaction is valid',
          'Generates a mathematical proof that a statement is true without revealing the secret data',
          'Mines new blocks on the blockchain',
          'Audits smart contracts for vulnerabilities'
        ],
        correct: 1,
        explanation: 'The Prover holds the secret data and creates a mathematical proof demonstrating that their statement is true. The proof is designed so the Verifier can check it without learning anything about the underlying secret data.'
      },
      {
        question: 'Which of these is a live ZK-Rollup on Ethereum?',
        options: [
          'Bitcoin Lightning Network',
          'zkSync Era / Scroll / Polygon zkEVM',
          'Solana',
          'Binance Smart Chain'
        ],
        correct: 1,
        explanation: 'zkSync Era, Scroll, Polygon zkEVM, StarkNet, and Linea are all live ZK-Rollup Layer 2 solutions on Ethereum. They process transactions off-chain and submit validity proofs to Ethereum mainnet.'
      },
      {
        question: 'How does privacy differ from secrecy?',
        options: [
          'They are the same thing',
          'Privacy is about controlling what you share; secrecy is about hiding everything from everyone',
          'Secrecy is legal; privacy is illegal',
          'Privacy applies to individuals; secrecy applies to governments'
        ],
        correct: 1,
        explanation: 'Privacy is about choosing what to share - a system can be auditable (rules can be verified) while being private (individual details hidden). Secrecy means hiding everything from everyone. ZK proofs enable auditable privacy, not secrecy.'
      }
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
      {
        question: 'What vulnerability caused the DAO Hack in 2016?',
        options: [
          'Integer overflow',
          'Reentrancy - the contract sent ETH before updating the sender\'s balance',
          'Access control failure',
          'Front-running attack'
        ],
        correct: 1,
        explanation: 'The DAO hack exploited a reentrancy vulnerability: the withdraw function sent ETH to the caller before updating their balance. The attacker\'s contract re-called withdraw repeatedly before the balance was set to zero.'
      },
      {
        question: 'What is the Checks-Effects-Interactions pattern?',
        options: [
          'A way to optimize gas costs in smart contracts',
          'A security pattern: validate inputs (Checks), update state (Effects), THEN make external calls (Interactions)',
          'A testing methodology for smart contracts',
          'A design pattern for user interfaces in dApps'
        ],
        correct: 1,
        explanation: 'Checks-Effects-Interactions is the primary defense against reentrancy: first validate conditions (Checks), then update contract state (Effects), and only then interact with external contracts (Interactions). This ensures state is correct before any external call.'
      },
      {
        question: 'What does Slither do?',
        options: [
          'It\'s a programming language for blockchain',
          'It\'s a static analysis tool that automatically detects common smart contract vulnerabilities',
          'It\'s a cryptocurrency exchange',
          'It\'s a blockchain consensus algorithm'
        ],
        correct: 1,
        explanation: 'Slither (by Trail of Bits) is a static analysis framework for Solidity. It runs on your code in seconds and automatically detects vulnerabilities like reentrancy, unused variables, and access control issues without executing the code.'
      },
      {
        question: 'Why are smart contracts harder to patch than traditional software?',
        options: [
          'They use a different programming language',
          'They are slower to compile',
          'Once deployed, the code is immutable - it cannot be changed or updated',
          'They require government approval for updates'
        ],
        correct: 2,
        explanation: 'Smart contracts are immutable once deployed to the blockchain. There\'s no "hotfix" or "patch Tuesday." If there\'s a bug, the code is permanent. This is why thorough testing and auditing before deployment is critical.'
      },
      {
        question: 'What is front-running in the context of blockchain?',
        options: [
          'Being the first person to deploy a smart contract',
          'An attacker seeing your pending transaction and submitting theirs first with higher gas to profit',
          'Running a blockchain node ahead of others',
          'The process of validating transactions before they\'re confirmed'
        ],
        correct: 1,
        explanation: 'Front-running occurs when someone sees your pending transaction in the mempool (the waiting area for unconfirmed transactions), understands what it will do, and submits their own transaction with higher gas to execute first and profit at your expense.'
      },
      {
        question: 'What was the key lesson from the Ronin Bridge Hack ($625M)?',
        options: [
          'Solidity is an insecure language',
          'Bridges between blockchains are always unsafe',
          'Centralization is a security risk - when 5/9 keys are controlled by related entities, the multi-sig is effectively compromised',
          'Proof-of-Stake is less secure than Proof-of-Work'
        ],
        correct: 2,
        explanation: 'The Ronin hack showed that a 5-of-9 multi-sig is only as decentralized as the key holders. When 4 keys belonged to one company and 1 more was easily compromised, the "decentralized" security was an illusion.'
      },
      {
        question: 'What does OpenZeppelin\'s ReentrancyGuard do?',
        options: [
          'Prevents smart contracts from being deployed',
          'Adds a lock that prevents a function from being called again while it\'s still executing',
          'Encrypts all smart contract data',
          'Limits the amount of gas a transaction can use'
        ],
        correct: 1,
        explanation: 'ReentrancyGuard uses a mutex (mutual exclusion) lock. When a function with the `nonReentrant` modifier is called, it sets a flag. If the function is called again before the first execution finishes (reentrancy attempt), it reverts.'
      },
      {
        question: 'What is the "Pull over Push" pattern?',
        options: [
          'Users pull data from the blockchain instead of having it pushed to them',
          'Instead of sending funds to users (push), let them withdraw (pull) - preventing reentrancy and failed transfers',
          'A git workflow for smart contract development',
          'A method for pulling smart contracts from one network to another'
        ],
        correct: 1,
        explanation: '"Pull over Push" means instead of the contract automatically sending ETH to users (which can fail or be exploited), users call a withdraw function to pull their funds. This prevents reentrancy and handles failed transfers gracefully.'
      },
      {
        question: 'What is Immunefi?',
        options: [
          'An antivirus for blockchain nodes',
          'A cryptocurrency insurance protocol',
          'The largest bug bounty platform in web3, paying ethical hackers to find vulnerabilities',
          'A layer 2 scaling solution'
        ],
        correct: 2,
        explanation: 'Immunefi is the largest bug bounty platform in web3, having paid over $100 million to ethical hackers ("white hats") who discover and responsibly disclose vulnerabilities in smart contracts and protocols.'
      },
      {
        question: 'Which Solidity version introduced built-in integer overflow/underflow protection?',
        options: [
          'Solidity 0.4.0',
          'Solidity 0.6.0',
          'Solidity 0.8.0',
          'Solidity 1.0.0'
        ],
        correct: 2,
        explanation: 'Starting from Solidity 0.8.0, arithmetic operations automatically revert on overflow and underflow. Before 0.8.0, developers needed to use SafeMath library from OpenZeppelin to prevent these vulnerabilities.'
      }
    ]
  }
];
