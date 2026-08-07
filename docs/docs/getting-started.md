---
sidebar_position: 2
title: Getting Started
---

# Getting Started

Set up the Road to DevCon 8 portal locally for development or to run your own workshop.

## Prerequisites

- **Node.js** 18+ ([download](https://nodejs.org))
- **npm** (comes with Node.js)
- **MetaMask** browser extension ([install](https://metamask.io))
- **Git** ([download](https://git-scm.com))
- **Vercel account** (free tier, for serverless API) — [vercel.com](https://vercel.com)

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/TeamGRYD/Road2DevCon.git
cd Road2DevCon
```

### 2. Install dependencies

```bash
# Frontend dependencies
npm install

# API (serverless) dependencies
cd api && npm install && cd ..
```

### 3. Configure environment

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your client-side values:

```env
VITE_CONTRACT_ADDRESS=<your-deployed-QuizScores-contract-address>
VITE_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
```

:::warning Server-Side Secrets
The following variables must be set in **Vercel Dashboard → Settings → Environment Variables** (NOT in `.env`):

| Variable | Description |
|----------|-------------|
| `ADMIN_PRIVATE_KEY` | Admin wallet private key (signs quiz scores) |
| `ADMIN_ADDRESS` | Admin wallet address (for verification) |
| `JWT_SECRET` | Random 32+ character string (for quiz sessions) |
| `RPC_URL` | Sepolia RPC URL (default: `https://ethereum-sepolia-rpc.publicnode.com`) |

These must **not** have the `VITE_` prefix to stay server-side.
:::

:::tip
If you don't have a deployed contract yet, the portal will still work for presentations, quests, and reading content. The contract + API are only needed for quiz score submission and the leaderboard.
:::

### 4. Start the development server

For local development with Vercel serverless functions:

```bash
npx vercel dev
```

Or for frontend-only development (without API):

```bash
npm run dev
```

The portal will be available at `http://localhost:5173/` (Vite) or `http://localhost:3000/` (Vercel dev).

## Project Structure

```
Road2DevCon/
├── index.html              # Entry point with nav, footer, meta tags
├── style.css               # Global styles and theme
├── package.json            # Frontend dependencies (Vite, Ethers.js)
├── vercel.json             # Vercel routing configuration
├── contracts/
│   └── QuizScores.sol      # On-chain quiz score tracking (with anti-cheat)
├── api/                    # Vercel Serverless Functions (server-side only)
│   ├── package.json        # API dependencies (ethers, jsonwebtoken)
│   ├── lib/
│   │   ├── jwt.js          # JWT session management
│   │   └── questions.js    # 400+ quiz questions with correct answers
│   └── quiz/
│       ├── start.js        # POST /api/quiz/start — serve random questions
│       ├── answer.js       # POST /api/quiz/answer — grade answers
│       └── complete.js     # POST /api/quiz/complete — sign score
├── src/
│   ├── main.js             # Page rendering and routing
│   ├── router.js           # Hash-based SPA router
│   ├── slides.js           # Presentation slide engine
│   ├── quiz.js             # Quiz engine (server-backed, 30s timer)
│   ├── leaderboard.js      # Multi-event on-chain leaderboard
│   ├── wallet.js           # MetaMask wallet + on-chain registration
│   ├── abi.js              # QuizScores contract ABI
│   ├── config/
│   │   └── events.js       # Event definitions (name + contract address)
│   └── data/
│       ├── presentations.js # All 5 presentation content
│       ├── quizQuestions.js  # Quiz metadata (NO correct answers)
│       └── workshopQuests.js # Quest step-by-step guides
├── public/
│   └── images/              # Logos, hero images, icons
└── docs/                    # This documentation site (Docusaurus)
```

## Deploying the Smart Contract

The `QuizScores.sol` contract needs to be deployed to **Sepolia testnet** with your admin wallet address.

### Admin Wallet Setup

1. Create a dedicated admin wallet (or use an existing one)
2. This wallet's **address** is passed as the constructor argument during deployment
3. This wallet's **private key** is stored in Vercel env vars (server-side only)
4. The admin wallet does NOT need Sepolia ETH — it only signs messages, not transactions

### Using Remix IDE

1. Open [remix.ethereum.org](https://remix.ethereum.org)
2. Create a new file called `QuizScores.sol`
3. Paste the contract code from `contracts/QuizScores.sol`
4. Compile with Solidity 0.8.19+
5. Deploy using "Injected Provider - MetaMask" (ensure Sepolia is selected)
6. Enter your **admin wallet address** as the constructor argument
7. Copy the deployed contract address into your `.env` file

See [Smart Contract Documentation](/smart-contract) for full details.

## Building for Production

```bash
npm run build
```

The production build will be in the `dist/` directory. Deploy to Vercel for full functionality (frontend + serverless API).

## Running the Documentation Site

The documentation you're reading now lives in the `docs/` directory:

```bash
cd docs
npm install
npm start
```

This starts the Docusaurus dev server at `http://localhost:3000/`.
