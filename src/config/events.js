// ============================================================
// Event Configuration
// ============================================================
// Each event gets its own deployed QuizScores contract.
// Add new events here after deploying a new contract instance.
//
// Fields:
//   id       — Unique slug (used in URLs and state, use event's Luma URL ID)
//   name     — Display name shown in the event dropdown
//   contract — Deployed QuizScores contract address on Sepolia
//
// To add a new event:
//   1. Deploy a fresh QuizScores.sol on Sepolia via Remix
//   2. Add a new entry below with the contract address
//   3. Commit and deploy — the leaderboard dropdown updates automatically
// ============================================================

export const EVENTS = [
  {
    id: 'vmatm00s', //extracted from https://luma.com/vmatm00s
    name: 'Road to DevCon 8 — Workshop Edition ft. ATLAS SkillTech University',
    contract: '0xb5456aDfa33BD3c94A6E021541d73Abc26A19138',
  },

  // ──────────────────────────────────────────────────────
  // Example entries (uncomment and fill in after deploying)
  // ──────────────────────────────────────────────────────
  // {
  //   id: 'hvast2c4', //extracted from https://luma.com/hvast2c4
  //   name: 'Road to DevCon 8 - Workshop Edition ft. NMIMS University',
  //   contract: '0x<YOUR_CONTRACT_ADDRESS>', //will be deploying live during the hands-on
  // },
  // {
  //   id: '',
  //   name: 'Road to DevCon 8 - Workshop Edition ft. DJ Sanghvi College',
  //   contract: '0x<YOUR_CONTRACT_ADDRESS>',
  // },
  // {
  //   id: '',
  //   name: '',
  //   contract: '0x<YOUR_CONTRACT_ADDRESS>',
  // },
];

// The first event is the default selection
export const DEFAULT_EVENT_ID = EVENTS[0]?.id || '';
