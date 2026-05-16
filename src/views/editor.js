// ═══════════════════════════════════════════════
// ARORA OS — Editor View
// Glass-panel code editor with AI integration
// ═══════════════════════════════════════════════

export function renderEditorView() {
  return `
    <div class="flex-1 flex overflow-hidden p-3 gap-3 relative z-10">
      ${fileExplorer()}
      ${codeEditor()}
      ${docPanel()}
    </div>
  `;
}

function fileExplorer() {
  const files = [
    { name: 'index.ts', icon: 'data_object', color: 'text-tertiary', active: true },
    { name: 'style.css', icon: 'css', color: 'text-indigo-400' },
    { name: 'index.html', icon: 'html', color: 'text-orange-400' },
  ];
  const folders = [
    { name: 'components', open: false },
    { name: 'assets', open: false },
  ];
  const rootFiles = [
    { name: 'package.json', icon: 'description' },
    { name: 'README.md', icon: 'description' },
  ];

  return `
    <aside class="hidden lg:flex flex-col w-56 glass-panel rounded-xl overflow-hidden shrink-0">
      <div class="p-3 border-b border-white/20 bg-white/30 flex justify-between items-center">
        <span class="text-[10px] uppercase text-on-surface-variant tracking-wider font-bold">Files</span>
        <div class="flex gap-1">
          <span class="material-symbols-outlined text-[14px] text-on-surface-variant cursor-pointer hover:text-on-surface">note_add</span>
          <span class="material-symbols-outlined text-[14px] text-on-surface-variant cursor-pointer hover:text-on-surface">create_new_folder</span>
        </div>
      </div>
      <div class="flex-1 overflow-y-auto py-2 px-2">
        <div class="flex items-center px-2 py-1.5 text-on-surface hover:bg-white/50 rounded-lg cursor-pointer">
          <span class="material-symbols-outlined text-[16px] text-on-surface-variant mr-1">keyboard_arrow_down</span>
          <span class="material-symbols-outlined text-[16px] text-on-surface-variant mr-2">folder</span>
          <span class="text-[13px] font-medium">src</span>
        </div>
        <div class="pl-6 flex flex-col gap-0.5">
          ${files.map(f => f.active ? `
            <div class="flex items-center justify-between px-2 py-1.5 ${f.color} bg-white/60 shadow-sm rounded-lg cursor-pointer relative">
              <div class="absolute -left-3 w-1.5 h-1.5 rounded-full bg-tertiary ai-active-dot"></div>
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-[14px] text-tertiary">${f.icon}</span>
                <span class="text-[13px] font-medium">${f.name}</span>
              </div>
              <div class="flex items-end gap-[1px] h-3 opacity-60">
                <div class="w-1 bg-tertiary/60 rounded-t-sm animate-pulse" style="height:40%"></div>
                <div class="w-1 bg-tertiary/60 rounded-t-sm animate-pulse" style="height:80%;animation-delay:.2s"></div>
                <div class="w-1 bg-tertiary/60 rounded-t-sm animate-pulse" style="height:60%;animation-delay:.4s"></div>
              </div>
            </div>
          ` : `
            <div class="flex items-center px-2 py-1.5 text-on-surface-variant hover:bg-white/50 rounded-lg cursor-pointer">
              <span class="material-symbols-outlined text-[14px] ${f.color} mr-2">${f.icon}</span>
              <span class="text-[13px]">${f.name}</span>
            </div>
          `).join('')}
        </div>
        ${folders.map(d => `
          <div class="flex items-center px-2 py-1.5 mt-1 text-on-surface-variant hover:bg-white/50 rounded-lg cursor-pointer">
            <span class="material-symbols-outlined text-[16px] text-on-surface-variant mr-1">keyboard_arrow_right</span>
            <span class="material-symbols-outlined text-[16px] text-on-surface-variant mr-2">folder</span>
            <span class="text-[13px]">${d.name}</span>
          </div>
        `).join('')}
        ${rootFiles.map(f => `
          <div class="flex items-center px-2 py-1.5 mt-1 text-on-surface-variant hover:bg-white/50 rounded-lg cursor-pointer">
            <span class="material-symbols-outlined text-[14px] text-on-surface-variant mr-2">${f.icon}</span>
            <span class="text-[13px]">${f.name}</span>
          </div>
        `).join('')}
      </div>
      <div class="p-2 border-t border-white/20 bg-white/20">
        <a href="#" class="flex items-center gap-3 px-3 py-1.5 text-on-surface-variant hover:text-on-surface hover:bg-white/50 rounded-lg text-[13px] font-medium">
          <span class="material-symbols-outlined text-[16px]">smart_toy</span> AI Agents
        </a>
        <a href="#" class="flex items-center gap-3 px-3 py-1.5 text-on-surface-variant hover:text-on-surface hover:bg-white/50 rounded-lg text-[13px] font-medium">
          <span class="material-symbols-outlined text-[16px]">history</span> Version History
        </a>
      </div>
    </aside>`;
}

function codeEditor() {
  const lines = Array.from({length:18}, (_,i) => `<span>${i+1}</span>`).join('');
  return `
    <div class="flex-1 flex flex-col min-w-0 bg-white/90 rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden relative glass-panel">
      <div class="flex border-b border-outline-variant/20 bg-surface-container-low/50 overflow-x-auto">
        <div class="flex items-center gap-2 px-4 py-2.5 bg-white border-t-2 border-tertiary border-r border-outline-variant/20 text-on-surface min-w-max cursor-pointer">
          <span class="material-symbols-outlined text-[14px] text-tertiary">data_object</span>
          <span class="text-[13px] font-medium">index.ts</span>
          <button class="ml-2 text-on-surface-variant hover:text-on-surface rounded-full p-0.5 hover:bg-surface-variant"><span class="material-symbols-outlined text-[14px]">close</span></button>
        </div>
        <div class="flex items-center gap-2 px-4 py-2.5 border-r border-outline-variant/20 text-on-surface-variant hover:bg-white hover:text-on-surface min-w-max cursor-pointer transition-colors">
          <span class="material-symbols-outlined text-[14px] text-indigo-400">css</span>
          <span class="text-[13px]">style.css</span>
        </div>
        <div class="flex items-center gap-2 px-4 py-2.5 text-on-surface-variant hover:bg-white hover:text-on-surface min-w-max cursor-pointer transition-colors">
          <span class="material-symbols-outlined text-[14px]">preview</span>
          <span class="text-[13px]">Preview</span>
        </div>
      </div>
      <div class="flex-1 overflow-auto p-4 code-font text-[13px] leading-[1.8] flex bg-white/80 backdrop-blur-sm">
        <div class="text-outline-variant/60 pr-4 text-right select-none flex flex-col w-8 shrink-0">${lines}</div>
        <div class="flex-1 whitespace-pre text-on-surface overflow-x-auto"><span class="text-indigo-600">import</span> { serve } <span class="text-indigo-600">from</span> <span class="text-emerald-600">"bun"</span>;
<span class="text-indigo-600">import</span> { Assistant } <span class="text-indigo-600">from</span> <span class="text-emerald-600">"@arora/ai"</span>;

<span class="text-on-surface-variant italic">// Initialize the core agent</span>
<span class="text-indigo-600">const</span> agent = <span class="text-indigo-600">new</span> Assistant({
  model: <span class="text-emerald-600">"gpt-4-turbo"</span>,
  temperature: <span class="text-orange-600">0.7</span>,
  memory: <span class="text-indigo-600">true</span>
});

<span class="text-indigo-600">export default</span> {
  <span class="text-tertiary">port</span>: <span class="text-orange-600">3000</span>,
  <span class="text-tertiary">async fetch</span>(req: Request) {
    <span class="text-indigo-600">const</span> url = <span class="text-indigo-600">new</span> URL(req.url);

    <span class="text-indigo-600">if</span> (url.pathname === <span class="text-emerald-600">"/"</span>) {
      <span class="text-indigo-600">return new</span> Response(<span class="text-emerald-600">"Arora Agent Active"</span>, { status: <span class="text-orange-600">200</span> });<span class="inline-block w-1.5 h-4 align-middle bg-tertiary rounded-sm ml-1 ai-cursor"></span>
    }
  }
};</div>
      </div>
    </div>`;
}

function docPanel() {
  return `
    <div class="hidden md:flex w-72 flex-col gap-3 shrink-0">
      <div class="glass-panel p-3 rounded-xl flex items-start gap-3 relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-r from-tertiary/5 to-transparent pointer-events-none"></div>
        <div class="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
          <span class="material-symbols-outlined text-[18px]">check_circle</span>
        </div>
        <div class="relative z-10">
          <h3 class="text-[13px] text-on-surface font-bold mb-0.5">Deployment Successful</h3>
          <p class="text-[11px] text-on-surface-variant">v1.4.2 deployed to edge</p>
          <a class="text-[11px] text-tertiary mt-1 inline-flex items-center gap-1 hover:underline font-medium" href="#">View Logs <span class="material-symbols-outlined text-[12px]">open_in_new</span></a>
        </div>
      </div>
      <div class="flex-1 glass-panel rounded-xl overflow-hidden flex flex-col">
        <div class="px-4 py-3 border-b border-white/20 bg-white/30 flex justify-between items-center">
          <h4 class="text-[10px] uppercase text-on-surface-variant tracking-wider font-bold">Documentation</h4>
          <button class="text-on-surface-variant hover:text-on-surface"><span class="material-symbols-outlined text-[14px]">edit</span></button>
        </div>
        <div class="flex-1 overflow-y-auto p-4">
          <h1 class="text-[18px] font-bold mb-2 text-on-surface leading-tight">Agent Initialization</h1>
          <p class="text-on-surface-variant mb-4 text-[13px] leading-relaxed">This module sets up the primary AI assistant instance using Bun's native HTTP server.</p>
          <h3 class="text-[13px] font-bold mt-4 mb-2 text-on-surface uppercase tracking-wide">Configuration</h3>
          <ul class="list-disc pl-4 space-y-1.5 text-[12px] text-on-surface-variant mb-4 marker:text-outline-variant">
            <li><code class="bg-surface-container px-1.5 py-0.5 rounded text-pink-600 font-mono text-[11px]">model</code>: Set to GPT-4 Turbo.</li>
            <li><code class="bg-surface-container px-1.5 py-0.5 rounded text-pink-600 font-mono text-[11px]">temperature</code>: 0.7 for balanced creativity.</li>
            <li><code class="bg-surface-container px-1.5 py-0.5 rounded text-pink-600 font-mono text-[11px]">memory</code>: Enabled for continuous thread context.</li>
          </ul>
          <div class="p-3 bg-yellow-50/50 border border-yellow-100 rounded-lg text-[12px] text-on-surface-variant mt-6 relative overflow-hidden">
            <div class="absolute left-0 top-0 bottom-0 w-1 bg-yellow-300"></div>
            <strong class="text-yellow-800">Note:</strong> Ensure your <code class="bg-white/50 px-1 rounded font-mono text-[11px]">.env</code> file contains the valid <code class="bg-white/50 px-1 rounded font-mono text-[11px]">ARORA_API_KEY</code>.
          </div>
        </div>
      </div>
    </div>`;
}
