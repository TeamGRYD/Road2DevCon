import { ethers } from 'ethers';
import { serverQuestions } from '../lib/questions.js';
import { createToken } from '../lib/jwt.js';

const RPC_URL = process.env.RPC_URL || 'https://rpc.sepolia.org';
const CONTRACT_ADDRESS = process.env.VITE_CONTRACT_ADDRESS || '';

// Minimal ABI for read-only checks
const CHECK_ABI = [
  'function isRegistered(address) view returns (bool)',
  'function hasAttempted(address, uint8) view returns (bool)'
];

const QUESTIONS_PER_QUIZ = 10;
const SESSION_EXPIRY = '10m';

/**
 * POST /api/quiz/start
 * 
 * Body: { walletAddress: string, quizId: number }
 * Returns: { questions: [{question, options}], jwt: string }
 * 
 * Selects 10 random questions from the 100+ pool for the given quiz.
 * Returns questions WITHOUT correct answers. Signs a JWT session.
 */
export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { walletAddress, quizId } = req.body;

    // Validate inputs
    if (!walletAddress || !ethers.isAddress(walletAddress)) {
      return res.status(400).json({ error: 'Invalid wallet address' });
    }
    if (quizId === undefined || quizId < 0 || quizId > 3) {
      return res.status(400).json({ error: 'Invalid quiz ID (must be 0-3)' });
    }

    // Check on-chain: is wallet registered?
    if (CONTRACT_ADDRESS) {
      const provider = new ethers.JsonRpcProvider(RPC_URL);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CHECK_ABI, provider);

      const registered = await contract.isRegistered(walletAddress);
      if (!registered) {
        return res.status(403).json({ error: 'Wallet not registered. Please register first.' });
      }

      const attempted = await contract.hasAttempted(walletAddress, quizId);
      if (attempted) {
        return res.status(403).json({ error: 'You have already attempted this quiz. No retakes allowed.' });
      }
    }

    // Find quiz pool
    const quizPool = serverQuestions.find(q => q.quizId === quizId);
    if (!quizPool || !quizPool.questions.length) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    // Shuffle and select questions
    const shuffled = fisherYatesShuffle([...quizPool.questions.map((q, i) => ({ ...q, _originalIndex: i }))]);
    const selected = shuffled.slice(0, QUESTIONS_PER_QUIZ);

    // Prepare client-safe questions (NO correct answer)
    const clientQuestions = selected.map((q, i) => {
      // Also shuffle the options within each question
      const optionIndices = [0, 1, 2, 3];
      fisherYatesShuffle(optionIndices);

      return {
        questionIndex: i,
        question: q.question,
        options: optionIndices.map(oi => q.options[oi])
      };
    });

    // Store the full truth in the JWT (server-side secret)
    const sessionData = {
      wallet: walletAddress.toLowerCase(),
      quizId,
      // For each selected question: original index, shuffled option mapping, correct answer in shuffled order
      questionMeta: selected.map((q, i) => {
        const shuffledOptions = clientQuestions[i].options;
        const correctAnswer = q.options[q.correct];
        const correctInShuffled = shuffledOptions.indexOf(correctAnswer);

        return {
          originalIndex: q._originalIndex,
          correctOption: correctInShuffled
        };
      }),
      answers: [],
      questionTimestamps: [],
      currentQuestion: 0,
      score: 0,
      startedAt: Date.now()
    };

    const jwt = createToken(sessionData, SESSION_EXPIRY);

    return res.status(200).json({
      questions: clientQuestions,
      jwt,
      totalQuestions: QUESTIONS_PER_QUIZ
    });

  } catch (err) {
    console.error('quiz/start error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Fisher-Yates shuffle (in-place, returns the array).
 */
function fisherYatesShuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
