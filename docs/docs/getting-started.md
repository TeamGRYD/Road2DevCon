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

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/TeamGRYD/RoadToDevcon8.git
cd RoadToDevcon8
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

Copy the example environment file and fill in your values:

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_CONTRACT_ADDRESS=<your-deployed-QuizScores-contract-address>
VITE_CHAIN_ID=11155111
VITE_RPC_URL=https://rpc.sepolia.org
```

:::tip
If you don't have a deployed contract yet, the portal will still work for presentations, quests, and reading content. The contract is only needed for quiz score submission and the leaderboard.
:::

### 4. Start the development server

```bash
npm run dev
```

The portal will be available at `http://localhost:5173/`.

## Project Structure

```
RoadToDevcon8/
├── index.html              # Entry point with nav, footer, meta tags
├── style.css               # Global styles and theme
├── package.json            # Dependencies (Vite, Ethers.js)
├── contracts/
│   └── QuizScores.sol      # On-chain quiz score tracking
├── src/
│   ├── main.js             # Page rendering and routing
│   ├── router.js            # Hash-based SPA router
│   ├── slides.js            # Presentation slide engine
│   ├── quiz.js              # Quiz engine with shuffle + scoring
│   ├── leaderboard.js       # On-chain leaderboard reader
│   ├── wallet.js            # MetaMask wallet integration
│   ├── abi.js               # QuizScores contract ABI
│   └── data/
│       ├── presentations.js # All 5 presentation content
│       ├── quizQuestions.js  # Quiz questions per topic
│       └── workshopQuests.js # Quest step-by-step guides
├── public/
│   └── images/              # Logos, hero images, icons
└── docs/                    # This documentation site (Docusaurus)
```

## Deploying the Smart Contract

The `QuizScores.sol` contract needs to be deployed to **Sepolia testnet** for quiz scores and the leaderboard to work.

### Using Remix IDE

1. Open [remix.ethereum.org](https://remix.ethereum.org)
2. Create a new file called `QuizScores.sol`
3. Paste the contract code from `contracts/QuizScores.sol`
4. Compile with Solidity 0.8.19+
5. Deploy using "Injected Provider - MetaMask" (ensure Sepolia is selected)
6. Copy the deployed contract address into your `.env` file

See [Smart Contract Documentation](/smart-contract) for full details.

## Building for Production

```bash
npm run build
```

The production build will be in the `dist/` directory, ready for deployment to Vercel, Netlify, or any static host.

## Running the Documentation Site

The documentation you're reading now lives in the `docs/` directory:

```bash
cd docs
npm install
npm start
```

This starts the Docusaurus dev server at `http://localhost:3000/RoadToDevcon8/`.
