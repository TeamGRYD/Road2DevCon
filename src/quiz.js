import { ethers } from 'ethers';
import { getSigner, getAddress, isConnected, connectWallet } from './wallet.js';
import { QUIZ_SCORES_ABI, CONTRACT_ADDRESS } from './abi.js';

// =================== CONSTANTS ===================
const HARD_TIMER_SECONDS = 30;
const QUESTIONS_PER_QUIZ = 10;
const MAX_POINTS_PER_QUESTION = 200;

// =================== STATE ===================
let currentQuizId = null;
let sessionJwt = null;
let questions = [];
let currentQuestionIndex = 0;
let totalQuestions = 0;
let quizTimerInterval = null;
let questionStartTime = 0;
let answerPending = false; // prevent double-clicks

// =================== PUBLIC API ===================

export async function startQuiz(quizId) {
  currentQuizId = quizId;

  // Must be connected + registered
  if (!isConnected()) {
    window.dispatchEvent(new CustomEvent('app-notification', {
      detail: { message: 'Please connect your wallet and register before taking a quiz.', type: 'error' }
    }));
    return;
  }

  // Check if already attempted (client-side quick check)
  const addr = getAddress();
  const attemptedKey = `quiz_attempted_${quizId}_${addr?.toLowerCase()}`;
  if (localStorage.getItem(attemptedKey)) {
    showAlreadyAttempted(quizId);
    return;
  }

  showQuizLoading(quizId);

  try {
    // Request questions from server
    const resp = await fetch('/api/quiz/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ walletAddress: addr, quizId })
    });

    const data = await resp.json();

    if (!resp.ok) {
      if (data.error?.includes('already attempted')) {
        localStorage.setItem(attemptedKey, 'true');
        showAlreadyAttempted(quizId);
        return;
      }
      throw new Error(data.error || 'Failed to start quiz');
    }

    // Store session
    sessionJwt = data.jwt;
    questions = data.questions;
    totalQuestions = data.totalQuestions;
    currentQuestionIndex = 0;
    answerPending = false;

    showQuizIntro(quizId);
  } catch (err) {
    console.error('Failed to start quiz:', err);
    showQuizError(err.message);
  }
}

// =================== LOADING STATE ===================

function showQuizLoading(quizId) {
  const modal = document.getElementById('quiz-modal');
  const content = document.getElementById('quiz-modal-content');

  content.innerHTML = `
    <div class="quiz-loading">
      <button class="modal-close" id="quiz-modal-close">&times;</button>
      <div class="quiz-loading-spinner"></div>
      <h2>Preparing Quiz ${quizId + 1}...</h2>
      <p>Selecting your questions from the question pool...</p>
    </div>
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  document.getElementById('quiz-modal-close').onclick = closeQuizModal;
}

function showQuizError(message) {
  const content = document.getElementById('quiz-modal-content');
  content.innerHTML = `
    <div class="quiz-error">
      <button class="modal-close" id="quiz-modal-close">&times;</button>
      <div class="quiz-error-icon">❌</div>
      <h2>Unable to Start Quiz</h2>
      <p class="quiz-error-message">${message}</p>
      <button class="btn btn-primary" id="quiz-error-close">Close</button>
    </div>
  `;
  document.getElementById('quiz-modal-close').onclick = closeQuizModal;
  document.getElementById('quiz-error-close').onclick = closeQuizModal;
}

function showAlreadyAttempted(quizId) {
  const modal = document.getElementById('quiz-modal');
  const content = document.getElementById('quiz-modal-content');

  content.innerHTML = `
    <div class="quiz-already-attempted">
      <button class="modal-close" id="quiz-modal-close">&times;</button>
      <div class="quiz-attempted-icon">🚫</div>
      <h2>Already Attempted</h2>
      <p>You have already attempted Quiz ${quizId + 1}. Each quiz can only be taken once per wallet.</p>
      <p class="quiz-attempted-note">Check the leaderboard to see your score!</p>
      <button class="btn btn-primary" id="quiz-attempted-close">Close</button>
    </div>
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  document.getElementById('quiz-modal-close').onclick = closeQuizModal;
  document.getElementById('quiz-attempted-close').onclick = closeQuizModal;
}

// =================== QUIZ INTRO (rules before start) ===================

function showQuizIntro(quizId) {
  const content = document.getElementById('quiz-modal-content');

  content.innerHTML = `
    <div class="quiz-registration">
      <button class="modal-close" id="quiz-modal-close">&times;</button>
      <div class="quiz-reg-icon">🧠</div>
      <h2>Quiz ${quizId + 1} Ready!</h2>
      <p class="quiz-reg-subtitle">${totalQuestions} questions selected from the question pool.</p>

      <div class="quiz-scoring-info">
        <h4>📋 Quiz Rules</h4>
        <ul>
          <li><strong>⏱️ 30 seconds</strong> per question (hard limit)</li>
          <li><strong>⚡ Speed bonus:</strong> Faster answers earn more points</li>
          <li><strong>📊 Max per question:</strong> 200 points (100 base + 100 speed)</li>
          <li><strong>🏆 Max per quiz:</strong> 2,000 points</li>
          <li><strong>🚫 No retakes:</strong> One attempt only!</li>
          <li><strong>🔒 Score submitted on-chain</strong> after completion</li>
        </ul>
      </div>

      <button class="btn btn-primary btn-lg quiz-start-btn" id="quiz-begin-btn">
        🚀 Begin Quiz
      </button>
      <p class="quiz-reg-note">Questions are randomized. Timer starts immediately.</p>
    </div>
  `;

  document.getElementById('quiz-modal-close').onclick = closeQuizModal;
  document.getElementById('quiz-begin-btn').onclick = () => showQuestion();
}

// =================== QUESTION DISPLAY ===================

function showQuestion() {
  if (currentQuestionIndex >= questions.length) {
    completeQuiz();
    return;
  }

  const content = document.getElementById('quiz-modal-content');
  const q = questions[currentQuestionIndex];
  answerPending = false;
  questionStartTime = Date.now();

  content.innerHTML = `
    <div class="quiz-question-container">
      <div class="quiz-header">
        <div class="quiz-progress">
          <span class="quiz-progress-text">Question ${currentQuestionIndex + 1} / ${totalQuestions}</span>
          <div class="quiz-progress-bar">
            <div class="quiz-progress-fill" style="width: ${((currentQuestionIndex + 1) / totalQuestions) * 100}%"></div>
          </div>
        </div>
        <div class="quiz-timer-countdown" id="quiz-timer-countdown">
          <span class="timer-countdown-value" id="timer-countdown-value">${HARD_TIMER_SECONDS}</span>
          <span class="timer-countdown-label">sec</span>
        </div>
      </div>

      <div class="quiz-timer" id="quiz-timer">
        <svg class="timer-ring" viewBox="0 0 36 36">
          <path class="timer-ring-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
          <path class="timer-ring-fill" id="timer-ring-fill" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
        </svg>
        <span class="timer-text" id="timer-text">${HARD_TIMER_SECONDS}s</span>
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

  // Start countdown timer
  startCountdownTimer();

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

// =================== COUNTDOWN TIMER (30s) ===================

function startCountdownTimer() {
  const fill = document.getElementById('timer-ring-fill');
  const text = document.getElementById('timer-text');
  const countdownEl = document.getElementById('timer-countdown-value');
  if (!fill || !text) return;

  const circumference = 100;
  fill.style.strokeDasharray = `${circumference} ${circumference}`;
  fill.style.strokeDashoffset = '0';

  clearInterval(quizTimerInterval);
  quizTimerInterval = setInterval(() => {
    const elapsed = (Date.now() - questionStartTime) / 1000;
    const remaining = Math.max(0, HARD_TIMER_SECONDS - elapsed);
    const progress = elapsed / HARD_TIMER_SECONDS;

    fill.style.strokeDashoffset = `${Math.min(progress, 1) * circumference}`;
    text.textContent = `${Math.ceil(remaining)}s`;
    if (countdownEl) countdownEl.textContent = Math.ceil(remaining);

    // Color changes
    if (remaining <= 5) {
      fill.style.stroke = '#ef4444';
      if (countdownEl) countdownEl.style.color = '#ef4444';
    } else if (remaining <= 10) {
      fill.style.stroke = '#F97316';
      if (countdownEl) countdownEl.style.color = '#F97316';
    }

    // Hard timer: auto-advance when time runs out
    if (remaining <= 0) {
      handleAnswer(-1); // -1 = no answer (timed out)
    }
  }, 100);
}

// =================== ANSWER HANDLING ===================

async function handleAnswer(selectedIndex) {
  if (answerPending) return; // prevent double submission
  answerPending = true;

  clearInterval(quizTimerInterval);
  document.onkeydown = null;

  // Visual feedback: mark selected
  if (selectedIndex >= 0) {
    const selectedBtn = document.getElementById(`quiz-opt-${selectedIndex}`);
    if (selectedBtn) selectedBtn.classList.add('selected');
  }

  // Disable all buttons
  document.querySelectorAll('.quiz-option').forEach(btn => {
    btn.disabled = true;
    btn.style.pointerEvents = 'none';
  });

  // Show brief "recording" state
  const timerText = document.getElementById('timer-text');
  if (timerText) timerText.textContent = '⏳';

  try {
    // Submit answer to server
    const resp = await fetch('/api/quiz/answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jwt: sessionJwt,
        questionIndex: currentQuestionIndex,
        selectedOption: selectedIndex
      })
    });

    const data = await resp.json();

    if (!resp.ok) {
      throw new Error(data.error || 'Failed to record answer');
    }

    // Update session JWT
    sessionJwt = data.jwt;
    currentQuestionIndex = data.questionNumber;

    // Brief pause then next question
    setTimeout(() => {
      if (currentQuestionIndex < totalQuestions) {
        showQuestion();
      } else {
        completeQuiz();
      }
    }, 300);

  } catch (err) {
    console.error('Failed to submit answer:', err);
    // On error, still advance to prevent getting stuck
    currentQuestionIndex++;
    setTimeout(() => {
      if (currentQuestionIndex < totalQuestions) {
        showQuestion();
      } else {
        completeQuiz();
      }
    }, 300);
  }
}

// =================== QUIZ COMPLETION ===================

async function completeQuiz() {
  const content = document.getElementById('quiz-modal-content');

  // Show "processing" state — score not revealed yet
  content.innerHTML = `
    <div class="quiz-submitting">
      <div class="quiz-loading-spinner"></div>
      <h2>Quiz Complete!</h2>
      <p>Calculating your score and preparing on-chain submission...</p>
      <p class="quiz-submit-note" id="submit-progress">⏳ Finalizing with the server...</p>
    </div>
  `;

  try {
    // Get signed score from server
    const resp = await fetch('/api/quiz/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jwt: sessionJwt })
    });

    const data = await resp.json();

    if (!resp.ok) {
      throw new Error(data.error || 'Failed to complete quiz');
    }

    // Now submit to blockchain — score is still hidden from user
    const progressEl = document.getElementById('submit-progress');
    if (progressEl) progressEl.textContent = '🔗 Submitting score on-chain... Please confirm in MetaMask.';

    await submitScoreOnChain(data);

  } catch (err) {
    console.error('Quiz completion failed:', err);
    showQuizError(`Failed to complete quiz: ${err.message}`);
  }
}

// =================== ON-CHAIN SUBMISSION ===================

async function submitScoreOnChain(serverData) {
  const { score, correctCount, totalQuestions: total, quizId, signature, nonce } = serverData;
  const content = document.getElementById('quiz-modal-content');
  const maxScore = total * MAX_POINTS_PER_QUESTION;

  if (!CONTRACT_ADDRESS) {
    // No contract configured — show score without on-chain submission
    showResults(score, correctCount, total, maxScore, null);
    return;
  }

  if (!isConnected()) {
    const connected = await connectWallet();
    if (!connected) {
      showResults(score, correctCount, total, maxScore, null);
      return;
    }
  }

  try {
    const signerInstance = getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, QUIZ_SCORES_ABI, signerInstance);

    const progressEl = document.getElementById('submit-progress');
    if (progressEl) progressEl.textContent = '⏳ Confirm the transaction in MetaMask...';

    const tx = await contract.submitScore(quizId, score, nonce, signature);

    if (progressEl) progressEl.textContent = '⏳ Transaction submitted! Waiting for confirmation...';

    const receipt = await tx.wait();

    // Mark as attempted in localStorage
    const addr = getAddress();
    localStorage.setItem(`quiz_attempted_${quizId}_${addr?.toLowerCase()}`, 'true');

    // NOW show the score (only after on-chain confirmation)
    showResults(score, correctCount, total, maxScore, receipt.hash);

    // Refresh leaderboard
    window.dispatchEvent(new CustomEvent('score-submitted'));

  } catch (err) {
    console.error('On-chain submission failed:', err);

    if (err.code === 'ACTION_REJECTED' || err.code === 4001) {
      // User rejected — show score anyway since server has it
      showResults(score, correctCount, total, maxScore, null, 'Transaction rejected. Your score was not stored on-chain.');
    } else {
      showResults(score, correctCount, total, maxScore, null,
        `On-chain submission failed: ${err.reason || err.message || 'Unknown error'}`);
    }
  }
}

// =================== RESULTS DISPLAY ===================

function showResults(score, correctCount, total, maxScore, txHash, errorMsg = null) {
  const content = document.getElementById('quiz-modal-content');
  const percentage = Math.round((score / maxScore) * 100);

  let grade = '';
  if (percentage >= 90) grade = '🏆 Outstanding!';
  else if (percentage >= 70) grade = '🌟 Great Job!';
  else if (percentage >= 50) grade = '👍 Good Effort!';
  else grade = '💪 Keep Learning!';

  const txLink = txHash
    ? `<a href="https://sepolia.etherscan.io/tx/${txHash}" target="_blank" rel="noopener" class="results-tx-link">View on Etherscan ↗</a>`
    : '';

  const statusBadge = txHash
    ? '<span class="results-status success">✅ Stored On-Chain</span>'
    : errorMsg
      ? `<span class="results-status error">⚠️ ${errorMsg}</span>`
      : '<span class="results-status warning">⚠️ Contract not configured</span>';

  content.innerHTML = `
    <div class="quiz-results">
      <button class="modal-close" id="quiz-modal-close">&times;</button>
      <div class="results-grade">${grade}</div>
      <h2>Quiz ${currentQuizId + 1} Complete!</h2>

      <div class="results-score-ring">
        <svg viewBox="0 0 120 120">
          <circle class="score-ring-bg" cx="60" cy="60" r="54" />
          <circle class="score-ring-fill" cx="60" cy="60" r="54"
            style="stroke-dasharray: ${(percentage / 100) * 339.292} 339.292" />
        </svg>
        <div class="score-ring-text">
          <span class="score-ring-value">${score}</span>
          <span class="score-ring-max">/ ${maxScore}</span>
        </div>
      </div>

      <div class="results-stats">
        <div class="stat-item">
          <span class="stat-value">${correctCount}/${total}</span>
          <span class="stat-label">Correct</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">${percentage}%</span>
          <span class="stat-label">Score</span>
        </div>
      </div>

      ${statusBadge}
      ${txLink}

      <div class="results-actions">
        <button class="btn btn-primary" id="results-leaderboard-btn">🏆 View Leaderboard</button>
        <button class="btn btn-ghost" id="close-results-btn">Close</button>
      </div>

      <p class="results-no-retake">🚫 This quiz cannot be retaken.</p>
    </div>
  `;

  document.getElementById('quiz-modal-close').onclick = closeQuizModal;
  document.getElementById('close-results-btn').onclick = closeQuizModal;
  document.getElementById('results-leaderboard-btn').onclick = () => {
    closeQuizModal();
    window.location.hash = '#/leaderboard';
  };
}

// =================== MODAL MANAGEMENT ===================

function closeQuizModal() {
  const modal = document.getElementById('quiz-modal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
  document.onkeydown = null;
  clearInterval(quizTimerInterval);
  sessionJwt = null;
}
