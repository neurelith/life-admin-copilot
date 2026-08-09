/* ============================================================
   LIFE ADMIN COPILOT — Interactive Landing Page Controller
   Live in-card document scanning simulator, 1-click settlement demo, profile previews.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize 3D Spatial Canvas
  let spatialHero = null;
  setTimeout(() => {
    spatialHero = new SpatialHero3D('spatial-hero-canvas');
  }, 100);

  // 2. Launch App / Auth Modal Buttons
  const launchBtns = document.querySelectorAll('.btn-launch-app, #btn-landing-enter');
  launchBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (window.tactile) window.tactile.playSubBass();
      if (window.authGateway) {
        window.authGateway.open('personal');
      }
    });
  });

  // 3. Landing Quick Drop Area
  const landingDrop = document.getElementById('landing-quick-drop');
  if (landingDrop) {
    landingDrop.addEventListener('click', () => {
      if (window.tactile) window.tactile.playClick();
      if (window.authGateway) {
        window.authGateway.loginWithProfile('personal');
        setTimeout(() => {
          window.app?.openCaptureModal();
        }, 500);
      }
    });
  }

  // 4. Live In-Card OCR Scanner Widget
  const ocrPresets = [
    { name: "IITM Circular", deadline: "Aug 14 · 6:00 PM", amount: "₹500", req: "Student ID Proof" },
    { name: "Electricity Bill", deadline: "Tomorrow · 11:59 PM", amount: "₹2,340", req: "UPI Payment" },
    { name: "Prescription", deadline: "Aug 16 · 5-day Refill", amount: "₹650", req: "Cardiology Follow-up" }
  ];

  document.querySelectorAll('[data-demo-ocr]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.dataset.demoOcr, 10);
      const data = ocrPresets[idx] || ocrPresets[0];
      const resultBox = document.getElementById('live-card-ocr-result');
      const scanLine = document.getElementById('live-card-scan-line');
      
      if (window.tactile) window.tactile.playTick();

      if (scanLine) {
        scanLine.style.animation = 'none';
        scanLine.offsetHeight; // trigger reflow
        scanLine.style.animation = 'scanLaser 1.2s ease-in-out infinite';
      }

      if (resultBox) {
        resultBox.innerHTML = `
          <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 4px;">Analyzing ${data.name}…</div>
          <div style="display: flex; gap: 6px; flex-wrap: wrap;">
            <span class="tag tag-urgent" style="font-size: 10px;">${data.deadline}</span>
            <span class="tag tag-subtle amount-val" style="font-size: 10px; font-weight: 600;">${data.amount}</span>
            <span class="tag tag-subtle" style="font-size: 10px;">${data.req}</span>
          </div>
        `;
      }

      setTimeout(() => {
        if (window.tactile) window.tactile.playComplete();
      }, 600);
    });
  });

  // 5. Live In-Card 1-Click Pay Demo
  const demoPayBtn = document.getElementById('btn-card-demo-pay');
  if (demoPayBtn) {
    demoPayBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (window.tactile) window.tactile.playClick();
      demoPayBtn.innerHTML = '<i class="ph ph-circle-notch" style="animation: spin 0.8s linear infinite;"></i> Processing…';
      demoPayBtn.style.pointerEvents = 'none';

      setTimeout(() => {
        if (window.tactile) window.tactile.playComplete();
        demoPayBtn.innerHTML = '<i class="ph ph-check-circle" style="color: #10B981;"></i> Paid ₹2,340 · TXN-882190';
        demoPayBtn.style.background = 'rgba(16, 185, 129, 0.15)';
        demoPayBtn.style.borderColor = 'rgba(16, 185, 129, 0.4)';
        demoPayBtn.style.color = '#10B981';
      }, 900);
    });
  }
});
