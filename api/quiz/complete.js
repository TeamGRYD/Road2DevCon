import { ethers } from 'ethers';
import { verifyToken } from '../lib/jwt.js';

const ADMIN_PRIVATE_KEY = process.env.ADMIN_PRIVATE_KEY;
const RPC_URL = process.env.RPC_URL || 'https://rpc.sepolia.org';
const CONTRACT_ADDRESS = process.env.VITE_CONTRACT_ADDRESS || '';

// Minimal ABI for reading nonce
const NONCE_ABI = ['function nonces(address) view returns (uint256)'];

/**
 * POST /api/quiz/complete
 * 
 * Body: { jwt: string }
 * Returns: { score: number, correctCount: number, totalQuestions: number,
 *            signature: string, nonce: number, quizId: number }
 * 
 * Validates that all questions are answered, calculates final score,
 * reads nonce from contract, and signs the score with admin key.
 */
export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { jwt } = req.body;

    if (!jwt) {
      return res.status(400).json({ error: 'Missing session token' });
    }

    if (!ADMIN_PRIVATE_KEY) {
      console.error('ADMIN_PRIVATE_KEY not configured');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Verify session
    const session = verifyToken(jwt);
    if (!session) {
      return res.status(401).json({ error: 'Invalid or expired session' });
    }

    // Verify all questions answered
    const totalQuestions = session.questionMeta.length;
    if (session.answers.length < totalQuestions) {
      return res.status(400).json({
        error: `Not all questions answered. Expected ${totalQuestions}, got ${session.answers.length}`
      });
    }

    // Calculate final score (sum of points from all answers)
    const score = session.score;
    const correctCount = session.answers.filter(a => a.pointsEarned > 0).length;

    // Read current nonce from contract
    let nonce = 0;
    if (CONTRACT_ADDRESS) {
      const provider = new ethers.JsonRpcProvider(RPC_URL);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, NONCE_ABI, provider);
      nonce = Number(await contract.nonces(session.wallet));
    }

    // Sign the score with admin key
    // Must match: keccak256(abi.encodePacked(wallet, quizId, score, nonce))
    const messageHash = ethers.solidityPackedKeccak256(
      ['address', 'uint8', 'uint256', 'uint256'],
      [session.wallet, session.quizId, score, nonce]
    );

    const adminWallet = new ethers.Wallet(ADMIN_PRIVATE_KEY);
    const signature = await adminWallet.signMessage(ethers.getBytes(messageHash));

    return res.status(200).json({
      score,
      correctCount,
      totalQuestions,
      quizId: session.quizId,
      signature,
      nonce
    });

  } catch (err) {
    console.error('quiz/complete error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
