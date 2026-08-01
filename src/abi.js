// ABI for QuizScores.sol - generated from the contract interface
// Update this if you modify the contract
export const QUIZ_SCORES_ABI = [
  {
    "inputs": [
      { "internalType": "string", "name": "_name", "type": "string" },
      { "internalType": "string", "name": "_xUsername", "type": "string" },
      { "internalType": "uint8", "name": "_quizId", "type": "uint8" },
      { "internalType": "uint256", "name": "_score", "type": "uint256" }
    ],
    "name": "registerAndSubmitScore",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "_wallet", "type": "address" }
    ],
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
    "inputs": [
      { "internalType": "address", "name": "_wallet", "type": "address" }
    ],
    "name": "isRegistered",
    "outputs": [
      { "internalType": "bool", "name": "", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllParticipants",
    "outputs": [
      { "internalType": "address[]", "name": "", "type": "address[]" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getParticipantCount",
    "outputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
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
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "wallet", "type": "address" },
      { "indexed": false, "internalType": "string", "name": "name", "type": "string" },
      { "indexed": false, "internalType": "string", "name": "xUsername", "type": "string" },
      { "indexed": false, "internalType": "uint8", "name": "quizId", "type": "uint8" },
      { "indexed": false, "internalType": "uint256", "name": "score", "type": "uint256" }
    ],
    "name": "ScoreSubmitted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "wallet", "type": "address" },
      { "indexed": false, "internalType": "string", "name": "name", "type": "string" },
      { "indexed": false, "internalType": "string", "name": "xUsername", "type": "string" }
    ],
    "name": "ParticipantRegistered",
    "type": "event"
  }
];

// Contract address - injected at build time from environment variable
export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '';

// Sepolia chain ID
export const SEPOLIA_CHAIN_ID = '0xaa36a7'; // 11155111 in hex
export const SEPOLIA_CHAIN_ID_DEC = 11155111;

// Sepolia network config for MetaMask
export const SEPOLIA_NETWORK = {
  chainId: '0xaa36a7',
  chainName: 'Sepolia Testnet',
  nativeCurrency: { name: 'SepoliaETH', symbol: 'ETH', decimals: 18 },
  rpcUrls: ['https://rpc.sepolia.org'],
  blockExplorerUrls: ['https://sepolia.etherscan.io']
};
