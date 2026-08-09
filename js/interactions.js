/* ============================================================
   LIFE ADMIN COPILOT — Cinematic Interactive & Audio Engine (Nolan / Apple Standard)
   Web Audio synthesized haptics: mechanical clicks, temporal clock ticks, sub-bass resonance.
   ============================================================ */

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

  // Mechanical switch click
  playClick() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(240, this.ctx.currentTime + 0.03);

      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.035);
    } catch (e) {}
  }

  // Temporal clock tick (Nolan-inspired ticking time)
  playTick() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.015);

      gain.gain.setValueAtTime(0.025, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.015);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.02);
    } catch (e) {}
  }

  // Deep Sub-Bass Cinematic Boom (on launch / auth)
  playSubBass() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(160, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.5);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.6);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.65);
    } catch (e) {}
  }

  // Harmonious chord resolution
  playComplete() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      freqs.forEach((f, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, this.ctx.currentTime + i * 0.035);

        gain.gain.setValueAtTime(0.035, this.ctx.currentTime + i * 0.035);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + i * 0.035);
        osc.stop(this.ctx.currentTime + 0.4);
      });
    } catch (e) {}
  }
}

const tactile = new TactileAudio();
window.tactile = tactile;

// ── Mouse-Following Spotlight Tracking ──
function initSpotlightCards() {
  const elements = document.querySelectorAll('.spotlight-card, .bento-tile, .item-row, .doc-card-3d, .spatial-feature-card');
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
      
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    });
  });
}

// ── Natural Language Search Query Engine ──
function executeNaturalLanguageSearch(query, dataset) {
  const q = query.toLowerCase().trim();
  const results = [];

  if (q.includes('bill') || q.includes('pay') || q.includes('money') || q.includes('due') || q.includes('electric') || q.includes('fee')) {
    dataset.tasks.filter(t => t.category === 'finance' || t.amount).forEach(item => {
      results.push({
        title: item.title,
        subtitle: `${item.due} · ${item.amount || 'No fee'} (${item.sourceName})`,
        type: 'Actionable Bill',
        targetView: 'tasks',
        item: item
      });
    });
    dataset.inbox.filter(i => i.amount || i.sourceCategory === 'finance').forEach(item => {
      results.push({
        title: item.title,
        subtitle: `Inbox Clutter · ${item.amount} (${item.source})`,
        type: 'Unprocessed Bill',
        targetView: 'inbox',
        item: item
      });
    });
  }

  if (q.includes('passport') || q.includes('id') || q.includes('expire') || q.includes('document') || q.includes('aadhaar')) {
    dataset.documents.forEach(doc => {
      results.push({
        title: doc.title,
        subtitle: `${doc.source} · Expires: ${doc.expires}`,
        type: 'Secured Document',
        targetView: 'documents',
        item: doc
      });
    });
  }

  if (q.includes('trip') || q.includes('travel') || q.includes('chennai') || q.includes('train') || q.includes('pnr')) {
    dataset.tasks.filter(t => t.category === 'travel').forEach(item => {
      results.push({
        title: item.title,
        subtitle: `${item.due} · ${item.sourceName}`,
        type: 'Travel Obligation',
        targetView: 'tasks',
        item: item
      });
    });
    dataset.timeline.filter(t => t.category === 'travel').forEach(item => {
      results.push({
        title: item.title,
        subtitle: `${item.day} at ${item.time}`,
        type: 'Travel Event',
        targetView: 'calendar',
        item: item
      });
    });
  }

  return results;
}

document.addEventListener('DOMContentLoaded', () => {
  initSpotlightCards();
  init3DParallaxTilt();

  // Attach mechanical click audio to all buttons
  document.querySelectorAll('button, .nav-item, .item-row, .sample-pill, .filter-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      tactile.playClick();
    });
  });
});
