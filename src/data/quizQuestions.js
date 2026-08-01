/**
 * Quiz metadata for the frontend card display.
 * 
 * NOTE: Correct answers are NOT stored here. They live exclusively
 * in /api/lib/questions.js (server-side only). This file only provides
 * metadata for rendering quiz cards on the quizzes page.
 */
export const quizQuestions = [
  {
    quizId: 0,
    title: 'Censorship Resistance & Resistance to Capture',
    icon: '🛡️',
    questionCount: 100,
    description: 'Test your understanding of how blockchains resist censorship, capture, and centralized control.'
  },
  {
    quizId: 1,
    title: 'Open Source & the Ethereum Ecosystem',
    icon: '🌐',
    questionCount: 100,
    description: 'Explore open source principles, Ethereum development tools, and the composable DeFi ecosystem.'
  },
  {
    quizId: 2,
    title: 'Privacy on Ethereum',
    icon: '🔒',
    questionCount: 100,
    description: 'Dive into zero-knowledge proofs, privacy protocols, and the balance between transparency and confidentiality.'
  },
  {
    quizId: 3,
    title: 'Security in Smart Contracts',
    icon: '🔐',
    questionCount: 100,
    description: 'Learn about common vulnerabilities, attack vectors, auditing practices, and secure coding patterns.'
  }
];
