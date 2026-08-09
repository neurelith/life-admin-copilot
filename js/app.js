/* ============================================================
   LIFE ADMIN COPILOT — Market-Ready Application Master Controller
   Integrated 3D WebGL Hub, Multi-Profile Switching, Instant Bill Settlement & Feeds.
   ============================================================ */

class LifeAdminApp {
  constructor() {
    this.data = JSON.parse(JSON.stringify(initialData));
    this.currentView = 'today';
    this.activeInboxFilter = 'all';
    this.selectedItem = null;
    this.threeHub = null;
    this.theme = localStorage.getItem('life_admin_theme') || 'dark';

    this.init();
  }

  init() {
    this.applyTheme(this.theme);
    this.bindNavigation();
    this.bindKeyboardShortcuts();
    this.bindCaptureModal();
    this.bindSearchModal();
    this.bindDrawer();
    this.bindThemeToggle();
    this.bindPaymentModal();
    this.bindFeedsModal();
    this.renderAll();

    // Initialize 3D Canvas
    setTimeout(() => {
      this.threeHub = new LifeHub3D('three-hub-canvas');
    }, 100);
  }

  // ── Theme Switcher ──
  applyTheme(theme) {
    this.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('life_admin_theme', theme);
    const themeIcon = document.getElementById('theme-icon');
    if (themeIcon) {
      themeIcon.className = theme === 'dark' ? 'ph ph-moon-stars' : 'ph ph-sun';
    }
  }

  bindThemeToggle() {
    const toggleBtn = document.getElementById('btn-toggle-theme');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        if (window.tactile) window.tactile.playClick();
        this.applyTheme(this.theme === 'dark' ? 'light' : 'dark');
      });
    }
  }

  // ── Multi-Profile Switching ──
  switchProfile(profileKey, userName) {
    this.data.activeProfile = profileKey;
    const profile = this.data.profiles[profileKey];
    if (!profile) return;

    // Update Sidebar User Display
    const avatarEl = document.querySelector('.user-avatar');
    const nameEl = document.querySelector('.user-name');
    const statusEl = document.querySelector('.user-status span:last-child');

    if (avatarEl) avatarEl.textContent = profile.avatar;
    if (nameEl) nameEl.textContent = profile.name;
    if (statusEl) statusEl.textContent = profile.role;

    this.renderAll();
  }

  // ── Navigation & View Switching ──
  switchView(viewName) {
    if (window.tactile) window.tactile.playClick();
    this.currentView = viewName;

    // Update Desktop Nav
    document.querySelectorAll('.nav-item').forEach(el => {
      el.classList.toggle('active', el.dataset.view === viewName);
    });

    // Update Mobile Nav
    document.querySelectorAll('.mobile-nav-item').forEach(el => {
      el.classList.toggle('active', el.dataset.view === viewName);
    });

    // Show View
    document.querySelectorAll('.app-view').forEach(el => {
      el.classList.remove('active');
    });

    const targetView = document.getElementById(`view-${viewName}`);
    if (targetView) {
      targetView.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    this.renderView(viewName);

    if (viewName === 'today' && !this.threeHub) {
      setTimeout(() => {
        this.threeHub = new LifeHub3D('three-hub-canvas');
      }, 50);
    }
  }

  bindNavigation() {
    document.querySelectorAll('[data-view]').forEach(el => {
      el.addEventListener('click', () => {
        const view = el.dataset.view;
        if (view) this.switchView(view);
      });
    });

    // Return to 3D Spatial Landing Page
    document.getElementById('btn-return-landing')?.addEventListener('click', () => {
      if (window.tactile) window.tactile.playClick();
      const landing = document.getElementById('landing-view');
      const appShell = document.getElementById('app-shell-root');
      if (landing && appShell) {
        appShell.style.display = 'none';
        landing.style.display = 'flex';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  bindKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        this.openSearchModal();
        return;
      }

      if (['input', 'textarea'].includes(document.activeElement.tagName.toLowerCase())) {
        if (e.key === 'Escape') this.closeAllModals();
        return;
      }

      if (e.key === 'Escape') {
        this.closeAllModals();
        return;
      }

      if (e.key === '1') this.switchView('today');
      if (e.key === '2') this.switchView('inbox');
      if (e.key === '3') this.switchView('tasks');
      if (e.key === '4') this.switchView('calendar');
      if (e.key === '5') this.switchView('documents');

      if (e.key.toLowerCase() === 'c') {
        this.openCaptureModal();
      }
    });
  }

  closeAllModals() {
    document.getElementById('capture-modal')?.classList.remove('open');
    document.getElementById('search-modal')?.classList.remove('open');
    document.getElementById('payment-modal')?.classList.remove('open');
    document.getElementById('feeds-modal')?.classList.remove('open');
    document.getElementById('onboarding-modal')?.classList.remove('open');
    this.closeDrawer();
  }

  // ── Render Master ──
  renderAll() {
    this.updateBadges();
    this.renderTodayView();
    this.renderInboxView();
    this.renderTasksView();
    this.renderCalendarView();
    this.renderDocumentsView();
    if (typeof initSpotlightCards === 'function') initSpotlightCards();
    if (typeof init3DParallaxTilt === 'function') init3DParallaxTilt();
  }

  renderView(viewName) {
    if (viewName === 'today') this.renderTodayView();
    if (viewName === 'inbox') this.renderInboxView();
    if (viewName === 'tasks') this.renderTasksView();
    if (viewName === 'calendar') this.renderCalendarView();
    if (viewName === 'documents') this.renderDocumentsView();
    this.updateBadges();
    if (typeof initSpotlightCards === 'function') initSpotlightCards();
    if (typeof init3DParallaxTilt === 'function') init3DParallaxTilt();
  }

  updateBadges() {
    const uncompletedTasks = this.data.tasks.filter(t => !t.completed).length;
    const inboxCount = this.data.inbox.length;

    const inboxBadge = document.getElementById('badge-inbox');
    if (inboxBadge) {
      inboxBadge.textContent = inboxCount;
      inboxBadge.style.display = inboxCount > 0 ? 'inline-block' : 'none';
    }

    const tasksBadge = document.getElementById('badge-tasks');
    if (tasksBadge) {
      tasksBadge.textContent = uncompletedTasks;
      tasksBadge.style.display = uncompletedTasks > 0 ? 'inline-block' : 'none';
    }
  }

  // ────────────────────────────────────────────────────────────
  // 1. TODAY VIEW RENDERER (With 3D Hub & Bento)
  // ────────────────────────────────────────────────────────────
  renderTodayView() {
    const container = document.getElementById('view-today');
    if (!container) return;

    const currentProfile = this.data.profiles[this.data.activeProfile] || this.data.profiles.personal;
    const urgentTasks = this.data.tasks.filter(t => !t.completed && (t.dueCategory === 'today' || t.dueCategory === 'tomorrow'));
    const comingUp = this.data.timeline.slice(0, 3);
    const recentCaptures = this.data.inbox.slice(0, 3);
    const attentionCount = urgentTasks.length;

    container.innerHTML = `
      <!-- Luxury Bento Hero Section -->
      <div class="bento-hero-grid">
        
        <!-- Bento Tile Left: 3D Operations Core -->
        <div class="bento-tile bento-tile-dark spotlight-card">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
              <span class="tag" style="background: rgba(200, 90, 42, 0.2); color: #FFA07A; border: 1px solid rgba(200, 90, 42, 0.4); margin-bottom: 8px;">
                <i class="ph ph-sparkle"></i> 3D Operations Core
              </span>
              <h2 style="font-size: var(--text-xl); font-weight: 600; margin-top: 4px;">Good morning, ${currentProfile.name}</h2>
              <p style="font-size: var(--text-sm); margin-top: 2px;">
                ${attentionCount > 0 ? `${attentionCount} immediate obligations require your decision.` : `All personal operations are in state of peace.`}
              </p>
            </div>
            <button class="btn-shimmer" id="btn-hero-capture" style="padding: 6px 14px; font-size: var(--text-xs);">
              <i class="ph ph-plus-bold"></i> + Capture Clutter
            </button>
          </div>

          <!-- WebGL Three.js Container -->
          <div class="three-canvas-wrap" id="three-hub-canvas"></div>
          
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: var(--text-dark-secondary); border-top: 1px solid var(--border-dark); padding-top: 8px;">
            <span><i class="ph ph-cursor-click"></i> Hover & click orbiting nodes to navigate</span>
            <span>Profile: <strong style="color: #FFA07A;">${currentProfile.role}</strong></span>
          </div>
        </div>

        <!-- Bento Tile Right: Focus Overview & Feeds Sync -->
        <div class="bento-tile spotlight-card" style="display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div class="section-label" style="margin-bottom: 4px;">
              <span>Focus Overview</span>
              <button class="btn btn-ghost btn-sm" id="btn-open-feeds" style="font-size: 11px; color: var(--accent-hermes); padding: 2px 6px;">
                <i class="ph ph-broadcast"></i> Sync Feeds
              </button>
            </div>
            <div style="font-size: var(--text-xs); color: var(--text-secondary); margin-bottom: var(--space-3);">
              Automated extraction across WhatsApp & Gmail
            </div>

            <div class="metric-row">
              <div class="metric-pill">
                <span class="metric-value" style="color: var(--urgency-high);">${attentionCount}</span>
                <span class="metric-label">Due Today</span>
              </div>
              <div class="metric-pill">
                <span class="metric-value" style="color: var(--accent);">${this.data.inbox.length}</span>
                <span class="metric-label">Inbox Raw</span>
              </div>
            </div>

            <div class="metric-row" style="margin-top: var(--space-2);">
              <div class="metric-pill">
                <span class="metric-value amount-val">${currentProfile.pendingPayment}</span>
                <span class="metric-label">Pending Pay</span>
              </div>
              <div class="metric-pill">
                <span class="metric-value">${this.data.documents.length}</span>
                <span class="metric-label">Docs Safe</span>
              </div>
            </div>
          </div>

          <!-- Quick Travel Pin -->
          <div style="background: var(--cat-travel-bg); border: 1px solid rgba(13, 124, 143, 0.2); border-radius: var(--radius-sm); padding: 10px; margin-top: var(--space-3);">
            <div style="font-size: 11px; font-weight: 600; color: var(--cat-travel); display: flex; align-items: center; gap: 4px;">
              <i class="ph ph-train"></i> Upcoming Trip: Chennai Express
            </div>
            <div style="font-size: 11px; color: var(--text-primary); margin-top: 2px;">
              Friday Aug 15 · 06:15 AM (PNR: 4529018471)
            </div>
          </div>
        </div>

      </div>

      <!-- Section: Needs Attention -->
      <div class="content-section">
        <div class="section-label">
          <span>Needs Attention</span>
          <span style="color: var(--urgency-high); font-weight: 600;">${urgentTasks.length} Urgent</span>
        </div>

        ${urgentTasks.length > 0 ? `
          <div class="item-list">
            ${urgentTasks.map((task, idx) => `
              <div class="item-row ${idx === 0 ? 'border-beam-card' : ''}" data-task-id="${task.id}">
                <div class="item-row-left">
                  <div class="item-checkbox ${task.completed ? 'checked' : ''}" data-action="toggle-task" data-id="${task.id}">
                    <i class="ph ph-check" style="font-size: 11px;"></i>
                  </div>
                  <div class="item-main-info" data-action="inspect-task" data-id="${task.id}">
                    <div class="item-title ${task.completed ? 'completed' : ''}">${task.title}</div>
                    <div class="item-subtext">
                      <span class="item-subtext-source"><i class="ph ${this.getCategoryIcon(task.category)}"></i> ${task.sourceName}</span>
                      ${task.amount ? `<span class="tag tag-subtle amount-val">${task.amount}</span>` : ''}
                    </div>
                  </div>
                </div>
                <div class="item-row-right">
                  <span class="tag ${task.dueCategory === 'today' ? 'tag-urgent' : 'tag-warning'}">${task.due}</span>
                  ${task.amount ? `
                    <button class="btn btn-primary btn-sm" data-action="pay-task" data-id="${task.id}">
                      <i class="ph ph-lightning"></i> Pay ${task.amount}
                    </button>
                  ` : ''}
                  <button class="btn btn-secondary btn-sm" data-action="inspect-task" data-id="${task.id}">Review</button>
                </div>
              </div>
            `).join('')}
          </div>
        ` : `
          <div class="item-list">
            <div class="empty-state" style="padding: var(--space-8) var(--space-4);">
              <div class="empty-state-icon"><i class="ph ph-check-circle" style="color: var(--success);"></i></div>
              <div class="empty-state-title">No urgent items</div>
              <div class="empty-state-desc">Everything requiring immediate attention has been addressed.</div>
            </div>
          </div>
        `}
      </div>

      <!-- Section: Coming Up -->
      <div class="content-section">
        <div class="section-label">
          <span>Coming Up</span>
          <button class="btn btn-ghost btn-sm" data-view="calendar">Full Timeline →</button>
        </div>
        <div class="item-list">
          ${comingUp.map(item => `
            <div class="item-row" data-view="calendar">
              <div class="item-row-left">
                <span class="urgency-dot" style="background-color: ${item.color};"></span>
                <span class="time-val" style="font-family: var(--font-mono); font-size: var(--text-xs); color: var(--text-muted); width: 48px;">${item.time}</span>
                <div class="item-main-info">
                  <div class="item-title" style="font-size: var(--text-sm);">${item.title}</div>
                  <div class="item-subtext">${item.day}</div>
                </div>
              </div>
              <div class="item-row-right">
                <span class="tag tag-subtle" style="text-transform: capitalize;">${item.type}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Section: Recently Captured -->
      <div class="content-section">
        <div class="section-label">
          <span>Recently Captured Clutter</span>
          <button class="btn btn-ghost btn-sm" data-view="inbox">View Inbox (${this.data.inbox.length})</button>
        </div>
        <div class="item-list">
          ${recentCaptures.map(inboxItem => `
            <div class="item-row" data-action="inspect-inbox" data-id="${inboxItem.id}">
              <div class="item-row-left">
                <i class="ph ${inboxItem.sourceIcon}" style="color: var(--accent-hermes); font-size: 1.25rem;"></i>
                <div class="item-main-info">
                  <div class="item-title" style="font-size: var(--text-sm);">${inboxItem.title}</div>
                  <div class="item-subtext">From ${inboxItem.source} · ${inboxItem.date}</div>
                </div>
              </div>
              <div class="item-row-right">
                <button class="btn btn-secondary btn-sm" data-action="convert-inbox" data-id="${inboxItem.id}">Triage</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    container.querySelector('#btn-hero-capture')?.addEventListener('click', () => this.openCaptureModal());
    container.querySelector('#btn-open-feeds')?.addEventListener('click', () => this.openFeedsModal());
    this.bindActionEvents(container);
  }

  // ────────────────────────────────────────────────────────────
  // 2. INBOX TRIAGE VIEW RENDERER
  // ────────────────────────────────────────────────────────────
  renderInboxView() {
    const container = document.getElementById('view-inbox');
    if (!container) return;

    let items = this.data.inbox;
    if (this.activeInboxFilter === 'high') {
      items = items.filter(i => i.importance === 'high');
    } else if (this.activeInboxFilter !== 'all') {
      items = items.filter(i => i.sourceCategory === this.activeInboxFilter);
    }

    container.innerHTML = `
      <div class="view-header-row">
        <div class="view-title-wrap">
          <h1 class="view-title">Inbox Clutter</h1>
          <span class="view-count-badge">${this.data.inbox.length} items awaiting triage</span>
        </div>

        <div class="filter-bar">
          <button class="filter-chip ${this.activeInboxFilter === 'all' ? 'active' : ''}" data-filter="all">All</button>
          <button class="filter-chip ${this.activeInboxFilter === 'high' ? 'active' : ''}" data-filter="high">High Priority</button>
          <button class="filter-chip ${this.activeInboxFilter === 'education' ? 'active' : ''}" data-filter="education">Education</button>
          <button class="filter-chip ${this.activeInboxFilter === 'finance' ? 'active' : ''}" data-filter="finance">Finance</button>
          <button class="filter-chip ${this.activeInboxFilter === 'travel' ? 'active' : ''}" data-filter="travel">Travel</button>
          <button class="filter-chip ${this.activeInboxFilter === 'warranty' ? 'active' : ''}" data-filter="warranty">Warranty</button>
        </div>
      </div>

      ${items.length > 0 ? `
        <div class="triage-toolbar">
          <span>Raw Life Clutter Awaiting Action</span>
          <div class="triage-actions">
            <button class="btn btn-ghost btn-sm" id="btn-inbox-triage-all"><i class="ph ph-lightning"></i> Triage All with Context</button>
          </div>
        </div>
        <div class="item-list" style="border-radius: 0 0 var(--radius-md) var(--radius-md);">
          ${items.map(item => `
            <div class="item-row spotlight-card" data-action="inspect-inbox" data-id="${item.id}">
              <div class="item-row-left">
                <span class="tag tag-${item.sourceCategory}" style="font-size: 10px; text-transform: uppercase;">${item.source}</span>
                <div class="item-main-info">
                  <div class="item-title">${item.title}</div>
                  <div class="item-subtext" style="color: var(--text-secondary);">
                    ${item.summary}
                  </div>
                </div>
              </div>
              <div class="item-row-right">
                ${item.amount ? `
                  <button class="btn btn-primary btn-sm" data-action="pay-inbox" data-id="${item.id}">
                    <i class="ph ph-lightning"></i> Pay ${item.amount}
                  </button>
                ` : ''}
                <div class="row-actions">
                  <button class="btn btn-secondary btn-sm" data-action="convert-inbox" data-id="${item.id}">Convert to Task</button>
                  <button class="btn btn-ghost btn-sm" data-action="archive-inbox" data-id="${item.id}" title="Archive"><i class="ph ph-archive-box"></i></button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      ` : `
        <div class="item-list">
          <div class="empty-state">
            <div class="empty-state-icon"><i class="ph ph-tray"></i></div>
            <div class="empty-state-title">Inbox Zero</div>
            <div class="empty-state-desc">Nothing to process. Raw clutter has been converted into calm, structured obligations.</div>
            <button class="btn btn-secondary btn-sm" style="margin-top: var(--space-4);" id="btn-quick-capture-inbox">+ Capture New Document</button>
          </div>
        </div>
      `}
    `;

    container.querySelectorAll('.filter-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        this.activeInboxFilter = btn.dataset.filter;
        if (window.tactile) window.tactile.playClick();
        this.renderInboxView();
      });
    });

    container.querySelector('#btn-quick-capture-inbox')?.addEventListener('click', () => this.openCaptureModal());
    container.querySelector('#btn-inbox-triage-all')?.addEventListener('click', () => this.triageAllInbox());

    this.bindActionEvents(container);
  }

  // ────────────────────────────────────────────────────────────
  // 3. TASKS VIEW RENDERER
  // ────────────────────────────────────────────────────────────
  renderTasksView() {
    const container = document.getElementById('view-tasks');
    if (!container) return;

    const uncompleted = this.data.tasks.filter(t => !t.completed);
    const completed = this.data.tasks.filter(t => t.completed);

    const todayTasks = uncompleted.filter(t => t.dueCategory === 'today');
    const tomorrowTasks = uncompleted.filter(t => t.dueCategory === 'tomorrow');
    const upcomingTasks = uncompleted.filter(t => t.dueCategory !== 'today' && t.dueCategory !== 'tomorrow');

    container.innerHTML = `
      <div class="view-header-row">
        <div class="view-title-wrap">
          <h1 class="view-title">Structured Tasks</h1>
          <span class="view-count-badge">${uncompleted.length} actionable obligations</span>
        </div>
      </div>

      ${todayTasks.length > 0 ? `
        <div class="task-group">
          <div class="task-group-title" style="color: var(--urgency-high);">Today</div>
          <div class="item-list">
            ${todayTasks.map(t => this.renderTaskRowHTML(t)).join('')}
          </div>
        </div>
      ` : ''}

      ${tomorrowTasks.length > 0 ? `
        <div class="task-group">
          <div class="task-group-title">Tomorrow</div>
          <div class="item-list">
            ${tomorrowTasks.map(t => this.renderTaskRowHTML(t)).join('')}
          </div>
        </div>
      ` : ''}

      ${upcomingTasks.length > 0 ? `
        <div class="task-group">
          <div class="task-group-title">Upcoming</div>
          <div class="item-list">
            ${upcomingTasks.map(t => this.renderTaskRowHTML(t)).join('')}
          </div>
        </div>
      ` : ''}

      ${completed.length > 0 ? `
        <div class="task-group" style="margin-top: var(--space-10); opacity: 0.75;">
          <div class="task-group-title">Completed (${completed.length})</div>
          <div class="item-list">
            ${completed.map(t => this.renderTaskRowHTML(t)).join('')}
          </div>
        </div>
      ` : ''}
    `;

    this.bindActionEvents(container);
  }

  renderTaskRowHTML(task) {
    const reqDone = task.requirements.filter(r => r.completed).length;
    const reqTotal = task.requirements.length;

    return `
      <div class="item-row spotlight-card" data-task-id="${task.id}">
        <div class="item-row-left">
          <div class="item-checkbox ${task.completed ? 'checked' : ''}" data-action="toggle-task" data-id="${task.id}">
            <i class="ph ph-check" style="font-size: 11px;"></i>
          </div>
          <div class="item-main-info" data-action="inspect-task" data-id="${task.id}">
            <div class="item-title ${task.completed ? 'completed' : ''}">${task.title}</div>
            <div class="item-subtext">
              <span class="item-subtext-source"><i class="ph ${this.getCategoryIcon(task.category)}"></i> ${task.sourceName}</span>
              ${task.amount ? `<span class="tag tag-subtle amount-val">${task.amount}</span>` : ''}
              ${reqTotal > 0 ? `<span class="tag tag-subtle" style="font-size: 10px;">${reqDone}/${reqTotal} reqs</span>` : ''}
            </div>
          </div>
        </div>
        <div class="item-row-right">
          <span class="tag ${task.dueCategory === 'today' ? 'tag-urgent' : 'tag-subtle'}">${task.due}</span>
          ${task.amount && !task.completed ? `
            <button class="btn btn-primary btn-sm" data-action="pay-task" data-id="${task.id}">
              <i class="ph ph-lightning"></i> Pay
            </button>
          ` : ''}
          <button class="btn btn-secondary btn-sm" data-action="inspect-task" data-id="${task.id}">Inspect</button>
        </div>
      </div>
    `;
  }

  // ────────────────────────────────────────────────────────────
  // 4. CALENDAR TIMELINE VIEW
  // ────────────────────────────────────────────────────────────
  renderCalendarView() {
    const container = document.getElementById('view-calendar');
    if (!container) return;

    const days = {};
    this.data.timeline.forEach(item => {
      if (!days[item.day]) days[item.day] = [];
      days[item.day].push(item);
    });

    container.innerHTML = `
      <div class="view-header-row">
        <div class="view-title-wrap">
          <h1 class="view-title">Calendar Timeline</h1>
          <span class="view-count-badge">Commitment schedule</span>
        </div>
      </div>

      ${Object.keys(days).map(dayTitle => `
        <div class="timeline-day-group">
          <div class="timeline-day-header">
            <i class="ph ph-calendar" style="color: var(--accent);"></i>
            <span>${dayTitle}</span>
          </div>
          <div class="timeline-list">
            ${days[dayTitle].map(t => `
              <div class="timeline-item spotlight-card">
                <span class="timeline-time">${t.time}</span>
                <span class="timeline-dot" style="background-color: ${t.color};"></span>
                <div class="timeline-content">
                  <span class="timeline-title">${t.title}</span>
                  <span class="tag tag-${t.category}">${t.type}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `).join('')}
    `;
  }

  // ────────────────────────────────────────────────────────────
  // 5. DOCUMENTS VIEW (3D Interactive Vault)
  // ────────────────────────────────────────────────────────────
  renderDocumentsView() {
    const container = document.getElementById('view-documents');
    if (!container) return;

    container.innerHTML = `
      <div class="view-header-row">
        <div class="view-title-wrap">
          <h1 class="view-title">Documents Vault</h1>
          <span class="view-count-badge">${this.data.documents.length} verified records</span>
        </div>
        <button class="btn btn-secondary btn-sm" id="btn-doc-upload">+ Add Record</button>
      </div>

      <div class="doc-3d-grid">
        ${this.data.documents.map(doc => `
          <div class="doc-card-3d spotlight-card" data-action="inspect-doc" data-id="${doc.id}">
            <div class="doc-card-top">
              <div class="doc-icon-badge" style="background: var(--cat-${doc.category}-bg); color: var(--cat-${doc.category});">
                <i class="ph ${doc.icon}"></i>
              </div>
              <span class="tag ${doc.urgent ? 'tag-urgent' : 'tag-subtle'}">
                ${doc.expires === 'Permanent' ? 'Permanent' : `Expires: ${doc.expires}`}
              </span>
            </div>

            <div>
              <div class="doc-card-title">${doc.title}</div>
              <div class="doc-card-source">${doc.source} · ${doc.fileType} (${doc.size})</div>
            </div>

            <div class="doc-card-bottom">
              <span style="color: var(--text-muted); font-size: 11px;">
                ${doc.relatedTask ? `<strong style="color: var(--urgency-high);">Linked Task</strong>` : 'Secured in Vault'}
              </span>
              <button class="btn btn-ghost btn-sm" style="padding: 2px 6px;">Inspect →</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    container.querySelector('#btn-doc-upload')?.addEventListener('click', () => this.openCaptureModal());
    this.bindActionEvents(container);
  }

  // ────────────────────────────────────────────────────────────
  // 1-CLICK INSTANT BILL PAYMENT MODAL (Market-Ready Feature)
  // ────────────────────────────────────────────────────────────
  openPaymentModal(item) {
    if (window.tactile) window.tactile.playClick();
    const modal = document.getElementById('payment-modal');
    const content = document.getElementById('payment-modal-content');
    if (!modal || !content) return;

    content.innerHTML = `
      <div style="text-align: center; padding: var(--space-4) 0;">
        <div style="width: 56px; height: 56px; border-radius: 50%; background: rgba(26, 122, 92, 0.15); color: var(--accent); display: flex; align-items: center; justify-content: center; font-size: 1.75rem; margin: 0 auto var(--space-4);">
          <i class="ph ph-lightning"></i>
        </div>

        <div style="font-size: var(--text-xs); text-transform: uppercase; letter-spacing: var(--tracking-wider); color: var(--text-muted);">
          Instant Settlement Gateway
        </div>
        <div style="font-size: var(--text-2xl); font-weight: 700; color: var(--text-primary); margin: 4px 0;">
          ${item.amount}
        </div>
        <div style="font-size: var(--text-sm); color: var(--text-secondary); margin-bottom: var(--space-6);">
          ${item.title} (${item.source || item.sourceName})
        </div>

        <div style="background: var(--bg-primary); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: var(--space-4); text-align: left; margin-bottom: var(--space-6);">
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 12px;">
            <span style="color: var(--text-muted);">Payment Method:</span>
            <strong style="color: var(--text-primary);">UPI Autopay / Card</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 12px;">
            <span style="color: var(--text-muted);">Consumer Ref:</span>
            <span class="mono" style="color: var(--text-secondary);">REF-04231098</span>
          </div>
        </div>

        <div style="display: flex; gap: var(--space-3);">
          <button class="btn btn-secondary" style="flex: 1;" id="btn-cancel-pay">Cancel</button>
          <button class="btn-shimmer" style="flex: 2; justify-content: center;" id="btn-confirm-pay">
            <i class="ph ph-lock-key"></i> Pay ${item.amount}
          </button>
        </div>
      </div>
    `;

    content.querySelector('#btn-cancel-pay')?.addEventListener('click', () => this.closeAllModals());
    content.querySelector('#btn-confirm-pay')?.addEventListener('click', () => {
      this.executePayment(item);
    });

    modal.classList.add('open');
  }

  executePayment(item) {
    const content = document.getElementById('payment-modal-content');
    if (!content) return;
    if (window.tactile) window.tactile.playClick();

    content.innerHTML = `
      <div style="text-align: center; padding: var(--space-8) 0;">
        <i class="ph ph-circle-notch" style="font-size: 2.5rem; color: var(--accent-hermes); animation: spin 0.8s linear infinite; margin-bottom: var(--space-4);"></i>
        <div style="font-size: var(--text-md); font-weight: 600;">Processing settlement with bank…</div>
        <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 4px;">Securing transaction token</div>
      </div>
    `;

    setTimeout(() => {
      if (window.tactile) window.tactile.playComplete();
      const txnId = `TXN-${Math.floor(100000 + Math.random() * 900000)}`;

      content.innerHTML = `
        <div style="text-align: center; padding: var(--space-6) 0;">
          <div style="width: 56px; height: 56px; border-radius: 50%; background: #DCFCE7; color: #16A34A; display: flex; align-items: center; justify-content: center; font-size: 2rem; margin: 0 auto var(--space-4);">
            <i class="ph ph-check-circle"></i>
          </div>
          <div style="font-size: var(--text-lg); font-weight: 700; color: var(--text-primary);">Settlement Successful</div>
          <div style="font-size: var(--text-sm); color: var(--text-secondary); margin-top: 2px;">
            ${item.amount} paid to ${item.source || item.sourceName}
          </div>
          <div class="mono" style="font-size: 11px; color: var(--text-muted); margin-top: 6px;">
            Ref: ${txnId} · Receipt Generated
          </div>

          <button class="btn btn-primary" style="margin-top: var(--space-6); width: 100%;" id="btn-done-pay">Done</button>
        </div>
      `;

      // Complete the task or remove from inbox
      const task = this.data.tasks.find(t => t.id === item.id);
      if (task) task.completed = true;

      this.data.inbox = this.data.inbox.filter(i => i.id !== item.id);

      content.querySelector('#btn-done-pay')?.addEventListener('click', () => {
        this.closeAllModals();
        this.renderAll();
      });
    }, 1200);
  }

  bindPaymentModal() {
    const modal = document.getElementById('payment-modal');
    modal?.addEventListener('click', (e) => {
      if (e.target === modal) this.closeAllModals();
    });
  }

  // ────────────────────────────────────────────────────────────
  // FEEDS SYNC MODAL (WhatsApp & Gmail Stream)
  // ────────────────────────────────────────────────────────────
  openFeedsModal() {
    if (window.tactile) window.tactile.playClick();
    const modal = document.getElementById('feeds-modal');
    const content = document.getElementById('feeds-modal-content');
    if (!modal || !content) return;

    content.innerHTML = `
      <div style="margin-bottom: var(--space-4);">
        <div style="font-size: var(--text-xs); text-transform: uppercase; letter-spacing: var(--tracking-wider); color: var(--text-muted); margin-bottom: 2px;">
          Live Autonomous Streams
        </div>
        <div style="font-size: var(--text-sm); color: var(--text-secondary);">
          Incoming notices and bills detected across connected communication channels.
        </div>
      </div>

      <div style="display: flex; flex-direction: column; gap: var(--space-3);">
        ${this.data.liveFeeds.map(feed => `
          <div class="spotlight-card" style="padding: var(--space-4); background: var(--bg-primary); border-radius: var(--radius-md);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <span class="tag tag-subtle" style="font-size: 10px;">
                <i class="ph ${feed.icon}"></i> ${feed.channelName}
              </span>
              <span style="font-size: 10px; color: var(--text-muted);">${feed.date}</span>
            </div>
            <div style="font-size: var(--text-sm); font-weight: 600; color: var(--text-primary); margin-top: 2px;">
              ${feed.title}
            </div>
            <div style="font-size: var(--text-xs); color: var(--text-secondary); margin: 4px 0;">
              ${feed.snippet}
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: var(--space-3); border-top: 1px solid var(--border-subtle); padding-top: 6px;">
              <span class="amount-val" style="font-weight: 700; color: var(--text-primary); font-size: 13px;">${feed.amount}</span>
              <button class="btn btn-primary btn-sm" data-feed-ingest="${feed.id}">
                <i class="ph ph-plus"></i> Ingest to Tasks
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    content.querySelectorAll('[data-feed-ingest]').forEach(btn => {
      btn.addEventListener('click', () => {
        const feedId = btn.dataset.feedIngest;
        const feed = this.data.liveFeeds.find(f => f.id === feedId);
        if (feed) {
          this.data.tasks.unshift({
            id: `task-${Date.now()}`,
            title: feed.title,
            due: "Due in 7 days",
            dueCategory: "upcoming",
            urgency: "medium",
            category: "housing",
            sourceName: feed.channelName,
            whyExists: feed.snippet,
            amount: feed.amount,
            requirements: [{ text: "Settle obligation via UPI", completed: false }],
            completed: false
          });
          this.data.liveFeeds = this.data.liveFeeds.filter(f => f.id !== feedId);
          if (window.tactile) window.tactile.playComplete();
          this.showToast(`Ingested: "${feed.title}"`);
          this.closeAllModals();
          this.renderAll();
        }
      });
    });

    modal.classList.add('open');
  }

  bindFeedsModal() {
    const modal = document.getElementById('feeds-modal');
    modal?.addEventListener('click', (e) => {
      if (e.target === modal) this.closeAllModals();
    });
  }

  // ────────────────────────────────────────────────────────────
  // CONTEXT INSPECTOR DRAWER
  // ────────────────────────────────────────────────────────────
  openTaskDrawer(taskId) {
    const task = this.data.tasks.find(t => t.id === taskId);
    if (!task) return;

    this.selectedItem = task;
    if (window.tactile) window.tactile.playClick();

    const drawer = document.getElementById('context-drawer');
    const backdrop = document.getElementById('drawer-backdrop');
    if (!drawer || !backdrop) return;

    const drawerBody = document.getElementById('drawer-body-content');
    const drawerTitle = document.getElementById('drawer-title');

    drawerTitle.textContent = task.title;

    drawerBody.innerHTML = `
      <div style="margin-bottom: var(--space-6);">
        <div style="font-size: var(--text-xs); text-transform: uppercase; letter-spacing: var(--tracking-wider); color: var(--text-muted); margin-bottom: var(--space-2);">Context & Provenance</div>
        <div class="source-provenance" style="width: 100%;">
          <i class="ph ${this.getCategoryIcon(task.category)}"></i>
          <strong>Source:</strong> ${task.sourceName}
        </div>
      </div>

      <div style="margin-bottom: var(--space-6);">
        <div style="font-size: var(--text-xs); text-transform: uppercase; letter-spacing: var(--tracking-wider); color: var(--text-muted); margin-bottom: var(--space-1);">Why this obligation exists</div>
        <p style="font-size: var(--text-sm); color: var(--text-primary); background: var(--bg-sidebar); padding: var(--space-3); border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
          ${task.whyExists}
        </p>
      </div>

      <div style="margin-bottom: var(--space-6);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-2);">
          <div style="font-size: var(--text-xs); text-transform: uppercase; letter-spacing: var(--tracking-wider); color: var(--text-muted);">Requirements Checklist</div>
          <span style="font-size: var(--text-xs); color: var(--text-secondary);">${task.requirements.filter(r => r.completed).length}/${task.requirements.length} Completed</span>
        </div>
        <div class="req-checklist">
          ${task.requirements.map((req, idx) => `
            <div class="req-item" data-req-idx="${idx}">
              <div class="item-checkbox ${req.completed ? 'checked' : ''}" style="margin-top: 2px;">
                <i class="ph ph-check" style="font-size: 11px;"></i>
              </div>
              <span style="flex: 1; ${req.completed ? 'text-decoration: line-through; color: var(--text-muted);' : ''}">${req.text}</span>
            </div>
          `).join('')}
        </div>
      </div>

      ${task.amount ? `
        <div style="margin-bottom: var(--space-6); background: var(--bg-primary); border: 1px solid var(--border-subtle); padding: var(--space-3); border-radius: var(--radius-sm); display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: var(--text-sm); color: var(--text-secondary);">Obligation Amount</span>
          <span class="amount-val" style="font-size: var(--text-md); font-weight: 600; color: var(--text-primary);">${task.amount}</span>
        </div>
      ` : ''}

      <div style="background: var(--bg-sidebar); border: 1px solid var(--border-subtle); padding: var(--space-3); border-radius: var(--radius-sm);">
        <div style="font-size: var(--text-xs); color: var(--text-muted); margin-bottom: 4px;">System Audit Metadata</div>
        <div style="font-size: var(--text-xs); color: var(--text-secondary);">
          • Extraction Certainty: <strong>High (98.4%)</strong><br>
          • Source Provenance: Verified document hash<br>
          • Extracted on: 09-Aug-2026 12:40 IST
        </div>
      </div>
    `;

    drawerBody.querySelectorAll('.req-item').forEach(item => {
      item.addEventListener('click', () => {
        const idx = parseInt(item.dataset.reqIdx, 10);
        task.requirements[idx].completed = !task.requirements[idx].completed;
        if (window.tactile) window.tactile.playClick();
        this.openTaskDrawer(task.id);
        this.renderView('tasks');
        this.renderView('today');
      });
    });

    backdrop.classList.add('open');
    drawer.classList.add('open');
  }

  closeDrawer() {
    document.getElementById('context-drawer')?.classList.remove('open');
    document.getElementById('drawer-backdrop')?.classList.remove('open');
  }

  bindDrawer() {
    const backdrop = document.getElementById('drawer-backdrop');
    const closeBtn = document.getElementById('btn-close-drawer');
    backdrop?.addEventListener('click', () => this.closeDrawer());
    closeBtn?.addEventListener('click', () => this.closeDrawer());

    document.getElementById('drawer-action-complete')?.addEventListener('click', () => {
      if (this.selectedItem) {
        this.toggleTask(this.selectedItem.id);
        this.closeDrawer();
      }
    });
  }

  // ────────────────────────────────────────────────────────────
  // CAPTURE SCANNER SIMULATOR
  // ────────────────────────────────────────────────────────────
  openCaptureModal() {
    if (window.tactile) window.tactile.playClick();
    const modal = document.getElementById('capture-modal');
    if (modal) modal.classList.add('open');
    this.resetCaptureModalState();
  }

  resetCaptureModalState() {
    const container = document.getElementById('capture-modal-content');
    if (!container) return;

    container.innerHTML = `
      <div class="capture-dropzone" id="capture-dropzone">
        <i class="ph ph-file-arrow-up" style="font-size: 2.2rem; color: var(--accent-hermes); margin-bottom: var(--space-2);"></i>
        <div style="font-size: var(--text-base); font-weight: 600; color: var(--text-primary); margin-bottom: 2px;">Drop any life document, bill or screenshot</div>
        <div style="font-size: var(--text-xs); color: var(--text-muted);">PDF, JPG, PNG, Email text, Circulars — system automatically extracts obligations</div>
      </div>

      <div class="capture-options-grid">
        <button class="capture-option-btn" data-capture-type="file"><i class="ph ph-file-pdf"></i> Upload PDF</button>
        <button class="capture-option-btn" data-capture-type="screenshot"><i class="ph ph-camera"></i> Camera Scan</button>
        <button class="capture-option-btn" data-capture-type="paste"><i class="ph ph-clipboard-text"></i> Paste Raw Text</button>
      </div>

      <div style="margin-top: var(--space-6);">
        <div style="font-size: var(--text-xs); text-transform: uppercase; letter-spacing: var(--tracking-wider); color: var(--text-muted); margin-bottom: var(--space-2);">Test with authentic presets:</div>
        <div class="sample-pills-row">
          ${this.data.sampleUploads.map((s, idx) => `
            <div class="sample-pill" data-sample-idx="${idx}">
              <i class="ph ph-lightning" style="color: var(--accent-hermes);"></i> ${s.label}
            </div>
          `).join('')}
        </div>
      </div>
    `;

    const dropzone = container.querySelector('#capture-dropzone');
    dropzone?.addEventListener('click', () => this.simulateCaptureProgress(this.data.sampleUploads[0]));

    container.querySelectorAll('.sample-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        const idx = parseInt(pill.dataset.sampleIdx, 10);
        this.simulateCaptureProgress(this.data.sampleUploads[idx]);
      });
    });

    container.querySelectorAll('.capture-option-btn').forEach(btn => {
      btn.addEventListener('click', () => this.simulateCaptureProgress(this.data.sampleUploads[0]));
    });
  }

  simulateCaptureProgress(sample) {
    if (window.tactile) window.tactile.playClick();
    const container = document.getElementById('capture-modal-content');
    if (!container) return;

    container.innerHTML = `
      <div style="text-align: center; padding: var(--space-2) 0;">
        <div class="scanner-viewport">
          <div class="scan-laser-line"></div>
          <div class="scanner-doc-preview">
            <div style="height: 6px; width: 40%; background: #DDD; border-radius: 2px;"></div>
            <div style="height: 4px; width: 80%; background: #EEE; border-radius: 2px;"></div>
            <div style="height: 4px; width: 90%; background: #EEE; border-radius: 2px;"></div>
            <div style="height: 4px; width: 70%; background: #EEE; border-radius: 2px;"></div>
            <div class="ocr-bounding-box" id="bbox-1" style="top: 40px; left: 10px; right: 10px; height: 16px; display: none;"></div>
            <div class="ocr-bounding-box" id="bbox-2" style="top: 70px; left: 10px; width: 60px; height: 14px; display: none;"></div>
            <div class="ocr-bounding-box" id="bbox-3" style="top: 100px; left: 10px; right: 20px; height: 14px; display: none;"></div>
          </div>
        </div>

        <div style="font-size: var(--text-md); font-weight: 600; color: var(--text-primary);">
          Analyzing ${sample.name}…
        </div>
        <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px;">
          Extracting structured obligations, fee amounts, and requirements
        </div>

        <div class="extraction-meter">
          <div class="extraction-meter-fill" id="extract-fill"></div>
        </div>

        <div id="progressive-entities" style="text-align: left; margin-top: var(--space-4);"></div>
      </div>
    `;

    const fill = document.getElementById('extract-fill');
    const entitiesBox = document.getElementById('progressive-entities');

    setTimeout(() => {
      if (fill) fill.style.transform = 'translateX(-50%)';
      const b1 = document.getElementById('bbox-1');
      if (b1) b1.style.display = 'block';
      if (window.tactile) window.tactile.playClick();
      entitiesBox.innerHTML += `
        <div class="extraction-entity-card">
          <div style="display: flex; align-items: center; gap: 8px;">
            <i class="ph ph-calendar-blank" style="color: var(--urgency-high);"></i>
            <span style="font-size: var(--text-sm); font-weight: 600;">Deadline Detected:</span>
          </div>
          <span class="tag tag-urgent">${sample.extracted.deadline}</span>
        </div>
      `;
    }, 400);

    setTimeout(() => {
      if (fill) fill.style.transform = 'translateX(-20%)';
      const b2 = document.getElementById('bbox-2');
      if (b2) b2.style.display = 'block';
      if (window.tactile) window.tactile.playClick();
      entitiesBox.innerHTML += `
        <div class="extraction-entity-card">
          <div style="display: flex; align-items: center; gap: 8px;">
            <i class="ph ph-currency-inr" style="color: var(--accent);"></i>
            <span style="font-size: var(--text-sm); font-weight: 600;">Financial Obligation:</span>
          </div>
          <span class="tag tag-subtle amount-val" style="font-weight: 600;">${sample.extracted.amount}</span>
        </div>
      `;
    }, 800);

    setTimeout(() => {
      if (fill) fill.style.transform = 'translateX(0%)';
      const b3 = document.getElementById('bbox-3');
      if (b3) b3.style.display = 'block';
      if (window.tactile) window.tactile.playComplete();
      entitiesBox.innerHTML += `
        <div class="extraction-entity-card">
          <div style="display: flex; align-items: center; gap: 8px;">
            <i class="ph ph-identification-card" style="color: var(--cat-identity);"></i>
            <span style="font-size: var(--text-sm); font-weight: 600;">Document Requirement:</span>
          </div>
          <span style="font-size: var(--text-xs); color: var(--text-secondary);">${sample.extracted.req}</span>
        </div>

        <div style="margin-top: var(--space-6); display: flex; gap: var(--space-3); justify-content: flex-end;">
          <button class="btn btn-secondary" id="btn-cancel-capture">Discard</button>
          <button class="btn btn-primary" id="btn-confirm-create-task">+ Create Actionable Task</button>
        </div>
      `;

      container.querySelector('#btn-confirm-create-task')?.addEventListener('click', () => {
        this.addNewTaskFromCapture(sample);
      });

      container.querySelector('#btn-cancel-capture')?.addEventListener('click', () => {
        this.resetCaptureModalState();
      });
    }, 1300);
  }

  addNewTaskFromCapture(sample) {
    const newTask = {
      id: `task-${Date.now()}`,
      title: sample.extracted.title,
      due: sample.extracted.deadline,
      dueCategory: 'today',
      urgency: 'high',
      category: sample.category,
      sourceName: sample.extracted.source,
      whyExists: `Auto-extracted obligation from ${sample.name}.`,
      amount: sample.extracted.amount,
      requirements: [
        { text: sample.extracted.req, completed: false },
        { text: "Verify payment acknowledgement", completed: false }
      ],
      completed: false
    };

    this.data.tasks.unshift(newTask);
    this.closeAllModals();
    if (window.tactile) window.tactile.playComplete();
    this.showToast(`Task created: "${newTask.title}"`);
    this.renderAll();
    this.switchView('tasks');
  }

  bindCaptureModal() {
    const modal = document.getElementById('capture-modal');
    const closeBtn = document.getElementById('btn-close-capture');
    const fab = document.getElementById('fab-capture');
    const mobileFab = document.getElementById('mobile-fab-capture');

    fab?.addEventListener('click', () => this.openCaptureModal());
    mobileFab?.addEventListener('click', () => this.openCaptureModal());
    closeBtn?.addEventListener('click', () => this.closeAllModals());

    modal?.addEventListener('click', (e) => {
      if (e.target === modal) this.closeAllModals();
    });
  }

  // ────────────────────────────────────────────────────────────
  // SEARCH / COMMAND PALETTE CONTROLLER
  // ────────────────────────────────────────────────────────────
  openSearchModal() {
    if (window.tactile) window.tactile.playClick();
    const modal = document.getElementById('search-modal');
    const input = document.getElementById('search-input');
    if (modal) modal.classList.add('open');
    if (input) {
      input.value = '';
      input.focus();
      this.renderSearchResults('');
    }
  }

  bindSearchModal() {
    const modal = document.getElementById('search-modal');
    const input = document.getElementById('search-input');
    const trigger = document.getElementById('topbar-search-trigger');

    trigger?.addEventListener('click', () => this.openSearchModal());

    input?.addEventListener('input', (e) => {
      this.renderSearchResults(e.target.value);
    });

    modal?.addEventListener('click', (e) => {
      if (e.target === modal) this.closeAllModals();
    });
  }

  renderSearchResults(query) {
    const container = document.getElementById('search-results-container');
    if (!container) return;

    if (!query || query.trim() === '') {
      container.innerHTML = `
        <div class="search-prompt-label">Quick Life Queries</div>
        <div class="search-suggestion-item" data-query="What bills are due this week?">
          <span><i class="ph ph-lightning" style="margin-right: 8px;"></i> What bills are due this week?</span>
          <span style="font-size: 11px; color: var(--text-muted);">Finance</span>
        </div>
        <div class="search-suggestion-item" data-query="When does my passport expire?">
          <span><i class="ph ph-passport" style="margin-right: 8px;"></i> When does my passport expire?</span>
          <span style="font-size: 11px; color: var(--text-muted);">Identity</span>
        </div>
        <div class="search-suggestion-item" data-query="What do I need for my Chennai trip?">
          <span><i class="ph ph-train" style="margin-right: 8px;"></i> What do I need for my Chennai trip?</span>
          <span style="font-size: 11px; color: var(--text-muted);">Travel</span>
        </div>
        <div class="search-suggestion-item" data-query="Find the receipt for my headphones">
          <span><i class="ph ph-certificate" style="margin-right: 8px;"></i> Find the receipt for my headphones</span>
          <span style="font-size: 11px; color: var(--text-muted);">Warranty</span>
        </div>
      `;

      container.querySelectorAll('.search-suggestion-item').forEach(item => {
        item.addEventListener('click', () => {
          const q = item.dataset.query;
          const input = document.getElementById('search-input');
          if (input) input.value = q;
          this.renderSearchResults(q);
        });
      });
      return;
    }

    const results = executeNaturalLanguageSearch(query, this.data);

    if (results.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: var(--space-8) 0; color: var(--text-muted);">
          <i class="ph ph-magnifying-glass" style="font-size: 1.5rem; margin-bottom: var(--space-2);"></i>
          <div style="font-size: var(--text-sm); font-weight: 500;">No records matched "${query}"</div>
          <div style="font-size: var(--text-xs);">Try asking about bills, passports, trips or receipts.</div>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="search-prompt-label">${results.length} Structured Records Found</div>
      ${results.map(res => `
        <div class="search-suggestion-item" data-target-view="${res.targetView}" data-item-id="${res.item.id}">
          <div style="display: flex; flex-direction: column; gap: 2px;">
            <span style="font-weight: 500; color: var(--text-primary);">${res.title}</span>
            <span style="font-size: 11px; color: var(--text-secondary);">${res.subtitle}</span>
          </div>
          <span class="tag tag-subtle">${res.type}</span>
        </div>
      `).join('')}
    `;

    container.querySelectorAll('.search-suggestion-item').forEach(el => {
      el.addEventListener('click', () => {
        const targetView = el.dataset.targetView;
        const itemId = el.dataset.itemId;
        this.closeAllModals();
        this.switchView(targetView);
        if (targetView === 'tasks') {
          setTimeout(() => this.openTaskDrawer(itemId), 200);
        }
      });
    });
  }

  // ────────────────────────────────────────────────────────────
  // CORE CRUD & TRIAGE ACTIONS
  // ────────────────────────────────────────────────────────────
  toggleTask(taskId) {
    const task = this.data.tasks.find(t => t.id === taskId);
    if (!task) return;

    task.completed = !task.completed;
    if (task.completed) {
      if (window.tactile) window.tactile.playComplete();
      this.showToast(`Completed: "${task.title}"`, () => this.toggleTask(taskId));
    } else {
      if (window.tactile) window.tactile.playClick();
    }

    this.renderAll();
  }

  convertInboxToTask(inboxId) {
    const itemIdx = this.data.inbox.findIndex(i => i.id === inboxId);
    if (itemIdx === -1) return;

    const item = this.data.inbox[itemIdx];
    this.data.inbox.splice(itemIdx, 1);

    const newTask = {
      id: `task-${Date.now()}`,
      title: item.title,
      due: item.date,
      dueCategory: item.importance === 'high' ? 'today' : 'upcoming',
      urgency: item.importance,
      category: item.sourceCategory,
      sourceName: item.source,
      whyExists: item.summary,
      amount: item.amount,
      requirements: item.detectedObligations.map(o => ({ text: o.text, completed: false })),
      completed: false
    };

    this.data.tasks.unshift(newTask);
    if (window.tactile) window.tactile.playComplete();
    this.showToast(`Converted "${item.title}" into task`, () => {
      this.data.tasks = this.data.tasks.filter(t => t.id !== newTask.id);
      this.data.inbox.splice(itemIdx, 0, item);
      this.renderAll();
    });

    this.renderAll();
  }

  archiveInbox(inboxId) {
    const itemIdx = this.data.inbox.findIndex(i => i.id === inboxId);
    if (itemIdx === -1) return;

    const [item] = this.data.inbox.splice(itemIdx, 1);
    if (window.tactile) window.tactile.playClick();
    this.showToast(`Archived item from ${item.source}`, () => {
      this.data.inbox.splice(itemIdx, 0, item);
      this.renderAll();
    });

    this.renderAll();
  }

  triageAllInbox() {
    if (this.data.inbox.length === 0) return;
    if (window.tactile) window.tactile.playComplete();
    
    const count = this.data.inbox.length;
    while(this.data.inbox.length > 0) {
      const item = this.data.inbox.shift();
      this.data.tasks.push({
        id: `task-${Date.now()}-${Math.random()}`,
        title: item.title,
        due: item.date,
        dueCategory: 'today',
        urgency: item.importance,
        category: item.sourceCategory,
        sourceName: item.source,
        whyExists: item.summary,
        amount: item.amount,
        requirements: item.detectedObligations.map(o => ({ text: o.text, completed: false })),
        completed: false
      });
    }

    this.showToast(`Triaged and structured ${count} items.`);
    this.renderAll();
    this.switchView('tasks');
  }

  bindActionEvents(container) {
    container.querySelectorAll('[data-action]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = el.dataset.action;
        const id = el.dataset.id;

        if (action === 'toggle-task') this.toggleTask(id);
        if (action === 'inspect-task') this.openTaskDrawer(id);
        if (action === 'convert-inbox') this.convertInboxToTask(id);
        if (action === 'archive-inbox') this.archiveInbox(id);
        if (action === 'inspect-inbox') this.openInboxInspect(id);
        if (action === 'inspect-doc') this.openDocInspect(id);
        if (action === 'pay-task') {
          const task = this.data.tasks.find(t => t.id === id);
          if (task) this.openPaymentModal(task);
        }
        if (action === 'pay-inbox') {
          const inboxItem = this.data.inbox.find(i => i.id === id);
          if (inboxItem) this.openPaymentModal(inboxItem);
        }
      });
    });

    container.querySelectorAll('[data-view]').forEach(el => {
      el.addEventListener('click', () => {
        const view = el.dataset.view;
        if (view) this.switchView(view);
      });
    });
  }

  openInboxInspect(inboxId) {
    const item = this.data.inbox.find(i => i.id === inboxId);
    if (!item) return;

    this.selectedItem = item;
    if (window.tactile) window.tactile.playClick();

    const drawer = document.getElementById('context-drawer');
    const backdrop = document.getElementById('drawer-backdrop');
    const drawerBody = document.getElementById('drawer-body-content');
    const drawerTitle = document.getElementById('drawer-title');

    drawerTitle.textContent = item.title;

    drawerBody.innerHTML = `
      <div style="margin-bottom: var(--space-6);">
        <div style="font-size: var(--text-xs); text-transform: uppercase; letter-spacing: var(--tracking-wider); color: var(--text-muted); margin-bottom: var(--space-2);">Captured Raw Context</div>
        <div class="source-provenance" style="width: 100%;">
          <i class="ph ${item.sourceIcon}"></i>
          <strong>Source:</strong> ${item.source}
        </div>
      </div>

      <div style="margin-bottom: var(--space-6);">
        <div style="font-size: var(--text-xs); text-transform: uppercase; letter-spacing: var(--tracking-wider); color: var(--text-muted); margin-bottom: var(--space-1);">Summary</div>
        <p style="font-size: var(--text-sm); color: var(--text-primary);">${item.summary}</p>
      </div>

      <div style="margin-bottom: var(--space-6);">
        <div style="font-size: var(--text-xs); text-transform: uppercase; letter-spacing: var(--tracking-wider); color: var(--text-muted); margin-bottom: var(--space-2);">Extracted Obligations</div>
        <div class="req-checklist">
          ${item.detectedObligations.map(ob => `
            <div class="req-item">
              <i class="ph ${ob.icon}" style="color: var(--accent); margin-top: 2px;"></i>
              <span style="flex: 1;">${ob.text}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <div style="background: var(--bg-primary); padding: var(--space-3); border-radius: var(--radius-sm); border: 1px solid var(--border-subtle); margin-bottom: var(--space-6);">
        <div style="font-size: var(--text-xs); color: var(--text-muted); margin-bottom: 4px;">Raw Extracted Text snippet</div>
        <div style="font-family: var(--font-mono); font-size: 11px; color: var(--text-secondary); line-height: 1.4;">
          ${item.rawText}
        </div>
      </div>

      <div style="display: flex; gap: var(--space-3);">
        ${item.amount ? `
          <button class="btn btn-primary" style="flex: 1;" id="btn-drawer-pay">
            <i class="ph ph-lightning"></i> Pay ${item.amount}
          </button>
        ` : ''}
        <button class="btn btn-secondary" style="flex: 1;" id="btn-drawer-convert-task">
          Convert to Task
        </button>
      </div>
    `;

    drawerBody.querySelector('#btn-drawer-pay')?.addEventListener('click', () => {
      this.closeDrawer();
      this.openPaymentModal(item);
    });

    drawerBody.querySelector('#btn-drawer-convert-task')?.addEventListener('click', () => {
      this.convertInboxToTask(item.id);
      this.closeDrawer();
    });

    backdrop?.classList.add('open');
    drawer?.classList.add('open');
  }

  openDocInspect(docId) {
    const doc = this.data.documents.find(d => d.id === docId);
    if (!doc) return;

    this.selectedItem = doc;
    if (window.tactile) window.tactile.playClick();

    const drawer = document.getElementById('context-drawer');
    const backdrop = document.getElementById('drawer-backdrop');
    const drawerBody = document.getElementById('drawer-body-content');
    const drawerTitle = document.getElementById('drawer-title');

    drawerTitle.textContent = doc.title;

    drawerBody.innerHTML = `
      <div style="margin-bottom: var(--space-6);">
        <div style="font-size: var(--text-xs); text-transform: uppercase; letter-spacing: var(--tracking-wider); color: var(--text-muted); margin-bottom: var(--space-2);">Document Metadata</div>
        <div class="source-provenance" style="width: 100%;">
          <i class="ph ${doc.icon}"></i>
          <strong>Origin:</strong> ${doc.source}
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3); margin-bottom: var(--space-6);">
        <div style="background: var(--bg-primary); padding: var(--space-3); border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
          <div style="font-size: var(--text-xs); color: var(--text-muted);">Issued On</div>
          <div style="font-size: var(--text-sm); font-weight: 500; color: var(--text-primary);">${doc.issued}</div>
        </div>
        <div style="background: var(--bg-primary); padding: var(--space-3); border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
          <div style="font-size: var(--text-xs); color: var(--text-muted);">Expires On</div>
          <div style="font-size: var(--text-sm); font-weight: 500; color: ${doc.urgent ? 'var(--urgency-high)' : 'var(--text-primary)'};">${doc.expires}</div>
        </div>
      </div>

      ${doc.relatedTask ? `
        <div style="margin-bottom: var(--space-6); background: var(--urgency-high-bg); padding: var(--space-3); border-radius: var(--radius-sm); border: 1px solid var(--warning);">
          <div style="font-size: var(--text-xs); font-weight: 600; color: var(--urgency-high);">Linked Active Obligation</div>
          <div style="font-size: var(--text-sm); color: var(--text-primary); margin-top: 2px;">${doc.relatedTask}</div>
        </div>
      ` : ''}

      <div style="display: flex; gap: var(--space-3);">
        <button class="btn btn-primary" style="flex: 1;"><i class="ph ph-eye"></i> View Original</button>
        <button class="btn btn-secondary" style="flex: 1;"><i class="ph ph-download-simple"></i> Download</button>
      </div>
    `;

    backdrop?.classList.add('open');
    drawer?.classList.add('open');
  }

  showToast(message, undoCallback = null) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <span>${message}</span>
      ${undoCallback ? `<span class="toast-undo">Undo</span>` : ''}
    `;

    if (undoCallback) {
      toast.querySelector('.toast-undo')?.addEventListener('click', () => {
        if (window.tactile) window.tactile.playClick();
        undoCallback();
        toast.remove();
      });
    }

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
      toast.style.transition = 'all 200ms ease';
      setTimeout(() => toast.remove(), 200);
    }, 4000);
  }

  getCategoryIcon(cat) {
    const map = {
      education: 'ph-graduation-cap',
      finance: 'ph-lightning',
      travel: 'ph-train',
      health: 'ph-first-aid',
      warranty: 'ph-certificate',
      housing: 'ph-house-line',
      identity: 'ph-identification-card'
    };
    return map[cat] || 'ph-file-text';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.app = new LifeAdminApp();
});
