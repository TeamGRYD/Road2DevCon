// ABI for QuizScores.sol (v1 / legacy: registration + signature verification)
// Used for events marked `legacy: true` in src/config/events.js
export const QUIZ_SCORES_ABI = [
  // ============ REGISTRATION ============
  {
    "inputs": [
      { "internalType": "string", "name": "_name", "type": "string" },
      { "internalType": "string", "name": "_xUsername", "type": "string" }
    ],
    "name": "register",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // ============ SCORE SUBMISSION ============
  {
    "inputs": [
      { "internalType": "uint8", "name": "_quizId", "type": "uint8" },
      { "internalType": "uint256", "name": "_score", "type": "uint256" },
      { "internalType": "uint256", "name": "_nonce", "type": "uint256" },
      { "internalType": "bytes", "name": "_signature", "type": "bytes" }
    ],
    "name": "submitScore",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // ============ VIEW FUNCTIONS ============
  {
    "inputs": [{ "internalType": "address", "name": "_wallet", "type": "address" }],
    "name": "getParticipant",
    "outputs": [
      { "internalType": "string", "name": "name", "type": "string" },
      { "internalType": "string", "name": "xUsername", "type": "string" },
      { "internalType": "uint256[4]", "name": "quizScores", "type": "uint256[4]" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "_wallet", "type": "address" }],
    "name": "isRegistered",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "", "type": "address" },
      { "internalType": "uint8", "name": "", "type": "uint8" }
    ],
    "name": "hasAttempted",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "name": "nonces",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllParticipants",
    "outputs": [{ "internalType": "address[]", "name": "", "type": "address[]" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getParticipantCount",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_start", "type": "uint256" },
      { "internalType": "uint256", "name": "_count", "type": "uint256" }
    ],
    "name": "getLeaderboardBatch",
    "outputs": [
      { "internalType": "address[]", "name": "wallets", "type": "address[]" },
      { "internalType": "string[]", "name": "names", "type": "string[]" },
      { "internalType": "string[]", "name": "xUsernames", "type": "string[]" },
      { "internalType": "uint256[4][]", "name": "scores", "type": "uint256[4][]" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "admin",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  // ============ EVENTS ============
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "wallet", "type": "address" },
      { "indexed": false, "internalType": "string", "name": "name", "type": "string" },
      { "indexed": false, "internalType": "string", "name": "xUsername", "type": "string" }
    ],
    "name": "ParticipantRegistered",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "wallet", "type": "address" },
      { "indexed": false, "internalType": "uint8", "name": "quizId", "type": "uint8" },
      { "indexed": false, "internalType": "uint256", "name": "score", "type": "uint256" }
    ],
    "name": "ScoreSubmitted",
    "type": "event"
  }
];

// ABI for QuizScoresV2.sol (scores only; profiles live in ProfileRegistry)
export const QUIZ_SCORES_V2_ABI = [
  'function submitScore(uint8 _quizId, uint256 _score, uint256 _nonce, bytes _signature)',
  'function isRegistered(address _wallet) view returns (bool)',
  'function hasAttempted(address, uint8) view returns (bool)',
  'function nonces(address) view returns (uint256)',
  'function getScores(address _wallet) view returns (uint256[4])',
  'function getParticipantCount() view returns (uint256)',
  'function getLeaderboardBatch(uint256 _start, uint256 _count) view returns (address[] wallets, uint256[4][] batchScores)',
  'event ScoreSubmitted(address indexed wallet, uint8 quizId, uint256 score)'
];

// ABI for ProfileRegistry.sol
export const PROFILE_REGISTRY_ABI = [
  'function register(string _name, string _xUsername)',
  'function migrationFinalized() view returns (bool)',
  'function isRegistered(address _wallet) view returns (bool)',
  'function getProfile(address _wallet) view returns (string name, string xUsername)',
  'function getProfilesBatch(address[] _wallets) view returns (string[] names, string[] xUsernames, bool[] registered)',
  'function getProfileCount() view returns (uint256)',
  'event ProfileRegistered(address indexed wallet, string name, string xUsername)'
];

// ABI for FeedContract.sol
const SUBMISSION_TUPLE = 'tuple(uint256 id, uint8 topicId, uint8 platform, string mediaId, address submitter, uint64 timestamp, uint32 upvotes, uint32 downvotes, bool hidden)';
export const FEED_ABI = [
  'function submit(uint8 _topicId, uint8 _platform, string _mediaId)',
  'function vote(uint256 _id, int8 _value)',
  'function getTopicCount(uint8 _topicId) view returns (uint256)',
  `function getTopicBatch(uint8 _topicId, uint256 _start, uint256 _count) view returns (${SUBMISSION_TUPLE}[] batch)`,
  'function getUserVotes(address _user, uint256[] _ids) view returns (int8[] votes)',
  'event Submitted(uint256 indexed id, uint8 indexed topicId, address indexed submitter, uint8 platform, string mediaId)',
  'event Voted(uint256 indexed id, address indexed voter, int8 value, uint32 upvotes, uint32 downvotes)'
];

// Contract address - injected at build time from environment variable
export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '';

// Shared profile registry. When unset, profiles are read from / registered on
// the legacy QuizScores contract at CONTRACT_ADDRESS (pre-migration behaviour).
export const PROFILE_REGISTRY_ADDRESS = import.meta.env.VITE_PROFILE_REGISTRY_ADDRESS || '';

// Feed contract (submissions + votes)
export const FEED_CONTRACT_ADDRESS = import.meta.env.VITE_FEED_CONTRACT_ADDRESS || '';

// ERC-2771 forwarder (GaslessForwarder.sol). When set, calls to contracts that
// trust it are signed by the participant and paid for by the gas station.
export const FORWARDER_ADDRESS = import.meta.env.VITE_FORWARDER_ADDRESS || '';

// Sepolia RPC URL - configurable via env, with reliable fallback
export const SEPOLIA_RPC_URL = import.meta.env.VITE_RPC_URL || 'https://ethereum-sepolia-rpc.publicnode.com';

// Sepolia chain ID
export const SEPOLIA_CHAIN_ID = '0xaa36a7'; // 11155111 in hex
export const SEPOLIA_CHAIN_ID_DEC = 11155111;

// Sepolia network config for MetaMask
export const SEPOLIA_NETWORK = {
  chainId: '0xaa36a7',
  chainName: 'Sepolia Testnet',
  nativeCurrency: { name: 'SepoliaETH', symbol: 'ETH', decimals: 18 },
  rpcUrls: [SEPOLIA_RPC_URL],
  blockExplorerUrls: ['https://sepolia.etherscan.io']
};
