/* ============================================================
   LIFE ADMIN COPILOT — Spatial Landing Controller
   Choreographs 3D spatial hero, chapter scrolling, and instant drop simulation.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize 3D Spatial Canvas
  let spatialHero = null;
  setTimeout(() => {
    spatialHero = new SpatialHero3D('spatial-hero-canvas');
  }, 100);

  // 2. Landing CTAs to Launch Auth / App
  const launchBtns = document.querySelectorAll('.btn-launch-app, #btn-landing-enter, #btn-spatial-explore');
  launchBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (window.authGateway) {
        window.authGateway.open('personal');
      }
    });
  });

  // 3. Direct Landing Dropzone Simulator
  const landingDrop = document.getElementById('landing-quick-drop');
  if (landingDrop) {
    landingDrop.addEventListener('click', () => {
      if (window.authGateway) {
        window.authGateway.loginWithProfile('personal');
        setTimeout(() => {
          window.app?.openCaptureModal();
        }, 600);
      }
    });
  }

  // 4. Chapter Index Smooth Scroll
  document.querySelectorAll('[data-chapter-target]').forEach(item => {
    item.addEventListener('click', () => {
      const targetId = item.dataset.chapterTarget;
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
        if (window.tactile) window.tactile.playClick();
      }
    });
  });
});
