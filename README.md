<p align="center">
  <img src="public/images/roadtodevconindia-logo-multicoloured.png" alt="Road to DevCon India" height="80">
</p>

<h1 align="center">Road to DevCon 8: Workshops Edition</h1>

<p align="center">
  An interactive Web3 educational portal for Ethereum workshops, built for the <a href="https://devcon.org/en/road-to-devcon/">Road to DevCon India</a> campaign.
</p>

<p align="center">
  <a href="https://teamgryd.github.io/RoadToDevcon8/">📖 Documentation</a> •
  <a href="https://devcon.org">🎪 DevCon 8</a> •
  <a href="https://gryd.wtf">🔧 GRYD</a> •
  <a href="https://x.com/TeamGRYD">𝕏 @TeamGRYD</a>
</p>

---

## Overview

**Road to DevCon 8: Workshops Edition** is a full-stack Web3 educational platform designed to onboard engineering students into the Ethereum ecosystem. Built by [GRYD](https://gryd.wtf) as part of the Road to DevCon India campaign, this portal powers in-person workshops leading up to [DevCon 8 in Mumbai](https://devcon.org) (November 3-6, 2026).

The workshop covers Ethereum's core principles through the **CROPS** framework:

| Letter | Principle | Description |
|--------|-----------|-------------|
| **C** | Censorship Resistance | No entity can block valid transactions |
| **R** | Resistance to Capture | No small group can gain control |
| **O** | Open Source | All code is transparent and verifiable |
| **P** | Privacy | Users control what they share |
| **S** | Security | Code handles real value safely |

## Features

### 📊 Presentations
5 slide decks that can be presented directly from the portal, covering blockchain fundamentals through to DevCon 8 participation.

### 📝 Quizzes
Topic-based quizzes with automatically shuffled questions. Scores are stored on-chain via a Solidity smart contract on the Sepolia testnet. No immediate correct/incorrect feedback to prevent coordination.

### ⚔️ Workshop Quests
Two hands-on, guided tutorials where participants deploy real smart contracts:
1. **Message Board** — A censorship-resistant, open-source message board
2. **Private Voting** — A commit-reveal voting contract with security best practices

### 🏆 On-Chain Leaderboard
Live leaderboard powered by the `QuizScores.sol` smart contract. Reads participant scores directly from the blockchain.

### 🔗 Wallet Integration
MetaMask wallet connection for quiz score submission and leaderboard tracking on the Sepolia testnet.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Vanilla JavaScript, HTML, CSS |
| **Build Tool** | [Vite](https://vite.dev/) |
| **Blockchain** | [Ethers.js](https://docs.ethers.org/) v6 |
| **Smart Contract** | [Solidity](https://soliditylang.org/) ^0.8.19 |
| **Network** | Ethereum Sepolia Testnet |
| **Documentation** | [Docusaurus](https://docusaurus.io/) 3 |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [MetaMask](https://metamask.io/) browser extension
- [Git](https://git-scm.com/)

### Installation

```bash
# Clone the repository
git clone https://github.com/TeamGRYD/RoadToDevcon8.git
cd RoadToDevcon8

# Install dependencies
npm install

# Copy environment config
cp .env.example .env

# Start the development server
npm run dev
```

### Environment Configuration

Edit `.env` with your values:

```env
VITE_CONTRACT_ADDRESS=<deployed-QuizScores-contract-address>
VITE_CHAIN_ID=11155111
VITE_RPC_URL=https://rpc.sepolia.org
```

> **Note**: The portal works for presentations and quests without a deployed contract. The contract is only needed for quiz scoring and the leaderboard.

## Project Structure

```
RoadToDevcon8/
├── index.html                 # Entry point (nav, footer, meta)
├── style.css                  # Global styles and DevCon theme
├── package.json               # Dependencies (Vite, Ethers.js)
├── .env.example               # Environment template
│
├── contracts/
│   └── QuizScores.sol         # On-chain quiz score tracking
│
├── src/
│   ├── main.js                # Page rendering and routing
│   ├── router.js              # Hash-based SPA router
│   ├── slides.js              # Presentation slide engine
│   ├── quiz.js                # Quiz engine (shuffle + scoring)
│   ├── leaderboard.js         # On-chain leaderboard reader
│   ├── wallet.js              # MetaMask wallet integration
│   ├── abi.js                 # QuizScores contract ABI
│   └── data/
│       ├── presentations.js   # 5 presentation content sets
│       ├── quizQuestions.js   # Quiz questions per topic
│       └── workshopQuests.js  # Quest step-by-step guides
│
├── public/
│   └── images/                # Logos, hero images, icons
│
├── docs/                      # Docusaurus documentation site
│   ├── docusaurus.config.js
│   ├── docs/                  # Markdown documentation
│   └── static/                # Documentation assets
│
└── .github/
    └── workflows/
        └── deploy-docs.yml    # GitHub Pages deployment
```

## Smart Contract

The `QuizScores.sol` contract stores participant quiz scores on-chain:

- **Permissionless registration** — anyone with a wallet can participate
- **Highest-score-wins** — scores can only increase, never decrease
- **Batch reads** — efficient leaderboard queries with pagination
- **Event logging** — all submissions emit events for transparency

### Deploy to Sepolia

1. Open [remix.ethereum.org](https://remix.ethereum.org)
2. Create `QuizScores.sol` and paste the contract code
3. Compile with Solidity 0.8.19+
4. Deploy via "Injected Provider - MetaMask" (Sepolia network)
5. Copy the contract address to your `.env` file

See the [Smart Contract Documentation](https://teamgryd.github.io/RoadToDevcon8/smart-contract) for full API reference.

## Documentation

Comprehensive documentation is available at:

**[teamgryd.github.io/RoadToDevcon8](https://teamgryd.github.io/RoadToDevcon8/)**

Includes:
- Portal overview and setup guide
- Full presentation content with further reading
- Step-by-step quest walkthroughs
- Smart contract API reference
- Curated learning resources

### Running Docs Locally

```bash
cd docs
npm install
npm start
```

## Building for Production

```bash
npm run build
```

The production build is output to `dist/`, ready for deployment to Vercel, Netlify, or any static host.

## Contributing

Contributions are welcome! Areas where you can help:

- **Documentation**: Fix typos, improve explanations
- **Translations**: Help translate content for Indian languages
- **New Quests**: Design additional hands-on tutorials
- **UI/UX**: Improve the portal's design and accessibility
- **Bug Reports**: Open an issue if you find something broken

## License

This project is open source under the [Apache License 2.0](LICENSE).

## Credits

Built for **DevCon 8 Mumbai** 🇮🇳 with 💗 by [**GRYD**](https://x.com/TeamGRYD)

- [DevCon](https://devcon.org) — Ethereum Foundation's flagship conference
- [Ethereum Foundation](https://ethereum.foundation) — Supporting the Ethereum ecosystem
- [Road to DevCon](https://devcon.org/en/road-to-devcon/) — Community-led events leading to DevCon
