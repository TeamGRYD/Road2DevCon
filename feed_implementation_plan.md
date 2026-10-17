# Feed Tab + Profile Registry — Implementation Plan

## Design Decisions Summary

| Decision | Choice |
|---|---|
| Network | Ethereum Sepolia (existing) |
| Profiles | New `ProfileRegistry.sol`, the single source of truth for name + X handle |
| Legacy profiles | Migrated on-chain from the 3 existing QuizScores contracts into the registry |
| Future quizzes | New `QuizScoresV2.sol`: stores scores only, reads profiles from the registry |
| Legacy leaderboards | Unchanged. `legacy: true` in `events.js` keeps the current read path |
| Feed contract | New `FeedContract.sol`: submissions + votes, gated on the registry |
| Who can submit / vote | Registered profiles only. No voting on your own submission |
| Vote model | 1 vote per user per submission: +1, −1, or 0 (clear) |
| Media types | X/Twitter, YouTube, Instagram, embedded without API keys |
| Stored media reference | `(platform, mediaId)` in canonical form, not the raw URL |
| Sort order | One global **Top** / **New** toggle at the top of the feed |
| Data reads | Paginated view functions (no `queryFilter` / `getLogs`) |
| Moderation | Owner-only `setHidden(id, bool)` on FeedContract |
| Topic config | `src/config/topics.js`, PR-driven, append-only IDs |
| Tab position | **Feed before Presentations** |
| Deployment | Remix (no Hardhat, matching the existing workflow) |

---

## Phase 1 — `ProfileRegistry.sol`

### Storage

```solidity
struct Profile {
    string name;       // ≤ 64 bytes
    string xUsername;  // ≤ 32 bytes, unique (case-insensitive)
    bool   registered;
}

address public owner;                          // used only for migration
bool    public migrationFinalized;
mapping(address => Profile) private profiles;
mapping(bytes32 => address) public xUsernameTaken;   // keccak(lower(x)) => wallet
address[] private profileAddresses;
```

### Functions

| Function | Description |
|---|---|
| `register(string name, string xUsername)` | Same rules as today's `QuizScores.register`. Requires `migrationFinalized`, so a new user can't claim a legacy user's X handle before it is migrated |
| `isRegistered(address)` | View |
| `getProfile(address)` → `(name, xUsername)` | View; reverts if not registered |
| `getProfilesBatch(address[] wallets)` → `(names[], xUsernames[], registered[])` | View; used by the leaderboard and feed to resolve many wallets at once |
| `getProfileCount()` / `getProfilesPage(start, count)` | View; enumeration |
| `migrateFrom(address legacy, uint256 start, uint256 count)` | `onlyOwner`, only before finalize. Reads `legacy.getLeaderboardBatch(start, count)` **on-chain** and writes each profile. Skips (and emits `MigrationSkipped`) when the wallet is already registered or the X handle is held by another wallet |
| `finalizeMigration()` | `onlyOwner`, one-way. Turns migration off and registration on. After this the owner has no special power |

Profile data is read from the legacy contracts on-chain, so nobody (including the owner) can inject fake names. The owner only controls the **order** and **timing** of the migration.

### Events

```solidity
event ProfileRegistered(address indexed wallet, string name, string xUsername);
event ProfileMigrated(address indexed wallet, address indexed legacySource);
event MigrationSkipped(address indexed wallet, address indexed legacySource, uint8 reason); // 1 = wallet exists, 2 = X handle taken
event MigrationFinalized();
```

### Migration rules

- **Migrate newest event first** (Hacktoberfest → DBIT → ATLAS). The first write wins, so a wallet registered at several events keeps its most recent name, and the most recent claimant gets a contested X handle.
- Legacy contracts only enforced X-handle uniqueness *per contract*, so cross-event clashes are possible. Skipped wallets still show normally on their legacy leaderboard. For the feed and future quizzes they register again with a different handle.
- **Run the migration only after the last legacy event (Hacktoberfest, `rtta1cub`) has closed registrations.** Anyone who registers on a legacy contract after migration won't be carried over. `migrateFrom` can be re-run with a later `start` offset at any point before `finalizeMigration()`.
- Batch size: ~30–50 profiles per tx (string storage is gas-heavy). Check `MigrationSkipped` events on Etherscan before finalizing.

---

## Phase 2 — `QuizScoresV2.sol` (future events)

Same as `QuizScores.sol` minus profile storage.

| Change vs. v1 | Detail |
|---|---|
| Constructor | `constructor(address _admin, address _profileRegistry)` |
| Profiles | `register` and the `Participant.name/xUsername` fields removed |
| `submitScore` | `require(registry.isRegistered(msg.sender))`; otherwise identical (nonce, one attempt per quiz) |
| `isRegistered(address)` | Kept as a **pass-through** to the registry so `api/quiz/start.js` works unchanged |
| Participant list | A wallet is added to `participantAddresses` on its **first** score submission (no "join event" tx) |
| `getLeaderboardBatch(start, count)` | Returns `(wallets[], scores[])`. The frontend resolves names via `registry.getProfilesBatch` |
| Signature hash | `keccak256(abi.encodePacked(address(this), block.chainid, wallet, quizId, score, nonce))` |

**Why the hash change:** today's signed message has no contract address in it. Every event contract starts nonces at 0, so a signature issued for one event can be replayed on another. Binding the hash to `address(this)` + `chainid` closes that. Legacy contracts keep the old format, and they never receive new signatures because quizzes only run against the active contract.

---

## Phase 3 — `FeedContract.sol`

### Data structures

```solidity
enum Platform { X, YouTube, Instagram }   // append-only

struct Submission {
    uint256  id;
    uint8    topicId;
    Platform platform;
    string   mediaId;     // tweet ID | 11-char YouTube ID | Instagram shortcode (≤ 32 bytes)
    address  submitter;
    uint64   timestamp;
    uint32   upvotes;
    uint32   downvotes;
    bool     hidden;
}

IProfileRegistry public immutable registry;
address public owner;                                            // moderation only

mapping(uint256 => Submission) public submissions;               // id starts at 1
uint256 public submissionCount;
mapping(uint8 => uint256[]) private topicSubmissions;            // topicId => ids
mapping(uint8 => mapping(bytes32 => bool)) public mediaSubmitted; // topicId => keccak(platform, mediaId) => taken
mapping(uint256 => mapping(address => int8)) public userVotes;   // -1 | 0 | 1
```

Net votes (`upvotes − downvotes`) are computed on the client for "Top" sorting. No cached score field. These are **feed votes**, completely separate from quiz scores in QuizScores/V2.

### Functions

| Function | Description |
|---|---|
| `submit(uint8 topicId, Platform platform, string mediaId)` | Requires a registered profile, non-empty `mediaId` ≤ 32 bytes, and no prior submission of the same media in that topic |
| `vote(uint256 id, int8 value)` | `value ∈ {-1, 0, 1}`. Requires a registered profile, an existing non-hidden submission, and `msg.sender != submitter`. Undoes the previous vote, then applies the new one |
| `getTopicCount(uint8 topicId)` | View |
| `getTopicBatch(uint8 topicId, uint256 start, uint256 count)` | View; returns a `Submission[]` page (mirrors `getLeaderboardBatch`) |
| `getUserVotes(address user, uint256[] ids)` | View; batch-read the viewer's votes to highlight ▲/▼ |
| `setHidden(uint256 id, bool hidden)` | `onlyOwner`; moderation |
| `transferOwnership(address)` | `onlyOwner` |

### Events

```solidity
event Submitted(uint256 indexed id, uint8 indexed topicId, address indexed submitter, Platform platform, string mediaId);
event Voted(uint256 indexed id, address indexed voter, int8 value, uint32 upvotes, uint32 downvotes);
event HiddenSet(uint256 indexed id, bool hidden);
```

The events are for Etherscan visibility only. The frontend reads through view functions.

### Topic validity

The contract doesn't know which topics exist, so a direct call can submit to any `uint8`. The frontend **ignores topic IDs not in `topics.js`**.

---

## Phase 4 — Config

### `src/config/events.js`: add a `legacy` flag

```js
export const EVENTS = [
  { id: 'vmatm00s', name: '… ATLAS SkillTech University', contract: '0xb545…9138', legacy: true },
  { id: 'x11ckwi5', name: '… DBIT Mumbai',                contract: '0xb54c…1b2d', legacy: true },
  { id: 'rtta1cub', name: 'Hacktoberfest Hack Day Mumbai…', contract: '0x487c…4c73', legacy: true },
  // New events deploy QuizScoresV2 and omit `legacy`
];
```

Header comment updated: `legacy: true` = QuizScores v1 (profiles stored in the event contract); no flag = QuizScoresV2 (profiles from ProfileRegistry).

### `src/config/topics.js` (new)

```js
// IDs are APPEND-ONLY: never reuse, renumber, or delete an entry, or
// existing on-chain submissions will show up under the wrong topic.
// To retire a topic, set `archived: true` (hidden from the feed + submit picker).
export const TOPICS = [
  {
    id: 0,
    title: 'Why do you want to attend the Devcon?',
    emoji: '🦄',
    description: 'Share a post or video on what Devcon means to you.',
  },

  // ──────────────────────────────────────────────────────
  // Example entries (uncomment and adapt via PR)
  // ──────────────────────────────────────────────────────
  // { id: 1, title: 'Your best Devcon moment', emoji: '📸', description: '…' },
  // { id: 2, title: 'Explain a ZK concept in 60 seconds', emoji: '🔐', description: '…' },
  // { id: 3, title: 'Show us what you built at the workshop', emoji: '🛠️', description: '…' },
];
```

### Env vars (`.env.example`)

| Var | Purpose |
|---|---|
| `VITE_CONTRACT_ADDRESS` | Active quiz contract (now a QuizScoresV2 for new events). Unchanged name |
| `VITE_PROFILE_REGISTRY_ADDRESS` | New |
| `VITE_FEED_CONTRACT_ADDRESS` | New |

---

## Phase 5 — Frontend changes to existing code

| File | Change |
|---|---|
| `src/abi.js` | Keep `QUIZ_SCORES_ABI` (v1, legacy). Add `QUIZ_SCORES_V2_ABI`, `PROFILE_REGISTRY_ABI`, `FEED_ABI`, and the two new address exports |
| `src/wallet.js` | `checkRegistration()` and `register()` move from `CONTRACT_ADDRESS` to the registry. `participantData` no longer carries `quizScores` (nothing in the profile flow needs it) |
| `src/leaderboard.js` | Branch on `event.legacy`. **Legacy:** current code, untouched. **V2:** `getLeaderboardBatch` on the event contract → `registry.getProfilesBatch(wallets)` → same `leaderboardData` shape, so `renderLeaderboard` is reused as is |
| `src/quiz.js` | No ABI-level change (`submitScore` signature is identical). Swap `QUIZ_SCORES_ABI` → `QUIZ_SCORES_V2_ABI` |
| `api/quiz/start.js` | No change (V2 exposes `isRegistered` + `hasAttempted`) |
| `api/quiz/complete.js` | Hash becomes `solidityPackedKeccak256(['address','uint256','address','uint8','uint256','uint256'], [CONTRACT_ADDRESS, chainId, wallet, quizId, score, nonce])`. **Ship together with the first V2 event**; until then the API still targets the legacy contract |
| `index.html` | Add `<a href="#/feed" class="nav-link">Feed</a>` **before** Presentations |
| `src/main.js` | `registerRoute('/feed', renderFeedPage)` (imported from `feed.js`) |

---

## Phase 6 — Feed module (`src/feed.js`)

### Responsibilities

1. **Page render**: topic rows stacked vertically; cards scroll horizontally within each row
2. **Data load**: `getTopicCount` + `getTopicBatch` per topic, then filter out `hidden` and unknown topics
3. **Profiles**: collect unique submitters → one `registry.getProfilesBatch` call → show name + `@xHandle`
4. **Sorting**: one global Top / New toggle (Top = net votes desc, ties broken by newest)
5. **Voting**: ▲ / ▼ buttons; clicking your active vote sends `0` (clear). Optimistic UI, reverted on tx failure. Disabled on your own cards and when you're not registered
6. **Submit modal**: floating `+` button → URL input + topic picker → client-side parse to `(platform, mediaId)` → live preview → `submit` tx
7. **Lazy embeds**: an `IntersectionObserver` mounts each embed only when its card nears the viewport

### URL parsing → canonical media ID

| Platform | Accepted URLs | Stored `mediaId` |
|---|---|---|
| X | `x.com/*/status/{id}`, `twitter.com/*/status/{id}` (+ `mobile.` / query params) | numeric tweet ID |
| YouTube | `youtube.com/watch?v={id}`, `youtu.be/{id}`, `youtube.com/shorts/{id}` | 11-char video ID |
| Instagram | `instagram.com/p/{code}`, `instagram.com/reel/{code}`, `instagram.com/reels/{code}` | shortcode |

Anything else is rejected in the modal before a tx is sent.

### Embed strategy (no API keys, no oEmbed fetches)

| Platform | Render | Video playback |
|---|---|---|
| X | Load `https://platform.twitter.com/widgets.js` once, then `twttr.widgets.createTweet(id, el, { theme, dnt: true })` | Native inline player in the embedded tweet |
| YouTube | `<iframe src="https://www.youtube-nocookie.com/embed/{id}" loading="lazy" allow="encrypted-media; picture-in-picture" allowfullscreen>` (Shorts use a 9:16 container) | Native inline |
| Instagram | `<blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/p/{code}/">` + `https://www.instagram.com/embed.js`, then `instgrm.Embeds.process()` after each mount | Reels play inline |

Cards have a fixed height with internal scroll, because tweet and Instagram embed heights vary widely.

---

## Phase 7 — UI/UX

### Nav
```
[ Feed ] [ Presentations ] [ Quizzes ] [ Leaderboard ] [ Quests ]
```

### Feed layout
```
┌─────────────────────────────────────────────────────┐
│  Feed                        [ Top | New ]          │
├─────────────────────────────────────────────────────┤
│  🦄 Why do you want to attend the Devcon?           │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ →             │
│  │card  │ │card  │ │card  │ │card  │                │
│  └──────┘ └──────┘ └──────┘ └──────┘                │
├─────────────────────────────────────────────────────┤
│  (future topics…)                                   │
└─────────────────────────────────────────────────────┘
                                              ( + )
```

### Submission card
```
┌─────────────────────────────────────┐
│  [Embedded tweet / YT / IG player]  │
│                                     │
│  Name · @xHandle            𝕏 / ▶ / ◎ │
│  ▲ 12   ▼ 3                         │
└─────────────────────────────────────┘
```

### Submit modal
```
┌──────────────────────────────┐
│  Submit to Feed              │
│  Link:  [paste X/YT/IG URL]  │
│  Topic: [ Why do you want… ▾]│
│  ┌ preview ───────────────┐  │
│  └────────────────────────┘  │
│           [ Submit → tx ]    │
└──────────────────────────────┘
```

---

## Phase 8 — Testing (Remix, no script needed)

There's no Hardhat or test runner in the repo, and the previously proposed `deploy-feed.js` was a new file that nothing depends on. It is dropped. Testing happens in the **Remix VM**:

1. Deploy two v1 `QuizScores` instances; register overlapping wallets and a clashing X handle across them.
2. Deploy `ProfileRegistry`; confirm `register` reverts before finalize.
3. `migrateFrom` newest → oldest; check `ProfileMigrated` / `MigrationSkipped` events and `getProfile` results; `finalizeMigration`; confirm `migrateFrom` now reverts and `register` works.
4. Deploy `QuizScoresV2(admin, registry)`; submit a score with a signature from the admin account; confirm a replayed signature fails on a second V2 instance.
5. Deploy `FeedContract(registry)`; submit; confirm a duplicate fails; vote +1 → −1 → 0 and check counts; confirm self-vote and unregistered vote revert; `setHidden`.

These steps go into the docs as a checklist.

---

## Phase 9 — Docs & changelog

- `docs/docs/smart-contract.md`: ProfileRegistry, QuizScoresV2, FeedContract, migration, and the legacy flag
- `docs/docs/feed.md` (new): how the feed works and the supported links
- `docs/docs/topics.md` (new): adding a topic via PR (append-only rule)
- Remix deployment + migration runbook and the Phase 8 test checklist
- `README.md`, `.env.example`, `CHANGELOG.md` (v0.3.0)

---

## Build & rollout order

```
 1. contracts/ProfileRegistry.sol
 2. contracts/QuizScoresV2.sol
 3. contracts/FeedContract.sol
 4. Remix VM test pass (Phase 8)
 5. src/config/events.js     ← legacy: true on existing 3
 6. src/config/topics.js
 7. src/abi.js
 8. src/wallet.js            ← registry-based profile
 9. src/leaderboard.js       ← legacy / V2 branch
10. src/feed.js + nav + route + styles
11. api/quiz/complete.js     ← new hash (gated on first V2 event)
12. docs + CHANGELOG
```

**Sepolia rollout:**

```
a. Wait until Hacktoberfest (rtta1cub) registrations are closed
b. Deploy ProfileRegistry → migrateFrom(Hacktoberfest) → (DBIT) → (ATLAS) → review skips → finalizeMigration
c. Deploy FeedContract(registry)
d. Set VITE_PROFILE_REGISTRY_ADDRESS + VITE_FEED_CONTRACT_ADDRESS, deploy frontend
e. Next event: deploy QuizScoresV2(admin, registry), add to events.js (no legacy flag),
   point VITE_CONTRACT_ADDRESS at it, and ship the complete.js hash change together
```

> [!IMPORTANT]
> Steps (b) → (d) must happen in that order. If the frontend switches to registry-based registration before `finalizeMigration()`, new users can't register; if registration opens before migration, a newcomer could claim a legacy user's X handle.
