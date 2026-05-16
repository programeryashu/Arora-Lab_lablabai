// ═══════════════════════════════════════════════
// ARORA OS — Editor View (Pop Up & ZIP Stabilized)
// Premium code editor featuring auto-popup preview & ZIP exporter
// ═══════════════════════════════════════════════

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

function fileExplorer() {
  return `
    <aside class="hidden lg:flex flex-col w-56 glass-panel rounded-xl overflow-hidden shrink-0">
      <div class="p-3 border-b border-white/20 bg-white/30 flex justify-between items-center">
        <span class="text-[10px] uppercase text-on-surface-variant tracking-wider font-bold">Files</span>
        <div class="flex gap-1.5 items-center">
          <span id="download-zip-btn" class="material-symbols-outlined text-[16px] text-on-surface-variant cursor-pointer hover:text-on-surface" title="Download ZIP file">download</span>
          <span class="material-symbols-outlined text-[14px] text-on-surface-variant cursor-pointer hover:text-on-surface">note_add</span>
          <span class="material-symbols-outlined text-[14px] text-on-surface-variant cursor-pointer hover:text-on-surface">create_new_folder</span>
        </div>
      </div>
      <div class="flex-1 overflow-y-auto py-2 px-2">
        <div class="flex items-center px-2 py-1.5 text-on-surface hover:bg-white/50 rounded-lg cursor-pointer">
          <span class="material-symbols-outlined text-[16px] text-on-surface-variant mr-1">keyboard_arrow_down</span>
          <span class="material-symbols-outlined text-[16px] text-on-surface-variant mr-2">folder</span>
          <span class="text-[14px] font-medium">src</span>
        </div>
        <div class="pl-6 flex flex-col gap-0.5">
          <!-- index.ts -->
          <div data-file="index.ts" class="explorer-file flex items-center justify-between px-2 py-1.5 text-tertiary bg-white/60 shadow-sm rounded-lg cursor-pointer relative transition-all">
            <div class="absolute -left-3 w-1.5 h-1.5 rounded-full bg-tertiary ai-active-dot"></div>
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-[14px] text-tertiary">data_object</span>
              <span class="text-[14px] font-medium">index.ts</span>
            </div>
            <div class="flex items-end gap-[1px] h-3 opacity-60">
              <div class="w-1 bg-tertiary/60 rounded-t-sm animate-pulse" style="height:40%"></div>
              <div class="w-1 bg-tertiary/60 rounded-t-sm animate-pulse" style="height:80%;animation-delay:.2s"></div>
              <div class="w-1 bg-tertiary/60 rounded-t-sm animate-pulse" style="height:60%;animation-delay:.4s"></div>
            </div>
          </div>
          <!-- style.css -->
          <div data-file="style.css" class="explorer-file flex items-center px-2 py-1.5 text-on-surface-variant hover:bg-white/50 rounded-lg cursor-pointer transition-all">
            <span class="material-symbols-outlined text-[14px] text-indigo-400 mr-2">css</span>
            <span class="text-[14px]">style.css</span>
          </div>
          <!-- index.html -->
          <div data-file="index.html" class="explorer-file flex items-center px-2 py-1.5 text-on-surface-variant hover:bg-white/50 rounded-lg cursor-pointer transition-all">
            <span class="material-symbols-outlined text-[14px] text-orange-400 mr-2">html</span>
            <span class="text-[14px]">index.html</span>
          </div>
        </div>
        <!-- package.json -->
        <div data-file="package.json" class="explorer-file flex items-center px-2 py-1.5 mt-1 text-on-surface-variant hover:bg-white/50 rounded-lg cursor-pointer transition-all">
          <span class="material-symbols-outlined text-[14px] text-on-surface-variant mr-2">description</span>
          <span class="text-[14px]">package.json</span>
        </div>
        <!-- README.md -->
        <div data-file="README.md" class="explorer-file flex items-center px-2 py-1.5 mt-1 text-on-surface-variant hover:bg-white/50 rounded-lg cursor-pointer transition-all">
          <span class="material-symbols-outlined text-[14px] text-on-surface-variant mr-2">description</span>
          <span class="text-[14px]">README.md</span>
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
      <div class="flex border-b border-outline-variant/20 bg-surface-container-low/50 overflow-x-auto items-center pr-4 shrink-0">
        <!-- Editor Tabs -->
        <div class="flex flex-1" id="editor-tabs">
          <div data-tab="index.ts" class="editor-tab active flex items-center gap-2 px-4 py-2.5 bg-white border-t-2 border-tertiary border-r border-outline-variant/20 text-on-surface min-w-max cursor-pointer">
            <span class="material-symbols-outlined text-[14px] text-tertiary">data_object</span>
            <span class="text-[14px] font-medium">index.ts</span>
            <button class="ml-2 text-on-surface-variant hover:text-on-surface rounded-full p-0.5 hover:bg-surface-variant"><span class="material-symbols-outlined text-[14px]">close</span></button>
          </div>
          <div data-tab="style.css" class="editor-tab flex items-center gap-2 px-4 py-2.5 border-r border-outline-variant/20 text-on-surface-variant hover:bg-white hover:text-on-surface min-w-max cursor-pointer transition-colors">
            <span class="material-symbols-outlined text-[14px] text-indigo-400">css</span>
            <span class="text-[14px]">style.css</span>
          </div>
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
        <div class="relative z-10">
          <h3 class="text-[14px] text-on-surface font-bold mb-0.5">Deployment Successful</h3>
          <p class="text-[12px] text-on-surface-variant">v1.4.2 deployed to edge</p>
          <a class="text-[12px] text-tertiary mt-1 inline-flex items-center gap-1 hover:underline font-medium" href="#">View Logs <span class="material-symbols-outlined text-[12px]">open_in_new</span></a>
        </div>
      </div>
      <div class="flex-1 glass-panel rounded-xl overflow-hidden flex flex-col">
        <div class="px-4 py-3 border-b border-white/20 bg-white/30 flex justify-between items-center">
          <h4 class="text-[10px] uppercase text-on-surface-variant tracking-wider font-bold">Documentation</h4>
          <button class="text-on-surface-variant hover:text-on-surface"><span class="material-symbols-outlined text-[14px]">edit</span></button>
        </div>
        <div class="flex-1 overflow-y-auto p-4">
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
// VIEW INITIALIZER
// ═══════════════════════════════════════════════
export function initEditorView() {
  // 1. Initial Render
  switchTab(activeTab);

  // 2. Setup run button state
  updateRunBtnUI();

  // 3. Tab switching listeners
  document.querySelectorAll('.editor-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const tabName = tab.dataset.tab;
      switchTab(tabName);
    });
  });

  // 4. File Explorer switching listeners
  document.querySelectorAll('.explorer-file').forEach(fileEl => {
    fileEl.addEventListener('click', () => {
      const fileName = fileEl.dataset.file;
      
      // Update explorer style classes
      document.querySelectorAll('.explorer-file').forEach(el => {
        el.className = "explorer-file flex items-center px-2 py-1.5 text-on-surface-variant hover:bg-white/50 rounded-lg cursor-pointer transition-all";
        const dot = el.querySelector('.ai-active-dot');
        if (dot) dot.remove();
        const pulse = el.querySelector('.h-3');
        if (pulse) pulse.remove();
      });

      fileEl.className = "explorer-file flex items-center justify-between px-2 py-1.5 text-tertiary bg-white/60 shadow-sm rounded-lg cursor-pointer relative transition-all";
      fileEl.insertAdjacentHTML('afterbegin', '<div class="absolute -left-3 w-1.5 h-1.5 rounded-full bg-tertiary ai-active-dot"></div>');
      fileEl.insertAdjacentHTML('beforeend', `
        <div class="flex items-end gap-[1px] h-3 opacity-60">
          <div class="w-1 bg-tertiary/60 rounded-t-sm animate-pulse" style="height:40%"></div>
          <div class="w-1 bg-tertiary/60 rounded-t-sm animate-pulse" style="height:80%;animation-delay:.2s"></div>
          <div class="w-1 bg-tertiary/60 rounded-t-sm animate-pulse" style="height:60%;animation-delay:.4s"></div>
        </div>
      `);

      switchTab(fileName);
    });
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

function switchTab(tabName) {
  activeTab = tabName;
  const container = document.getElementById('editor-code-container');
  if (!container) return;

  // Update tabs header styling
  document.querySelectorAll('.editor-tab').forEach(tab => {
    const isCurrent = tab.dataset.tab === tabName;
    tab.className = isCurrent
      ? "editor-tab active flex items-center gap-2 px-4 py-2.5 bg-white border-t-2 border-tertiary border-r border-outline-variant/20 text-on-surface min-w-max cursor-pointer"
      : "editor-tab flex items-center gap-2 px-4 py-2.5 border-r border-outline-variant/20 text-on-surface-variant hover:bg-white hover:text-on-surface min-w-max cursor-pointer transition-colors";
  });

  renderCodeTab(tabName);
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
  
  // Write workspace files into parent directory entries
  srcFolder.file("index.ts", projectRawFiles['src/index.ts']);
  srcFolder.file("style.css", projectRawFiles['src/style.css']);
  srcFolder.file("index.html", projectRawFiles['src/index.html']);
  
  zip.file("package.json", projectRawFiles['package.json']);
  zip.file("README.md", projectRawFiles['README.md']);
  
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
