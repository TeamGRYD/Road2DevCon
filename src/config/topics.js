// ============================================================
// Feed Topic Configuration
// ============================================================
// Each topic is a horizontally scrollable row on the Feed page.
// Submissions are stored on-chain in FeedContract.sol against the topic ID.
//
// Fields:
//   id          — Topic ID stored on-chain (0-255)
//   title       — Prompt shown as the row heading and in the submit picker
//   emoji       — Icon shown next to the title
//   description — One-line hint shown under the title
//   archived    — Optional. true hides the topic from the feed and picker
//
// IDs are APPEND-ONLY: never reuse, renumber, or delete an entry, or
// existing on-chain submissions will show up under the wrong topic.
// To retire a topic, set `archived: true` instead of removing it.
//
// To add a topic: open a PR adding a new entry with the next unused ID.
// No contract change or redeploy is needed.
// ============================================================

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
  // {
  //   id: 1,
  //   title: 'Your best Road to DevCon moment',
  //   emoji: '📸',
  //   description: 'Photos and clips from the workshops.',
  // },
  // {
  //   id: 2,
  //   title: 'Explain a ZK concept in 60 seconds',
  //   emoji: '🔐',
  //   description: 'Short explainers on zero-knowledge proofs.',
  // },
  // {
  //   id: 3,
  //   title: 'Show us what you built',
  //   emoji: '🛠️',
  //   description: 'Demos from hack days and quests.',
  // },
];

export const ACTIVE_TOPICS = TOPICS.filter(t => !t.archived);
