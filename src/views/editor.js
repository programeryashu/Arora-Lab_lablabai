// ═══════════════════════════════════════════════
// ARORA OS — Editor View (Pop Up & ZIP Stabilized)
// Premium code editor featuring auto-popup preview & ZIP exporter
// ═══════════════════════════════════════════════

import { api } from '../api.js';

const projectFiles = {
  'index.ts': {
    name: 'index.ts',
    lang: 'typescript',
    icon: 'data_object',
    color: 'text-tertiary',
    linesCount: 18,
    content: `<span class="text-indigo-600">import</span> { serve } <span class="text-indigo-600">from</span> <span class="text-emerald-600">"bun"</span>;
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
};`
  },
  'style.css': {
    name: 'style.css',
    lang: 'css',
    icon: 'css',
    color: 'text-indigo-400',
    linesCount: 17,
    content: `<span class="text-indigo-600">:root</span> {
  <span class="text-tertiary">--primary-color</span>: <span class="text-emerald-600">#0060ac</span>;
  <span class="text-tertiary">--background-color</span>: <span class="text-emerald-600">#fdfcfb</span>;
  <span class="text-tertiary">--font-family</span>: <span class="text-emerald-600">'Manrope', sans-serif</span>;
}

<span class="text-indigo-600">body</span> {
  <span class="text-tertiary">margin</span>: <span class="text-orange-600">0</span>;
  <span class="text-tertiary">font-family</span>: <span class="text-indigo-600">var</span>(<span class="text-tertiary">--font-family</span>);
  <span class="text-tertiary">background</span>: <span class="text-indigo-600">var</span>(<span class="text-tertiary">--background-color</span>);
  <span class="text-tertiary">color</span>: <span class="text-emerald-600">#1a1c1c</span>;
}

<span class="text-indigo-600">.agent-badge</span> {
  <span class="text-tertiary">display</span>: <span class="text-emerald-600">inline-flex</span>;
  <span class="text-tertiary">padding</span>: <span class="text-emerald-600">4px 12px</span>;
  <span class="text-tertiary">border-radius</span>: <span class="text-emerald-600">12px</span>;
  <span class="text-tertiary">background</span>: <span class="text-emerald-600">rgba(0, 96, 172, 0.1)</span>;
  <span class="text-tertiary">color</span>: <span class="text-indigo-600">var</span>(<span class="text-tertiary">--primary-color</span>);
}`
  },
  'index.html': {
    name: 'index.html',
    lang: 'html',
    icon: 'html',
    color: 'text-orange-400',
    linesCount: 10,
    content: `<span class="text-indigo-600">&lt;!DOCTYPE html&gt;</span>
<span class="text-indigo-600">&lt;html</span> <span class="text-tertiary">lang</span>=<span class="text-emerald-600">"en"</span><span class="text-indigo-600">&gt;</span>
<span class="text-indigo-600">&lt;head&gt;</span>
  <span class="text-indigo-600">&lt;meta</span> <span class="text-tertiary">charset</span>=<span class="text-emerald-600">"UTF-8"</span><span class="text-indigo-600">&gt;</span>
  <span class="text-indigo-600">&lt;title&gt;</span>Arora Agent Preview<span class="text-indigo-600">&lt;/title&gt;</span>
<span class="text-indigo-600">&lt;/head&gt;</span>
<span class="text-indigo-600">&lt;body&gt;</span>
  <span class="text-indigo-600">&lt;div</span> <span class="text-tertiary">class</span>=<span class="text-emerald-600">"agent-badge"</span><span class="text-indigo-600">&gt;</span>Arora Server Running<span class="text-indigo-600">&lt;/div&gt;</span>
<span class="text-indigo-600">&lt;/body&gt;</span>
<span class="text-indigo-600">&lt;/html&gt;</span>`
  },
  'package.json': {
    name: 'package.json',
    lang: 'json',
    icon: 'description',
    color: 'text-on-surface-variant',
    linesCount: 11,
    content: `<span class="text-indigo-600">{</span>
  <span class="text-tertiary">"name"</span>: <span class="text-emerald-600">"arora-agent"</span>,
  <span class="text-tertiary">"version"</span>: <span class="text-emerald-600">"1.0.0"</span>,
  <span class="text-tertiary">"scripts"</span>: <span class="text-indigo-600">{</span>
    <span class="text-tertiary">"start"</span>: <span class="text-emerald-600">"bun run src/index.ts"</span>
  <span class="text-indigo-600">}</span>,
  <span class="text-tertiary">"dependencies"</span>: <span class="text-indigo-600">{</span>
    <span class="text-tertiary">"@arora/ai"</span>: <span class="text-emerald-600">"^1.0.0"</span>
  <span class="text-indigo-600">}</span>
<span class="text-indigo-600">}</span>`
  },
  'README.md': {
    name: 'README.md',
    lang: 'markdown',
    icon: 'description',
    color: 'text-on-surface-variant',
    linesCount: 8,
    content: `<span class="text-indigo-600"># Project Alpha</span>

An AI-native autonomous agent powered by Arora OS.

<span class="text-indigo-600">## Running</span>
Click **Run** to start the bun server at port 3000.`
  }
};

const projectRawFiles = {
  'src/index.ts': `import { serve } from "bun";
import { Assistant } from "@arora/ai";

// Initialize the core agent
const agent = new Assistant({
  model: "gpt-4-turbo",
  temperature: 0.7,
  memory: true
});

export default {
  port: 3000,
  async fetch(req: Request) {
    const url = new URL(req.url);

    if (url.pathname === "/") {
      return new Response("Arora Agent Active", { status: 200 });
    }
  }
};`,
  'src/style.css': `:root {
  --primary-color: #0060ac;
  --background-color: #fdfcfb;
  --font-family: 'Manrope', sans-serif;
}

body {
  margin: 0;
  font-family: var(--font-family);
  background: var(--background-color);
  color: #1a1c1c;
}

.agent-badge {
  display: inline-flex;
  padding: 4px 12px;
  border-radius: 12px;
  background: rgba(0, 96, 172, 0.1);
  color: var(--primary-color);
}`,
  'src/index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Arora Agent Preview</title>
</head>
<body>
  <div class="agent-badge">Arora Server Running</div>
</body>
</html>`,
  'package.json': `{
  "name": "arora-agent",
  "version": "1.0.0",
  "scripts": {
    "start": "bun run src/index.ts"
  },
  "dependencies": {
    "@arora/ai": "^1.0.0"
  }
}`,
  'README.md': `# Project Alpha

An AI-native autonomous agent powered by Arora OS.

## Running
Click **Run** to start the bun server at port 3000.`
};

let activeTabs = ['index.ts', 'style.css'];
let activeTab = 'index.ts';
let isEngineRunning = false;

export function renderEditorView() {
  return `
    <div class="flex-1 flex overflow-hidden p-3 gap-3 relative z-10">
      ${fileExplorer()}
      ${codeEditor()}
      ${docPanel()}
    </div>
  `;
}

function renderTabsHtml() {
  return activeTabs.map(k => {
    const file = projectFiles[k] || { name: k, icon: 'insert_drive_file', color: 'text-on-surface-variant' };
    const isCurrent = activeTab === k;
    if (isCurrent) {
      return `
        <div data-tab="${k}" class="editor-tab active flex items-center gap-2 px-4 py-2.5 bg-white border-t-2 border-tertiary border-r border-outline-variant/20 text-on-surface min-w-max cursor-pointer">
          <span class="material-symbols-outlined text-[14px] text-tertiary">${file.icon || 'insert_drive_file'}</span>
          <span class="text-[14px] font-medium">${k}</span>
          <button data-close-tab="${k}" class="ml-2 text-on-surface-variant hover:text-on-surface rounded-full p-0.5 hover:bg-surface-variant flex items-center justify-center"><span class="material-symbols-outlined text-[14px]">close</span></button>
        </div>`;
    } else {
      return `
        <div data-tab="${k}" class="editor-tab flex items-center gap-2 px-4 py-2.5 border-r border-outline-variant/20 text-on-surface-variant hover:bg-white hover:text-on-surface min-w-max cursor-pointer transition-colors">
          <span class="material-symbols-outlined text-[14px] ${file.color || 'text-on-surface-variant'}">${file.icon || 'insert_drive_file'}</span>
          <span class="text-[14px]">${k}</span>
          <button data-close-tab="${k}" class="ml-2 text-on-surface-variant hover:text-on-surface rounded-full p-0.5 hover:bg-surface-variant flex items-center justify-center"><span class="material-symbols-outlined text-[14px]">close</span></button>
        </div>`;
    }
  }).join('');
}

function fileExplorer() {
  const fileKeys = Object.keys(projectFiles);
  const srcFiles = fileKeys.filter(k => k !== 'package.json' && k !== 'README.md');
  const rootFiles = fileKeys.filter(k => k === 'package.json' || k === 'README.md');

  const srcFilesHtml = srcFiles.map(k => {
    const file = projectFiles[k];
    const isCurrent = activeTab === k;
    if (isCurrent) {
      return `
        <div data-file="${k}" class="explorer-file flex items-center justify-between px-2 py-1.5 text-tertiary bg-white/60 shadow-sm rounded-lg cursor-pointer relative transition-all">
          <div class="absolute -left-3 w-1.5 h-1.5 rounded-full bg-tertiary ai-active-dot"></div>
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[14px] text-tertiary">${file.icon || 'insert_drive_file'}</span>
            <span class="text-[14px] font-medium">${k}</span>
          </div>
          <div class="flex items-end gap-[1px] h-3 opacity-60">
            <div class="w-1 bg-tertiary/60 rounded-t-sm animate-pulse" style="height:40%"></div>
            <div class="w-1 bg-tertiary/60 rounded-t-sm animate-pulse" style="height:80%;animation-delay:.2s"></div>
            <div class="w-1 bg-tertiary/60 rounded-t-sm animate-pulse" style="height:60%;animation-delay:.4s"></div>
          </div>
        </div>`;
    } else {
      return `
        <div data-file="${k}" class="explorer-file flex items-center px-2 py-1.5 text-on-surface-variant hover:bg-white/50 rounded-lg cursor-pointer transition-all">
          <span class="material-symbols-outlined text-[14px] ${file.color || 'text-on-surface-variant'} mr-2">${file.icon || 'insert_drive_file'}</span>
          <span class="text-[14px]">${k}</span>
        </div>`;
    }
  }).join('');

  const rootFilesHtml = rootFiles.map(k => {
    const file = projectFiles[k];
    const isCurrent = activeTab === k;
    if (isCurrent) {
      return `
        <div data-file="${k}" class="explorer-file flex items-center justify-between px-2 py-1.5 mt-1 text-tertiary bg-white/60 shadow-sm rounded-lg cursor-pointer relative transition-all">
          <div class="absolute -left-3 w-1.5 h-1.5 rounded-full bg-tertiary ai-active-dot"></div>
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[14px] text-tertiary">${file.icon || 'insert_drive_file'}</span>
            <span class="text-[14px] font-medium">${k}</span>
          </div>
          <div class="flex items-end gap-[1px] h-3 opacity-60">
            <div class="w-1 bg-tertiary/60 rounded-t-sm animate-pulse" style="height:40%"></div>
            <div class="w-1 bg-tertiary/60 rounded-t-sm animate-pulse" style="height:80%;animation-delay:.2s"></div>
            <div class="w-1 bg-tertiary/60 rounded-t-sm animate-pulse" style="height:60%;animation-delay:.4s"></div>
          </div>
        </div>`;
    } else {
      return `
        <div data-file="${k}" class="explorer-file flex items-center px-2 py-1.5 mt-1 text-on-surface-variant hover:bg-white/50 rounded-lg cursor-pointer transition-all">
          <span class="material-symbols-outlined text-[14px] ${file.color || 'text-on-surface-variant'} mr-2">${file.icon || 'insert_drive_file'}</span>
          <span class="text-[14px]">${k}</span>
        </div>`;
    }
  }).join('');

  return `
    <aside class="hidden lg:flex flex-col w-56 glass-panel rounded-xl overflow-hidden shrink-0">
      <div class="p-3 border-b border-white/20 bg-white/30 flex justify-between items-center">
        <span class="text-[10px] uppercase text-on-surface-variant tracking-wider font-bold">Files</span>
        <div class="flex gap-1.5 items-center">
          <span id="download-zip-btn" class="material-symbols-outlined text-[16px] text-on-surface-variant cursor-pointer hover:text-on-surface" title="Download ZIP file">download</span>
          <span id="add-file-btn" class="material-symbols-outlined text-[14px] text-on-surface-variant cursor-pointer hover:text-on-surface" title="Add new file">note_add</span>
          <span class="material-symbols-outlined text-[14px] text-on-surface-variant cursor-pointer hover:text-on-surface">create_new_folder</span>
        </div>
      </div>
      <div class="flex-1 overflow-y-auto py-2 px-2" id="explorer-files-container">
        <div class="flex items-center px-2 py-1.5 text-on-surface hover:bg-white/50 rounded-lg cursor-pointer select-none">
          <span class="material-symbols-outlined text-[16px] text-on-surface-variant mr-1">keyboard_arrow_down</span>
          <span class="material-symbols-outlined text-[16px] text-on-surface-variant mr-2">folder</span>
          <span class="text-[14px] font-medium">src</span>
        </div>
        <div class="pl-6 flex flex-col gap-0.5" id="explorer-src-files">
          ${srcFilesHtml}
        </div>
        <div id="explorer-root-files" class="flex flex-col gap-0.5 mt-1.5">
          ${rootFilesHtml}
        </div>
      </div>
      <div class="p-2 border-t border-white/20 bg-white/20">
        <a href="#" class="flex items-center gap-3 px-3 py-1.5 text-on-surface-variant hover:text-on-surface hover:bg-white/50 rounded-lg text-[14px] font-medium">
          <span class="material-symbols-outlined text-[16px]">smart_toy</span> AI Agents
        </a>
        <a href="#" class="flex items-center gap-3 px-3 py-1.5 text-on-surface-variant hover:text-on-surface hover:bg-white/50 rounded-lg text-[14px] font-medium">
          <span class="material-symbols-outlined text-[16px]">history</span> Version History
        </a>
      </div>
    </aside>`;
}

function codeEditor() {
  return `
    <div class="flex-1 flex flex-col min-w-0 bg-white/90 rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden relative glass-panel">
      <div class="flex border-b border-outline-variant/20 bg-surface-container-low/50 items-center justify-between pr-4 shrink-0 select-none w-full">
        <!-- Editor Tabs -->
        <div class="flex flex-1 overflow-x-auto scrollbar-none mr-2" id="editor-tabs">
          ${renderTabsHtml()}
        </div>
        
        <!-- Run & Preview dedicated action buttons -->
        <div class="flex items-center gap-2">
          <!-- Preview Button -->
          <button id="editor-preview-btn" class="px-3 py-1.5 rounded-lg border border-outline-variant/30 text-on-surface-variant hover:text-on-surface hover:bg-white/50 text-[12px] font-bold flex items-center gap-1.5 shadow-sm transition-all">
            <span class="material-symbols-outlined text-[16px]">open_in_new</span>
            <span>Preview</span>
          </button>
          
          <!-- Run Button -->
          <button id="editor-run-btn" class="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[12px] font-bold flex items-center gap-1.5 shadow-sm transition-all">
            <span class="material-symbols-outlined text-[16px]" id="run-icon">play_arrow</span>
            <span id="run-text">Run</span>
          </button>
        </div>
      </div>
      
      <!-- Content Container -->
      <div id="editor-code-container" class="flex-1 overflow-auto flex bg-white/80 backdrop-blur-sm">
        <!-- Rendered Code will be dynamically injected here -->
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
        <div class="relative z-10 select-none">
          <h3 class="text-[14px] text-on-surface font-bold mb-0.5">Deployment Successful</h3>
          <p class="text-[12px] text-on-surface-variant">v1.4.2 deployed to edge</p>
          <a class="text-[12px] text-tertiary mt-1 inline-flex items-center gap-1 hover:underline font-medium" href="#">View Logs <span class="material-symbols-outlined text-[12px]">open_in_new</span></a>
        </div>
      </div>
      <div class="flex-1 glass-panel rounded-xl overflow-hidden flex flex-col">
        <div class="px-4 py-3 border-b border-white/20 bg-white/30 flex justify-between items-center select-none">
          <h4 class="text-[10px] uppercase text-on-surface-variant tracking-wider font-bold">Documentation</h4>
          <button class="text-on-surface-variant hover:text-on-surface"><span class="material-symbols-outlined text-[14px]">edit</span></button>
        </div>
        <div class="flex-1 overflow-y-auto p-4 select-none">
          <h1 class="text-[18px] font-bold mb-2 text-on-surface leading-tight">Agent Initialization</h1>
          <p class="text-on-surface-variant mb-4 text-[14px] leading-relaxed">This module sets up the primary AI assistant instance using Bun's native HTTP server.</p>
          <h3 class="text-[14px] font-bold mt-4 mb-2 text-on-surface uppercase tracking-wide">Configuration</h3>
          <ul class="list-disc pl-4 space-y-1.5 text-[14px] text-on-surface-variant mb-4 marker:text-outline-variant">
            <li><code class="bg-surface-container px-1.5 py-0.5 rounded text-pink-600 font-mono text-[12px]">model</code>: Set to GPT-4 Turbo.</li>
            <li><code class="bg-surface-container px-1.5 py-0.5 rounded text-pink-600 font-mono text-[12px]">temperature</code>: 0.7 for balanced creativity.</li>
            <li><code class="bg-surface-container px-1.5 py-0.5 rounded text-pink-600 font-mono text-[12px]">memory</code>: Enabled for continuous thread context.</li>
          </ul>
          <div class="p-3 bg-yellow-50/50 border border-yellow-100 rounded-lg text-[14px] text-on-surface-variant mt-6 relative overflow-hidden">
            <div class="absolute left-0 top-0 bottom-0 w-1 bg-yellow-300"></div>
            <strong class="text-yellow-800">Note:</strong> Ensure your <code class="bg-white/50 px-1 rounded font-mono text-[12px]">.env</code> file contains the valid <code class="bg-white/50 px-1 rounded font-mono text-[12px]">ARORA_API_KEY</code>.
          </div>
        </div>
      </div>
    </div>`;
}

// ═══════════════════════════════════════════════
// DYNAMIC EVENT BINDINGS VIA DELEGATION
// ═══════════════════════════════════════════════
export function bindEditorDelegatedEvents() {
  const tabsContainer = document.getElementById('editor-tabs');
  if (tabsContainer && !tabsContainer.dataset.delegated) {
    tabsContainer.dataset.delegated = 'true';
    tabsContainer.addEventListener('click', (e) => {
      const closeBtn = e.target.closest('[data-close-tab]');
      if (closeBtn) {
        e.preventDefault();
        e.stopPropagation();
        const tabName = closeBtn.dataset.closeTab;
        closeTab(tabName);
        return;
      }

      const tab = e.target.closest('.editor-tab');
      if (tab) {
        const tabName = tab.dataset.tab;
        switchTab(tabName);
      }
    });
  }

  const explorerContainer = document.getElementById('explorer-src-files')?.closest('aside');
  if (explorerContainer && !explorerContainer.dataset.delegated) {
    explorerContainer.dataset.delegated = 'true';
    explorerContainer.addEventListener('click', (e) => {
      const fileEl = e.target.closest('.explorer-file');
      if (fileEl) {
        e.preventDefault();
        e.stopPropagation();
        const fileName = fileEl.dataset.file;
        
        if (!activeTabs.includes(fileName)) {
          activeTabs.push(fileName);
        }
        
        switchTab(fileName);
      }
    });
  }
}

function switchTab(tabName) {
  activeTab = tabName;
  
  const tabsContainer = document.getElementById('editor-tabs');
  if (tabsContainer) {
    tabsContainer.innerHTML = renderTabsHtml();
  }

  document.querySelectorAll('.explorer-file').forEach(el => {
    const k = el.dataset.file;
    const file = projectFiles[k];
    const isCurrent = k === tabName;
    
    const dot = el.querySelector('.ai-active-dot');
    if (dot) dot.remove();
    const pulse = el.querySelector('.h-3');
    if (pulse) pulse.remove();

    if (isCurrent) {
      el.className = "explorer-file flex items-center justify-between px-2 py-1.5 text-tertiary bg-white/60 shadow-sm rounded-lg cursor-pointer relative transition-all";
      el.insertAdjacentHTML('afterbegin', '<div class="absolute -left-3 w-1.5 h-1.5 rounded-full bg-tertiary ai-active-dot"></div>');
      el.insertAdjacentHTML('beforeend', `
        <div class="flex items-end gap-[1px] h-3 opacity-60">
          <div class="w-1 bg-tertiary/60 rounded-t-sm animate-pulse" style="height:40%"></div>
          <div class="w-1 bg-tertiary/60 rounded-t-sm animate-pulse" style="height:80%;animation-delay:.2s"></div>
          <div class="w-1 bg-tertiary/60 rounded-t-sm animate-pulse" style="height:60%;animation-delay:.4s"></div>
        </div>
      `);
    } else {
      el.className = "explorer-file flex items-center px-2 py-1.5 text-on-surface-variant hover:bg-white/50 rounded-lg cursor-pointer transition-all";
    }
  });

  if (activeTab) {
    renderCodeTab(tabName);
  }

  bindEditorDelegatedEvents();
}

function closeTab(tabName) {
  activeTabs = activeTabs.filter(t => t !== tabName);
  
  if (activeTab === tabName) {
    if (activeTabs.length > 0) {
      activeTab = activeTabs[activeTabs.length - 1];
    } else {
      activeTab = null;
    }
  }
  
  const tabsContainer = document.getElementById('editor-tabs');
  if (tabsContainer) {
    tabsContainer.innerHTML = renderTabsHtml();
  }
  
  if (activeTab) {
    switchTab(activeTab);
  } else {
    const container = document.getElementById('editor-code-container');
    if (container) {
      container.innerHTML = `
        <div class="flex-1 flex flex-col items-center justify-center text-on-surface-variant/60 p-8 select-none">
          <span class="material-symbols-outlined text-[48px] opacity-40 mb-3 select-none">folder_open</span>
          <p class="text-[14px]">No files open in editor. Select a file from the sidebar explorer.</p>
        </div>`;
    }
    bindEditorDelegatedEvents();
  }
}

// Helper to render explorer UI dynamically
export function renderExplorerUI() {
  const srcFilesContainer = document.getElementById('explorer-src-files');
  const rootFilesContainer = document.getElementById('explorer-root-files');
  
  if (srcFilesContainer && rootFilesContainer) {
    const fileKeys = Object.keys(projectFiles);
    const srcFiles = fileKeys.filter(k => k !== 'package.json' && k !== 'README.md');
    const rootFiles = fileKeys.filter(k => k === 'package.json' || k === 'README.md');

    srcFilesContainer.innerHTML = srcFiles.map(k => {
      const file = projectFiles[k];
      return `
        <div data-file="${k}" class="explorer-file flex items-center px-2 py-1.5 text-on-surface-variant hover:bg-white/50 rounded-lg cursor-pointer transition-all">
          <span class="material-symbols-outlined text-[14px] ${file.color || 'text-on-surface-variant'} mr-2">${file.icon || 'insert_drive_file'}</span>
          <span class="text-[14px]">${k}</span>
        </div>`;
    }).join('');

    rootFilesContainer.innerHTML = rootFiles.map(k => {
      const file = projectFiles[k];
      return `
        <div data-file="${k}" class="explorer-file flex items-center px-2 py-1.5 mt-1 text-on-surface-variant hover:bg-white/50 rounded-lg cursor-pointer transition-all">
          <span class="material-symbols-outlined text-[14px] ${file.color || 'text-on-surface-variant'} mr-2">${file.icon || 'insert_drive_file'}</span>
          <span class="text-[14px]">${k}</span>
        </div>`;
    }).join('');
  }
}

// Asynchronously load files generated by AI agents from the backend results
export async function loadActiveProjectFiles(activeId) {
  try {
    const results = await api.getResult(activeId);
    if (!results) return;

    // Clear existing
    for (const key in projectFiles) delete projectFiles[key];
    for (const key in projectRawFiles) delete projectRawFiles[key];
    activeTabs = [];

    function addFile(name, rawContent) {
      const ext = name.split('.').pop().toLowerCase();
      let icon = 'description';
      let color = 'text-on-surface-variant';
      let lang = 'typescript';
      
      if (ext === 'ts' || ext === 'tsx' || ext === 'js' || ext === 'jsx') {
        icon = ext.endsWith('x') ? 'code' : 'data_object';
        color = 'text-tertiary';
        lang = ext.startsWith('t') ? 'typescript' : 'javascript';
      } else if (ext === 'css') {
        icon = 'css';
        color = 'text-indigo-400';
        lang = 'css';
      } else if (ext === 'html') {
        icon = 'html';
        color = 'text-orange-400';
        lang = 'html';
      } else if (ext === 'json') {
        icon = 'description';
        color = 'text-on-surface-variant';
        lang = 'json';
      } else if (ext === 'md') {
        icon = 'description';
        color = 'text-on-surface-variant';
        lang = 'markdown';
      }

      function escapeHtml(text) {
        return text
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#039;");
      }

      const lines = rawContent.split('\n');
      const linesCount = lines.length;
      
      let highlighted = escapeHtml(rawContent);
      
      // 1. Highlight Strings (do this before keywords to avoid matching quote characters in HTML span attributes)
      highlighted = highlighted.replace(/(["'])(.*?)\1/g, `<span class="text-emerald-600">"$2"</span>`);

      // 2. Highlight Comments
      highlighted = highlighted.replace(/(\/\/.*)/g, `<span class="text-on-surface-variant italic">$1</span>`);

      // 3. Highlight Keywords (using tag-ignoring regex to ensure we never replace attributes of our HTML tags)
      const keywords = ['import', 'export', 'default', 'function', 'const', 'let', 'var', 'return', 'async', 'await', 'from', 'if', 'else', 'new', 'class', 'port', 'fetch'];
      highlighted = highlighted.replace(/(<[^>]+>)|(\b\w+\b)/g, (match, tag, word) => {
        if (tag) return tag;
        if (keywords.includes(word)) {
          return `<span class="text-indigo-600 font-semibold">${word}</span>`;
        }
        return word;
      });

      projectFiles[name] = {
        name: name,
        lang: lang,
        icon: icon,
        color: color,
        linesCount: linesCount,
        content: highlighted
      };

      const rawPath = (name === 'package.json' || name === 'README.md') ? name : `src/${name}`;
      projectRawFiles[rawPath] = rawContent;

      activeTabs.push(name);
    }

    // 1. Process Frontend Components
    if (results.frontend && Array.isArray(results.frontend.components)) {
      results.frontend.components.forEach(comp => {
        if (comp.name && comp.code) {
          addFile(comp.name, comp.code);
        }
      });
    }

    // 2. Process Backend Code
    if (results.backend) {
      if (results.backend.backend_code) {
        addFile('server.py', results.backend.backend_code);
      }
      if (results.backend.database_schema) {
        addFile('schema.sql', results.backend.database_schema);
      }
    }

    // 3. Process Docs
    if (results.docs) {
      if (results.docs.docs) {
        addFile('README.md', results.docs.docs);
      } else if (typeof results.docs === 'string') {
        addFile('README.md', results.docs);
      }
    }

    // If still empty, add default
    if (activeTabs.length === 0) {
      addFile('README.md', '# Generated Arora Project\nNo files were generated.');
    }

    activeTab = activeTabs[0];

    // Re-render explorer UI list
    renderExplorerUI();

  } catch (error) {
    console.error("Failed to load project results:", error);
  }
}

// ═══════════════════════════════════════════════
// VIEW INITIALIZER
// ═══════════════════════════════════════════════
export async function initEditorView() {
  const activeId = sessionStorage.getItem('arora_active_project_id');
  if (activeId) {
    showToast("Syncing agent workspace files...", "success");
    await loadActiveProjectFiles(activeId);
  }

  // 1. Initial Render
  switchTab(activeTab);

  // 2. Setup run button state
  updateRunBtnUI();

  // 3. Bind Editor Event Listeners via delegation
  bindEditorDelegatedEvents();

  // 4. Bind Add File Click Action
  const addFileBtn = document.getElementById('add-file-btn');
  addFileBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    openCreateFileModal();
  });

  // 5. Preview dedicated button click
  const previewBtn = document.getElementById('editor-preview-btn');
  previewBtn?.addEventListener('click', () => {
    openPreviewModal();
  });

  // 6. Run Button logic (Auto pop-up on start, Auto vanish on stop)
  const runBtn = document.getElementById('editor-run-btn');
  runBtn?.addEventListener('click', () => {
    if (!isEngineRunning) {
      // START ENGINE
      isEngineRunning = true;
      showToast("Starting Arora Engine on port 3000...", "success");
      
      setTimeout(() => {
        showToast("Arora Engine is listening on http://localhost:3000", "success");
        updateRunBtnUI();
        // AUTO POP-UP PREVIEW ON START
        openPreviewModal();
      }, 800);
    } else {
      // STOP ENGINE
      isEngineRunning = false;
      showToast("Stopping Arora Engine...", "error");
      
      setTimeout(() => {
        showToast("Arora Engine suspended.", "error");
        updateRunBtnUI();
        // AUTO VANISH PREVIEW ON STOP
        closePreviewModal();
      }, 600);
    }
  });

  // 7. Download ZIP logic
  const downloadBtn = document.getElementById('download-zip-btn');
  downloadBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    downloadFilesAsZip();
  });
}

function updateRunBtnUI() {
  const runBtn = document.getElementById('editor-run-btn');
  const runIcon = document.getElementById('run-icon');
  const runText = document.getElementById('run-text');

  if (!runBtn) return;

  if (isEngineRunning) {
    runBtn.className = "px-4 py-1.5 rounded-lg bg-error hover:bg-error/90 text-white text-[12px] font-bold flex items-center gap-1.5 shadow-sm transition-all";
    if (runIcon) runIcon.textContent = "stop";
    if (runText) runText.textContent = "Stop";
  } else {
    runBtn.className = "px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[12px] font-bold flex items-center gap-1.5 shadow-sm transition-all";
    if (runIcon) runIcon.textContent = "play_arrow";
    if (runText) runText.textContent = "Run";
  }
}

function renderCodeTab(fileName) {
  const container = document.getElementById('editor-code-container');
  const file = projectFiles[fileName] || projectFiles['index.ts'];

  const linesHtml = Array.from({ length: file.linesCount }, (_, i) => `<span>${i + 1}</span>`).join('');
  
  container.className = "flex-1 overflow-auto flex bg-white/80 backdrop-blur-sm";
  container.innerHTML = `
    <div class="text-outline-variant/60 p-4 pr-0 text-right select-none flex flex-col w-8 shrink-0 code-font text-[14px] leading-[1.7]">${linesHtml}</div>
    <div class="flex-1 p-4 whitespace-pre text-on-surface overflow-x-auto code-font text-[14px] leading-[1.7]">${file.content}</div>
  `;
}

// ═══════════════════════════════════════════════
// NEW FILE CREATION MODAL
// ═══════════════════════════════════════════════
function openCreateFileModal() {
  const modalHtml = `
    <div id="create-file-modal-overlay" class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none">
      <div class="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 flex flex-col transform scale-95 transition-all duration-300" id="create-file-modal-window">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
            <span class="material-symbols-outlined">note_add</span>
          </div>
          <div>
            <h3 class="text-[16px] font-bold text-on-surface font-sans">Create New File</h3>
            <p class="text-[12px] text-on-surface-variant font-sans">Add a code file to your project</p>
          </div>
        </div>
        
        <div class="mb-5">
          <label class="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-1.5 font-sans">File Name</label>
          <input type="text" id="new-file-name-input" placeholder="e.g. App.tsx, utils.js, styles.css" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-[14px] text-on-surface placeholder:text-gray-400 outline-none focus:border-emerald-600 transition-all font-sans" autocomplete="off" />
          <span id="create-file-error" class="hidden text-[11px] text-error mt-1.5 font-medium font-sans"></span>
        </div>
        
        <div class="flex gap-3 justify-end">
          <button id="cancel-create-file" class="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-[13px] font-bold rounded-xl text-on-surface-variant font-sans transition-all">Cancel</button>
          <button id="confirm-create-file" class="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[13px] font-bold rounded-xl shadow-sm font-sans transition-all">Create File</button>
        </div>
      </div>
    </div>`;

  document.body.insertAdjacentHTML('beforeend', modalHtml);
  
  const input = document.getElementById('new-file-name-input');
  input?.focus();

  // Scale in modal window smoothly
  setTimeout(() => {
    const win = document.getElementById('create-file-modal-window');
    if (win) {
      win.classList.remove('scale-95');
      win.classList.add('scale-100');
    }
  }, 10);

  // Bind modal button elements
  const cancelBtn = document.getElementById('cancel-create-file');
  cancelBtn?.addEventListener('click', closeCreateFileModal);

  const overlay = document.getElementById('create-file-modal-overlay');
  overlay?.addEventListener('click', (e) => {
    if (e.target === overlay) closeCreateFileModal();
  });

  const confirmBtn = document.getElementById('confirm-create-file');
  confirmBtn?.addEventListener('click', handleSubmit);
  
  input?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleSubmit();
    if (e.key === 'Escape') closeCreateFileModal();
  });

  function handleSubmit() {
    const fileName = input.value.trim();
    const errorEl = document.getElementById('create-file-error');
    if (!errorEl) return;

    if (!fileName) {
      errorEl.textContent = "Please enter a valid filename.";
      errorEl.classList.remove('hidden');
      return;
    }

    if (projectFiles[fileName]) {
      errorEl.textContent = "A file with this name already exists.";
      errorEl.classList.remove('hidden');
      return;
    }

    const isValid = /^[a-zA-Z0-9_\-\.\/]+$/.test(fileName);
    if (!isValid) {
      errorEl.textContent = "Filename contains invalid characters.";
      errorEl.classList.remove('hidden');
      return;
    }

    createFileInWorkspace(fileName);
    closeCreateFileModal();
  }
}

function closeCreateFileModal() {
  const overlay = document.getElementById('create-file-modal-overlay');
  const win = document.getElementById('create-file-modal-window');
  if (win) {
    win.classList.remove('scale-100');
    win.classList.add('scale-95');
  }
  setTimeout(() => {
    overlay?.remove();
  }, 150);
}

function createFileInWorkspace(fileName) {
  // Clean filename path prefixes if user types them explicitly
  const cleanName = fileName.replace(/^src\//, '');
  const ext = cleanName.split('.').pop().toLowerCase();
  
  let icon = 'description';
  let color = 'text-on-surface-variant';
  let lang = 'typescript';
  let linesCount = 5;
  let rawContent = `// New file: ${cleanName}`;
  let highlightedContent = `<span class="text-on-surface-variant italic">// New file: ${cleanName}</span>`;

  if (ext === 'ts' || ext === 'tsx' || ext === 'js' || ext === 'jsx') {
    icon = ext.endsWith('x') ? 'code' : 'data_object';
    color = 'text-tertiary';
    lang = ext.startsWith('t') ? 'typescript' : 'javascript';
    if (ext === 'tsx' || ext === 'jsx') {
      rawContent = `export default function App() {\n  return (\n    <div className="p-6 text-center">\n      <h1>Hello from ${cleanName}!</h1>\n    </div>\n  );\n}`;
      highlightedContent = `<span class="text-indigo-600">export default function</span> <span class="text-tertiary">App</span>() {\n  <span class="text-indigo-600">return</span> (\n    <span class="text-emerald-600">&lt;div className="p-6 text-center"&gt;</span>\n      <span class="text-emerald-600">&lt;h1&gt;Hello from ${cleanName}!&lt;/h1&gt;</span>\n    <span class="text-emerald-600">&lt;/div&gt;</span>\n  );\n}`;
      linesCount = 7;
    } else {
      rawContent = `export function init() {\n  console.log("Initialized ${cleanName}");\n}`;
      highlightedContent = `<span class="text-indigo-600">export function</span> <span class="text-tertiary">init</span>() {\n  <span class="text-tertiary">console.log</span>(<span class="text-emerald-600">"Initialized ${cleanName}"</span>);\n}`;
      linesCount = 3;
    }
  } else if (ext === 'css') {
    icon = 'css';
    color = 'text-indigo-400';
    lang = 'css';
    rawContent = `/* Stylesheet: ${cleanName} */\n.container {\n  padding: 20px;\n}`;
    highlightedContent = `<span class="text-on-surface-variant italic">/* Stylesheet: ${cleanName} */</span>\n<span class="text-indigo-600">.container</span> {\n  <span class="text-tertiary">padding</span>: <span class="text-emerald-600">20px</span>;\n}`;
    linesCount = 4;
  } else if (ext === 'html') {
    icon = 'html';
    color = 'text-orange-400';
    lang = 'html';
    rawContent = `<!DOCTYPE html>\n<html>\n<body>\n  <h2>${cleanName}</h2>\n</body>\n</html>`;
    highlightedContent = `<span class="text-indigo-600">&lt;!DOCTYPE html&gt;</span>\n<span class="text-indigo-600">&lt;html&gt;</span>\n<span class="text-indigo-600">&lt;body&gt;</span>\n  <span class="text-indigo-600">&lt;h2&gt;</span>${cleanName}<span class="text-indigo-600">&lt;/h2&gt;</span>\n<span class="text-indigo-600">&lt;/body&gt;</span>\n<span class="text-indigo-600">&lt;/html&gt;</span>`;
    linesCount = 6;
  } else if (ext === 'json') {
    icon = 'description';
    color = 'text-on-surface-variant';
    lang = 'json';
    rawContent = `{\n  "name": "${cleanName.split('.')[0]}"\n}`;
    highlightedContent = `<span class="text-indigo-600">{</span>\n  <span class="text-tertiary">"name"</span>: <span class="text-emerald-600">"${cleanName.split('.')[0]}"</span>\n<span class="text-indigo-600">}</span>`;
    linesCount = 3;
  } else if (ext === 'md') {
    icon = 'description';
    color = 'text-on-surface-variant';
    lang = 'markdown';
    rawContent = `# ${cleanName}\n\nDocumentation for this component.`;
    highlightedContent = `<span class="text-indigo-600"># ${cleanName}</span>\n\nDocumentation for this component.`;
    linesCount = 3;
  }

  // 1. Add file model dynamically to projectFiles
  projectFiles[cleanName] = {
    name: cleanName,
    lang: lang,
    icon: icon,
    color: color,
    linesCount: linesCount,
    content: highlightedContent
  };

  // 2. Add raw text to projectRawFiles
  const rawPath = (cleanName === 'package.json' || cleanName === 'README.md') ? cleanName : `src/${cleanName}`;
  projectRawFiles[rawPath] = rawContent;

  // 3. Auto push to activeTabs
  if (!activeTabs.includes(cleanName)) {
    activeTabs.push(cleanName);
  }

  // 4. Display elegant toast notification
  showToast(`Created file: ${cleanName}`, "success");

  // 5. Re-render full file explorer components
  renderExplorerUI();

  // Focus the newly created file tab
  switchTab(cleanName);
}

// ═══════════════════════════════════════════════
// STABILIZED LIGHT THEME PREVIEW MODAL
// ═══════════════════════════════════════════════
function renderPreviewModalContent() {
  return isEngineRunning 
    ? `
      <div class="flex-1 flex flex-col items-center justify-center text-center p-8 bg-[#f8fafc] rounded-b-xl relative overflow-hidden select-none animate-fade-in">
        <!-- Soft animated gradient light aura -->
        <div class="absolute inset-0 bg-gradient-to-tr from-emerald-100/30 via-sky-50/20 to-transparent pointer-events-none"></div>
        
        <!-- Premium Safari-body Container -->
        <div class="relative z-10 w-full max-w-sm p-6 bg-white border border-emerald-100 rounded-2xl flex flex-col items-center shadow-lg transform transition-transform duration-500 scale-100">
          <div class="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100 mb-4 animate-bounce">
            <span class="material-symbols-outlined text-emerald-600 text-3xl">smart_toy</span>
          </div>
          <h4 class="text-[16px] font-bold text-emerald-800 mb-1 font-sans">Arora Agent Active</h4>
          <p class="text-[11px] text-gray-400 mb-4 font-sans">Port 3000 &bull; GPT-4-Turbo</p>
          
          <div class="w-full text-left bg-gray-50/80 p-4 rounded-xl font-mono text-[11px] border border-gray-200/50 space-y-1">
            <div class="text-gray-500"><span class="text-pink-600 font-semibold">GET</span> / - <span class="text-emerald-600 font-bold">200 OK</span></div>
            <div class="text-emerald-700 font-semibold">Response: "Arora Agent Active"</div>
          </div>
        </div>
      </div>`
    : `
      <div class="flex-1 flex flex-col items-center justify-center text-center p-8 bg-[#f8fafc] rounded-b-xl relative overflow-hidden select-none">
        <div class="absolute inset-0 bg-red-50/10 blur-3xl opacity-30"></div>
        <span class="material-symbols-outlined text-[48px] text-red-500 opacity-60 mb-4 animate-pulse">cloud_off</span>
        <h3 class="text-[16px] text-red-800 font-bold mb-1.5 font-sans">Engine Offline</h3>
        <p class="text-[12px] text-gray-400 max-w-[240px] font-sans leading-relaxed">The Arora server at port 3000 is currently suspended. Click the <strong>Run</strong> button in the editor toolbar to activate the server.</p>
      </div>`;
}

function openPreviewModal() {
  let modal = document.getElementById('preview-modal-overlay');
  if (modal) return;

  const modalHtml = `
    <div id="preview-modal-overlay" class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="w-full max-w-xl bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col transform scale-95 transition-all duration-300" id="preview-modal-window">
        <!-- MacOS Style Mock Header (Light Theme) -->
        <div class="flex items-center gap-2 p-3 bg-gray-50 border-b border-gray-200 shrink-0 select-none">
          <!-- Window Controls -->
          <div class="flex gap-1.5 shrink-0">
            <button id="close-preview-modal" class="w-3 h-3 rounded-full bg-red-400 hover:bg-red-500 flex items-center justify-center group relative transition-colors shadow-sm animate-pulse">
              <span class="absolute text-[8px] font-bold text-red-900 opacity-0 group-hover:opacity-100" style="margin-top:-1.5px">×</span>
            </button>
            <div class="w-3 h-3 rounded-full bg-yellow-400 shadow-sm"></div>
            <div class="w-3 h-3 rounded-full bg-green-400 shadow-sm"></div>
          </div>
          
          <!-- Address Bar -->
          <div class="flex-1 bg-white px-3 py-1.5 rounded-md text-gray-500 border border-gray-200/80 flex items-center gap-1.5 text-[11px] mx-4 shadow-sm select-none">
            <span class="material-symbols-outlined text-[13px] text-gray-400">lock</span>
            <span class="text-gray-500 font-sans tracking-wide">http://localhost:3000/</span>
          </div>
          
          <!-- Refresh -->
          <span id="refresh-preview-modal" class="material-symbols-outlined text-[15px] text-gray-400 cursor-pointer hover:rotate-180 transition-transform duration-500 p-1 hover:bg-gray-100 rounded">refresh</span>
        </div>
        
        <!-- Preview Content -->
        <div class="h-[340px] flex flex-col bg-[#f8fafc]" id="preview-modal-body">
          ${renderPreviewModalContent()}
        </div>
      </div>
    </div>`;

  document.body.insertAdjacentHTML('beforeend', modalHtml);
  
  // Scale window in smoothly
  setTimeout(() => {
    const win = document.getElementById('preview-modal-window');
    if (win) {
      win.classList.remove('scale-95');
      win.classList.add('scale-100');
    }
  }, 10);

  // Bind close buttons (closes preview and stops run)
  const closeBtn = document.getElementById('close-preview-modal');
  closeBtn?.addEventListener('click', () => {
    // Suspend engine when preview popup is closed
    if (isEngineRunning) {
      isEngineRunning = false;
      showToast("Suspending Arora Engine...", "error");
      updateRunBtnUI();
    }
    closePreviewModal();
  });

  const overlay = document.getElementById('preview-modal-overlay');
  overlay?.addEventListener('click', (e) => {
    if (e.target === overlay) {
      if (isEngineRunning) {
        isEngineRunning = false;
        showToast("Suspending Arora Engine...", "error");
        updateRunBtnUI();
      }
      closePreviewModal();
    }
  });

  const refreshBtn = document.getElementById('refresh-preview-modal');
  refreshBtn?.addEventListener('click', () => {
    showToast("Refreshing preview window...", "success");
    updatePreviewModalUI();
  });
}

function updatePreviewModalUI() {
  const body = document.getElementById('preview-modal-body');
  if (body) {
    body.innerHTML = renderPreviewModalContent();
  }
}

function closePreviewModal() {
  const overlay = document.getElementById('preview-modal-overlay');
  const win = document.getElementById('preview-modal-window');
  if (win) {
    win.classList.remove('scale-100');
    win.classList.add('scale-95');
  }
  setTimeout(() => {
    overlay?.remove();
  }, 150);
}

// ═══════════════════════════════════════════════
// STABILIZED WINDOWS COMPATIBLE ZIP FILE GENERATOR
// ═══════════════════════════════════════════════
async function downloadFilesAsZip() {
  if (typeof JSZip === 'undefined') {
    showToast("JSZip library is loading. Please try again.", "error");
    return;
  }
  
  showToast("Preparing ZIP file...", "success");
  const zip = new JSZip();
  
  // Windows Explorer Compatibility: Explicitly create parent subfolder nodes
  const srcFolder = zip.folder("src");
  
  // Write workspace files dynamically into directory entries
  for (const rawPath in projectRawFiles) {
    if (rawPath.startsWith("src/")) {
      const fileName = rawPath.substring(4);
      srcFolder.file(fileName, projectRawFiles[rawPath]);
    } else {
      zip.file(rawPath, projectRawFiles[rawPath]);
    }
  }
  
  try {
    const blob = await zip.generateAsync({ 
      type: "blob",
      mimeType: "application/zip",
      compression: "DEFLATE",
      compressionOptions: { level: 9 }
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "project-alpha.zip";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast("Download started: project-alpha.zip", "success");
  } catch (err) {
    console.error("ZIP Generation failed", err);
    showToast("Failed to generate ZIP file.", "error");
  }
}
