# Changelog

All notable changes to **Road to DevCon Quest Portal** are documented here.

This project follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [0.2.4] - 2026-08-08

### Added

#### Multi-Event Leaderboard (`src/config/events.js`, `src/leaderboard.js`, `style.css`)
- **New config file**: `src/config/events.js` — defines events with name, ID, and contract address; no env var changes needed for new events
- **Event selector dropdown**: Leaderboard page now shows a dropdown to switch between events, each loading its own on-chain data from a separate contract
- First event entry: *"Road to DevCon 8 — Workshop Edition ft. ATLAS SkillTech University"* (`0xb5456aDfa33BD3c94A6E021541d73Abc26A19138`)
- Leaderboard no longer reads `CONTRACT_ADDRESS` from env — it reads per-event contract addresses from config
- Styled event dropdown with glass aesthetic matching existing UI
- **Luma link button**: Each event shows a "Luma ↗" button next to the dropdown, linking to `https://luma.com/{id}` (event ID doubles as the Luma URL slug)

---

## [0.2.3] - 2026-08-05

### Fixed

#### Leaderboard RPC Reliability (`src/leaderboard.js`, `src/abi.js`)
- **Root cause**: Leaderboard failed with "Failed to fetch" because `https://rpc.sepolia.org` (hardcoded) was returning HTTP 404
- Replaced hardcoded RPC URL with configurable `SEPOLIA_RPC_URL` exported from `abi.js`
- Added `VITE_RPC_URL` env var (client-side) with reliable default: `https://ethereum-sepolia-rpc.publicnode.com`
- Updated `SEPOLIA_NETWORK.rpcUrls` to use the same configurable URL

#### Server-Side API RPC Fallback (`api/quiz/start.js`, `api/quiz/complete.js`)
- Updated fallback RPC URL from unreliable `rpc.sepolia.org` to `ethereum-sepolia-rpc.publicnode.com`

### Changed

#### Documentation & Config
- Updated `.env`, `.env.example`, `README.md`, `docs/getting-started.md`, `docs/smart-contract.md` to reference `VITE_RPC_URL` and the new default RPC endpoint
- Removed all references to the deprecated `rpc.sepolia.org`

---

## [0.2.2] - 2026-08-02

### Changed

#### Homepage Hero (`src/main.js`, `style.css`)
- Removed `🇮🇳 DevCon 8 · Mumbai · 3-6 November 2026` badge from hero section due to repeating info
- Centered Road to DevCon logo horizontally (`display: block` + `margin: 0 auto`)
- Added `ft.` connector text between "Workshops Edition" subtitle and CROPS letters

#### Quiz Page (`src/main.js`)
- Removed redundant meta/rules from all 4 quiz cards (10 Random Questions, Max 2,000 pts, ⏱️ 30s/question, 🚫 One attempt)
- Updated quiz subtitle: *"Test your understanding! 10 random questions, 30 seconds each, only 1 attempt per quiz. 4 of these quizzes are all it takes to determine your ranking in the on-chain leaderboard!"*

#### Branding & Favicon (`index.html`, `style.css`, `public/`)
- **New favicon**: Generated from `raw_favicon.svg` — created `favicon.svg` (5 KB) and `favicon.ico` (4 KB) with 16/32/64px sizes; updated both main site and Docusaurus docs
- **Header & footer logo**: Replaced `devcon8-logo.png` with `road2devcon-primary.png` (colorful circular logo); removed `brightness(0) invert(1)` CSS filter, added `border-radius: 50%`
- **Website preview image**: Changed OG/Twitter preview from `devcon-hero-3.jpg` to `devcon-hero-2.jpg`
- Added ICO favicon fallback `<link>` for browser compatibility
- Cleaned up `raw_favicon.svg` (3 MB) from repository

#### Navigation (`index.html`)
- Added **Wiki ↗** external link to header nav bar — opens `wiki.road2devcon.quest` in a new tab

---

## [0.2.1] - 2026-08-01

### Added

#### Documentation — Extended Learning Sections
- **`docs/docs/presentations/censorship-resistance.md`** — Cryptography basics, L2 scaling (rollups, sharding), finality/slashing, node types
- **`docs/docs/presentations/open-source.md`** — DAOs & governance, public goods funding (Gitcoin, RetroPGF), DeFi composability, gas/EIP-1559, Vyper & alternative languages
- **`docs/docs/presentations/privacy.md`** — MPC, stealth addresses, FHE, privacy coins (Monero/Zcash), DIDs/SBTs/SSI, GDPR/OFAC regulation, nullifiers, differential privacy
- **`docs/docs/presentations/security.md`** — MEV, proxy patterns (UUPS/transparent/diamond), formal verification & fuzzing, more case studies (Wormhole/Parity/Cream), rug pulls, gas griefing, function selector collisions

Each presentation doc now includes a **📖 Extended Learning** section clearly separated from the 25-minute presentation slides. These are designed for self-study so students can prepare for the quizzes, which draw from the entire page.

---

## [0.2.0] - 2026-08-01

### ⚠️ BREAKING CHANGES

This release completely replaces the quiz and scoring system with a secure, anti-cheat architecture. The smart contract and ABI has changed; a fresh contract deployment has been done.

---

### Added

#### Smart Contract — Anti-Cheat QuizScores.sol
- **On-chain registration**: `register(name, xUsername)` — students register from their own wallet; name and X username are permanent and paired to the wallet address
- **Unique X usernames**: Case-insensitive enforcement via `_toLower()` hashing; contract rejects duplicate usernames across wallets
- **ECDSA signature verification**: `submitScore()` requires a valid admin-signed authorization — prevents forged score transactions
- **One-attempt enforcement**: `hasAttempted[wallet][quizId]` mapping blocks retakes at the contract level (4 quizzes, 0–3)
- **Nonce replay protection**: Per-wallet nonce incremented on each submission, preventing signature reuse
- **`immutable admin`**: Admin address set at deployment, cannot be changed
- **Input validation**: Name ≤ 64 chars, X username ≤ 32 chars, score ≤ 2000, quizId < 4
- **`_recoverSigner()`**: Custom ECDSA recovery with `v` correction and zero-address check

#### Serverless API Backend (Vercel Functions)
- **`POST /api/quiz/start`** — Validates wallet registration + hasAttempted on-chain via RPC, selects 10 random questions from 100+ pool, shuffles options within each question, returns questions with NO correct answers, creates signed JWT session
- **`POST /api/quiz/answer`** — Grades individual answers server-side, enforces 30-second hard timer (with 1s network grace), returns updated JWT with no correct/wrong feedback
- **`POST /api/quiz/complete`** — Calculates final score, reads nonce from contract via RPC, signs `keccak256(wallet, quizId, score, nonce)` with admin private key, returns signature for on-chain submission
- **`api/lib/jwt.js`** — JWT session utilities using `jsonwebtoken` package
- **`api/lib/questions.js`** — Server-only question bank with **405 questions total** (105 + 100 + 100 + 100 across 4 quizzes), each with correct answer index
- **`api/package.json`** — Server dependencies: `ethers`, `jsonwebtoken`

#### Infrastructure
- **`vercel.json`** — API routing (`/api/*`), SPA fallback, `Cache-Control: no-store` for API responses
- **`.env.example`** — Documented separation of client-side (`VITE_CONTRACT_ADDRESS`) and server-side (`ADMIN_PRIVATE_KEY`, `ADMIN_ADDRESS`, `JWT_SECRET`, `RPC_URL`) environment variables

#### Documentation
- **`docs/docs/smart-contract.md`** — Complete rewrite: architecture diagram, security model, function reference table, deployment guide with admin wallet setup
- **`docs/docs/quizzes.md`** — Complete rewrite: anti-cheat flow diagram, scoring table, security summary, attack vector analysis
- **`docs/docs/getting-started.md`** — Updated prerequisites: Vercel account, `api/npm install`, server environment variable setup

#### Smart Contract — Updated License Header
- `SPDX-License-Identifier: Apache-2.0` added to match project license

---

### Changed

#### Frontend — Quiz Engine (`src/quiz.js`)
- Questions now fetched from `POST /api/quiz/start` instead of local `quizQuestions.js`
- Each quiz presents 10 randomly selected questions (from 100+ server-side pool)
- Answers submitted to `POST /api/quiz/answer` for server-side grading
- **30-second countdown timer** per question with auto-advance on expiry
- Score hidden until stored on-chain — shows "Submitting on-chain..." spinner until `tx.wait()` confirms
- Retake button **removed** — shows "🚫 This quiz cannot be retaken"
- Registration check on quiz start — redirects unregistered users
- Double-click prevention via `answerPending` flag
- Keyboard shortcuts (A/B/C/D, 1/2/3/4) for answer selection

#### Frontend — Wallet (`src/wallet.js`)
- Registration modal triggered immediately after wallet connect (not during quiz)
- Modal includes: name input (max 64 chars), X username input (max 32 chars, with `@` prefix display)
- Calls `contract.register()` from student's wallet — displays tx status and Etherscan link
- Error handling for: "Already registered", "X username already taken", user rejection
- Greets registered users by name after connection

#### Frontend — Quiz Metadata (`src/data/quizQuestions.js`)
- **Removed** all `questions` arrays and `correct` answer indices
- Now contains only metadata: `quizId`, `title`, `icon`, `description`, `questionCount`
- Zero quiz content in the frontend bundle

#### Frontend — ABI (`src/abi.js`)
- Updated to match new contract: `register()`, `submitScore()`, `hasAttempted()`, `nonces()`, `admin()`, all view functions, both events

#### Frontend — Main (`src/main.js`)
- Quiz cards display "10 Random Questions", "⏱️ 30s/question", "🚫 One attempt"
- Quiz modal container added to page layout

#### Documentation
- **`docs/docs/intro.md`** — Updated Portal Features section
- **`README.md`** — Added anti-cheat architecture, API directory, Vercel deployment, server-side env vars, project structure

---

### Security

| Attack Vector | Mitigation |
|---------------|------------|
| Manual tx encoding (fake scores) | ECDSA signature verification — only admin-signed scores accepted |
| Inspect browser bundle for answers | Zero answers in frontend — all grading server-side |
| Replay admin signature | Per-wallet nonce prevents reuse |
| Retake quiz for higher score | `hasAttempted` mapping rejects 2nd submission |
| Predict questions | 10 randomly selected from 100+, options shuffled within each question |
| Timer manipulation | Server-side 30s enforcement in `answer.js` |
| Share admin key | Key stored as Vercel server-side env var (no `VITE_` prefix) |
| Register duplicate X username | Case-insensitive hash comparison rejects duplicates |

---

### Removed
- Client-side answer grading logic
- Client-side question pool with correct answers
- "Retake Quiz" button
- `registerAndSubmitScore()` combined function (replaced with separate `register()` + `submitScore()`)
- Old QuizScores.sol contract (pre-registration, pre-signature)

---

## [0.1.0] - 2026-07-31

### Added

#### Presentations (5 Slide Decks)
- **Censorship Resistance & Resistance to Capture** — Blockchain fundamentals, intermediary risk, Ethereum's PoS, FOCIL, Tornado Cash case study
- **Open Source & Ethereum Ecosystem** — OSS principles, EIP/ERC process, Remix/Hardhat/Foundry/OpenZeppelin tooling, first contract tutorial
- **Privacy on Ethereum** — Transparency paradox, ZKPs (zk-SNARKs/zk-STARKs), ZK-Rollups, commit-reveal schemes, Semaphore
- **Security in Smart Contracts** — Reentrancy (DAO hack), Ronin bridge, CEI pattern, access control, slither/mythril/foundry fuzz, audit process
- **DevCon 8: What to Expect** — Conference overview, tracks, application process, Mumbai logistics
- In-browser slide engine (`src/slides.js`) with keyboard navigation and fullscreen

#### Workshop Quests
- **Quest 1: Deploy Your First Contract** — HelloDevcon.sol step-by-step using Remix + MetaMask on Sepolia
- **Quest 2: Commit-Reveal Voting** — SecretBallot.sol implementing the commit-reveal pattern with keccak256
- Guided tutorials with code snippets, deployment instructions, and verification steps

#### Quiz System (v0.1.0 — Client-Side)
- 4 topic-based quizzes corresponding to each presentation
- Client-side grading with shuffled questions
- Time-based scoring (faster = more points)
- Quiz modal with progress bar and option selection

#### Smart Contract — QuizScores.sol (v0.1.0)
- `Participant` struct: name, scores array
- Score submission via `submitScore()`
- View functions: `getParticipant()`, `getAllParticipants()`, `getParticipantCount()`, `getLeaderboardBatch()`
- Deployed on Ethereum Sepolia testnet

#### Leaderboard
- Live on-chain leaderboard reading from QuizScores contract via `getLeaderboardBatch()`
- Sortable by total score and per-quiz scores
- Batch-read for gas-efficient participant enumeration
- Auto-refresh on score submission

#### Wallet Integration
- MetaMask connection with Sepolia network auto-switch
- Account change and chain change event listeners
- Shortened address display in header

#### Documentation Site (Docusaurus)
- Full wiki at https://wiki.road2devcon.quest
- Pages: Intro, Getting Started, Presentations (4 topics), Quests (2 tutorials), Quizzes, Smart Contract, Resources
- Responsive and dark mode support

#### CI/CD
- **`.github/workflows/deploy-docs.yml`** — GitHub Actions workflow for automatic Docusaurus deployment

#### Infrastructure
- Vite build system with vanilla JS frontend
- Client-side SPA router (`src/router.js`)
- Responsive CSS with glassmorphism, gradients, and micro-animations
- ethers.js v6 for blockchain interaction

#### Licensing & Links
- **`LICENSE`** — Apache 2.0 license file
- **Footer links**: [GitHub](https://github.com/TeamGRYD/Road2DevCon) and [Wiki](https://wiki.road2devcon.quest)
