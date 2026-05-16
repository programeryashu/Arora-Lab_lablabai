// ═══════════════════════════════════════════════
// ARORA OS — Execution View
// Live workflow DAG with animated nodes
// ═══════════════════════════════════════════════

export function renderExecutionView() {
  return `
    <div class="flex-1 flex overflow-hidden">
      ${workflowCanvas()}
      ${executionSidePanel()}
    </div>
  `;
}

function workflowCanvas() {
  return `
    <div class="flex-1 flex flex-col relative overflow-y-auto node-grid-bg">
      <!-- Watermark -->
      <div class="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
        <svg class="w-[800px] h-[800px] text-primary opacity-[0.06] -rotate-6" fill="none" stroke="currentColor" stroke-width="0.1" viewBox="0 0 24 24">
          <path d="M12 2L2 22h5l2-4h6l2 4h5L12 2z"></path>
          <path d="M10 14h4l-2-4-2 4z"></path>
        </svg>
      </div>

      <!-- Header -->
      <div class="p-6 md:p-8 flex justify-between items-end relative z-20">
        <div>
          <h2 class="text-headline-lg text-on-surface font-semibold">Execution Workflow</h2>
          <p class="text-body-md text-on-surface-variant mt-2">Live AI sequence running. Monitoring memory and steps.</p>
        </div>
        <div class="flex gap-3">
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
          <path class="animated-connector" d="M 200 200 C 300 200, 300 350, 400 350" fill="none" stroke="#a4c9ff" stroke-width="2"></path>
          <path class="animated-connector" d="M 400 350 C 500 350, 500 150, 600 150" fill="none" stroke="#5d5f5d" stroke-width="2"></path>
          <path d="M 600 150 C 700 150, 700 250, 800 250" fill="none" stroke="#e2e3e1" stroke-dasharray="4 4" stroke-width="2"></path>
          <path d="M 800 250 C 900 250, 900 200, 1000 200" fill="none" stroke="#e2e3e1" stroke-dasharray="4 4" stroke-width="2"></path>
        </svg>

        <div class="w-full max-w-5xl relative z-10 flex flex-wrap justify-between items-center gap-8 px-8">
          ${nodeComplete('Planning', '0.4s')}
          ${nodeComplete('Research', '1.2s', 'mt-20')}
          ${nodeActive()}
          ${nodePending('Testing', 'bug_report', 'mt-10')}
          ${nodePending('Deploy', 'rocket_launch', '-mt-10')}
        </div>
      </div>

      <!-- Terminal Panel -->
      <div class="hidden md:block h-48 terminal-panel border-t border-outline-variant/20 flex flex-col z-30">
        <div class="flex items-center justify-between px-4 py-2 bg-[#1a1c1c] border-b border-outline-variant/10">
          <span class="text-label-sm text-inverse-on-surface flex items-center gap-2">
            <span class="material-symbols-outlined text-[16px]">terminal</span> Execution Logs
          </span>
          <div class="flex gap-2">
            <button class="w-6 h-6 flex items-center justify-center rounded hover:bg-white/10 text-inverse-on-surface"><span class="material-symbols-outlined text-[14px]">remove</span></button>
            <button class="w-6 h-6 flex items-center justify-center rounded hover:bg-white/10 text-inverse-on-surface"><span class="material-symbols-outlined text-[14px]">open_in_full</span></button>
          </div>
        </div>
        <div class="flex-1 p-4 font-mono text-[13px] text-primary-fixed-dim overflow-y-auto space-y-1">
          <div class="opacity-70">[INFO] 2023-10-27 10:42:01 - Initializing Workflow Engine v2.4</div>
          <div class="opacity-70">[INFO] 2023-10-27 10:42:02 - Loading Context: 'Project Alpha' (Size: 1.2MB)</div>
          <div class="opacity-70">[INFO] 2023-10-27 10:42:05 - Node 'Planning' executed successfully. (Time: 0.4s)</div>
          <div class="opacity-70">[INFO] 2023-10-27 10:42:12 - Node 'Research' initiating web search...</div>
          <div class="opacity-70">[INFO] 2023-10-27 10:42:15 - Node 'Research' compiled 4 sources. (Time: 1.2s)</div>
          <div class="text-secondary-fixed-dim">[RUNNING] 2023-10-27 10:42:16 - Node 'Code Synthesis' started...</div>
          <div class="text-secondary-fixed-dim">  &gt; Resolving dependencies...</div>
          <div class="text-secondary-fixed-dim">  &gt; Parsing JSON schema...</div>
          <div class="text-secondary-fixed-dim animate-pulse">  &gt; Generating markup_v1.html... <span class="text-on-surface-variant">_</span></div>
        </div>
      </div>
    </div>`;
}

function nodeComplete(name, time, extraClass = '') {
  return `
    <div class="glass-panel p-4 rounded-2xl w-48 flex flex-col items-center text-center ambient-shadow relative transition-all duration-300 ${extraClass}">
      <svg class="w-4 h-4 text-primary opacity-20 absolute top-3 right-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 22h5l2-4h6l2 4h5L12 2z"></path></svg>
      <div class="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center mb-3">
        <span class="material-symbols-outlined text-secondary">check_circle</span>
      </div>
      <h3 class="text-label-md text-on-surface font-semibold">${name}</h3>
      <p class="text-label-sm text-on-surface-variant mt-1 text-[10px]">${time} • Complete</p>
    </div>`;
}

function nodeActive() {
  return `
    <div class="glass-panel node-active p-5 rounded-2xl w-64 flex flex-col items-center text-center relative -mt-10 border border-primary/30 z-20">
      <svg class="w-5 h-5 text-primary opacity-30 absolute top-3 right-3 animate-pulse" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path d="M12 2L2 22h5l2-4h6l2 4h5L12 2z"></path><path d="M10 14h4l-2-4-2 4z"></path>
      </svg>
      <div class="absolute -top-2 -right-2 w-4 h-4 bg-primary rounded-full animate-pulse border-2 border-surface"></div>
      <div class="w-14 h-14 rounded-full bg-primary-container flex items-center justify-center mb-3 border border-primary/20 shadow-inner">
        <span class="material-symbols-outlined text-primary text-2xl">code</span>
      </div>
      <h3 class="text-label-md text-on-surface font-bold">Code Synthesis</h3>
      <p class="text-label-sm text-primary mt-1">Generating logic...</p>
      <div class="w-full bg-surface-container-high h-1.5 rounded-full mt-4 overflow-hidden">
        <div class="bg-primary w-2/3 h-full rounded-full transition-all duration-1000"></div>
      </div>
      <div class="mt-4 text-left w-full bg-surface-container-low rounded p-2.5 text-[11px] font-mono text-on-surface-variant space-y-1.5 border border-outline-variant/20">
        <div class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-outline-variant"></span>Resolving dependencies</div>
        <div class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-outline-variant"></span>Parsing JSON schema</div>
        <div class="flex items-center gap-2 text-primary font-medium"><span class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>Generating AST...</div>
      </div>
    </div>`;
}

function nodePending(name, icon, extraClass = '') {
  return `
    <div class="glass-panel p-4 rounded-2xl w-48 flex flex-col items-center text-center ambient-shadow relative ${extraClass} opacity-50">
      <svg class="w-4 h-4 text-outline opacity-20 absolute top-3 right-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 22h5l2-4h6l2 4h5L12 2z"></path></svg>
      <div class="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center mb-3 border border-outline-variant/30">
        <span class="material-symbols-outlined text-outline">${icon}</span>
      </div>
      <h3 class="text-label-md text-outline font-semibold">${name}</h3>
      <p class="text-label-sm text-outline-variant mt-1 text-[10px]">Pending</p>
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
          ${statusBar('CPU Usage', '42%', 42)}
          ${statusBar('Memory (Active)', '4.2 / 8.0 GB', 55)}
        </div>
      </div>
      <div class="flex-1 p-6 overflow-y-auto flex flex-col">
        <h3 class="text-label-md text-on-surface flex items-center gap-2 mb-5">
          <span class="material-symbols-outlined text-[18px]" style="font-variation-settings:'FILL' 1">psychology</span> AI Activity Timeline
        </h3>
        <div class="relative flex-1">
          <div class="absolute left-2.5 top-2 bottom-4 w-0.5 timeline-path rounded-full opacity-30"></div>
          <div class="space-y-7 relative">
            ${timelineStep('10:42:01 AM', 'Analyzed user prompt regarding UI component generation.', false)}
            ${timelineStep('10:42:15 AM', 'Extracted visual tokens from JSON structure.', false)}
            ${timelineStep('Current', 'Constructing HTML skeleton and mapping Tailwind classes based on style guidelines...', true)}
          </div>
        </div>
      </div>
    </aside>`;
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

function timelineStep(time, text, active) {
  const dotClass = active
    ? 'w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0 z-10 shadow-[0_0_12px_rgba(93,95,93,0.5)]'
    : 'w-5 h-5 rounded-full bg-surface-container-high flex items-center justify-center shrink-0 z-10 border border-outline-variant/30';
  const innerDot = active
    ? '<div class="w-1.5 h-1.5 rounded-full bg-on-primary animate-pulse"></div>'
    : '<div class="w-1.5 h-1.5 rounded-full bg-secondary"></div>';
  const timeClass = active ? 'text-primary' : 'text-on-surface-variant';
  const textClass = active ? 'text-on-surface font-medium' : 'text-on-surface';

  return `
    <div class="flex gap-4 relative">
      <div class="${dotClass}">${innerDot}</div>
      <div>
        <p class="text-label-sm ${timeClass} mb-1">${time}</p>
        <p class="text-body-md ${textClass} text-sm">${text}</p>
      </div>
    </div>`;
}
