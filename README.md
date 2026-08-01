<p align="center">
  <img src="public/images/roadtodevconindia-logo-multicoloured.png" alt="Road to DevCon India" height="80">
</p>

<h1 align="center">Road to DevCon 8: Workshops Edition</h1>

<p align="center">
  An interactive Web3 educational portal for Ethereum workshops, built for the <a href="https://devcon.org/en/road-to-devcon/">Road to DevCon India</a> campaign.
</p>

<p align="center">
  <a href="https://wiki.road2devcon.quest">📖 Documentation</a> •
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

### 📝 Anti-Cheat Quizzes
Server-side quiz engine with 400+ questions (100+ per topic). Each student gets 10 random questions with a 30-second hard timer. Features:
- **Server-side grading** — correct answers never reach the browser
- **Admin-signed scores** — prevents manual transaction forging
- **One attempt only** — enforced on-chain per wallet per quiz
- **Unique X usernames** — one registration per identity
- **On-chain scoring** — scores stored on Sepolia testnet

### ⚔️ Workshop Quests
Two hands-on, guided tutorials where participants deploy real smart contracts:
1. **Message Board** — A censorship-resistant, open-source message board
2. **Private Voting** — A commit-reveal voting contract with security best practices

### 🏆 On-Chain Leaderboard
Live leaderboard powered by the `QuizScores.sol` smart contract. Reads participant scores directly from the blockchain.

### 🔗 Wallet Integration
MetaMask wallet connection with on-chain registration (name + X username permanently linked to wallet) and quiz score submission on Sepolia testnet.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Vanilla JavaScript, HTML, CSS |
| **Build Tool** | [Vite](https://vite.dev/) |
| **Blockchain** | [Ethers.js](https://docs.ethers.org/) v6 |
| **Smart Contract** | [Solidity](https://soliditylang.org/) ^0.8.19 |
| **Network** | Ethereum Sepolia Testnet |
| **Serverless API** | [Vercel Functions](https://vercel.com/docs/functions) |
| **Documentation** | [Docusaurus](https://docusaurus.io/) 3 |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [MetaMask](https://metamask.io/) browser extension
- [Git](https://git-scm.com/)
- [Vercel](https://vercel.com/) account (free tier)

### Installation

```bash
# Clone the repository
git clone https://github.com/TeamGRYD/Road2DevCon.git
cd Road2DevCon

# Install frontend dependencies
npm install

# Install API dependencies
cd api && npm install && cd ..

# Copy environment config
cp .env.example .env

# Start with Vercel (includes serverless API)
npx vercel dev
```

### Environment Configuration

**Client-side** (in `.env` file):

```env
VITE_CONTRACT_ADDRESS=<deployed-QuizScores-contract-address>
```

**Server-side** (in Vercel Dashboard → Settings → Environment Variables):

| Variable | Description |
|----------|-------------|
| `ADMIN_PRIVATE_KEY` | Admin wallet private key (signs quiz scores) |
| `ADMIN_ADDRESS` | Admin wallet address |
| `JWT_SECRET` | Random 32+ character string for session tokens |
| `RPC_URL` | Sepolia RPC URL (default: `https://rpc.sepolia.org`) |

> **⚠️ Security Note**: Server-side variables must NOT have the `VITE_` prefix. Never store private keys in `.env` files that are committed to version control.

> **Note**: The portal works for presentations and quests without a deployed contract. The contract + API are only needed for quiz scoring and the leaderboard.

## Project Structure

```
Road2DevCon/
├── index.html                 # Entry point (nav, footer, meta)
├── style.css                  # Global styles and DevCon theme
├── package.json               # Frontend dependencies (Vite, Ethers.js)
├── vercel.json                # Vercel routing configuration
├── .env.example               # Environment template
│
├── contracts/
│   └── QuizScores.sol         # On-chain quiz scores (anti-cheat)
│
├── api/                       # Vercel Serverless Functions
│   ├── package.json           # API dependencies (ethers, jsonwebtoken)
│   ├── lib/
│   │   ├── jwt.js             # JWT session management
│   │   └── questions.js       # 400+ questions with correct answers
│   └── quiz/
│       ├── start.js           # Serve random questions (no answers)
│       ├── answer.js          # Grade answers server-side
│       └── complete.js        # Sign score with admin key
│
├── src/
│   ├── main.js                # Page rendering and routing
│   ├── router.js              # Hash-based SPA router
│   ├── slides.js              # Presentation slide engine
│   ├── quiz.js                # Quiz engine (server-backed, 30s timer)
│   ├── leaderboard.js         # On-chain leaderboard reader
│   ├── wallet.js              # MetaMask wallet + registration
│   ├── abi.js                 # QuizScores contract ABI
│   └── data/
│       ├── presentations.js   # 5 presentation content sets
│       ├── quizQuestions.js   # Quiz metadata (NO correct answers)
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

The `QuizScores.sol` contract stores participant quiz scores on-chain with anti-cheat protections:

- **Separate registration** — name + X username permanently linked to wallet
- **Admin-signed scores** — ECDSA signature verification prevents score forging
- **One attempt per quiz** — `hasAttempted` mapping enforces single attempts
- **Unique X usernames** — case-insensitive uniqueness check
- **Nonce replay protection** — prevents signature replay attacks
- **Batch reads** — efficient leaderboard queries with pagination

### Deploy to Sepolia

1. Open [remix.ethereum.org](https://remix.ethereum.org)
2. Create `QuizScores.sol` and paste the contract code
3. Compile with Solidity 0.8.19+
4. Deploy via "Injected Provider - MetaMask" (Sepolia network)
5. Pass your **admin wallet address** as the constructor argument
6. Copy the contract address to your `.env` file

See the [Smart Contract Documentation](https://wiki.road2devcon.quest/smart-contract) for full API reference.

## Documentation

Comprehensive documentation is available at:

**[wiki.road2devcon.quest](https://wiki.road2devcon.quest)**

Includes:
- Portal overview and setup guide
- Full presentation content with further reading
- Step-by-step quest walkthroughs
- Smart contract API reference
- Anti-cheat quiz system architecture
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

The production build is output to `dist/`. Deploy to Vercel for full functionality (frontend + serverless API).

## Contributing

Contributions are welcome! Areas where you can help:

- **Documentation**: Fix typos, improve explanations
- **Translations**: Help translate content for Indian languages
- **New Quests**: Design additional hands-on tutorials
- **Quiz Questions**: Add more high-quality questions to the pool
- **UI/UX**: Improve the portal's design and accessibility
- **Bug Reports**: Open an issue if you find something broken

## License

This project is open source under the [Apache License 2.0](LICENSE).

## Credits

Built for **DevCon 8 Mumbai** 🇮🇳 with 💗 by [**GRYD**](https://x.com/TeamGRYD)

- [DevCon](https://devcon.org) — Ethereum Foundation's flagship conference
- [Ethereum Foundation](https://ethereum.foundation) — Supporting the Ethereum ecosystem
- [Road to DevCon](https://devcon.org/en/road-to-devcon/) — Community-led events leading to DevCon
