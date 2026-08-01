// =================== FULLSCREEN SLIDE PRESENTER ===================

import { presentations } from './data/presentations.js';

let currentPresentation = null;
let currentSlideIndex = 0;
let slides = [];
let slideOverlay = null;

// =================== PUBLIC API ===================

export function openSlidePresenter(presentationId) {
  const pres = presentations.find(p => p.id === presentationId);
  if (!pres) return;

  currentPresentation = pres;
  currentSlideIndex = 0;

  // Build slides array from sections
  slides = [];

  // Title slide
  slides.push({
    type: 'title',
    content: `
      <div class="slide-title-layout">
        <span class="slide-title-icon">${pres.icon}</span>
        <h1 class="slide-main-title">${pres.title}</h1>
        <p class="slide-tagline">${pres.tagline}</p>
        <div class="slide-meta">
          <span>Road to DevCon 8 · Workshops Edition</span>
        </div>
      </div>
    `
  });

  // Content slides: split each section into digestible slides
  pres.sections.forEach(section => {
    // Each section heading becomes one slide with its content
    const paragraphs = section.content.split('\n\n');
    
    // Group paragraphs into slides (max ~3 paragraphs per slide for readability)
    const maxParasPerSlide = 3;
    for (let i = 0; i < paragraphs.length; i += maxParasPerSlide) {
      const batch = paragraphs.slice(i, i + maxParasPerSlide);
      const isFirst = i === 0;
      slides.push({
        type: 'content',
        heading: isFirst ? section.heading : `${section.heading} (cont.)`,
        content: formatSlideContent(batch.join('\n\n'))
      });
    }
  });

  // End slide
  slides.push({
    type: 'end',
    content: `
      <div class="slide-title-layout">
        <span class="slide-title-icon">🙏</span>
        <h1 class="slide-main-title">Thank You!</h1>
        <p class="slide-tagline">Questions?</p>
        <div class="slide-meta">
          <span>Press Escape or click × to exit</span>
        </div>
      </div>
    `
  });

  createSlideOverlay();
  renderSlide();
  bindSlideControls();
}

// =================== OVERLAY ===================

function createSlideOverlay() {
  // Remove existing
  if (slideOverlay) slideOverlay.remove();

  slideOverlay = document.createElement('div');
  slideOverlay.className = 'slide-overlay';
  slideOverlay.innerHTML = `
    <div class="slide-controls-top">
      <div class="slide-counter" id="slide-counter">1 / ${slides.length}</div>
      <div class="slide-top-actions">
        <button class="slide-btn" id="slide-fullscreen-btn" title="Toggle Fullscreen">⛶</button>
        <button class="slide-btn slide-close-btn" id="slide-close-btn" title="Exit (Esc)">×</button>
      </div>
    </div>
    <div class="slide-content-area" id="slide-content-area"></div>
    <div class="slide-controls-bottom">
      <button class="slide-nav-btn" id="slide-prev-btn" title="Previous (←)">←</button>
      <div class="slide-progress">
        <div class="slide-progress-fill" id="slide-progress-fill"></div>
      </div>
      <button class="slide-nav-btn" id="slide-next-btn" title="Next (→)">→</button>
    </div>
  `;

  document.body.appendChild(slideOverlay);
  document.body.style.overflow = 'hidden';

  // Animate in
  requestAnimationFrame(() => slideOverlay.classList.add('active'));
}

function destroySlideOverlay() {
  if (slideOverlay) {
    slideOverlay.classList.remove('active');
    setTimeout(() => {
      slideOverlay.remove();
      slideOverlay = null;
    }, 300);
  }
  document.body.style.overflow = '';

  // Exit fullscreen if active
  if (document.fullscreenElement) {
    document.exitFullscreen().catch(() => {});
  }

  // Remove keyboard listener
  document.removeEventListener('keydown', handleSlideKey);
}

// =================== SLIDE RENDERING ===================

function renderSlide() {
  const area = document.getElementById('slide-content-area');
  const counter = document.getElementById('slide-counter');
  const progress = document.getElementById('slide-progress-fill');
  const prevBtn = document.getElementById('slide-prev-btn');
  const nextBtn = document.getElementById('slide-next-btn');

  if (!area) return;

  const slide = slides[currentSlideIndex];

  if (slide.type === 'title' || slide.type === 'end') {
    area.innerHTML = `<div class="slide-frame slide-center">${slide.content}</div>`;
  } else {
    area.innerHTML = `
      <div class="slide-frame">
        <h2 class="slide-heading">${slide.heading}</h2>
        <div class="slide-body">${slide.content}</div>
      </div>
    `;
  }

  // Update counter and progress
  counter.textContent = `${currentSlideIndex + 1} / ${slides.length}`;
  progress.style.width = `${((currentSlideIndex + 1) / slides.length) * 100}%`;

  // Disable buttons at edges
  prevBtn.disabled = currentSlideIndex === 0;
  nextBtn.disabled = currentSlideIndex === slides.length - 1;

  // Animate slide in
  const frame = area.querySelector('.slide-frame');
  if (frame) {
    frame.style.opacity = '0';
    frame.style.transform = 'translateY(10px)';
    requestAnimationFrame(() => {
      frame.style.transition = 'all 0.3s ease';
      frame.style.opacity = '1';
      frame.style.transform = 'translateY(0)';
    });
  }
}

// =================== CONTROLS ===================

function bindSlideControls() {
  document.getElementById('slide-prev-btn').onclick = prevSlide;
  document.getElementById('slide-next-btn').onclick = nextSlide;
  document.getElementById('slide-close-btn').onclick = destroySlideOverlay;
  document.getElementById('slide-fullscreen-btn').onclick = toggleFullscreen;

  document.addEventListener('keydown', handleSlideKey);

  // Click on slide area to advance (except on links)
  document.getElementById('slide-content-area').addEventListener('click', (e) => {
    if (e.target.tagName === 'A' || e.target.closest('a')) return;
    nextSlide();
  });
}

function handleSlideKey(e) {
  if (!slideOverlay) return;

  switch (e.key) {
    case 'ArrowRight':
    case ' ':
    case 'Enter':
      e.preventDefault();
      nextSlide();
      break;
    case 'ArrowLeft':
    case 'Backspace':
      e.preventDefault();
      prevSlide();
      break;
    case 'Escape':
      e.preventDefault();
      destroySlideOverlay();
      break;
    case 'f':
    case 'F':
      e.preventDefault();
      toggleFullscreen();
      break;
  }
}

function nextSlide() {
  if (currentSlideIndex < slides.length - 1) {
    currentSlideIndex++;
    renderSlide();
  }
}

function prevSlide() {
  if (currentSlideIndex > 0) {
    currentSlideIndex--;
    renderSlide();
  }
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    slideOverlay.requestFullscreen().catch(() => {});
  } else {
    document.exitFullscreen().catch(() => {});
  }
}

// =================== CONTENT FORMATTING ===================

function formatSlideContent(text) {
  return text
    .split('\n\n')
    .map(para => {
      // Bullet points
      if (para.includes('\n•') || para.startsWith('•')) {
        const lines = para.split('\n');
        const items = lines.filter(l => l.startsWith('•'));
        const intro = lines[0].startsWith('•') ? '' : `<p>${formatInline(lines[0])}</p>`;
        return `${intro}<ul class="slide-list">${items.map(item => `<li>${formatInline(item.slice(1).trim())}</li>`).join('')}</ul>`;
      }
      // Code blocks
      if (para.includes('```')) {
        const match = para.match(/```(\w*)\n([\s\S]*?)```/);
        if (match) {
          return `<pre class="slide-code"><code>${escapeHtml(match[2].trim())}</code></pre>`;
        }
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
