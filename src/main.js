// ═══════════════════════════════════════════════
// ARORA LAB — Main Application Controller
// Routing, dark mode, boot sequence, AI commands
// ═══════════════════════════════════════════════

import { renderIdleView } from './views/idle.js';
import { renderEditorView, initEditorView } from './views/editor.js';
import { renderExecutionView, initExecutionView } from './views/execution.js';
import { renderKnowledgeView, initKnowledgeView } from './views/knowledge.js';
import { renderHistoryView } from './views/history.js';
import { renderWorkersView, initWorkersView } from './views/workers.js';
import { renderBridgeView, initBridgeView } from './views/bridge.js';
import { handleCommand, clearHistory, startNewChat } from './ai-engine.js';
import { initAuth, logout } from './auth.js';
import { bridgeService } from './bridge-service.js';

// ── View Registry ──
const views = {
  idle: { render: renderIdleView, title: 'Workspace', breadcrumbs: [] },
  editor: { render: renderEditorView, init: initEditorView, title: 'Editor', breadcrumbs: ['Project Alpha', 'src', 'index.ts'] },
  execution: { render: renderExecutionView, init: initExecutionView, title: 'Execution', breadcrumbs: ['Workspace', 'Execution'] },
  knowledge: { render: renderKnowledgeView, init: initKnowledgeView, title: 'Knowledge Base', breadcrumbs: ['Workspace', 'Knowledge Base'] },
  history: { render: renderHistoryView, title: 'History', breadcrumbs: ['Workspace', 'Execution History'] },
  workers: { render: renderWorkersView, init: initWorkersView, title: 'Workers', breadcrumbs: ['Workspace', 'Agent Workers'] },
  bridge: { render: renderBridgeView, init: initBridgeView, title: 'System Bridge', breadcrumbs: ['Workspace', 'System Bridge'] }
};

// ── Timeline Data ──
const timelineData = {
  idle: [
    { time: 'Just now', text: 'Memory snapshot compiled successfully.', active: true, badge: null, progress: 100 },
    { time: '2m ago', text: 'Syncing remote worker nodes...', active: false, badge: 'Network', progress: null },
    { time: '15m ago', text: 'Session context initialized.', active: false, badge: null, progress: null },
    { time: '1h ago', text: 'Previous session closed.', active: false, badge: null, progress: null },
  ],
  editor: [
    { time: 'Just now', text: 'AI cursor active on index.ts line 16.', active: true, badge: 'Editor', progress: null },
    { time: '1m ago', text: 'Deployment v1.4.2 pushed to edge.', active: false, badge: 'Deploy', progress: 100 },
    { time: '5m ago', text: 'Documentation auto-synced from docstrings.', active: false, badge: null, progress: null },
  ],
  execution: [
    { time: '10:42:16', text: 'Code Synthesis generating HTML skeleton...', active: true, badge: 'Running', progress: 66 },
    { time: '10:42:15', text: 'Research compiled 4 sources. (1.2s)', active: false, badge: null, progress: 100 },
    { time: '10:42:05', text: 'Planning node executed. (0.4s)', active: false, badge: null, progress: 100 },
    { time: '10:42:01', text: 'Workflow Engine v2.4 initialized.', active: false, badge: null, progress: null },
  ]
};

// ── State ──
export let currentView = 'idle';
export let activeProjectId = null;
export let activeProjectIdea = null;

export function setActiveProject(id, idea) {
  activeProjectId = id;
  activeProjectIdea = idea;
}

// ── DOM References ──
const viewContainer = document.getElementById('view-container');
const navTabs = document.querySelectorAll('.nav-tab');
const mobileTabs = document.querySelectorAll('.mobile-tab');
const breadcrumbsEl = document.getElementById('breadcrumbs');
const statusDot = document.getElementById('status-dot');
const statusText = document.getElementById('status-text');
const timelineEntries = document.getElementById('timeline-entries');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebar-overlay');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const themeIcon = document.getElementById('theme-icon');

// ═══════════════════════════════════════════════
// BOOT SEQUENCE
// ═══════════════════════════════════════════════
async function bootSequence() {
  const loadingScreen = document.getElementById('loading-screen');
  const bootLogo = document.getElementById('boot-logo');
  const bootProgress = document.getElementById('boot-progress');
  const bootStatus = document.getElementById('boot-status');

  if (!loadingScreen) { initApp(); return; }

  // Animate logo in
  bootLogo.classList.add('boot-logo-animate');
  bootLogo.style.opacity = '1';
  bootStatus.classList.add('boot-status-pulse');

  const steps = [
    { progress: 20, text: 'Loading design tokens...' },
    { progress: 45, text: 'Initializing AI agents...' },
    { progress: 65, text: 'Connecting to workspace...' },
    { progress: 85, text: 'Preparing ambient interface...' },
    { progress: 100, text: 'Arora Lab ready.' },
  ];

  for (const step of steps) {
    await wait(350 + Math.random() * 250);
    bootProgress.style.width = step.progress + '%';
    bootStatus.textContent = step.text;
  }

  // Fade out
  await wait(400);
  loadingScreen.style.opacity = '0';
  await wait(500);
  loadingScreen.remove();

  // Initialize Authentication Gateway
  initAuth(initApp);
}

function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

// ═══════════════════════════════════════════════
// DARK MODE
// ═══════════════════════════════════════════════
function initDarkMode() {
  const saved = localStorage.getItem('arora-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = saved === 'dark' || (!saved && prefersDark);

  if (isDark) {
    document.documentElement.classList.add('dark');
    document.body.classList.add('dark');
    themeIcon.textContent = 'light_mode';
  }

  darkModeToggle?.addEventListener('click', toggleDarkMode);
}

export function toggleDarkMode() {
  const html = document.documentElement;
  const body = document.body;
  const isDark = html.classList.toggle('dark');
  body.classList.toggle('dark');

  // Animate icon
  themeIcon.classList.add('theme-icon-animate');
  themeIcon.textContent = isDark ? 'light_mode' : 'dark_mode';
  setTimeout(() => themeIcon.classList.remove('theme-icon-animate'), 300);

  // Persist
  localStorage.setItem('arora-theme', isDark ? 'dark' : 'light');

  // Update loading screen bg if still present
  const ls = document.getElementById('loading-screen');
  if (ls) ls.style.backgroundColor = isDark ? '#111313' : '#fdfcfb';
}

// ═══════════════════════════════════════════════
// COMMAND BAR HANDLER
// ═══════════════════════════════════════════════
function initCommandBar() {
  const input = document.getElementById('command-input');
  const sendBtn = document.getElementById('command-send');
  const kbd = document.getElementById('command-kbd');
  const container = document.getElementById('ai-response-container');

  if (!input) return;

  // Show/hide send button based on input
  input.addEventListener('input', () => {
    const hasText = input.value.trim().length > 0;
    if (sendBtn) {
      sendBtn.style.opacity = hasText ? '1' : '0';
      sendBtn.style.transform = hasText ? 'scale(1)' : 'scale(0.75)';
      sendBtn.style.pointerEvents = hasText ? 'auto' : 'none';
    }
    if (kbd) {
      kbd.style.display = hasText ? 'none' : 'flex';
    }
  });

  // Enter to send
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && input.value.trim()) {
      e.preventDefault();
      submitCommand(input, container, sendBtn, kbd);
    }
  });

  // Click send button
  sendBtn?.addEventListener('click', () => {
    if (input.value.trim()) {
      submitCommand(input, container, sendBtn, kbd);
    }
  });
}

function submitCommand(input, container, sendBtn, kbd) {
  const text = input.value.trim();
  input.value = '';

  // Reset send button
  if (sendBtn) {
    sendBtn.style.opacity = '0';
    sendBtn.style.transform = 'scale(0.75)';
    sendBtn.style.pointerEvents = 'none';
  }
  if (kbd) kbd.style.display = 'flex';

  handleCommand(text, container);
}

// ═══════════════════════════════════════════════
// ROUTER + UI STATE
// ═══════════════════════════════════════════════
export function navigateTo(viewName) {
  if (!views[viewName] || viewName === currentView) return;
  const config = views[viewName];
  viewContainer.classList.add('view-exit');

  setTimeout(() => {
    currentView = viewName;
    viewContainer.innerHTML = config.render();
    viewContainer.classList.remove('view-exit');
    viewContainer.classList.add('view-enter');
    setTimeout(() => viewContainer.classList.remove('view-enter'), 400);

    updateNavState(viewName);
    updateBreadcrumbs(config.breadcrumbs);
    updateStatusIndicator(viewName);
    updateTimeline(viewName);
    window.location.hash = viewName;

    if (config.init) config.init();

    // Re-init command bar if on idle
    if (viewName === 'idle') setTimeout(initCommandBar, 50);
  }, 250);
}

function updateNavState(viewName) {
  navTabs.forEach(tab => {
    tab.className = tab.dataset.view === viewName
      ? 'nav-tab active text-tertiary font-bold border-b-2 border-tertiary pb-0.5 px-3 py-1.5 text-[14px] transition-all'
      : 'nav-tab text-on-surface-variant hover:text-on-surface px-3 py-1.5 rounded-lg text-[14px] hover:bg-surface-variant/50 transition-all';
  });
  mobileTabs.forEach(tab => {
    if (!tab.dataset.view) return;
    tab.className = tab.dataset.view === viewName
      ? 'mobile-tab active flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-semibold bg-tertiary/10 text-tertiary border border-tertiary/10 transition-all'
      : 'mobile-tab flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-semibold text-on-surface-variant hover:text-on-surface transition-all';
  });
}

function updateBreadcrumbs(crumbs) {
  if (!crumbs || crumbs.length === 0) { breadcrumbsEl.innerHTML = ''; return; }
  breadcrumbsEl.innerHTML = crumbs.map((c, i) => {
    const sep = i > 0 ? '<span class="material-symbols-outlined text-[14px] text-outline-variant">chevron_right</span>' : '';
    const cls = i === crumbs.length - 1 ? 'text-on-surface font-semibold' : 'text-on-surface-variant';
    return `${sep}<span class="${cls}">${c}</span>`;
  }).join('');
}

function updateStatusIndicator(viewName) {
  statusText.classList.remove('text-tertiary');
  if (viewName === 'execution') {
    statusDot.className = 'w-2 h-2 rounded-full bg-error animate-pulse shadow-[0_0_6px_rgba(186,26,26,0.6)]';
    statusText.textContent = 'Executing';
  } else if (viewName === 'editor') {
    statusDot.className = 'w-2 h-2 rounded-full bg-tertiary animate-pulse shadow-[0_0_6px_rgba(0,96,172,0.6)]';
    statusText.textContent = 'AI Syncing';
  } else if (viewName === 'workers') {
    statusDot.className = 'w-2 h-2 rounded-full bg-secondary animate-pulse shadow-[0_0_6px_rgba(0,188,212,0.6)]';
    statusText.textContent = 'Nodes Active';
    statusText.textContent = 'Nodes Active';
  } else {
    // If bridge is connected, keep it green!
    if (bridgeService.isConnected) {
      statusDot.className = 'w-2 h-2 rounded-full bg-success animate-pulse-soft shadow-[0_0_5px_rgba(76,175,80,0.5)]';
      statusText.textContent = 'System Online';
    } else {
      statusDot.className = 'w-2 h-2 rounded-full bg-tertiary animate-pulse-soft';
      statusText.textContent = 'System Online';
    }
  }
}

function updateTimeline(viewName) {
  const entries = timelineData[viewName] || [];
  const colors = ['tertiary', 'secondary', 'outline', 'outline-variant/50'];
  timelineEntries.innerHTML = entries.map((entry, i) => {
    const color = entry.active ? 'tertiary' : colors[Math.min(i, colors.length - 1)];
    const dotCls = entry.active
      ? `w-3 h-3 rounded-full bg-${color} border-2 border-surface z-10 shadow-[0_0_0_3px_rgba(0,96,172,0.1)]`
      : `w-3 h-3 rounded-full bg-${color} border-2 border-surface z-10`;
    let content;
    if (entry.active) {
      content = `<div class="bg-surface-container-low border border-outline-variant/10 rounded-xl p-3 shadow-sm">
        <div class="flex items-center justify-between mb-1">
          <span class="text-label-sm text-tertiary font-bold">${entry.time}</span>
          ${entry.badge ? `<span class="text-[10px] text-on-surface-variant px-1.5 py-0.5 bg-surface-container rounded-md">${entry.badge}</span>` : '<span class="material-symbols-outlined text-[14px] text-on-surface-variant">check_circle</span>'}
        </div>
        <p class="text-[14px] text-on-surface leading-tight mb-2">${entry.text}</p>
        ${entry.progress !== null ? `<div class="w-full bg-surface-variant h-1 rounded-full overflow-hidden"><div class="bg-tertiary h-full rounded-full" style="width:${entry.progress}%"></div></div>` : ''}
      </div>`;
    } else {
      const opacity = i > 2 ? 'opacity-40' : i > 1 ? 'opacity-60' : 'opacity-80';
      content = `<div class="p-2 ${opacity} hover:opacity-100 transition-opacity">
        <div class="flex items-center gap-2 mb-1">
          <span class="text-label-sm text-on-surface-variant">${entry.time}</span>
          ${entry.badge ? `<span class="text-[10px] text-on-surface-variant px-1.5 py-0.5 bg-surface-container rounded-md">${entry.badge}</span>` : ''}
        </div>
        <p class="text-[14px] text-on-surface-variant leading-tight">${entry.text}</p>
      </div>`;
    }
    return `<div class="relative pb-8 group"><div class="absolute -left-[25px] top-1 ${dotCls}"></div>${content}</div>`;
  }).join('');
}

// ═══════════════════════════════════════════════
// EVENTS
// ═══════════════════════════════════════════════
navTabs.forEach(t => t.addEventListener('click', e => { e.preventDefault(); navigateTo(t.dataset.view); }));
mobileTabs.forEach(t => { if (t.dataset.view) t.addEventListener('click', e => { e.preventDefault(); navigateTo(t.dataset.view); closeMobileSidebar(); }); });

mobileMenuBtn?.addEventListener('click', () => { sidebar.classList.add('open'); sidebar.classList.remove('hidden'); sidebarOverlay.classList.remove('hidden'); });
sidebarOverlay?.addEventListener('click', closeMobileSidebar);
function closeMobileSidebar() { sidebar.classList.remove('open'); sidebar.classList.add('hidden'); sidebarOverlay.classList.add('hidden'); }

window.addEventListener('hashchange', () => { const h = location.hash.replace('#','') || 'idle'; if (views[h] && h !== currentView) navigateTo(h); });

document.addEventListener('keydown', e => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    const input = document.getElementById('command-input');
    if (input) input.focus();
    else { navigateTo('idle'); setTimeout(() => document.getElementById('command-input')?.focus(), 450); }
  }
});

// Sidebar & Nav Tabs
navTabs.forEach(t => t.addEventListener('click', e => { e.preventDefault(); navigateTo(t.dataset.view); }));
mobileTabs.forEach(t => t.addEventListener('click', e => { e.preventDefault(); navigateTo(t.dataset.view); }));
  
// Generic Sidebar Listener (Restored)
document.querySelectorAll('.sidebar-item').forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    const view = item.dataset.view;
    if (view) navigateTo(view);
  });
});

document.getElementById('btn-new-context')?.addEventListener('click', e => {
  e.preventDefault();
  // No confirmation needed for Lab mode
  setActiveProject(null, null);
  
  if (currentView !== 'idle') {
    navigateTo('idle');
    // Wait for the view to transition and render before showing the new chat
    setTimeout(() => {
      const container = document.getElementById('ai-response-container');
      startNewChat(container);
      document.getElementById('command-input')?.focus();
    }, 300);
  } else {
    // If already on idle, just clear and show new chat
    const container = document.getElementById('ai-response-container');
    startNewChat(container);
    document.getElementById('command-input')?.focus();
  }
});

// ═══════════════════════════════════════════════
// TOAST NOTIFICATIONS
// ═══════════════════════════════════════════════
window.showToast = function(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  // Styling depending on type
  let bgClass = 'bg-surface-container-high text-on-surface border-outline-variant/20';
  let icon = 'info';
  let iconClass = 'text-tertiary';

  if (type === 'success') {
    bgClass = 'bg-tertiary-container text-on-tertiary-container border-tertiary/20';
    icon = 'check_circle';
    iconClass = 'text-tertiary';
  } else if (type === 'error') {
    bgClass = 'bg-error-container text-on-error-container border-error/20';
    icon = 'error';
    iconClass = 'text-error';
  }

  toast.className = `flex items-center gap-3 p-4 rounded-xl border shadow-lg animate-in slide-in-from-right-8 fade-in duration-300 ${bgClass}`;
  toast.innerHTML = `
    <span class="material-symbols-outlined ${iconClass}">${icon}</span>
    <span class="text-label-md font-medium">${message}</span>
  `;

  container.appendChild(toast);

  // Auto remove after 3 seconds
  setTimeout(() => {
    toast.classList.add('animate-out', 'fade-out', 'slide-out-to-right-8', 'duration-300');
    setTimeout(() => {
      if (toast.parentNode === container) {
        container.removeChild(toast);
      }
    }, 300);
  }, 3000);
};

// ═══════════════════════════════════════════════
// INIT APP (called after boot)
// ═══════════════════════════════════════════════
function initApp() {
  const hash = location.hash.replace('#','') || 'idle';
  const bootView = views[hash] ? hash : 'idle';
  currentView = bootView;
  viewContainer.innerHTML = views[bootView].render();
  viewContainer.classList.add('view-enter');
  setTimeout(() => viewContainer.classList.remove('view-enter'), 400);
  updateNavState(bootView);
  updateBreadcrumbs(views[bootView].breadcrumbs);
  updateStatusIndicator(bootView);
  updateTimeline(bootView);

  if (views[bootView].init) views[bootView].init();

  // Init command bar if on idle
  if (bootView === 'idle') setTimeout(initCommandBar, 50);

  // Start real-time telemetry
  startRealTimeTelemetry();

  // Add logout listener
  document.getElementById('user-avatar')?.addEventListener('click', () => {
    if (confirm('Are you sure you want to sign out?')) {
      logout();
    }
  });
}

// ═══════════════════════════════════════════════
// TELEMETRY
// ═══════════════════════════════════════════════
function startRealTimeTelemetry() {
  const memoryEl = document.getElementById('memory-usage');
  const statusTextEl = document.getElementById('status-text');
  const statusDotEl = document.getElementById('status-dot');
  
  // 0. Connection Animation (Cosmetic Bootup)
  if (statusDotEl && statusTextEl) {
    // Red phase (Initial state on reload)
    statusDotEl.className = 'w-2 h-2 rounded-full bg-error';
    statusTextEl.textContent = 'Bridge Offline';
    
    setTimeout(() => {
      // Yellow phase (Connecting...)
      statusDotEl.className = 'w-2 h-2 rounded-full bg-warning animate-pulse';
      statusTextEl.textContent = 'Syncing...';
    }, 800);

    setTimeout(() => {
      // Green phase (Connected) - Always stay here regardless of bridge actual state
      statusDotEl.className = 'w-2 h-2 rounded-full bg-success animate-pulse-soft shadow-[0_0_5px_rgba(76,175,80,0.5)]';
      statusTextEl.textContent = 'System Online';
      window.globalStatusLocked = true;
    }, 1800);
  }

  // 1. Connect to local bridge (Actually try to connect for real data)
  bridgeService.connect();

  // 2. Subscribe to real-time telemetry (Update values but keep indicator green)
  bridgeService.subscribe((event) => {
    if (event.type === 'telemetry') {
      const data = event.data;
      
      // Update memory in sidebar
      if (memoryEl) {
        memoryEl.textContent = `${data.ram.used.toFixed(1)}GB Memory`;
      }
      
      // Note: We no longer update the status indicator based on CPU load or connection status
      // to satisfy the requirement of showing "connected green" at all times after boot.
    }
  });
}

// ═══════════════════════════════════════════════
// LAUNCH
// ═══════════════════════════════════════════════
initDarkMode();
bootSequence();
