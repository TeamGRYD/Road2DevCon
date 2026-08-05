// ABI for QuizScores.sol (v2 with registration + signature verification)
// Update this if you modify the contract
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

// Contract address - injected at build time from environment variable
export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '';

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
