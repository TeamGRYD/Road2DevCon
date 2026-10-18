import { ethers } from 'ethers';
import {
  FEED_ABI, FEED_CONTRACT_ADDRESS, PROFILE_REGISTRY_ABI, PROFILE_REGISTRY_ADDRESS, SEPOLIA_RPC_URL
} from './abi.js';
import { ACTIVE_TOPICS } from './config/topics.js';
import {
  connectWallet, isConnected, isRegistered, getAddress, getSigner, onWalletConnect, onWalletDisconnect
} from './wallet.js';
import { isGasless, sendContractTx } from './gasless.js';

// =================== CONSTANTS ===================

// Must match FeedContract.Platform (append-only)
const PLATFORM = { X: 0, YOUTUBE: 1, INSTAGRAM: 2 };
const PLATFORM_META = {
  [PLATFORM.X]: { label: 'X', icon: '𝕏' },
  [PLATFORM.YOUTUBE]: { label: 'YouTube', icon: '▶' },
  [PLATFORM.INSTAGRAM]: { label: 'Instagram', icon: '◎' },
};
const MEDIA_ID_RE = /^[A-Za-z0-9_-]{1,32}$/;
const BATCH_SIZE = 50;
// Show the "Open on …" link if a widget hasn't rendered by then (slow, or blocked by tracking protection)
const EMBED_TIMEOUT_MS = 15000;
const SORT_KEY = 'feed_sort';

// =================== STATE ===================

let submissionsByTopic = {}; // topicId => [submission]
let profiles = {};           // lowercase address => { name, xUsername }
let myVotes = {};            // submission id => -1 | 0 | 1
let pendingVotes = new Set();
let sortMode = readSort();
let embedObserver = null;

function readSort() {
  try { return localStorage.getItem(SORT_KEY) === 'new' ? 'new' : 'top'; } catch { return 'top'; }
}

function saveSort(mode) {
  try { localStorage.setItem(SORT_KEY, mode); } catch { /* storage unavailable */ }
}

// =================== URL PARSING ===================

/**
 * Parse an X / YouTube / Instagram URL into its canonical on-chain form.
 * Returns { platform, mediaId } or null if the URL isn't supported.
 */
export function parseMediaUrl(input) {
  let url;
  try {
    url = new URL(input.trim());
  } catch {
    return null;
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;

  const host = url.hostname.toLowerCase().replace(/^(www\.|mobile\.|m\.)/, '');
  const parts = url.pathname.split('/').filter(Boolean);
  let platform = null;
  let mediaId = null;

  if (host === 'x.com' || host === 'twitter.com') {
    // /{user}/status/{id} or /i/web/status/{id}
    const i = parts.findIndex(p => p === 'status' || p === 'statuses');
    if (i !== -1 && /^\d{1,20}$/.test(parts[i + 1] || '')) {
      platform = PLATFORM.X;
      mediaId = parts[i + 1];
    }
  } else if (host === 'youtu.be') {
    platform = PLATFORM.YOUTUBE;
    mediaId = parts[0];
  } else if (host === 'youtube.com') {
    platform = PLATFORM.YOUTUBE;
    if (parts[0] === 'watch') mediaId = url.searchParams.get('v');
    else if (['shorts', 'embed', 'live'].includes(parts[0])) mediaId = parts[1];
  } else if (host === 'instagram.com') {
    // /p/{code}, /reel/{code}, /reels/{code}, /tv/{code} (optionally prefixed by /{user})
    const i = parts.findIndex(p => ['p', 'reel', 'reels', 'tv'].includes(p));
    if (i !== -1) {
      platform = PLATFORM.INSTAGRAM;
      mediaId = parts[i + 1];
    }
  }

  if (platform === null || !mediaId) return null;
  if (platform === PLATFORM.YOUTUBE && !/^[A-Za-z0-9_-]{11}$/.test(mediaId)) return null;
  if (!MEDIA_ID_RE.test(mediaId)) return null;
  return { platform, mediaId };
}

function permalink(platform, mediaId) {
  switch (platform) {
    case PLATFORM.X: return `https://x.com/i/status/${mediaId}`;
    case PLATFORM.YOUTUBE: return `https://www.youtube.com/watch?v=${mediaId}`;
    case PLATFORM.INSTAGRAM: return `https://www.instagram.com/p/${mediaId}/`;
    default: return '#';
  }
}

// =================== PAGE ===================

export function renderFeedPage(app) {
  app.innerHTML = `
    <div class="page-container">
      <div class="page-header">
        <h1 class="page-title">📣 Feed</h1>
        <p class="page-subtitle">Posts and videos from the community, one topic per row. Submit a link and vote on-chain.</p>
      </div>
      <div class="feed-toolbar">
        <div class="feed-sort" role="group" aria-label="Sort submissions">
          <button class="feed-sort-btn ${sortMode === 'top' ? 'active' : ''}" data-sort="top">🔥 Top</button>
          <button class="feed-sort-btn ${sortMode === 'new' ? 'active' : ''}" data-sort="new">🕒 New</button>
        </div>
      </div>
      <div class="feed-content" id="feed-content"></div>
    </div>
    <button class="feed-fab" id="feed-fab" aria-label="Submit a post" title="Submit a post">+</button>
  `;

  app.querySelectorAll('.feed-sort-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset.sort === sortMode) return;
      sortMode = btn.dataset.sort;
      saveSort(sortMode);
      app.querySelectorAll('.feed-sort-btn').forEach(b => b.classList.toggle('active', b === btn));
      renderTopics();
    });
  });

  app.querySelector('#feed-fab').addEventListener('click', () => openSubmitModal());

  loadFeed();
}

async function loadFeed() {
  const container = document.getElementById('feed-content');
  if (!container) return;

  if (!FEED_CONTRACT_ADDRESS || !PROFILE_REGISTRY_ADDRESS) {
    container.innerHTML = emptyState('⚙️', 'Feed is not configured yet.',
      'Set <code>VITE_FEED_CONTRACT_ADDRESS</code> and <code>VITE_PROFILE_REGISTRY_ADDRESS</code> in .env.');
    document.getElementById('feed-fab')?.remove();
    return;
  }

  if (ACTIVE_TOPICS.length === 0) {
    container.innerHTML = emptyState('🗂️', 'No topics yet.', 'Add topics to <code>src/config/topics.js</code>.');
    return;
  }

  container.innerHTML = `
    <div class="leaderboard-loading">
      <div class="spinner-lg"></div>
      <p>Loading feed from Sepolia...</p>
    </div>
  `;

  try {
    const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);
    const feed = new ethers.Contract(FEED_CONTRACT_ADDRESS, FEED_ABI, provider);
    const registry = new ethers.Contract(PROFILE_REGISTRY_ADDRESS, PROFILE_REGISTRY_ABI, provider);

    const results = await Promise.all(ACTIVE_TOPICS.map(t => fetchTopic(feed, t.id)));
    submissionsByTopic = {};
    ACTIVE_TOPICS.forEach((t, i) => { submissionsByTopic[t.id] = results[i]; });

    const all = results.flat();
    await Promise.all([fetchProfiles(registry, all), fetchMyVotes(feed, all)]);

    renderTopics();
  } catch (err) {
    console.error('Failed to load feed:', err);
    container.innerHTML = `
      ${emptyState('⚠️', 'Failed to load feed.', escapeHtml(err.shortMessage || err.message || 'Please check your network connection and try again.'))}
      <div class="feed-retry"><button class="btn btn-secondary" id="feed-retry-btn">Retry</button></div>
    `;
    container.querySelector('#feed-retry-btn').addEventListener('click', loadFeed);
  }
}

async function fetchTopic(feed, topicId) {
  const count = Number(await feed.getTopicCount(topicId));
  const rows = [];
  for (let start = 0; start < count; start += BATCH_SIZE) {
    const batch = await feed.getTopicBatch(topicId, start, BATCH_SIZE);
    for (const s of batch) {
      const submission = {
        id: Number(s.id),
        topicId: Number(s.topicId),
        platform: Number(s.platform),
        mediaId: s.mediaId,
        submitter: s.submitter,
        timestamp: Number(s.timestamp),
        upvotes: Number(s.upvotes),
        downvotes: Number(s.downvotes),
      };
      // Skip moderated posts and anything we can't render safely
      if (s.hidden || !PLATFORM_META[submission.platform] || !MEDIA_ID_RE.test(submission.mediaId)) continue;
      rows.push(submission);
    }
  }
  return rows;
}

async function fetchProfiles(registry, submissions) {
  const wallets = [...new Set(submissions.map(s => s.submitter))]
    .filter(w => !profiles[w.toLowerCase()]);
  for (let i = 0; i < wallets.length; i += 100) {
    const chunk = wallets.slice(i, i + 100);
    const res = await registry.getProfilesBatch(chunk);
    chunk.forEach((w, j) => {
      profiles[w.toLowerCase()] = { name: res.names[j], xUsername: res.xUsernames[j] };
    });
  }
}

async function fetchMyVotes(feed, submissions) {
  myVotes = {};
  const addr = getAddress();
  if (!addr || submissions.length === 0) return;
  const ids = submissions.map(s => s.id);
  for (let i = 0; i < ids.length; i += 200) {
    const chunk = ids.slice(i, i + 200);
    const votes = await feed.getUserVotes(addr, chunk);
    chunk.forEach((id, j) => { myVotes[id] = Number(votes[j]); });
  }
}

// =================== RENDERING ===================

function sortSubmissions(list) {
  const sorted = [...list];
  if (sortMode === 'new') {
    sorted.sort((a, b) => b.id - a.id);
  } else {
    sorted.sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes) || b.id - a.id);
  }
  return sorted;
}

function renderTopics() {
  const container = document.getElementById('feed-content');
  if (!container) return;

  if (embedObserver) embedObserver.disconnect();
  embedObserver = new IntersectionObserver(onEmbedVisible, { rootMargin: '300px' });

  container.innerHTML = ACTIVE_TOPICS.map(topic => {
    const list = sortSubmissions(submissionsByTopic[topic.id] || []);
    return `
      <section class="feed-topic" id="feed-topic-${topic.id}">
        <div class="feed-topic-header">
          <h2 class="feed-topic-title"><span class="feed-topic-emoji">${topic.emoji}</span>${escapeHtml(topic.title)}</h2>
          <p class="feed-topic-desc">${escapeHtml(topic.description || '')} · ${list.length} post${list.length !== 1 ? 's' : ''}</p>
        </div>
        ${list.length > 0 ? `
          <div class="feed-row">
            ${list.map(renderCard).join('')}
          </div>
        ` : `
          <div class="feed-topic-empty">
            <p>No posts yet.</p>
            <button class="btn btn-ghost feed-first-btn" data-topic="${topic.id}">Be the first to share →</button>
          </div>
        `}
      </section>
    `;
  }).join('');

  container.querySelectorAll('.feed-embed').forEach(el => embedObserver.observe(el));
  container.querySelectorAll('.feed-vote-btn').forEach(btn => btn.addEventListener('click', onVoteClick));
  container.querySelectorAll('.feed-first-btn').forEach(btn => {
    btn.addEventListener('click', () => openSubmitModal(Number(btn.dataset.topic)));
  });
}

function renderCard(s) {
  const profile = profiles[s.submitter.toLowerCase()];
  const meta = PLATFORM_META[s.platform];
  const mine = getAddress()?.toLowerCase() === s.submitter.toLowerCase();
  return `
    <article class="feed-card" data-id="${s.id}">
      <div class="feed-embed platform-${s.platform}" data-platform="${s.platform}" data-media="${s.mediaId}">
        <div class="feed-embed-placeholder"><div class="spinner-lg"></div></div>
      </div>
      <div class="feed-card-footer">
        <div class="feed-card-author">
          <span class="feed-author-name">${escapeHtml(profile?.name || shortAddress(s.submitter))}</span>
          ${profile?.xUsername ? `<a class="feed-author-x" href="https://x.com/${encodeURIComponent(profile.xUsername)}" target="_blank" rel="noopener">@${escapeHtml(profile.xUsername)}</a>` : ''}
        </div>
        <a class="feed-source-link" href="${permalink(s.platform, s.mediaId)}" target="_blank" rel="noopener" title="Open on ${meta.label}">${meta.icon} ↗</a>
      </div>
      <div class="feed-votes">
        ${renderVoteButtons(s, mine)}
      </div>
    </article>
  `;
}

function renderVoteButtons(s, mine) {
  const vote = myVotes[s.id] || 0;
  const pending = pendingVotes.has(s.id);
  const disabled = mine || pending ? 'disabled' : '';
  const title = mine ? 'title="You can\'t vote on your own post"' : '';
  return `
    <button class="feed-vote-btn up ${vote === 1 ? 'active' : ''}" data-id="${s.id}" data-value="1" ${disabled} ${title} aria-label="Upvote">▲ <span>${s.upvotes}</span></button>
    <button class="feed-vote-btn down ${vote === -1 ? 'active' : ''}" data-id="${s.id}" data-value="-1" ${disabled} ${title} aria-label="Downvote">▼ <span>${s.downvotes}</span></button>
    ${pending ? '<span class="spinner feed-vote-spinner"></span>' : ''}
  `;
}

function refreshCardVotes(id) {
  const s = findSubmission(id);
  const card = document.querySelector(`.feed-card[data-id="${id}"] .feed-votes`);
  if (!s || !card) return;
  const mine = getAddress()?.toLowerCase() === s.submitter.toLowerCase();
  card.innerHTML = renderVoteButtons(s, mine);
  card.querySelectorAll('.feed-vote-btn').forEach(btn => btn.addEventListener('click', onVoteClick));
}

function findSubmission(id) {
  for (const list of Object.values(submissionsByTopic)) {
    const s = list.find(x => x.id === id);
    if (s) return s;
  }
  return null;
}

// =================== EMBEDS ===================

function onEmbedVisible(entries) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    embedObserver.unobserve(entry.target);
    mountEmbed(entry.target, Number(entry.target.dataset.platform), entry.target.dataset.media);
  });
}

const scriptPromises = {};
function loadScript(src) {
  if (!scriptPromises[src]) {
    scriptPromises[src] = new Promise((resolve, reject) => {
      const el = document.createElement('script');
      el.src = src;
      el.async = true;
      el.onload = resolve;
      el.onerror = () => {
        delete scriptPromises[src];
        reject(new Error(`Failed to load ${src}`));
      };
      document.head.appendChild(el);
    });
  }
  return scriptPromises[src];
}

async function mountEmbed(el, platform, mediaId) {
  if (!MEDIA_ID_RE.test(mediaId)) return;
  try {
    if (platform === PLATFORM.YOUTUBE) {
      el.innerHTML = `
        <iframe class="feed-yt" src="https://www.youtube-nocookie.com/embed/${mediaId}?rel=0"
          title="YouTube video" loading="lazy" frameborder="0"
          allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      `;
    } else if (platform === PLATFORM.X) {
      await withTimeout((async () => {
        await loadScript('https://platform.twitter.com/widgets.js');
        await new Promise(resolve => window.twttr.ready(resolve));
      })(), EMBED_TIMEOUT_MS);

      // createTweet never settles for a detached container, so render in place
      // after the spinner, and swap the spinner out once the tweet is ready
      const holder = document.createElement('div');
      el.appendChild(holder);
      const slow = setTimeout(() => {
        el.querySelector('.feed-embed-placeholder')?.replaceWith(fallbackNode(platform, mediaId));
      }, EMBED_TIMEOUT_MS);
      const tweet = await window.twttr.widgets.createTweet(mediaId, holder, {
        theme: 'dark', dnt: true, conversation: 'none', align: 'center'
      }).finally(() => clearTimeout(slow));
      if (!tweet) throw new Error('Post unavailable');
      el.querySelector('.feed-embed-placeholder, .feed-embed-fallback')?.remove();
    } else if (platform === PLATFORM.INSTAGRAM) {
      el.innerHTML = `
        <blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/p/${mediaId}/" data-instgrm-version="14">
          <a href="https://www.instagram.com/p/${mediaId}/" target="_blank" rel="noopener">View on Instagram</a>
        </blockquote>
      `;
      await loadScript('https://www.instagram.com/embed.js');
      window.instgrm?.Embeds.process();
    }
  } catch (err) {
    console.warn('Embed failed:', err);
    el.replaceChildren(fallbackNode(platform, mediaId));
  }
}

function fallbackNode(platform, mediaId) {
  const node = document.createElement('div');
  node.className = 'feed-embed-fallback';
  node.innerHTML = `
    <p>Couldn't load this post.</p>
    <a href="${permalink(platform, mediaId)}" target="_blank" rel="noopener">Open on ${PLATFORM_META[platform].label} ↗</a>
  `;
  return node;
}

function withTimeout(promise, ms) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(`Timed out after ${ms}ms`)), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

// =================== VOTING ===================

async function onVoteClick(e) {
  const btn = e.currentTarget;
  const id = Number(btn.dataset.id);
  const clicked = Number(btn.dataset.value);
  const s = findSubmission(id);
  if (!s || pendingVotes.has(id)) return;

  if (!(await ensureRegistered())) return;
  if (getAddress().toLowerCase() === s.submitter.toLowerCase()) return;

  const previous = myVotes[id] || 0;
  const next = previous === clicked ? 0 : clicked;

  // Optimistic update
  applyVote(s, previous, next);
  pendingVotes.add(id);
  refreshCardVotes(id);

  try {
    const tx = await sendContractTx(getSigner(), FEED_CONTRACT_ADDRESS, FEED_ABI, 'vote', [id, next]);
    await tx.wait();
  } catch (err) {
    console.error('Vote failed:', err);
    applyVote(s, next, previous);
    notify(txErrorMessage(err, 'Vote failed'), 'error');
  } finally {
    pendingVotes.delete(id);
    refreshCardVotes(id);
  }
}

function applyVote(s, from, to) {
  if (from === 1) s.upvotes--;
  else if (from === -1) s.downvotes--;
  if (to === 1) s.upvotes++;
  else if (to === -1) s.downvotes++;
  myVotes[s.id] = to;
}

async function ensureRegistered() {
  if (!isConnected()) {
    const connected = await connectWallet();
    if (!connected) return false;
  }
  if (!isRegistered()) {
    // connectWallet() opens the registration modal for unregistered wallets
    notify('Register your profile to post and vote.', 'info');
    return false;
  }
  return true;
}

// =================== SUBMIT MODAL ===================

async function openSubmitModal(preselectedTopicId) {
  if (!FEED_CONTRACT_ADDRESS) return;
  if (!(await ensureRegistered())) return;

  const modal = document.getElementById('quiz-modal');
  const content = document.getElementById('quiz-modal-content');
  if (!modal || !content) return;

  const topicId = preselectedTopicId ?? ACTIVE_TOPICS[0]?.id;

  content.innerHTML = `
    <div class="feed-submit">
      <button class="modal-close" id="feed-modal-close">&times;</button>
      <h2>Submit to Feed</h2>
      <p class="quiz-reg-subtitle">Share a public post from X, YouTube or Instagram.</p>

      <div class="quiz-reg-form">
        <div class="form-group">
          <label for="feed-url">Link <span class="required">*</span></label>
          <input type="url" id="feed-url" placeholder="https://x.com/user/status/…" autocomplete="off" />
          <p class="feed-url-hint" id="feed-url-hint">Supports X posts, YouTube videos &amp; Shorts, Instagram posts &amp; Reels.</p>
        </div>
        <div class="form-group">
          <label for="feed-topic">Topic <span class="required">*</span></label>
          <select id="feed-topic" class="event-dropdown feed-topic-select">
            ${ACTIVE_TOPICS.map(t => `
              <option value="${t.id}" ${t.id === topicId ? 'selected' : ''}>${t.emoji} ${escapeHtml(t.title)}</option>
            `).join('')}
          </select>
        </div>
      </div>

      <div class="feed-preview" id="feed-preview" hidden></div>

      <button class="btn btn-primary btn-lg" id="feed-submit-btn" disabled>🔗 Submit On-Chain</button>
      <p class="quiz-reg-note" id="feed-submit-status">This will send a transaction from your connected wallet.</p>
    </div>
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  const close = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };
  document.getElementById('feed-modal-close').onclick = close;

  const urlInput = document.getElementById('feed-url');
  const hint = document.getElementById('feed-url-hint');
  const preview = document.getElementById('feed-preview');
  const submitBtn = document.getElementById('feed-submit-btn');
  let parsed = null;
  let previewTimer = null;

  urlInput.addEventListener('input', () => {
    parsed = parseMediaUrl(urlInput.value);
    submitBtn.disabled = !parsed;
    clearTimeout(previewTimer);

    if (!urlInput.value.trim()) {
      hint.textContent = 'Supports X posts, YouTube videos & Shorts, Instagram posts & Reels.';
      hint.className = 'feed-url-hint';
      preview.hidden = true;
      return;
    }
    if (!parsed) {
      hint.textContent = 'Unsupported link. Paste a public X post, YouTube video or Instagram post/Reel URL.';
      hint.className = 'feed-url-hint error';
      preview.hidden = true;
      return;
    }

    hint.textContent = `${PLATFORM_META[parsed.platform].icon} ${PLATFORM_META[parsed.platform].label} detected`;
    hint.className = 'feed-url-hint ok';
    const current = parsed;
    previewTimer = setTimeout(() => {
      preview.hidden = false;
      preview.innerHTML = `<div class="feed-embed platform-${current.platform}"><div class="feed-embed-placeholder"><div class="spinner-lg"></div></div></div>`;
      mountEmbed(preview.firstElementChild, current.platform, current.mediaId);
    }, 400);
  });
  urlInput.focus();

  submitBtn.onclick = () => handleSubmit(parsed, Number(document.getElementById('feed-topic').value), close);

  isGasless(FEED_CONTRACT_ADDRESS).then((gasless) => {
    const statusEl = document.getElementById('feed-submit-status');
    if (gasless && statusEl && !statusEl.dataset.busy) {
      statusEl.textContent = 'Gas is on us. You only sign a message in your wallet, no ETH needed.';
    }
  });
}

async function handleSubmit(parsed, topicId, close) {
  if (!parsed) return;
  const submitBtn = document.getElementById('feed-submit-btn');
  const statusEl = document.getElementById('feed-submit-status');

  try {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner"></span> Submitting...';
    statusEl.dataset.busy = 'true';
    statusEl.textContent = (await isGasless(FEED_CONTRACT_ADDRESS))
      ? '⏳ Sign the request in MetaMask (no gas needed)...'
      : '⏳ Confirm the transaction in MetaMask...';
    statusEl.style.color = '#7235ED';

    const tx = await sendContractTx(getSigner(), FEED_CONTRACT_ADDRESS, FEED_ABI, 'submit', [topicId, parsed.platform, parsed.mediaId]);

    statusEl.textContent = '⏳ Transaction submitted! Waiting for confirmation...';
    await tx.wait();

    submitBtn.innerHTML = '✅ Submitted!';
    submitBtn.classList.add('success');
    statusEl.innerHTML = `✅ Posted on-chain! <a href="https://sepolia.etherscan.io/tx/${tx.hash}" target="_blank" rel="noopener">View on Etherscan ↗</a>`;
    statusEl.style.color = '#80DF98';

    setTimeout(() => {
      close();
      notify('Your post is live in the feed!', 'success');
      if (document.getElementById('feed-content')) loadFeed();
    }, 1500);
  } catch (err) {
    console.error('Submission failed:', err);
    submitBtn.disabled = false;
    submitBtn.innerHTML = '🔗 Retry Submission';
    statusEl.textContent = `❌ ${txErrorMessage(err, 'Submission failed')}`;
    statusEl.style.color = '#ef4444';
  }
}

// =================== HELPERS ===================

function txErrorMessage(err, fallback) {
  const msg = err.reason || err.shortMessage || err.message || '';
  if (err.code === 'ACTION_REJECTED' || err.code === 4001) return 'Request rejected in wallet.';
  if (msg.includes('Already submitted')) return 'This post has already been submitted to this topic.';
  if (msg.includes('Not registered')) return 'Register your profile first.';
  if (msg.includes('Submission hidden')) return 'This post has been hidden by moderators.';
  return `${fallback}: ${msg || 'unknown error'}`;
}

function emptyState(icon, title, sub) {
  return `
    <div class="leaderboard-empty">
      <span class="empty-icon">${icon}</span>
      <p>${title}</p>
      <p class="empty-sub">${sub}</p>
    </div>
  `;
}

function shortAddress(addr) {
  return addr.slice(0, 6) + '...' + addr.slice(-4);
}

function notify(message, type) {
  window.dispatchEvent(new CustomEvent('app-notification', { detail: { message, type } }));
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// =================== WALLET CHANGES ===================

async function refreshMyVotes() {
  if (!document.getElementById('feed-content') || !FEED_CONTRACT_ADDRESS) return;
  try {
    const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);
    const feed = new ethers.Contract(FEED_CONTRACT_ADDRESS, FEED_ABI, provider);
    await fetchMyVotes(feed, Object.values(submissionsByTopic).flat());
  } catch (err) {
    console.error('Failed to load votes:', err);
  }
  Object.values(submissionsByTopic).flat().forEach(s => refreshCardVotes(s.id));
}

export function initFeed() {
  onWalletConnect(refreshMyVotes);
  onWalletDisconnect(refreshMyVotes);
  window.addEventListener('profile-registered', refreshMyVotes);
}
