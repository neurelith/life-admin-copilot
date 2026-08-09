/* ============================================================
   LIFE ADMIN COPILOT — GSAP Timeline, ScrollTrigger, Lenis & Cursor Glow
   Monocle / Kinfolk / Stripe Editorial Interactive Engine
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Initialize Lenis Smooth Scroll
  let lenis = null;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  // 2. Custom Mouse Interactive Aura Glow
  const mouseAura = document.getElementById('mouse-aura');
  if (mouseAura) {
    window.addEventListener('mousemove', (e) => {
      mouseAura.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    });
  }

  // 3. Vanilla-Tilt 3D Parallax Glare
  if (typeof VanillaTilt !== 'undefined') {
    VanillaTilt.init(document.querySelectorAll('.bento-card, .how-step-card, .landing-drop-box'), {
      max: 6,
      speed: 600,
      glare: true,
      "max-glare": 0.15,
      scale: 1.01
    });
  }

  // 4. GSAP Entrance Timeline & ScrollTrigger
  if (typeof gsap !== 'undefined') {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1.0 } });

    tl.from('.hero-editorial-title', {
      y: 50,
      opacity: 0,
      duration: 1.2,
      delay: 0.1
    })
    .from('.hero-editorial-desc', {
      y: 30,
      opacity: 0,
      duration: 0.9
    }, '-=0.6')
    .from('.hero-cta-single', {
      y: 20,
      opacity: 0,
      duration: 0.8
    }, '-=0.5');

    // GSAP ScrollTrigger Animations
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      // CRITICAL FIX: Link Lenis to GSAP ScrollTrigger
      if (lenis) {
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => {
          lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
      }

      gsap.from('.bento-card', {
        scrollTrigger: {
          trigger: '.bento-editorial-grid',
          start: 'top 98%',
          toggleActions: 'play none none none'
        },
        y: 24,
        stagger: 0.1,
        duration: 0.7,
        ease: 'power2.out'
      });

      gsap.from('.how-step-card', {
        scrollTrigger: {
          trigger: '.how-steps-grid',
          start: 'top 98%',
          toggleActions: 'play none none none'
        },
        y: 24,
        stagger: 0.12,
        duration: 0.7,
        ease: 'power2.out'
      });

      // Stat Counters Reveal
      document.querySelectorAll('.stat-number').forEach(stat => {
        const targetVal = stat.dataset.value;
        if (!targetVal) return;

        ScrollTrigger.create({
          trigger: stat,
          start: 'top 90%',
          onEnter: () => {
            gsap.fromTo(stat, 
              { innerText: 0 }, 
              { 
                innerText: targetVal, 
                duration: 2.0, 
                snap: { innerText: 0.1 },
                ease: 'power2.out'
              }
            );
          }
        });
      });

      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 300);
    }
  }

  // 5. In-Card Live Interactive Demonstrations
  const demoOcrBtn = document.getElementById('btn-in-card-scan');
  if (demoOcrBtn) {
    demoOcrBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (window.tactile) window.tactile.playTick();
      const res = document.getElementById('bento-ocr-demo-output');
      if (res) {
        res.innerHTML = `
          <div style="font-size: 11px; color: var(--text-secondary); margin-bottom: 4px;">IIT Madras Annual Fee Receipt:</div>
          <div style="display: flex; gap: 6px; flex-wrap: wrap;">
            <span class="tag tag-urgent" style="font-size: 10px;">DUE TODAY</span>
            <span class="tag tag-subtle" style="font-size: 10px; font-weight: 700; color: var(--accent-gold);">₹500.00</span>
            <span class="tag tag-subtle" style="font-size: 10px;">Verified ID</span>
          </div>
        `;
      }
      setTimeout(() => {
        if (window.tactile) window.tactile.playComplete();
      }, 500);
    });
  }

  const demoPayBtn = document.getElementById('btn-in-card-settle');
  if (demoPayBtn) {
    demoPayBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (window.tactile) window.tactile.playClick();
      demoPayBtn.innerText = 'Processing UPI…';
      setTimeout(() => {
        if (window.tactile) window.tactile.playComplete();
        demoPayBtn.innerText = '✓ Settled ₹2,340 · TXN-994820';
        demoPayBtn.style.background = 'rgba(232, 200, 114, 0.2)';
        demoPayBtn.style.color = '#E8C872';
      }, 800);
    });
  }
});
