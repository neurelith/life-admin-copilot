/* ============================================================
   LIFE ADMIN COPILOT — Luxury Interactive Engine
   Spotlight tracking, multi-layer 3D tilt, audio synthesis, count-up.
   ============================================================ */

// ── Synthesized Luxury Tactile Sound Engine (Web Audio API) ──
class TactileAudio {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
  }

  playClick() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(320, this.ctx.currentTime + 0.025);

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.025);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.03);
    } catch (e) {}
  }

  playComplete() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      // Pleasant luxury major chord resolution
      const freqs = [523.25, 659.25, 783.99]; // C5, E5, G5
      freqs.forEach((f, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, this.ctx.currentTime + i * 0.03);

        gain.gain.setValueAtTime(0.03, this.ctx.currentTime + i * 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + i * 0.03);
        osc.stop(this.ctx.currentTime + 0.3);
      });
    } catch (e) {}
  }
}

const tactile = new TactileAudio();

// ── Aceternity Mouse-Following Spotlight Engine ──
function initSpotlightCards() {
  const elements = document.querySelectorAll('.spotlight-card, .bento-tile, .item-row, .doc-card-3d');
  elements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      el.style.setProperty('--mouse-x', `${x}px`);
      el.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

// ── 3D Parallax Tilt with Multi-Layer Depth ──
function init3DParallaxTilt() {
  const cards = document.querySelectorAll('.card-3d-wrap, .bento-tile');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });
}

// ── Animated Metric Counter ──
function animateCountUp(element, target, prefix = '') {
  if (!element) return;
  const duration = 800;
  const start = 0;
  const startTime = performance.now();

  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeProgress = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current = Math.floor(start + (target - start) * easeProgress);

    element.textContent = `${prefix}${current.toLocaleString()}`;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = `${prefix}${target.toLocaleString()}`;
    }
  }

  requestAnimationFrame(update);
}

// ── Natural Language Search Query Engine ──
function executeNaturalLanguageSearch(query, data) {
  if (!query || query.trim() === '') return [];
  const q = query.toLowerCase().trim();
  const results = [];

  // Special NLP Intent matching
  if (q.includes('bill') || q.includes('pay') || q.includes('due') || q.includes('money')) {
    data.tasks.filter(t => t.amount || t.category === 'finance').forEach(t => {
      results.push({
        type: 'Task Obligation',
        title: t.title,
        subtitle: `${t.due} · Amount: ${t.amount || 'None'}`,
        badge: t.dueCategory,
        item: t,
        targetView: 'tasks'
      });
    });
    data.inbox.filter(i => i.sourceCategory === 'finance' || i.amount).forEach(i => {
      results.push({
        type: 'Inbox Clutter',
        title: i.title,
        subtitle: `From ${i.source} · ${i.date}`,
        badge: 'Inbox',
        item: i,
        targetView: 'inbox'
      });
    });
  }

  if (q.includes('passport') || q.includes('expire') || q.includes('identity')) {
    data.documents.filter(d => d.category === 'identity' || d.expires).forEach(d => {
      results.push({
        type: 'Document Record',
        title: d.title,
        subtitle: `Expires: ${d.expires} · Source: ${d.source}`,
        badge: d.categoryName,
        item: d,
        targetView: 'documents'
      });
    });
  }

  if (q.includes('chennai') || q.includes('trip') || q.includes('travel') || q.includes('train')) {
    data.tasks.filter(t => t.category === 'travel').forEach(t => {
      results.push({
        type: 'Travel Preparation',
        title: t.title,
        subtitle: `${t.due} · ${t.sourceName}`,
        badge: 'Travel',
        item: t,
        targetView: 'tasks'
      });
    });
    data.inbox.filter(i => i.sourceCategory === 'travel').forEach(i => {
      results.push({
        type: 'Travel Booking',
        title: i.title,
        subtitle: `${i.source} · Departure: ${i.date}`,
        badge: 'IRCTC',
        item: i,
        targetView: 'inbox'
      });
    });
  }

  if (q.includes('receipt') || q.includes('warranty') || q.includes('headphone') || q.includes('sony') || q.includes('amazon')) {
    data.documents.filter(d => d.category === 'warranty' || d.source.includes('Amazon')).forEach(d => {
      results.push({
        type: 'Purchase & Warranty',
        title: d.title,
        subtitle: `Warranty valid until: ${d.expires}`,
        badge: 'Warranty Protected',
        item: d,
        targetView: 'documents'
      });
    });
  }

  // Fallback match across all entities
  data.tasks.forEach(t => {
    if ((t.title.toLowerCase().includes(q) || t.sourceName.toLowerCase().includes(q)) && !results.some(r => r.item.id === t.id)) {
      results.push({
        type: 'Task',
        title: t.title,
        subtitle: `${t.due} · ${t.sourceName}`,
        badge: t.category,
        item: t,
        targetView: 'tasks'
      });
    }
  });

  data.inbox.forEach(i => {
    if ((i.title.toLowerCase().includes(q) || i.source.toLowerCase().includes(q) || i.summary.toLowerCase().includes(q)) && !results.some(r => r.item.id === i.id)) {
      results.push({
        type: 'Inbox Item',
        title: i.title,
        subtitle: `From ${i.source} · ${i.date}`,
        badge: i.sourceCategory,
        item: i,
        targetView: 'inbox'
      });
    }
  });

  data.documents.forEach(d => {
    if ((d.title.toLowerCase().includes(q) || d.source.toLowerCase().includes(q)) && !results.some(r => r.item.id === d.id)) {
      results.push({
        type: 'Document',
        title: d.title,
        subtitle: `Expires: ${d.expires} · Type: ${d.fileType}`,
        badge: d.categoryName,
        item: d,
        targetView: 'documents'
      });
    }
  });

  return results;
}
