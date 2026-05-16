// ═══════════════════════════════════════════════
// ARORA OS — Execution History View
// ═══════════════════════════════════════════════

export function renderHistoryView() {
  return `
    <div class="flex-1 flex flex-col p-8 overflow-y-auto bg-surface-container-low">
      <div class="max-w-5xl mx-auto w-full">
        <header class="mb-10 flex justify-between items-end">
          <div>
            <h2 class="text-display-lg text-on-surface font-light tracking-tight">Execution History</h2>
            <p class="text-body-lg text-on-surface-variant mt-2">Review previous agent workflows and their generated outputs.</p>
          </div>
          <button class="px-5 py-2.5 rounded-xl border border-outline-variant/20 hover:bg-surface-variant/30 transition-all flex items-center gap-2 text-label-md">
            <span class="material-symbols-outlined text-[18px]">download</span> Export Logs
          </button>
        </header>

        <div class="glass-panel rounded-3xl overflow-hidden border border-outline-variant/10">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-surface-container-high/50 border-b border-outline-variant/10">
                <th class="px-6 py-4 text-label-sm uppercase tracking-wider text-on-surface-variant">Pipeline ID</th>
                <th class="px-6 py-4 text-label-sm uppercase tracking-wider text-on-surface-variant">Project Prompt</th>
                <th class="px-6 py-4 text-label-sm uppercase tracking-wider text-on-surface-variant">Status</th>
                <th class="px-6 py-4 text-label-sm uppercase tracking-wider text-on-surface-variant">Date</th>
                <th class="px-6 py-4 text-label-sm uppercase tracking-wider text-on-surface-variant">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-outline-variant/10">
              ${historyRow('633a40b8', 'Weather Dashboard React', 'Completed', 'Today, 10:15 PM')}
              ${historyRow('a2x9k2p1', 'AI Task Orchestrator', 'Failed', 'Yesterday, 4:22 PM')}
              ${historyRow('z9r3m5l0', 'Portfolio Site v2', 'Completed', 'May 10, 2026')}
              ${historyRow('v1q2w3e4', 'Database Schema Gen', 'Completed', 'May 08, 2026')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function historyRow(id, prompt, status, date) {
  const statusCls = status === 'Completed' ? 'bg-tertiary/10 text-tertiary' : 'bg-error/10 text-error';
  return `
    <tr class="hover:bg-surface-variant/20 transition-colors">
      <td class="px-6 py-4 font-mono text-[13px] text-on-surface-variant">#${id}</td>
      <td class="px-6 py-4 text-[14px] font-medium text-on-surface">${prompt}</td>
      <td class="px-6 py-4">
        <span class="px-2 py-1 rounded-md text-[11px] font-bold uppercase tracking-tighter ${statusCls}">${status}</span>
      </td>
      <td class="px-6 py-4 text-[13px] text-on-surface-variant">${date}</td>
      <td class="px-6 py-4">
        <button class="p-2 text-on-surface-variant hover:text-tertiary transition-colors">
          <span class="material-symbols-outlined text-[20px]">visibility</span>
        </button>
      </td>
    </tr>
  `;
}
