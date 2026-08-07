import { ethers } from 'ethers';
import { QUIZ_SCORES_ABI, SEPOLIA_RPC_URL } from './abi.js';
import { quizQuestions } from './data/quizQuestions.js';
import { EVENTS, DEFAULT_EVENT_ID } from './config/events.js';

// =================== STATE ===================
let leaderboardData = [];
let activeTab = 'all';
let activeEventId = DEFAULT_EVENT_ID;

// =================== PUBLIC API ===================

export async function loadLeaderboard(container) {
  if (!container) container = document.getElementById('leaderboard-content');
  if (!container) return;

  if (EVENTS.length === 0) {
    container.innerHTML = `
      <div class="leaderboard-empty">
        <span class="empty-icon">⚙️</span>
        <p>No events configured yet.</p>
        <p class="empty-sub">Add events to <code>src/config/events.js</code> to get started.</p>
      </div>
    `;
    return;
  }

  const event = EVENTS.find(e => e.id === activeEventId) || EVENTS[0];
  activeEventId = event.id;

  // Render the event selector + loading state
  const tableArea = container.querySelector('#leaderboard-table-area');
  if (tableArea) {
    // If event selector already exists, just refresh the table area
    tableArea.innerHTML = `
      <div class="leaderboard-loading">
        <div class="spinner-lg"></div>
        <p>Loading leaderboard from Sepolia...</p>
      </div>
    `;
  } else {
    // First render — build the full layout with event selector
    container.innerHTML = `
      <div class="event-selector" id="event-selector">
        <label for="event-dropdown" class="event-selector-label">📍 Event</label>
        <select id="event-dropdown" class="event-dropdown">
          ${EVENTS.map(e => `
            <option value="${e.id}" ${e.id === activeEventId ? 'selected' : ''}>
              ${escapeHtml(e.name)}
            </option>
          `).join('')}
        </select>
        ${event.id ? `
          <a id="event-luma-link" class="event-luma-link" href="https://luma.com/${event.id}" target="_blank" rel="noopener" title="View on Luma">
            Luma ↗
          </a>
        ` : ''}
      </div>
      <div id="leaderboard-table-area">
        <div class="leaderboard-loading">
          <div class="spinner-lg"></div>
          <p>Loading leaderboard from Sepolia...</p>
        </div>
      </div>
    `;

    // Attach event dropdown listener
    container.querySelector('#event-dropdown').addEventListener('change', (e) => {
      activeEventId = e.target.value;
      activeTab = 'all';
      // Update Luma link
      const lumaLink = container.querySelector('#event-luma-link');
      if (lumaLink) {
        if (activeEventId) {
          lumaLink.href = `https://luma.com/${activeEventId}`;
          lumaLink.style.display = '';
        } else {
          lumaLink.style.display = 'none';
        }
      }
      loadLeaderboard(container);
    });
  }

  const area = container.querySelector('#leaderboard-table-area');

  try {
    const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);
    const contract = new ethers.Contract(event.contract, QUIZ_SCORES_ABI, provider);

    const participantCount = await contract.getParticipantCount();
    const count = Number(participantCount);

    if (count === 0) {
      area.innerHTML = `
        <div class="leaderboard-empty">
          <span class="empty-icon">🏆</span>
          <p>No scores submitted yet!</p>
          <p class="empty-sub">Be the first to take a quiz and submit your score on-chain.</p>
        </div>
      `;
      return;
    }

    const batchSize = 50;
    leaderboardData = [];

    for (let start = 0; start < count; start += batchSize) {
      const batch = await contract.getLeaderboardBatch(start, batchSize);
      for (let i = 0; i < batch.wallets.length; i++) {
        const scores = batch.scores[i].map(s => Number(s));
        leaderboardData.push({
          wallet: batch.wallets[i],
          name: batch.names[i],
          xUsername: batch.xUsernames[i],
          scores: scores,
          totalScore: scores.reduce((a, b) => a + b, 0)
        });
      }
    }

    leaderboardData.sort((a, b) => b.totalScore - a.totalScore);
    renderLeaderboard(area, event.contract);
  } catch (err) {
    console.error('Failed to load leaderboard:', err);
    area.innerHTML = `
      <div class="leaderboard-empty">
        <span class="empty-icon">⚠️</span>
        <p>Failed to load leaderboard.</p>
        <p class="empty-sub">${err.message || 'Please check your network connection and try again.'}</p>
        <button class="btn btn-secondary" onclick="window.dispatchEvent(new CustomEvent('reload-leaderboard'))">
          Retry
        </button>
      </div>
    `;
  }
}

// =================== RENDERING ===================

function renderLeaderboard(area, contractAddress) {
  if (!area) return;

  const quizTitles = quizQuestions.map(q => q.title);

  area.innerHTML = `
    <div class="leaderboard-tabs" id="leaderboard-tabs">
      <button class="lb-tab ${activeTab === 'all' ? 'active' : ''}" data-tab="all">
        🏆 Overall
      </button>
      ${quizTitles.map((title, i) => `
        <button class="lb-tab ${activeTab === `quiz-${i}` ? 'active' : ''}" data-tab="quiz-${i}">
          Quiz ${i + 1}
        </button>
      `).join('')}
    </div>
    <div class="leaderboard-table-wrapper" id="leaderboard-table-wrapper">
      ${renderTable(activeTab)}
    </div>
    <div class="leaderboard-footer">
      <p>📊 ${leaderboardData.length} participant${leaderboardData.length !== 1 ? 's' : ''} · Scores stored on <a href="https://sepolia.etherscan.io/address/${contractAddress}" target="_blank" rel="noopener">Sepolia ↗</a></p>
    </div>
  `;

  area.querySelectorAll('.lb-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      activeTab = tab.dataset.tab;
      area.querySelectorAll('.lb-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('leaderboard-table-wrapper').innerHTML = renderTable(activeTab);
    });
  });
}

function renderTable(tab) {
  let sortedData;
  let scoreHeader;
  let getScore;

  if (tab === 'all') {
    sortedData = [...leaderboardData].sort((a, b) => b.totalScore - a.totalScore);
    scoreHeader = 'Total Score';
    getScore = (p) => p.totalScore;
  } else {
    const quizIndex = parseInt(tab.split('-')[1]);
    sortedData = [...leaderboardData]
      .filter(p => p.scores[quizIndex] > 0)
      .sort((a, b) => b.scores[quizIndex] - a.scores[quizIndex]);
    scoreHeader = `Quiz ${quizIndex + 1} Score`;
    getScore = (p) => p.scores[quizIndex];
  }

  if (sortedData.length === 0) {
    return `
      <div class="leaderboard-empty-tab">
        <p>No scores yet for this quiz.</p>
      </div>
    `;
  }

  const podium = sortedData.slice(0, 3);
  const rest = sortedData.slice(3);

  const medals = ['🥇', '🥈', '🥉'];
  const podiumColors = ['#fbbf24', '#94a3b8', '#cd7f32'];

  return `
    <div class="leaderboard-podium">
      ${podium.map((p, i) => `
        <div class="podium-card ${i === 0 ? 'gold' : i === 1 ? 'silver' : 'bronze'}" style="--podium-color: ${podiumColors[i]}">
          <span class="podium-medal">${medals[i]}</span>
          <span class="podium-rank">#${i + 1}</span>
          <span class="podium-name">${escapeHtml(p.name)}</span>
          <a class="podium-x" href="https://x.com/${escapeHtml(p.xUsername)}" target="_blank" rel="noopener">@${escapeHtml(p.xUsername)}</a>
          <span class="podium-score">${getScore(p).toLocaleString()}</span>
          ${tab === 'all' ? `
            <div class="podium-breakdown">
              ${p.scores.map((s, qi) => `<span class="mini-score">Q${qi+1}:${s}</span>`).join('')}
            </div>
          ` : ''}
        </div>
      `).join('')}
    </div>

    ${rest.length > 0 ? `
      <table class="leaderboard-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>X Handle</th>
            ${tab === 'all' ? '<th>Q1</th><th>Q2</th><th>Q3</th><th>Q4</th>' : ''}
            <th>${scoreHeader}</th>
          </tr>
        </thead>
        <tbody>
          ${rest.map((p, i) => `
            <tr>
              <td class="rank-cell">${i + 4}</td>
              <td class="name-cell">${escapeHtml(p.name)}</td>
              <td class="x-cell"><a href="https://x.com/${escapeHtml(p.xUsername)}" target="_blank" rel="noopener">@${escapeHtml(p.xUsername)}</a></td>
              ${tab === 'all' ? p.scores.map(s => `<td>${s}</td>`).join('') : ''}
              <td class="score-cell"><strong>${getScore(p).toLocaleString()}</strong></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    ` : ''}
  `;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// =================== AUTO-REFRESH ===================

export function initLeaderboard() {
  window.addEventListener('score-submitted', () => {
    setTimeout(() => loadLeaderboard(), 3000);
  });
  window.addEventListener('reload-leaderboard', () => loadLeaderboard());
}
