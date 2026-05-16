// ═══════════════════════════════════════════════
// ARORA LAB — Workers View
// Manage and deploy custom AI agents
// ═══════════════════════════════════════════════

import { api } from '../api.js';

const defaultWorkers = [
  { id: '1', name: 'Arora Scout', role: 'Research & Discovery', prompt: 'You are Arora Scout. Your goal is to research topics deeply and provide structured summaries.', apiKey: 'sk-arora-sct-9x8y7z6w5v', status: 'idle' },
  { id: '2', name: 'Arora Coder', role: 'Full-stack Engineering', prompt: 'You are Arora Coder. You write clean, performant, and modern code following best practices.', apiKey: 'sk-arora-cdr-4a3b2c1d0e', status: 'idle' },
  { id: '3', name: 'Arora Designer', role: 'UI/UX & Aesthetics', prompt: 'You are Arora Designer. You focus on premium visuals, accessibility, and modern design trends.', apiKey: 'sk-arora-dsg-7m8n9p0q1r', status: 'idle' },
  { id: '4', name: 'Arora Growth', role: 'Documentation & Marketing', prompt: 'You are Arora Growth. You specialize in creating compelling documentation, marketing copy, and user acquisition strategies.', apiKey: 'sk-arora-grw-2h3j4k5l6m', status: 'idle' },
  { id: '5', name: 'Arora Flow', role: 'Workflow & Automation', prompt: 'You are Arora Flow. You design and implement seamless automated workflows and CI/CD pipelines.', apiKey: 'sk-arora-flw-5u6v7w8x9y', status: 'idle' },
  { id: '6', name: 'Arora QA', role: 'Security & Testing', prompt: 'You are Arora QA. You rigorously test applications, ensure security compliance, and maintain high quality standards.', apiKey: 'sk-arora-qaa-0t1s2r3q4p', status: 'idle' },
  { id: '7', name: 'Arora Analytics', role: 'Data & Analytics', prompt: 'You are Arora Analytics. You analyze data patterns, generate insights, and provide actionable intelligence.', apiKey: 'sk-arora-anl-3f4g5h6j7k', status: 'idle' }
];

let workers = JSON.parse(localStorage.getItem('arora-workers')) || defaultWorkers;

// Migration: Ensure Arora Prime agents are present with API keys
if (!localStorage.getItem('arora-prime-migrated-v2')) {
  workers = defaultWorkers;
  localStorage.setItem('arora-workers', JSON.stringify(workers));
  localStorage.setItem('arora-prime-migrated-v2', 'true');
}

export function renderWorkersView() {
  return `
    <div class="flex-1 flex flex-col p-6 md:p-10 overflow-y-auto">
      <div class="max-w-6xl mx-auto w-full">
        
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 class="text-display-lg text-on-surface font-bold tracking-tight">Agent Workers</h1>
            <p class="text-body-lg text-on-surface-variant mt-2 max-w-2xl">
              Deploy and orchestrate specialized Arora agents. Each worker operates within its own defined boundaries and utilizes its own intelligence credentials.
            </p>
          </div>
          <button id="btn-add-worker" class="bg-tertiary text-on-tertiary px-6 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-lg shadow-tertiary/20 hover:bg-on-tertiary-fixed-variant transition-all shrink-0">
            <span class="material-symbols-outlined">person_add</span>
            Add Worker
          </button>
        </div>

        <!-- Workers Grid -->
        <div id="workers-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          ${renderWorkersList()}
        </div>

      </div>
    </div>
  `;
}

function renderWorkersList() {
  if (workers.length === 0) {
    return `
      <div class="col-span-full py-20 flex flex-col items-center justify-center text-center bg-surface-container-low rounded-[32px] border-2 border-dashed border-outline-variant/30">
        <div class="w-16 h-16 rounded-2xl bg-surface-variant flex items-center justify-center text-on-surface-variant mb-4">
          <span class="material-symbols-outlined text-4xl">group_off</span>
        </div>
        <h3 class="text-headline-md text-on-surface font-bold">No active workers</h3>
        <p class="text-on-surface-variant mt-2">Initialize your first specialized agent to get started.</p>
      </div>
    `;
  }

  return workers.map(worker => `
    <div class="glass-panel rounded-[28px] p-6 border border-outline-variant/20 relative group hover:border-tertiary/30 transition-all">
      <div class="flex items-start justify-between mb-6">
        <div class="w-12 h-12 rounded-2xl bg-tertiary-container flex items-center justify-center text-tertiary border border-tertiary/10 shadow-sm">
          <span class="material-symbols-outlined text-[28px]">smart_toy</span>
        </div>
        <div class="flex gap-1">
          <button class="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-variant rounded-xl transition-all btn-invoke-worker" data-id="${worker.id}" title="Invoke Worker">
            <span class="material-symbols-outlined text-[20px]">play_arrow</span>
          </button>
          <button class="p-2 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-xl transition-all btn-remove-worker" data-id="${worker.id}" title="Remove Worker">
            <span class="material-symbols-outlined text-[20px]">delete</span>
          </button>
        </div>
      </div>

      <div class="mb-4">
        <h3 class="text-[20px] font-bold text-on-surface">${worker.name}</h3>
        <p class="text-label-sm text-tertiary font-bold uppercase tracking-widest mt-1">${worker.role}</p>
      </div>

      <div class="bg-surface-container-low rounded-xl p-4 mb-4">
        <p class="text-[14px] text-on-surface leading-relaxed italic opacity-90">
          "${worker.prompt}"
        </p>
      </div>

      <div class="flex items-center justify-between pt-4 border-t border-outline-variant/10">
        ${renderWorkerStatus(worker.status || 'idle')}
        <span class="text-[12px] font-mono text-on-surface-variant bg-surface-container-high px-2 py-1 rounded font-semibold border border-outline-variant/30">API: ${worker.apiKey.slice(0, 4)}***</span>
      </div>
    </div>
  `).join('');
}

function renderWorkerStatus(status) {
  if (status === 'working') {
    return `
      <div class="flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-[#fbbc04] animate-pulse shadow-[0_0_6px_rgba(251,188,4,0.6)]"></span>
        <span class="text-label-sm text-[#fbbc04] font-medium">Processing task...</span>
      </div>
    `;
  } else if (status === 'error') {
    return `
      <div class="flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-error shadow-[0_0_6px_rgba(186,26,26,0.6)]"></span>
        <span class="text-label-sm text-error font-medium">System Error</span>
      </div>
    `;
  }
  
  // idle (default)
  return `
    <div class="flex items-center gap-2">
      <span class="w-2 h-2 rounded-full bg-tertiary"></span>
      <span class="text-label-sm text-on-surface-variant font-medium">Ready for deployment</span>
    </div>
  `;
}

export function initWorkersView() {
  const grid = document.getElementById('workers-grid');
  const btnAdd = document.getElementById('btn-add-worker');
  const modal = document.getElementById('worker-modal');
  const overlay = document.getElementById('worker-modal-overlay');
  const btnClose = document.getElementById('close-worker-modal');
  const form = document.getElementById('worker-form');

  // Modal logic
  btnAdd?.addEventListener('click', () => modal.classList.remove('hidden'));
  btnClose?.addEventListener('click', () => modal.classList.add('hidden'));
  overlay?.addEventListener('click', () => modal.classList.add('hidden'));

  // Form submission
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const newWorker = {
      id: Date.now().toString(),
      name: document.getElementById('worker-name').value,
      role: document.getElementById('worker-role').value,
      prompt: document.getElementById('worker-prompt').value,
      apiKey: document.getElementById('worker-api-key').value,
    };

    workers.push(newWorker);
    saveWorkers();
    renderAll();
    modal.classList.add('hidden');
    form.reset();
  });

  // Event delegation for remove and invoke
  grid?.addEventListener('click', (e) => {
    const removeBtn = e.target.closest('.btn-remove-worker');
    if (removeBtn) {
      const id = removeBtn.dataset.id;
      workers = workers.filter(w => w.id !== id);
      saveWorkers();
      renderAll();
    }

    const invokeBtn = e.target.closest('.btn-invoke-worker');
    if (invokeBtn) {
      const id = invokeBtn.dataset.id;
      const worker = workers.find(w => w.id === id);
      invokeWorker(worker);
    }
  });
}

function saveWorkers() {
  localStorage.setItem('arora-workers', JSON.stringify(workers));
}

function renderAll() {
  const grid = document.getElementById('workers-grid');
  if (grid) grid.innerHTML = renderWorkersList();
}

async function invokeWorker(worker) {
  // Use the stored API key to trigger the agent
  console.log(`Invoking ${worker.name} with custom key...`);
  
  // Set status to working and re-render
  worker.status = 'working';
  renderAll();
  
  try {
    const result = await api.runWorker(worker.name, worker.prompt, worker.apiKey);
    console.log('Worker result:', result);
    
    // Set status back to idle
    worker.status = 'idle';
    renderAll();
    
    // Show a success notification
    setTimeout(() => {
      if (window.showToast) {
        window.showToast(`✓ ${worker.name} invoked successfully!`, 'success');
      } else {
        alert(`✓ ${worker.name} invoked successfully!\n\n${result.message}`);
      }
    }, 100);
  } catch (error) {
    console.error('Failed to invoke worker:', error);
    
    // Set status to error
    worker.status = 'error';
    renderAll();
    
    setTimeout(() => {
      if (window.showToast) {
        window.showToast(`Error: Failed to invoke ${worker.name}.`, 'error');
      } else {
        alert(`Error: Failed to invoke ${worker.name}. Make sure the backend is running.`);
      }
      // Reset after acknowledging error
      worker.status = 'idle';
      renderAll();
    }, 100);
  }
}
