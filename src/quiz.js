import { ethers } from 'ethers';
import { quizQuestions } from './data/quizQuestions.js';
import { getSigner, getAddress, isConnected, connectWallet } from './wallet.js';
import { QUIZ_SCORES_ABI, CONTRACT_ADDRESS } from './abi.js';

// =================== SCORING CONSTANTS ===================
const BASE_POINTS = 100;
const MAX_TIME_BONUS = 100;
const TIME_DECAY_RATE = 4; // Points lost per second
const QUESTIONS_PER_QUIZ = 10;

// =================== STATE ===================
let currentQuiz = null;
let shuffledQuestions = [];
let currentQuestionIndex = 0;
let quizScore = 0;
let questionStartTime = 0;
let correctCount = 0;
let participantName = '';
let participantX = '';
let quizTimerInterval = null;

// =================== PUBLIC API ===================

export function startQuiz(quizId) {
  const quizData = quizQuestions.find(q => q.quizId === quizId);
  if (!quizData) return;

  currentQuiz = quizData;
  currentQuestionIndex = 0;
  quizScore = 0;
  correctCount = 0;

  // Shuffle questions + shuffle options within each question
  shuffledQuestions = shuffleArray([...quizData.questions]).map(q => {
    const { shuffledOptions, newCorrectIndex } = shuffleOptions(q.options, q.correct);
    return { ...q, options: shuffledOptions, correct: newCorrectIndex };
  });

  showRegistrationModal(quizId);
}

// =================== SHUFFLE UTILITIES ===================

function shuffleArray(arr) {
  // Fisher-Yates shuffle
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function shuffleOptions(options, correctIndex) {
  // Create array of {text, isCorrect} to track correct answer through shuffle
  const tagged = options.map((text, i) => ({ text, isCorrect: i === correctIndex }));
  const shuffled = shuffleArray([...tagged]);
  return {
    shuffledOptions: shuffled.map(t => t.text),
    newCorrectIndex: shuffled.findIndex(t => t.isCorrect)
  };
}

// =================== REGISTRATION MODAL ===================

function showRegistrationModal(quizId) {
  const modal = document.getElementById('quiz-modal');
  const content = document.getElementById('quiz-modal-content');
  const quizData = quizQuestions.find(q => q.quizId === quizId);

  content.innerHTML = `
    <div class="quiz-registration">
      <button class="modal-close" id="quiz-modal-close">&times;</button>
      <div class="quiz-reg-icon">${quizData.icon}</div>
      <h2>Quiz ${quizId + 1}: ${quizData.title}</h2>
      <p class="quiz-reg-subtitle">Test your knowledge! Answer faster for bonus points.</p>
      
      <div class="quiz-reg-form">
        <div class="form-group">
          <label for="quiz-name">Your Name <span class="required">*</span></label>
          <input type="text" id="quiz-name" placeholder="Enter your full name" required autocomplete="name" />
        </div>
        <div class="form-group">
          <label for="quiz-x-username">X (Twitter) Username <span class="required">*</span></label>
          <div class="input-with-prefix">
            <span class="input-prefix">@</span>
            <input type="text" id="quiz-x-username" placeholder="username" required />
          </div>
        </div>
      </div>

      <div class="quiz-scoring-info">
        <h4>⏱️ Scoring System</h4>
        <ul>
          <li><strong>Correct answer:</strong> 100 base points</li>
          <li><strong>Speed bonus:</strong> Up to +100 points (faster = more!)</li>
          <li><strong>Max per question:</strong> 200 points</li>
          <li><strong>Max per quiz:</strong> 2,000 points</li>
        </ul>
      </div>

      <button class="btn btn-primary btn-lg quiz-start-btn" id="quiz-start-btn">
        🚀 Start Quiz
      </button>
      <p class="quiz-reg-note">${QUESTIONS_PER_QUIZ} questions · Multiple choice · Questions are shuffled</p>
    </div>
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  // Check for previously stored name/username
  const savedName = localStorage.getItem('quiz_name') || '';
  const savedX = localStorage.getItem('quiz_x') || '';
  document.getElementById('quiz-name').value = savedName;
  document.getElementById('quiz-x-username').value = savedX;

  document.getElementById('quiz-modal-close').onclick = closeQuizModal;
  document.getElementById('quiz-start-btn').onclick = () => {
    const name = document.getElementById('quiz-name').value.trim();
    const xUser = document.getElementById('quiz-x-username').value.trim();

    if (!name) {
      shakeInput('quiz-name');
      return;
    }
    if (!xUser) {
      shakeInput('quiz-x-username');
      return;
    }

    participantName = name;
    participantX = xUser.startsWith('@') ? xUser.slice(1) : xUser;

    // Save for next quiz
    localStorage.setItem('quiz_name', participantName);
    localStorage.setItem('quiz_x', participantX);

    showQuestion();
  };

  // Allow Enter key
  content.querySelectorAll('input').forEach(input => {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') document.getElementById('quiz-start-btn').click();
    });
  });
}

function shakeInput(id) {
  const el = document.getElementById(id);
  el.classList.add('shake');
  el.focus();
  setTimeout(() => el.classList.remove('shake'), 500);
}

// =================== QUESTION DISPLAY ===================

function showQuestion() {
  const content = document.getElementById('quiz-modal-content');
  const q = shuffledQuestions[currentQuestionIndex];
  const total = shuffledQuestions.length;

  questionStartTime = Date.now();

  content.innerHTML = `
    <div class="quiz-question-container">
      <div class="quiz-header">
        <div class="quiz-progress">
          <span class="quiz-progress-text">Question ${currentQuestionIndex + 1} / ${total}</span>
          <div class="quiz-progress-bar">
            <div class="quiz-progress-fill" style="width: ${((currentQuestionIndex + 1) / total) * 100}%"></div>
          </div>
        </div>
        <div class="quiz-score-display">
          Score: <span class="quiz-live-score">${quizScore}</span>
        </div>
      </div>

      <div class="quiz-timer" id="quiz-timer">
        <svg class="timer-ring" viewBox="0 0 36 36">
          <path class="timer-ring-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
          <path class="timer-ring-fill" id="timer-ring-fill" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
        </svg>
        <span class="timer-text" id="timer-text">0s</span>
      </div>

      <h3 class="quiz-question-text">${q.question}</h3>

      <div class="quiz-options" id="quiz-options">
        ${q.options.map((opt, i) => `
          <button class="quiz-option" data-index="${i}" id="quiz-opt-${i}">
            <span class="quiz-option-letter">${String.fromCharCode(65 + i)}</span>
            <span class="quiz-option-text">${opt}</span>
          </button>
        `).join('')}
      </div>
    </div>
  `;

  // Start timer animation
  startTimer();

  // Bind option clicks
  document.querySelectorAll('.quiz-option').forEach(btn => {
    btn.addEventListener('click', () => handleAnswer(parseInt(btn.dataset.index)));
  });

  // Keyboard shortcuts
  document.onkeydown = (e) => {
    const keyMap = { 'a': 0, 'b': 1, 'c': 2, 'd': 3, '1': 0, '2': 1, '3': 2, '4': 3 };
    const idx = keyMap[e.key.toLowerCase()];
    if (idx !== undefined) handleAnswer(idx);
  };
}

// =================== TIMER ===================

function startTimer() {
  const fill = document.getElementById('timer-ring-fill');
  const text = document.getElementById('timer-text');
  if (!fill || !text) return;

  const circumference = 100;
  fill.style.strokeDasharray = `${circumference} ${circumference}`;
  fill.style.strokeDashoffset = '0';

  const maxTime = 25;
  let elapsed = 0;

  clearInterval(quizTimerInterval);
  quizTimerInterval = setInterval(() => {
    elapsed = (Date.now() - questionStartTime) / 1000;
    const progress = Math.min(elapsed / maxTime, 1);
    fill.style.strokeDashoffset = `${progress * circumference}`;
    text.textContent = `${Math.floor(elapsed)}s`;

    if (elapsed > 20) {
      fill.style.stroke = '#ef4444';
    } else if (elapsed > 10) {
      fill.style.stroke = '#F97316';
    }
  }, 100);
}

// =================== ANSWER HANDLING (NO FEEDBACK) ===================

function handleAnswer(selectedIndex) {
  clearInterval(quizTimerInterval);
  document.onkeydown = null;

  const q = shuffledQuestions[currentQuestionIndex];
  const timeTaken = (Date.now() - questionStartTime) / 1000;
  const isCorrect = selectedIndex === q.correct;

  // Calculate score
  if (isCorrect) {
    const timeBonus = Math.max(0, Math.floor(MAX_TIME_BONUS - (timeTaken * TIME_DECAY_RATE)));
    quizScore += BASE_POINTS + timeBonus;
    correctCount++;
  }

  // Brief "recorded" flash - no correct/wrong indication
  const selectedBtn = document.getElementById(`quiz-opt-${selectedIndex}`);
  if (selectedBtn) {
    selectedBtn.classList.add('selected');
    // Disable all buttons
    document.querySelectorAll('.quiz-option').forEach(btn => {
      btn.disabled = true;
      btn.style.pointerEvents = 'none';
    });
  }

  // Move to next question after a short delay
  setTimeout(() => {
    currentQuestionIndex++;
    if (currentQuestionIndex < shuffledQuestions.length) {
      showQuestion();
    } else {
      showQuizResults();
    }
  }, 400);
}

// =================== RESULTS (SCORE ONLY, NO BREAKDOWN) ===================

function showQuizResults() {
  const content = document.getElementById('quiz-modal-content');
  const maxScore = shuffledQuestions.length * (BASE_POINTS + MAX_TIME_BONUS);
  const percentage = Math.round((quizScore / maxScore) * 100);

  let grade = '';
  if (percentage >= 90) grade = '🏆 Outstanding!';
  else if (percentage >= 70) grade = '🌟 Great Job!';
  else if (percentage >= 50) grade = '👍 Good Effort!';
  else grade = '💪 Keep Learning!';

  content.innerHTML = `
    <div class="quiz-results">
      <button class="modal-close" id="quiz-modal-close">&times;</button>
      <div class="results-grade">${grade}</div>
      <h2>Quiz ${currentQuiz.quizId + 1} Complete!</h2>
      <p class="results-subtitle">${currentQuiz.title}</p>

      <div class="results-score-ring">
        <svg viewBox="0 0 120 120">
          <circle class="score-ring-bg" cx="60" cy="60" r="54" />
          <circle class="score-ring-fill" cx="60" cy="60" r="54"
            style="stroke-dasharray: ${(percentage / 100) * 339.292} 339.292" />
        </svg>
        <div class="score-ring-text">
          <span class="score-ring-value">${quizScore}</span>
          <span class="score-ring-max">/ ${maxScore}</span>
        </div>
      </div>

      <div class="results-stats">
        <div class="stat-item">
          <span class="stat-value">${correctCount}/${shuffledQuestions.length}</span>
          <span class="stat-label">Correct</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">${percentage}%</span>
          <span class="stat-label">Score</span>
        </div>
      </div>

      <div class="results-actions">
        <button class="btn btn-primary btn-lg" id="submit-score-btn">
          🔗 Submit Score On-Chain
        </button>
        <button class="btn btn-secondary" id="retake-quiz-btn">
          🔄 Retake Quiz
        </button>
        <button class="btn btn-ghost" id="close-results-btn">
          Close
        </button>
      </div>
      <p class="results-note" id="submit-note">Connect your wallet and submit your score to the Sepolia blockchain!</p>
    </div>
  `;

  document.getElementById('quiz-modal-close').onclick = closeQuizModal;
  document.getElementById('close-results-btn').onclick = closeQuizModal;
  document.getElementById('retake-quiz-btn').onclick = () => startQuiz(currentQuiz.quizId);
  document.getElementById('submit-score-btn').onclick = () => submitScoreOnChain(currentQuiz.quizId, quizScore);
}

// =================== ON-CHAIN SUBMISSION ===================

async function submitScoreOnChain(quizId, score) {
  const submitBtn = document.getElementById('submit-score-btn');
  const noteEl = document.getElementById('submit-note');

  if (!CONTRACT_ADDRESS) {
    noteEl.textContent = '⚠️ Contract not configured. Set VITE_CONTRACT_ADDRESS in environment.';
    noteEl.style.color = '#F97316';
    return;
  }

  if (!isConnected()) {
    noteEl.textContent = '🔗 Connecting wallet...';
    const connected = await connectWallet();
    if (!connected) {
      noteEl.textContent = '❌ Please connect your MetaMask wallet first.';
      noteEl.style.color = '#ef4444';
      return;
    }
  }

  try {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner"></span> Submitting...';
    noteEl.textContent = '⏳ Confirm the transaction in MetaMask...';
    noteEl.style.color = '#7235ED';

    const signerInstance = getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, QUIZ_SCORES_ABI, signerInstance);

    const tx = await contract.registerAndSubmitScore(
      participantName,
      participantX,
      quizId,
      score
    );

    noteEl.textContent = '⏳ Transaction submitted! Waiting for confirmation...';

    await tx.wait();

    submitBtn.innerHTML = '✅ Score Submitted!';
    submitBtn.classList.add('success');
    noteEl.innerHTML = `✅ Score stored on-chain! <a href="https://sepolia.etherscan.io/tx/${tx.hash}" target="_blank" rel="noopener">View on Etherscan ↗</a>`;
    noteEl.style.color = '#80DF98';

    // Dispatch event to refresh leaderboard
    window.dispatchEvent(new CustomEvent('score-submitted'));
  } catch (err) {
    console.error('Score submission failed:', err);
    submitBtn.disabled = false;
    submitBtn.innerHTML = '🔗 Retry Submission';

    if (err.code === 'ACTION_REJECTED' || err.code === 4001) {
      noteEl.textContent = '❌ Transaction rejected. Click to retry.';
    } else {
      noteEl.textContent = `❌ Error: ${err.reason || err.message || 'Transaction failed'}`;
    }
    noteEl.style.color = '#ef4444';
  }
}

// =================== MODAL MANAGEMENT ===================

function closeQuizModal() {
  const modal = document.getElementById('quiz-modal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
  document.onkeydown = null;
  clearInterval(quizTimerInterval);
}
