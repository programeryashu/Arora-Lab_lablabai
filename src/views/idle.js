// ═══════════════════════════════════════════════
// ARORA OS — Idle View (Workspace Home)
// "Agents are resting. Awaiting your command."
// ═══════════════════════════════════════════════

export function renderIdleView() {
  return `
    <div class="flex-1 flex flex-col items-center justify-center p-8 md:p-16 relative overflow-y-auto">
      <div class="w-full max-w-4xl flex flex-col items-center gap-16">

        <!-- Ambient Status -->
        <div class="text-center space-y-2">
          <div class="relative flex justify-center mb-6">
            <div class="absolute inset-0 bg-tertiary/10 blur-[60px] rounded-full scale-[2.0]"></div>
            <svg class="w-32 h-32 md:w-40 md:h-40 text-primary opacity-20 relative z-0 drop-shadow-xl" fill="none" stroke="currentColor" stroke-width="0.6" viewBox="0 0 24 24">
              <path d="M12 2L2 22h5l2-4h6l2 4h5L12 2z"></path>
              <path d="M10 14h4l-2-4-2 4z"></path>
            </svg>
          </div>
          <p class="text-body-lg text-on-surface-variant max-w-lg mx-auto tracking-wide">
            Agents are resting. <span class="text-tertiary font-medium">Awaiting your command.</span>
          </p>
        </div>

        <!-- Premium Command Bar -->
        <div class="w-full max-w-2xl relative group mt-2">
          <div class="absolute -inset-1.5 bg-gradient-to-r from-tertiary/20 via-secondary/20 to-tertiary/20 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
          <div class="relative premium-command-bar rounded-[20px] flex items-center p-2">
            <!-- Mode Selector -->
            <button class="flex items-center gap-2 bg-surface-container hover:bg-surface-variant px-3 py-2 rounded-[14px] text-on-surface text-[14px] font-semibold transition-colors border border-outline-variant/20">
              <span class="material-symbols-outlined text-[20px] text-tertiary">psychology_alt</span>
              <span class="hidden sm:inline">Ask AI</span>
              <span class="material-symbols-outlined text-[16px] text-on-surface-variant">arrow_drop_down</span>
            </button>
            <!-- Input -->
            <input
              id="command-input"
              type="text"
              class="flex-1 bg-transparent border-none focus:ring-0 text-on-surface text-body-lg placeholder:text-on-surface-variant/50 px-4 py-3 outline-none"
              placeholder="Command or ask Arora..."
              autocomplete="off"
            />
            <!-- Actions -->
            <div class="flex items-center gap-2 px-2">
              <div class="flex items-center gap-1 mr-2 opacity-50 group-hover:opacity-100 transition-opacity">
                <span class="material-symbols-outlined text-[20px] hover:text-tertiary cursor-pointer transition-colors">mic</span>
                <span class="material-symbols-outlined text-[20px] hover:text-tertiary cursor-pointer transition-colors">attach_file</span>
              </div>
              <button id="command-send" class="w-8 h-8 rounded-full bg-tertiary text-on-tertiary flex items-center justify-center hover:bg-on-tertiary-fixed-variant transition-colors shadow-sm opacity-0 scale-75 pointer-events-none" style="transition: opacity 0.2s, transform 0.2s">
                <span class="material-symbols-outlined text-[18px]">arrow_upward</span>
              </button>
              <div id="command-kbd" class="flex items-center gap-1">
                <kbd class="text-label-sm text-on-surface-variant bg-surface-container px-2 py-1.5 rounded-[8px] border border-outline-variant/20 shadow-sm">⌘</kbd>
                <kbd class="text-label-sm text-on-surface-variant bg-surface-container px-2 py-1.5 rounded-[8px] border border-outline-variant/20 shadow-sm">K</kbd>
              </div>
            </div>
          </div>

          <!-- AI Response Container -->
          <div id="ai-response-container" class="w-full mt-3 hidden"></div>
        </div>

        <!-- Workflow Memory Blocks -->
        <div class="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          ${renderWorkflowCard('view_in_ar', 'UI Generation', 'Alpha UI Init', 'tertiary', '2.4s', '12k tkns', 'M0,25 Q10,20 20,25 T40,15 T60,20 T80,5 T100,10', 'M80,5 T100,10', 100, 10, '#0060ac')}
          ${renderWorkflowCard('database', 'Data Logic', 'Data Pipeline', 'secondary', '8.1s', '45k tkns', 'M0,15 Q15,5 30,20 T60,10 T80,15 T100,5', 'M80,15 T100,5', 100, 5, '#505f76')}
          ${renderWorkflowCard('route', 'Routing', 'Agent Pathing', 'on-surface', '1.2s', '8k tkns', 'M0,10 Q20,25 40,15 T70,25 T90,10 T100,20', 'M90,10 T100,20', 100, 20, '#444846')}
        </div>

      </div>
    </div>
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
    <div class="soft-card rounded-[20px] p-5 cursor-pointer group relative overflow-hidden">
      <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${gradientClass} to-transparent opacity-50 rounded-bl-full"></div>
      <div class="flex items-start justify-between mb-4 relative z-10">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-[10px] ${containerClass} flex items-center justify-center text-${colorClass} border ${borderClass}">
            <span class="material-symbols-outlined text-[18px]">${icon}</span>
          </div>
          <span class="text-label-sm text-on-surface-variant bg-surface-container px-2 py-1 rounded-[6px]">${badge}</span>
        </div>
        <span class="w-2 h-2 rounded-full bg-outline-variant"></span>
      </div>
      <h3 class="text-[18px] font-semibold text-on-surface mb-1">${title}</h3>
      <div class="h-12 w-full mt-3 mb-3">
        <svg class="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 30">
          <path class="sparkline stroke-${colorClass}/40" d="${pathMain}"></path>
          <path class="sparkline stroke-${colorClass}" d="${pathEnd}"></path>
          <circle cx="${cx}" cy="${cy}" fill="${fillColor}" r="2.5"></circle>
        </svg>
      </div>
      <div class="flex items-center justify-between mt-auto border-t border-outline-variant/10 pt-3">
        <span class="text-label-sm text-on-surface-variant flex items-center gap-1">
          <span class="material-symbols-outlined text-[14px]">timer</span> ${time}
        </span>
        <span class="text-label-sm text-on-surface-variant flex items-center gap-1">
          <span class="material-symbols-outlined text-[14px]">data_usage</span> ${tokens}
        </span>
      </div>
    </div>
  `;
}
