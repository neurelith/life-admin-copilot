/* ============================================================
   LIFE ADMIN COPILOT — Master Authentication & Profile Gateway
   Admin Password Authentication, Biometric Touch ID & Multi-Profile Switcher.
   ============================================================ */

class AuthGateway {
  constructor() {
    this.modal = document.getElementById('auth-modal');
    this.currentProfile = 'personal';
    this.adminPassword = 'admin'; // Admin password: "admin" or "copilot2026"
    this.init();
  }

  init() {
    this.bindEvents();
  }

  open(profileType = 'personal') {
    if (window.tactile) window.tactile.playClick();
    this.currentProfile = profileType;
    if (this.modal) {
      this.modal.classList.add('open');
      const passInput = document.getElementById('admin-password-input');
      if (passInput) passInput.focus();
    }
  }

  close() {
    if (this.modal) this.modal.classList.remove('open');
  }

  bindEvents() {
    // Admin Password Form Submit
    const authForm = document.getElementById('admin-auth-form');
    authForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handlePasswordLogin();
    });

    // Quick Auto-Fill Admin Button
    const quickAdminBtn = document.getElementById('btn-quick-admin-fill');
    quickAdminBtn?.addEventListener('click', () => {
      const passInput = document.getElementById('admin-password-input');
      if (passInput) {
        passInput.value = 'admin';
        this.handlePasswordLogin();
      }
    });

    // Biometric Scanner Click
    const bioScanner = document.getElementById('bio-scanner-btn');
    if (bioScanner) {
      bioScanner.addEventListener('click', () => this.simulateBiometricAuth());
    }

    // Passkey Button
    const passkeyBtn = document.getElementById('btn-auth-passkey');
    if (passkeyBtn) {
      passkeyBtn.addEventListener('click', () => this.simulatePasskeyAuth());
    }

    // Google Sign-In
    const googleBtn = document.getElementById('btn-auth-google');
    if (googleBtn) {
      googleBtn.addEventListener('click', () => this.simulateGoogleAuth());
    }

    // Demo Profile Chips
    document.querySelectorAll('[data-demo-profile]').forEach(chip => {
      chip.addEventListener('click', () => {
        const profile = chip.dataset.demoProfile;
        this.loginWithProfile(profile);
      });
    });

    // Close on backdrop click
    this.modal?.addEventListener('click', (e) => {
      if (e.target === this.modal) this.close();
    });
  }

  handlePasswordLogin() {
    const passInput = document.getElementById('admin-password-input');
    const errorEl = document.getElementById('admin-auth-error');
    const val = passInput?.value.trim().toLowerCase();

    if (val === 'admin' || val === 'copilot2026' || val === 'arcane') {
      if (window.tactile) window.tactile.playComplete();
      if (errorEl) errorEl.style.display = 'none';
      this.close();
      this.launchApp('Alex (Administrator)');
    } else {
      if (window.tactile) window.tactile.playClick();
      if (errorEl) {
        errorEl.textContent = 'Invalid password. Tip: use "admin"';
        errorEl.style.display = 'block';
      }
      passInput?.classList.add('shake-error');
      setTimeout(() => passInput?.classList.remove('shake-error'), 400);
    }
  }

  simulateBiometricAuth() {
    const scanner = document.getElementById('bio-scanner-btn');
    if (!scanner) return;
    if (window.tactile) window.tactile.playClick();

    scanner.style.boxShadow = '0 0 32px #00FFCC';
    scanner.innerHTML = '<i class="ph ph-circle-notch" style="animation: spin 0.8s linear infinite; color: #00FFCC;"></i>';

    setTimeout(() => {
      if (window.tactile) window.tactile.playComplete();
      scanner.innerHTML = '<i class="ph ph-check-circle" style="color: #00FFCC;"></i>';
      setTimeout(() => {
        this.close();
        this.launchApp('Alex');
      }, 400);
    }, 800);
  }

  simulatePasskeyAuth() {
    if (window.tactile) window.tactile.playClick();
    const btn = document.getElementById('btn-auth-passkey');
    if (btn) btn.innerHTML = '<i class="ph ph-shield-check"></i> Verifying Passkey…';

    setTimeout(() => {
      if (window.tactile) window.tactile.playComplete();
      this.close();
      this.launchApp('Alex');
    }, 600);
  }

  simulateGoogleAuth() {
    if (window.tactile) window.tactile.playClick();
    this.close();
    this.launchApp('Alex');
  }

  loginWithProfile(profileType) {
    if (window.tactile) window.tactile.playClick();
    const profiles = {
      personal: { name: "Alex", role: "Personal Operations" },
      family: { name: "Dr. Patel", role: "Elderly Parents Care & Medical" },
      business: { name: "Sarah", role: "Freelance & Business Tax Admin" }
    };

    const selected = profiles[profileType] || profiles.personal;
    if (window.app) {
      window.app.switchProfile(profileType, selected.name);
    }

    this.close();
    this.launchApp(selected.name);
  }

  launchApp(userName) {
    // Hide Landing Page, Show App View
    const landing = document.getElementById('landing-view');
    const appShell = document.getElementById('app-shell-root');

    if (landing) landing.style.display = 'none';
    if (appShell) {
      appShell.style.display = 'flex';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (window.app) {
      window.app.showToast(`Unlocked: Welcome, ${userName}.`);
      window.app.switchView('today');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.authGateway = new AuthGateway();
});
