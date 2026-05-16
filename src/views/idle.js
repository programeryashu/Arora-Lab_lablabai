// ═══════════════════════════════════════════════
// ARORA OS — Idle View (Workspace Home)
// "Ambient AI Orchestration"
// ═══════════════════════════════════════════════

export function renderIdleView() {
  const hour = new Date().getHours();
  let greeting = 'Good evening';
  if (hour < 12) greeting = 'Good morning';
  else if (hour < 18) greeting = 'Good afternoon';

  return `
    <div class="flex-1 flex flex-col items-center justify-start p-8 md:p-16 relative overflow-y-auto bg-layer">
      <div class="w-full max-w-5xl flex flex-col items-center gap-12 mt-8 md:mt-16">

        <!-- System Core Visualization -->
        <div class="relative flex flex-col items-center mb-4">
          <div class="absolute inset-0 bg-tertiary/15 animate-orb-pulse rounded-full blur-[80px] scale-[2.5]"></div>
          
          <div class="relative w-48 h-48 md:w-56 md:h-56 flex items-center justify-center">
            <!-- Rotating SVG Layers -->
            <svg class="absolute inset-0 w-full h-full animate-orb-rotate opacity-20" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" stroke-width="0.2" stroke-dasharray="1 4" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" stroke-width="0.5" stroke-dasharray="10 5" />
            </svg>
            <svg class="absolute inset-0 w-full h-full animate-orb-rotate opacity-40" style="animation-direction: reverse; animation-duration: 30s;" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" stroke-width="0.3" stroke-dasharray="2 8" />
            </svg>
            
            <!-- Central Core -->
            <div class="relative z-10 w-24 h-24 md:w-28 md:h-28 glass-panel-strong rounded-full flex items-center justify-center shadow-2xl border-white/40">
              <span class="material-symbols-outlined text-[40px] md:text-[48px] text-tertiary animate-pulse-soft">blur_on</span>
            </div>
            
            <!-- Orbiting Nodes -->
            <div class="absolute inset-0 animate-orb-rotate" style="animation-duration: 15s;">
              <div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-tertiary rounded-full shadow-[0_0_15px_rgba(0,96,172,0.5)]"></div>
            </div>
          </div>

          <div class="mt-8 text-center">
            <h1 class="text-[32px] md:text-[40px] font-bold tracking-tight text-on-surface mb-2">
              ${greeting}, <span class="text-tertiary">Commander</span>
            </h1>
            <p class="text-body-lg text-on-surface-variant max-w-md mx-auto opacity-80">
              System optimized. Arora is standing by for orchestration.
            </p>
          </div>
        </div>

        <!-- Premium Command Bar -->
        <div class="w-full max-w-3xl relative group">
          <div class="absolute -inset-1.5 bg-gradient-to-r from-tertiary/20 via-secondary/20 to-tertiary/20 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
          <div class="relative premium-command-bar rounded-[24px] flex items-center p-3">
            <button class="flex items-center gap-2 bg-surface-container hover:bg-surface-container-high px-4 py-2.5 rounded-[16px] text-on-surface text-[14px] font-semibold transition-all border border-outline-variant/20 shadow-sm">
              <span class="material-symbols-outlined text-[20px] text-tertiary">psychology_alt</span>
              <span class="hidden sm:inline">Contextual Ask</span>
              <span class="material-symbols-outlined text-[16px] text-on-surface-variant">arrow_drop_down</span>
            </button>
            <input
              id="command-input"
              type="text"
              class="flex-1 bg-transparent border-none focus:ring-0 text-on-surface text-[18px] placeholder:text-on-surface-variant/40 px-5 py-3 outline-none"
              placeholder="What shall we build today?"
              autocomplete="off"
            />
            <div class="flex items-center gap-3 px-3 border-l border-outline-variant/10 ml-2">
               <button id="command-send" class="w-10 h-10 rounded-[14px] bg-tertiary text-on-tertiary flex items-center justify-center hover:bg-tertiary/90 transition-all shadow-lg shadow-tertiary/20 opacity-0 scale-75 pointer-events-none">
                <span class="material-symbols-outlined text-[22px]">arrow_upward</span>
              </button>
            </div>
          </div>
          
          <!-- Quick Actions -->
          <div class="flex flex-wrap justify-center gap-3 mt-6">
            ${renderQuickAction('explore', 'Analyze Repository')}
            ${renderQuickAction('add_circle', 'New Feature')}
            ${renderQuickAction('bug_report', 'Debug Active Context')}
            ${renderQuickAction('auto_awesome', 'Optimize Codebase')}
          </div>
        </div>

        <!-- System Telemetry & Workflow Cards -->
        <div class="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          ${renderWorkflowCard('view_in_ar', 'UI SYSTEM', 'Interface Engine', 'tertiary', '2.4s', '12k', 'M0,25 Q10,20 20,25 T40,15 T60,20 T80,5 T100,10', 'M80,5 T100,10', 100, 10, '#0060ac')}
          ${renderWorkflowCard('database', 'LOGIC CORE', 'Neural Pipeline', 'secondary', '8.1s', '45k', 'M0,15 Q15,5 30,20 T60,10 T80,15 T100,5', 'M80,15 T100,5', 100, 5, '#505f76')}
          ${renderWorkflowCard('route', 'ORCHESTRATION', 'Agent Routing', 'on-surface', '1.2s', '8k', 'M0,10 Q20,25 40,15 T70,25 T90,10 T100,20', 'M90,10 T100,20', 100, 20, '#444846')}
        </div>

        <!-- Agent Status Footer -->
        <div class="flex items-center gap-8 px-6 py-3 rounded-full bg-surface-container/50 border border-outline-variant/10 backdrop-blur-md opacity-70 hover:opacity-100 transition-opacity">
          <div class="flex items-center gap-2">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-tertiary"></span>
            </span>
            <span class="text-label-sm text-on-surface-variant font-medium">LATENCY: 24ms</span>
          </div>
          <div class="w-px h-4 bg-outline-variant/20"></div>
          <div class="text-label-sm text-on-surface-variant font-medium">MEM: 1.2GB / 8GB</div>
          <div class="w-px h-4 bg-outline-variant/20"></div>
          <div class="text-label-sm text-on-surface-variant font-medium uppercase tracking-widest">Region: ARORA-PRIME-01</div>
        </div>

      </div>
    </div>
  `;
}

function renderQuickAction(icon, label) {
  return `
    <button class="quick-action flex items-center gap-2 px-4 py-2 rounded-full border border-outline-variant/20 text-on-surface-variant hover:text-on-surface bg-surface-container/30 hover:bg-surface-container shadow-sm">
      <span class="material-symbols-outlined text-[18px] text-tertiary">${icon}</span>
      <span class="text-label-sm font-semibold">${label}</span>
    </button>
  `;
}

function renderWorkflowCard(icon, badge, title, colorClass, time, tokens, pathMain, pathEnd, cx, cy, fillColor) {
  const containerClass = colorClass === 'on-surface'
    ? 'bg-surface-container-high'
    : colorClass === 'secondary'
      ? 'bg-secondary-container'
      : 'bg-tertiary-container';

  const borderClass = colorClass === 'on-surface'
    ? 'border-outline-variant/20'
    : colorClass === 'secondary'
      ? 'border-secondary/10'
      : 'border-tertiary/10';

  const gradientClass = colorClass === 'on-surface'
    ? 'from-surface-variant'
    : colorClass === 'secondary'
      ? 'from-secondary-container'
      : 'from-tertiary-container';

  return `
    <div class="soft-card glass-panel rounded-[24px] p-6 cursor-pointer group relative overflow-hidden border border-white/40">
      <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${gradientClass} to-transparent opacity-30 rounded-bl-full transition-all group-hover:scale-110"></div>
      
      <div class="flex items-start justify-between mb-5 relative z-10">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-[12px] ${containerClass} flex items-center justify-center text-${colorClass} border ${borderClass} shadow-inner">
            <span class="material-symbols-outlined text-[20px]">${icon}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-[10px] font-bold tracking-[0.1em] text-${colorClass} opacity-80 uppercase">${badge}</span>
            <h3 class="text-[18px] font-bold text-on-surface -mt-0.5">${title}</h3>
          </div>
        </div>
        <div class="ai-active-dot w-2 h-2 rounded-full bg-tertiary"></div>
      </div>

      <div class="h-14 w-full mt-2 mb-4">
        <svg class="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 30">
          <path class="sparkline stroke-${colorClass}/30" d="${pathMain}" style="stroke-width: 1.5;"></path>
          <path class="sparkline stroke-${colorClass} animate-shimmer" d="${pathEnd}" style="stroke-width: 2; filter: drop-shadow(0 0 2px ${fillColor}40);"></path>
          <circle cx="${cx}" cy="${cy}" fill="${fillColor}" r="3" class="animate-pulse"></circle>
        </svg>
      </div>

      <div class="flex items-center justify-between mt-auto border-t border-outline-variant/5 pt-4">
        <div class="flex items-center gap-4">
          <span class="text-[12px] font-medium text-on-surface-variant flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[16px] text-tertiary/60">avg_pace</span> ${time}
          </span>
          <span class="text-[12px] font-medium text-on-surface-variant flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[16px] text-tertiary/60">token</span> ${tokens}
          </span>
        </div>
        <span class="material-symbols-outlined text-[20px] text-on-surface-variant opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">chevron_right</span>
      </div>
    </div>
  `;
}

