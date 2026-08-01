import { presentations } from './data/presentations.js';
import { quizQuestions } from './data/quizQuestions.js';
import { workshopQuests } from './data/workshopQuests.js';
import { connectWallet, initWalletListeners, isConnected, isRegistered, getAddress, shortenAddress } from './wallet.js';
import { startQuiz } from './quiz.js';
import { loadLeaderboard, initLeaderboard } from './leaderboard.js';
import { openSlidePresenter } from './slides.js';
import { registerRoute, initRouter, navigateTo } from './router.js';

// =================== INITIALIZATION ===================

document.addEventListener('DOMContentLoaded', () => {
  initWalletListeners();
  initLeaderboard();
  initNotifications();
  initMobileNav();

  // Register pages
  registerRoute('/home', renderHomePage);
  registerRoute('/presentations', renderPresentationsPage);
  registerRoute('/quizzes', renderQuizzesPage);
  registerRoute('/leaderboard', renderLeaderboardPage);
  registerRoute('/quests', renderQuestsPage);

  // Start router
  initRouter();

  // Wallet button
  document.getElementById('wallet-connect-btn').addEventListener('click', connectWallet);
});

// =================== MOBILE NAV ===================

function initMobileNav() {
  const nav = document.getElementById('main-nav');
  const toggle = document.getElementById('mobile-nav-toggle');
  if (toggle) {
    toggle.addEventListener('click', () => nav.classList.toggle('mobile-open'));
  }
  // Close mobile nav on link click
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => nav.classList.remove('mobile-open'));
  });
}

// =================== NOTIFICATIONS ===================

function initNotifications() {
  window.addEventListener('app-notification', (e) => {
    const { message, type } = e.detail;
    showNotification(message, type);
  });
}

function showNotification(message, type = 'info') {
  const container = document.getElementById('notification-container');
  const notif = document.createElement('div');
  notif.className = `notification ${type}`;
  notif.innerHTML = `
    <span class="notif-icon">${type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️'}</span>
    <span class="notif-message">${message}</span>
    <button class="notif-close">&times;</button>
  `;
  container.appendChild(notif);

  notif.querySelector('.notif-close').onclick = () => notif.remove();
  setTimeout(() => notif.classList.add('show'), 10);
  setTimeout(() => {
    notif.classList.remove('show');
    setTimeout(() => notif.remove(), 300);
  }, 5000);
}

// =================== PAGE: HOME ===================

function renderHomePage(app) {
  app.innerHTML = `
    <section class="hero-section">
      <div class="hero-bg-image"></div>
      <div class="hero-bg-grid"></div>
      <div class="hero-glow hero-glow-1"></div>
      <div class="hero-glow hero-glow-2"></div>
      <div class="hero-content">
        <img src="/images/roadtodevconindia-logo-multicoloured.png" alt="Road to DevCon India" class="hero-devcon-logo" />
        <div class="hero-badge">🇮🇳 DevCon 8 · Mumbai · 3-6 November 2026</div>
        <h1 class="hero-title">
          Road to <span class="gradient-text">DevCon 8</span>
        </h1>
        <p class="hero-subtitle">Workshops Edition</p>
        <div class="crops-letters">
          <span class="crop-letter">C</span>
          <span class="crop-letter">R</span>
          <span class="crop-letter">O</span>
          <span class="crop-letter">P</span>
          <span class="crop-letter">S</span>
        </div>
        <div class="crops-meanings">
          <span>Censorship Resistance</span>
          <span class="crops-dot">·</span>
          <span>Resistance to Capture</span>
          <span class="crops-dot">·</span>
          <span>Open Source</span>
          <span class="crops-dot">·</span>
          <span>Privacy</span>
          <span class="crops-dot">·</span>
          <span>Security</span>
        </div>
        <div class="hero-actions">
          <a href="#/presentations" class="btn btn-primary btn-lg">Explore Presentations</a>
          <a href="#/quizzes" class="btn btn-secondary btn-lg">Take a Quiz</a>
        </div>
      </div>
    </section>
  `;
}

// =================== PAGE: PRESENTATIONS ===================

function renderPresentationsPage(app) {
  app.innerHTML = `
    <div class="page-container">
      <div class="page-header">
        <h1 class="page-title">📚 Presentations</h1>
        <p class="page-subtitle">Deep-dive into Ethereum's core principles. Click to read or present as slides.</p>
      </div>
      <div class="presentations-grid" id="presentations-grid"></div>
    </div>
  `;

  const grid = document.getElementById('presentations-grid');

  grid.innerHTML = presentations.map(p => `
    <div class="presentation-card animate-in" id="pres-card-${p.id}">
      <div class="pres-card-header">
        <span class="pres-icon">${p.icon}</span>
      </div>
      <h3 class="pres-title">${p.title}</h3>
      <p class="pres-tagline">${p.tagline}</p>
      <div class="pres-actions">
        <button class="btn btn-primary pres-present-btn" data-pres-id="${p.id}">
          🖥️ Present Slides
        </button>
        <button class="btn btn-ghost pres-expand-btn" data-pres-id="${p.id}">
          📖 Read Content
        </button>
      </div>
      <div class="pres-expanded" id="pres-expanded-${p.id}">
        ${p.sections.map(s => `
          <div class="pres-section">
            <h4>${s.heading}</h4>
            <div class="pres-section-content">${formatContent(s.content)}</div>
          </div>
        `).join('')}
        <button class="btn btn-ghost pres-collapse-btn" data-pres-id="${p.id}">
          Collapse ↑
        </button>
      </div>
    </div>
  `).join('');

  // Bind present buttons
  grid.querySelectorAll('.pres-present-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      openSlidePresenter(parseInt(btn.dataset.presId));
    });
  });

  // Bind expand/collapse
  grid.querySelectorAll('.pres-expand-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.presId;
      const expanded = document.getElementById(`pres-expanded-${id}`);
      expanded.classList.toggle('active');
      btn.textContent = expanded.classList.contains('active') ? '📖 Hide Content' : '📖 Read Content';
    });
  });

  grid.querySelectorAll('.pres-collapse-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.presId;
      const expanded = document.getElementById(`pres-expanded-${id}`);
      const card = document.getElementById(`pres-card-${id}`);
      expanded.classList.remove('active');
      card.querySelector('.pres-expand-btn').textContent = '📖 Read Content';
      card.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

// =================== PAGE: QUIZZES ===================

function renderQuizzesPage(app) {
  app.innerHTML = `
    <div class="page-container">
      <div class="page-header">
        <h1 class="page-title">🧠 Knowledge Quizzes</h1>
        <p class="page-subtitle">Test your understanding! 10 random questions per attempt, 30 seconds each. Scores stored on-chain.</p>
      </div>
      <div class="quiz-grid" id="quiz-grid"></div>
    </div>
  `;

  const grid = document.getElementById('quiz-grid');

  grid.innerHTML = quizQuestions.map(q => `
    <div class="quiz-card animate-in">
      <div class="quiz-card-icon">${q.icon}</div>
      <h3>Quiz ${q.quizId + 1}</h3>
      <p class="quiz-card-title">${q.title}</p>
      <p class="quiz-card-desc">${q.description}</p>
      <div class="quiz-card-meta">
        <span>10 Random Questions</span>
        <span>Max 2,000 pts</span>
      </div>
      <div class="quiz-card-rules">
        <span>⏱️ 30s/question</span>
        <span>🚫 One attempt</span>
      </div>
      <button class="btn btn-primary quiz-take-btn" data-quiz-id="${q.quizId}">
        Take Quiz →
      </button>
    </div>
  `).join('');

  grid.querySelectorAll('.quiz-take-btn').forEach(btn => {
    btn.addEventListener('click', () => startQuiz(parseInt(btn.dataset.quizId)));
  });
}

// =================== PAGE: LEADERBOARD ===================

function renderLeaderboardPage(app) {
  app.innerHTML = `
    <div class="page-container">
      <div class="page-header">
        <h1 class="page-title">🏆 Leaderboard</h1>
        <p class="page-subtitle">On-chain scores from the Sepolia testnet. Compete for the top!</p>
      </div>
      <div class="leaderboard-content" id="leaderboard-content"></div>
    </div>
  `;

  loadLeaderboard(document.getElementById('leaderboard-content'));
}

// =================== PAGE: QUESTS ===================

function renderQuestsPage(app) {
  app.innerHTML = `
    <div class="page-container">
      <div class="page-header">
        <h1 class="page-title">🛠️ Workshop Quests</h1>
        <p class="page-subtitle">Hands-on smart contract development using Remix IDE, no installations needed!</p>
      </div>
      <div class="quests-container" id="quests-container"></div>
    </div>
  `;

  const container = document.getElementById('quests-container');

  container.innerHTML = workshopQuests.map(quest => `
    <div class="quest-card animate-in" id="quest-${quest.id}">
      <div class="quest-header">
        <div class="quest-icon-wrap">
          <span class="quest-icon">${quest.icon}</span>
        </div>
        <div class="quest-meta-info">
          <span class="quest-badge">${quest.difficulty}</span>
          <span class="quest-duration">${quest.duration}</span>
        </div>
      </div>
      
      <h3 class="quest-title">Quest ${quest.id}: ${quest.title}</h3>
      <p class="quest-subtitle">${quest.subtitle}</p>
      <p class="quest-overview">${quest.overview}</p>

      <div class="quest-prereqs">
        <h4>📋 Prerequisites</h4>
        <ul>${quest.prerequisites.map(p => `<li>${p}</li>`).join('')}</ul>
      </div>

      <div class="quest-tools">
        <h4>🔧 Tools Needed</h4>
        <div class="tools-grid">
          ${quest.tools.map(t => `
            <a href="${t.url}" target="_blank" rel="noopener" class="tool-link">
              <strong>${t.name}</strong>
              <span>${t.desc}</span>
            </a>
          `).join('')}
        </div>
      </div>

      <button class="btn btn-primary quest-expand-btn" data-quest-id="${quest.id}">
        📖 View Step-by-Step Guide
      </button>

      <div class="quest-steps" id="quest-steps-${quest.id}">
        ${quest.steps.map((step, i) => `
          <div class="quest-step">
            <div class="step-number">${i + 1}</div>
            <div class="step-content">
              <h4>${step.title}</h4>
              <div class="step-body">${formatContent(step.content)}</div>
            </div>
          </div>
        `).join('')}
        <button class="btn btn-ghost quest-collapse-btn" data-quest-id="${quest.id}">
          Collapse Guide ↑
        </button>
      </div>
    </div>
  `).join('');

  container.querySelectorAll('.quest-expand-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.questId;
      const steps = document.getElementById(`quest-steps-${id}`);
      steps.classList.toggle('active');
      btn.textContent = steps.classList.contains('active') ? '📖 Hide Guide' : '📖 View Step-by-Step Guide';
    });
  });

  container.querySelectorAll('.quest-collapse-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.questId;
      const steps = document.getElementById(`quest-steps-${id}`);
      const card = document.getElementById(`quest-${id}`);
      steps.classList.remove('active');
      card.querySelector('.quest-expand-btn').textContent = '📖 View Step-by-Step Guide';
      card.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // Initialize copy buttons after DOM render
  initCopyButtons(container);
}

// =================== CONTENT FORMATTING ===================

function formatContent(text) {
  // Step 1: Extract code blocks BEFORE splitting (they contain \n\n internally)
  const codeBlocks = [];
  const withPlaceholders = text.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
    const idx = codeBlocks.length;
    codeBlocks.push({ lang: lang || 'code', code: code.trim() });
    return `__CODE_BLOCK_${idx}__`;
  });

  // Step 2: Split and format paragraphs
  return withPlaceholders
    .split('\n\n')
    .map(para => {
      // Check for code block placeholder
      const cbMatch = para.match(/^__CODE_BLOCK_(\d+)__$/);
      if (cbMatch) {
        const cb = codeBlocks[parseInt(cbMatch[1])];
        const langLabel = cb.lang.charAt(0).toUpperCase() + cb.lang.slice(1);
        const escapedCode = escapeHtml(cb.code);
        return `
          <div class="code-window">
            <div class="code-window-header">
              <span class="code-window-lang">${langLabel}</span>
              <button class="code-copy-btn" data-code="${encodeURIComponent(cb.code)}">
                <span class="copy-icon">📋</span>
                <span class="copy-text">Copy</span>
              </button>
            </div>
            <pre class="code-window-body"><code>${escapedCode}</code></pre>
          </div>
        `;
      }
      // Handle bullet points
      if (para.includes('\n•') || para.startsWith('•')) {
        const items = para.split('\n').filter(l => l.startsWith('•'));
        const intro = para.split('\n')[0].startsWith('•') ? '' : `<p>${formatInline(para.split('\n')[0])}</p>`;
        return `${intro}<ul>${items.map(item => `<li>${formatInline(item.slice(1).trim())}</li>`).join('')}</ul>`;
      }
      // Handle numbered lists: detect if ANY line in the block starts with a digit-dot pattern
      const lines = para.split('\n');
      const hasNumberedItems = lines.some(l => /^\d+\.\s/.test(l.trim()));
      if (hasNumberedItems) {
        const result = [];
        let currentOl = [];
        for (const line of lines) {
          const trimmed = line.trim();
          if (/^\d+\.\s/.test(trimmed)) {
            currentOl.push(`<li>${formatInline(trimmed.replace(/^\d+\.\s/, '').trim())}</li>`);
          } else if (trimmed) {
            // Flush any pending ordered list items
            if (currentOl.length) {
              result.push(`<ol>${currentOl.join('')}</ol>`);
              currentOl = [];
            }
            result.push(`<p>${formatInline(trimmed)}</p>`);
          }
        }
        if (currentOl.length) {
          result.push(`<ol>${currentOl.join('')}</ol>`);
        }
        return result.join('');
      }
      // Handle blockquotes
      if (para.trim().startsWith('>')) {
        const text = para.replace(/^>\s*/gm, '');
        return `<blockquote>${formatInline(text)}</blockquote>`;
      }
      return `<p>${formatInline(para)}</p>`;
    })
    .join('');
}

function formatInline(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// =================== CODE COPY BUTTONS ===================

function initCopyButtons(container) {
  container.querySelectorAll('.code-copy-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const code = decodeURIComponent(btn.dataset.code);
      try {
        await navigator.clipboard.writeText(code);
        const textEl = btn.querySelector('.copy-text');
        const iconEl = btn.querySelector('.copy-icon');
        textEl.textContent = 'Copied!';
        iconEl.textContent = '✅';
        btn.classList.add('copied');
        setTimeout(() => {
          textEl.textContent = 'Copy';
          iconEl.textContent = '📋';
          btn.classList.remove('copied');
        }, 2000);
      } catch (err) {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = code;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        textarea.remove();
      }
    });
  });
}
