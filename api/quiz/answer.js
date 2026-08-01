import { verifyToken, createToken } from '../lib/jwt.js';

const HARD_TIMER_SECONDS = 30;
const BASE_POINTS = 100;
const MAX_TIME_BONUS = 100;
const TIME_DECAY_RATE = 4; // Points lost per second

/**
 * POST /api/quiz/answer
 * 
 * Body: { jwt: string, questionIndex: number, selectedOption: number }
 * Returns: { jwt: string, questionNumber: number, recorded: true }
 * 
 * Grades a single answer server-side. Enforces 30s hard timer.
 * Returns an updated JWT with no correct/wrong feedback.
 */
export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { jwt, questionIndex, selectedOption } = req.body;

    if (!jwt) {
      return res.status(400).json({ error: 'Missing session token' });
    }

    // Verify and decode JWT
    const session = verifyToken(jwt);
    if (!session) {
      return res.status(401).json({ error: 'Invalid or expired session. Please start a new quiz.' });
    }

    // Validate question index
    if (questionIndex !== session.currentQuestion) {
      return res.status(400).json({
        error: `Expected question ${session.currentQuestion}, got ${questionIndex}`
      });
    }

    if (questionIndex >= session.questionMeta.length) {
      return res.status(400).json({ error: 'All questions already answered' });
    }

    // Calculate time taken for this question
    const now = Date.now();
    const lastTimestamp = session.questionTimestamps.length > 0
      ? session.questionTimestamps[session.questionTimestamps.length - 1]
      : session.startedAt;
    const timeTakenMs = now - lastTimestamp;
    const timeTakenSec = timeTakenMs / 1000;

    // Enforce 30s hard timer (with 1s grace for network latency)
    const timedOut = timeTakenSec > (HARD_TIMER_SECONDS + 1);

    // Grade the answer
    const meta = session.questionMeta[questionIndex];
    let pointsEarned = 0;

    if (!timedOut && selectedOption >= 0 && selectedOption === meta.correctOption) {
      const timeBonus = Math.max(0, Math.floor(MAX_TIME_BONUS - (timeTakenSec * TIME_DECAY_RATE)));
      pointsEarned = BASE_POINTS + timeBonus;
    }
    // If timed out or wrong answer: pointsEarned stays 0

    // Update session state
    const updatedSession = {
      ...session,
      answers: [...session.answers, { questionIndex, selectedOption, timeTakenSec, pointsEarned }],
      questionTimestamps: [...session.questionTimestamps, now],
      currentQuestion: session.currentQuestion + 1,
      score: session.score + pointsEarned,
      // Remove JWT-internal fields that get re-added by createToken
      iat: undefined,
      exp: undefined
    };

    // Clean up JWT metadata fields
    delete updatedSession.iat;
    delete updatedSession.exp;

    const newJwt = createToken(updatedSession, '10m');

    return res.status(200).json({
      jwt: newJwt,
      questionNumber: updatedSession.currentQuestion,
      totalQuestions: session.questionMeta.length,
      recorded: true
    });

  } catch (err) {
    console.error('quiz/answer error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
