// ═══════════════════════════════════════════════
// ARORA OS — Execution View
// Live workflow DAG with animated nodes
// ═══════════════════════════════════════════════

import { api } from '../api.js';
import { activeProjectId, activeProjectIdea, navigateTo } from '../main.js';
import { bridgeService } from '../bridge-service.js';

let logSocket = null;
let telemetryUnsubscribe = null;

export function renderExecutionView() {
  return `
    <div class="flex-1 flex overflow-hidden">
      ${workflowCanvas()}
      ${executionSidePanel()}
    </div>
  `;
}

export function initExecutionView() {
  if (!activeProjectId) {
    const logContainer = document.getElementById('log-stream');
    if (logContainer) logContainer.innerHTML = '<div class="text-on-surface-variant opacity-80 italic">No active project execution. Start a project from the Workspace.</div>';
    return;
  }

  // Update title if we have an idea
  if (activeProjectIdea) {
    const title = document.querySelector('#execution-title');
    if (title) title.textContent = `Executing: ${activeProjectIdea}`;
  }

  // Connect to logs
  if (logSocket) logSocket.close();
  
  logSocket = api.connectLogs(activeProjectId, (data) => {
    updateLogs(data.logs);
    updateWorkflowNodes(data.current_agent);
    updateTimeline(data.current_agent, data.logs[data.logs.length - 1]);
  });

  // Subscribe to real-time telemetry
  if (telemetryUnsubscribe) telemetryUnsubscribe();
  telemetryUnsubscribe = bridgeService.subscribe((event) => {
    if (event.type === 'telemetry') {
      updateTelemetryUI(event.data);
    }
  });
}

function updateLogs(logs) {
  const container = document.getElementById('log-stream');
  if (!container) return;

  container.innerHTML = logs.map(log => {
    let cls = "opacity-90";
    if (log.includes("[ERROR]")) cls = "text-error font-bold";
    if (log.includes("[SUCCESS]")) cls = "text-tertiary font-bold";
    if (log.includes("[DONE]")) cls = "text-tertiary font-bold animate-pulse";
    if (log.includes("[*]")) cls = "text-secondary font-bold";

    return `<div class="${cls}">${log}</div>`;
  }).join('');

  container.scrollTop = container.scrollHeight;
}

function updateWorkflowNodes(currentAgent) {
  const agents = ['planner', 'frontend', 'backend', 'docs'];
  const currentIndex = agents.indexOf(currentAgent);

  agents.forEach((agent, index) => {
    const node = document.getElementById(`node-${agent}`);
    if (!node) return;

    if (index < currentIndex || currentAgent === 'completed') {
      // Completed
      node.innerHTML = nodeCompleteContent(capitalize(agent));
      node.className = "glass-panel p-4 rounded-2xl w-48 flex flex-col items-center text-center ambient-shadow relative transition-all duration-300";
    } else if (index === currentIndex) {
      // Active
      node.innerHTML = nodeActiveContent(capitalize(agent));
      node.className = "glass-panel node-active p-5 rounded-2xl w-64 flex flex-col items-center text-center relative -mt-10 border border-tertiary/30 z-20";
    } else {
      // Pending
      node.className = "glass-panel p-4 rounded-2xl w-48 flex flex-col items-center text-center ambient-shadow relative opacity-60";
    }
  });

  if (currentAgent === 'completed') {
    // 1. Swap actions in header to show pulsing Start Coding button
    const actionsContainer = document.getElementById('execution-actions');
    if (actionsContainer && !document.getElementById('header-start-coding-btn')) {
      actionsContainer.innerHTML = `
        <button id="header-start-coding-btn" class="px-5 py-2 rounded-lg bg-tertiary text-on-tertiary text-[14px] font-bold flex items-center gap-2 hover:bg-tertiary/90 shadow-sm transition-all animate-pulse">
          <span class="material-symbols-outlined text-[18px]">code</span> Start Coding
        </button>
      `;
      document.getElementById('header-start-coding-btn')?.addEventListener('click', () => {
        navigateTo('editor');
      });
    }

    // 2. Automatically launch clarification modal
    showCompletionModal();
  }
}

function updateTimeline(agent, lastLog) {
    const timeline = document.getElementById('execution-timeline');
    if (!timeline) return;

    // Add a new step if it's different from the last one or if it's a success/done message
    if (lastLog.includes('[SUCCESS]') || lastLog.includes('[DONE]') || lastLog.includes('[*]')) {
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const step = document.createElement('div');
        step.className = 'flex gap-4 relative';
        step.innerHTML = `
            <div class="w-5 h-5 rounded-full bg-tertiary flex items-center justify-center shrink-0 z-10 shadow-[0_0_12px_rgba(0,96,172,0.3)]">
                <div class="w-1.5 h-1.5 rounded-full bg-on-tertiary animate-pulse"></div>
            </div>
            <div>
                <p class="text-label-sm text-tertiary mb-1">${time}</p>
                <p class="text-body-md text-on-surface font-medium text-sm">${lastLog}</p>
            </div>
        `;
        // Remove active state from previous ones
        const dots = timeline.querySelectorAll('.bg-tertiary');
        dots.forEach(d => {
            d.className = 'w-5 h-5 rounded-full bg-surface-container-high flex items-center justify-center shrink-0 z-10 border border-outline-variant/30';
            d.innerHTML = '<div class="w-1.5 h-1.5 rounded-full bg-secondary"></div>';
        });
        
        timeline.prepend(step);
    }
}

function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

function workflowCanvas() {
  return `
    <div class="flex-1 flex flex-col relative overflow-y-auto node-grid-bg">
      <!-- Header -->
      <div class="p-6 md:p-8 flex justify-between items-end relative z-20">
        <div>
          <h2 id="execution-title" class="text-headline-lg text-on-surface font-semibold">Execution Workflow</h2>
          <p class="text-body-md text-on-surface-variant mt-2">Live AI sequence running. Monitoring memory and steps.</p>
        </div>
        <div id="execution-actions" class="flex gap-3">
          <button class="px-4 py-2 rounded-lg glass-panel text-[14px] font-semibold text-on-surface flex items-center gap-2 hover:bg-surface-variant/20 transition-colors">
            <span class="material-symbols-outlined text-[18px]">pause</span> Pause
          </button>
          <button class="px-4 py-2 rounded-lg bg-error text-on-error text-[14px] font-semibold flex items-center gap-2 hover:opacity-90 shadow-sm transition-opacity">
            <span class="material-symbols-outlined text-[18px]">stop</span> Terminate
          </button>
        </div>
      </div>

      <!-- Workflow Nodes -->
      <div class="flex-1 relative flex flex-col justify-center items-center py-8 min-h-[400px] px-4">
        <!-- SVG Connectors -->
        <svg class="absolute inset-0 w-full h-full pointer-events-none" style="z-index:0">
          <path class="animated-connector" d="M 200 350 C 300 350, 350 350, 450 350" fill="none" stroke="#a4c9ff" stroke-width="2"></path>
          <path class="animated-connector" d="M 450 350 C 550 350, 600 350, 700 350" fill="none" stroke="#5d5f5d" stroke-width="2"></path>
          <path class="animated-connector" d="M 700 350 C 800 350, 850 350, 950 350" fill="none" stroke="#e2e3e1" stroke-width="2"></path>
        </svg>

        <div class="w-full max-w-6xl relative z-10 flex justify-between items-center gap-4 px-8">
          <div id="node-planner" class="glass-panel p-4 rounded-2xl w-48 flex flex-col items-center text-center ambient-shadow relative opacity-60">
             ${nodePendingContent('Planner', 'dataset')}
          </div>
          <div id="node-frontend" class="glass-panel p-4 rounded-2xl w-48 flex flex-col items-center text-center ambient-shadow relative opacity-60">
             ${nodePendingContent('Frontend', 'code')}
          </div>
          <div id="node-backend" class="glass-panel p-4 rounded-2xl w-48 flex flex-col items-center text-center ambient-shadow relative opacity-60">
             ${nodePendingContent('Backend', 'storage')}
          </div>
          <div id="node-docs" class="glass-panel p-4 rounded-2xl w-48 flex flex-col items-center text-center ambient-shadow relative opacity-60">
             ${nodePendingContent('Docs', 'description')}
          </div>
        </div>
      </div>

      <!-- Terminal Panel -->
      <div class="hidden md:block h-64 terminal-panel border-t border-outline-variant/20 flex flex-col z-30">
        <div class="flex items-center justify-between px-4 py-2 bg-[#1a1c1c] border-b border-outline-variant/10">
          <span class="text-label-sm text-inverse-on-surface flex items-center gap-2">
            <span class="material-symbols-outlined text-[16px]">terminal</span> Execution Logs
          </span>
          <div class="flex gap-2">
            <button class="w-6 h-6 flex items-center justify-center rounded hover:bg-white/10 text-inverse-on-surface"><span class="material-symbols-outlined text-[14px]">remove</span></button>
            <button class="w-6 h-6 flex items-center justify-center rounded hover:bg-white/10 text-inverse-on-surface"><span class="material-symbols-outlined text-[14px]">open_in_full</span></button>
          </div>
        </div>
        <div id="log-stream" class="flex-1 p-4 font-mono text-[13px] text-primary-fixed-dim overflow-y-auto space-y-1 bg-[#111313]">
           <div class="opacity-80 italic">Waiting for execution logs...</div>
        </div>
      </div>
    </div>`;
}

function nodePendingContent(name, icon) {
  return `
    <svg class="w-4 h-4 text-outline opacity-20 absolute top-3 right-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 22h5l2-4h6l2 4h5L12 2z"></path></svg>
    <div class="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center mb-3 border border-outline-variant/30">
      <span class="material-symbols-outlined text-outline">${icon}</span>
    </div>
    <h3 class="text-label-md text-outline font-semibold">${name}</h3>
    <p class="text-label-sm text-outline-variant mt-1 text-[11px] font-medium">Pending</p>`;
}

function nodeCompleteContent(name) {
  return `
    <svg class="w-4 h-4 text-tertiary opacity-20 absolute top-3 right-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 22h5l2-4h6l2 4h5L12 2z"></path></svg>
    <div class="w-12 h-12 rounded-full bg-tertiary/10 flex items-center justify-center mb-3 border border-tertiary/20">
      <span class="material-symbols-outlined text-tertiary">check_circle</span>
    </div>
    <h3 class="text-label-md text-on-surface font-semibold">${name}</h3>
    <p class="text-label-sm text-tertiary mt-1 text-[11px] font-medium">Complete</p>`;
}

function nodeActiveContent(name) {
    let icon = 'psychology';
    if (name === 'Frontend') icon = 'code';
    if (name === 'Backend') icon = 'storage';
    if (name === 'Docs') icon = 'description';
    if (name === 'Planner') icon = 'dataset';

  return `
      <svg class="w-5 h-5 text-tertiary opacity-30 absolute top-3 right-3 animate-pulse" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path d="M12 2L2 22h5l2-4h6l2 4h5L12 2z"></path><path d="M10 14h4l-2-4-2 4z"></path>
      </svg>
      <div class="absolute -top-2 -right-2 w-4 h-4 bg-tertiary rounded-full animate-pulse border-2 border-surface"></div>
      <div class="w-14 h-14 rounded-full bg-tertiary/10 flex items-center justify-center mb-3 border border-tertiary/20 shadow-inner">
        <span class="material-symbols-outlined text-tertiary text-2xl">${icon}</span>
      </div>
      <h3 class="text-label-md text-on-surface font-bold">${name} Agent</h3>
      <p class="text-label-sm text-tertiary mt-1 animate-pulse font-semibold">Processing...</p>
      <div class="w-full bg-surface-container-high h-1.5 rounded-full mt-4 overflow-hidden">
        <div class="bg-tertiary w-2/3 h-full rounded-full animate-shimmer"></div>
      </div>`;
}

function executionSidePanel() {
  return `
    <aside class="hidden lg:flex w-80 flex-col border-l border-outline-variant/20 bg-surface/60 backdrop-blur-md shrink-0 z-10">
      <div class="p-6 border-b border-outline-variant/20">
        <h3 class="text-label-md text-on-surface flex items-center gap-2 mb-4">
          <span class="material-symbols-outlined text-[18px]">memory</span> System Status
        </h3>
        <div class="space-y-4">
          <div id="execution-cpu-status">
            ${statusBar('CPU Usage', '28%', 28)}
          </div>
          <div id="execution-mem-status">
            ${statusBar('Memory (Active)', '3.1 / 8.0 GB', 38)}
          </div>
        </div>
      </div>
      <div class="flex-1 p-6 overflow-y-auto flex flex-col">
        <h3 class="text-label-md text-on-surface flex items-center gap-2 mb-5">
          <span class="material-symbols-outlined text-[18px]" style="font-variation-settings:'FILL' 1">psychology</span> AI Activity Timeline
        </h3>
        <div class="relative flex-1">
          <div class="absolute left-2.5 top-2 bottom-4 w-0.5 timeline-path rounded-full opacity-50"></div>
          <div id="execution-timeline" class="space-y-7 relative">
            <!-- Steps injected here -->
          </div>
        </div>
      </div>
    </aside>`;
}

function updateTelemetryUI(data) {
  const cpuContainer = document.getElementById('execution-cpu-status');
  const memContainer = document.getElementById('execution-mem-status');

  if (cpuContainer) {
    const cpuLoad = Math.round(data.cpu.load);
    cpuContainer.innerHTML = statusBar('CPU Usage', `${cpuLoad}%`, cpuLoad);
  }

  if (memContainer) {
    const used = data.ram.used.toFixed(1);
    const total = data.ram.total.toFixed(1);
    const percent = Math.round(data.ram.percent);
    memContainer.innerHTML = statusBar('Memory (Active)', `${used} / ${total} GB`, percent);
  }
}

function statusBar(label, value, percent) {
  return `
    <div>
      <div class="flex justify-between text-label-sm mb-1">
        <span class="text-on-surface-variant">${label}</span>
        <span class="text-on-surface">${value}</span>
      </div>
      <div class="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
        <div class="bg-secondary h-full rounded-full transition-all duration-700" style="width:${percent}%"></div>
      </div>
    </div>`;
}

function showCompletionModal() {
  if (document.getElementById('execution-completion-modal')) return;

  const modalHtml = `
    <div id="execution-completion-modal" class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="w-full max-w-2xl bg-white/95 rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden flex flex-col transform scale-95 transition-all duration-300 glass-panel p-6" id="completion-modal-window">
        <!-- Header -->
        <div class="flex items-center gap-4 mb-6 border-b border-outline-variant/20 pb-4">
          <div class="w-12 h-12 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary">
            <span class="material-symbols-outlined text-[28px]">check_circle</span>
          </div>
          <div>
            <h3 class="text-headline-sm font-bold text-on-surface">Execution Sequence Complete</h3>
            <p class="text-body-md text-on-surface-variant">Arora Prime has scaffolded the autonomous workspace files successfully.</p>
          </div>
        </div>

        <!-- Contents: What We Are Going to Build / What has been built -->
        <div class="space-y-4 mb-6">
          <div class="p-4 bg-surface-container-low border border-outline-variant/20 rounded-xl">
            <h4 class="text-label-md font-bold text-tertiary mb-3 flex items-center gap-2">
              <span class="material-symbols-outlined text-[18px]">build</span> Scaffolding & Preparation Summary
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="flex items-start gap-2.5">
                <span class="material-symbols-outlined text-[18px] text-on-surface-variant mt-0.5">dataset</span>
                <div>
                  <span class="text-body-sm font-bold text-on-surface">Planner Config</span>
                  <p class="text-[11px] text-on-surface-variant">Full project timeline and agent sequencing scaffolding built.</p>
                </div>
              </div>
              <div class="flex items-start gap-2.5">
                <span class="material-symbols-outlined text-[18px] text-on-surface-variant mt-0.5">code</span>
                <div>
                  <span class="text-body-sm font-bold text-on-surface">Frontend Interface</span>
                  <p class="text-[11px] text-on-surface-variant">Glassmorphism UI layouts, charts, and main panels structured.</p>
                </div>
              </div>
              <div class="flex items-start gap-2.5">
                <span class="material-symbols-outlined text-[18px] text-on-surface-variant mt-0.5">storage</span>
                <div>
                  <span class="text-body-sm font-bold text-on-surface">Backend & AI Routing</span>
                  <p class="text-[11px] text-on-surface-variant">FastAPI database schemas, watsonx API streams & IBM BOB routes ready.</p>
                </div>
              </div>
              <div class="flex items-start gap-2.5">
                <span class="material-symbols-outlined text-[18px] text-on-surface-variant mt-0.5">description</span>
                <div>
                  <span class="text-body-sm font-bold text-on-surface">Project Documentation</span>
                  <p class="text-[11px] text-on-surface-variant">Setup manuals, dependencies config, and API integration references.</p>
                </div>
              </div>
            </div>
          </div>

          <div class="p-4 bg-tertiary/5 border border-tertiary/10 rounded-xl relative overflow-hidden">
            <div class="absolute left-0 top-0 bottom-0 w-1 bg-tertiary"></div>
            <h4 class="text-label-md font-bold text-on-surface mb-2 flex items-center gap-2">
              <span class="material-symbols-outlined text-[18px]">terminal</span> Next Steps: Start Coding in Editor
            </h4>
            <p class="text-[12px] text-on-surface-variant leading-relaxed">
              We are now moving to the <strong>Integrated Code Editor</strong> view. 
              In the editor, we will review the scaffolded code, adjust the active variables, customize component themes, run the server, and write our core business logic.
            </p>
          </div>
        </div>

        <!-- Auto redirect countdown -->
        <div class="mb-6 flex items-center justify-between bg-surface-container-high/40 p-3 rounded-lg border border-outline-variant/10">
          <span id="countdown-label" class="text-label-sm text-on-surface-variant flex items-center gap-2">
            <span class="material-symbols-outlined text-[16px] animate-spin text-tertiary">autorenew</span>
            Redirecting to Code Editor automatically in <strong id="countdown-sec" class="text-tertiary font-bold">5</strong> seconds...
          </span>
          <button id="countdown-cancel-btn" class="px-3 py-1 rounded-md text-[11px] font-bold bg-surface-container-high hover:bg-surface-variant/40 text-on-surface-variant border border-outline-variant/20 transition-all">
            Stay on Logs
          </button>
        </div>

        <!-- Footer -->
        <div class="flex justify-end gap-3 border-t border-outline-variant/20 pt-4">
          <button id="completion-modal-cancel" class="px-4 py-2 rounded-lg border border-outline-variant/30 text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/20 text-[13px] font-semibold transition-all">
            Review Logs
          </button>
          <button id="completion-modal-start" class="px-5 py-2 rounded-lg bg-tertiary text-on-tertiary hover:bg-tertiary/90 text-[13px] font-bold flex items-center gap-1.5 shadow-sm transition-all">
            <span>Start Coding</span>
            <span class="material-symbols-outlined text-[16px]">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);

  // Scale modal window in smoothly
  setTimeout(() => {
    const win = document.getElementById('completion-modal-window');
    if (win) {
      win.classList.remove('scale-95');
      win.classList.add('scale-100');
    }
  }, 10);

  // Set up the countdown logic
  let secondsRemaining = 5;
  const secEl = document.getElementById('countdown-sec');
  const labelEl = document.getElementById('countdown-label');
  const countdownCancelBtn = document.getElementById('countdown-cancel-btn');

  const countdownInterval = setInterval(() => {
    secondsRemaining--;
    if (secEl) secEl.textContent = secondsRemaining;

    if (secondsRemaining <= 0) {
      clearInterval(countdownInterval);
      closeCompletionModal();
      navigateTo('editor');
    }
  }, 1000);

  // Function to stop countdown
  function cancelCountdown() {
    clearInterval(countdownInterval);
    if (labelEl) {
      labelEl.innerHTML = `
        <span class="material-symbols-outlined text-[16px] text-tertiary">check_circle</span>
        Automatic transition suspended. You can review logs or switch views when ready.
      `;
    }
    if (countdownCancelBtn) {
      countdownCancelBtn.style.display = 'none';
    }
  }

  countdownCancelBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    cancelCountdown();
  });

  // Bind close on "Review Logs"
  const cancelBtn = document.getElementById('completion-modal-cancel');
  cancelBtn?.addEventListener('click', () => {
    cancelCountdown();
    closeCompletionModal();
  });

  // Bind navigate on "Start Coding"
  const startBtn = document.getElementById('completion-modal-start');
  startBtn?.addEventListener('click', () => {
    cancelCountdown();
    closeCompletionModal();
    navigateTo('editor');
  });

  const overlay = document.getElementById('execution-completion-modal');
  overlay?.addEventListener('click', (e) => {
    if (e.target === overlay) {
      cancelCountdown();
      closeCompletionModal();
    }
  });
}

function closeCompletionModal() {
  const overlay = document.getElementById('execution-completion-modal');
  const win = document.getElementById('completion-modal-window');
  if (win) {
    win.classList.remove('scale-100');
    win.classList.add('scale-95');
  }
  setTimeout(() => {
    overlay?.remove();
  }, 150);
}
