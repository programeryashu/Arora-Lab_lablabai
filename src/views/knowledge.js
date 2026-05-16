// ═══════════════════════════════════════════════
// ARORA OS — Knowledge Base View
// ═══════════════════════════════════════════════

let knowledgeBase = JSON.parse(localStorage.getItem('arora-knowledge')) || [
  { id: '1', title: 'System Architecture', desc: 'Core principles and structural design of Arora OS.', type: 'architecture', date: new Date().toLocaleDateString() },
  { id: '2', title: 'API Documentation', desc: 'Reference for internal and external service integrations.', type: 'api', date: new Date().toLocaleDateString() },
  { id: '3', title: 'Research Notes', desc: 'Compiled data from autonomous web research agents.', type: 'document', date: new Date().toLocaleDateString() },
  { id: '4', title: 'Design Tokens', desc: 'Visual system variables and style guidelines.', type: 'palette', date: new Date().toLocaleDateString() }
];

export function renderKnowledgeView() {
  return `
    <div class="flex-1 flex flex-col p-6 md:p-10 overflow-y-auto">
      <div class="max-w-6xl mx-auto w-full">
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 class="text-display-lg text-on-surface font-bold tracking-tight">Knowledge Base</h1>
            <p class="text-body-lg text-on-surface-variant mt-2 max-w-2xl">
              Manage your project's context, research, and indexed knowledge.
            </p>
          </div>
          <button id="btn-add-knowledge" class="bg-tertiary text-on-tertiary px-6 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-lg shadow-tertiary/20 hover:bg-on-tertiary-fixed-variant transition-all shrink-0">
            <span class="material-symbols-outlined">library_add</span>
            Add Knowledge
          </button>
        </div>

        <div id="knowledge-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          ${renderKnowledgeList()}
        </div>
      </div>
    </div>

    <!-- Knowledge Modal -->
    <div id="knowledge-modal" class="fixed inset-0 z-[100] flex items-center justify-center hidden">
      <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" id="knowledge-modal-overlay"></div>
      <div class="glass-panel w-full max-w-lg rounded-3xl p-8 relative z-10 shadow-2xl border border-outline-variant/30 animate-in fade-in zoom-in duration-300">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-tertiary-container flex items-center justify-center text-tertiary">
              <span class="material-symbols-outlined">upload_file</span>
            </div>
            <h2 class="text-headline-md text-on-surface font-bold">Index New Data</h2>
          </div>
          <button id="close-knowledge-modal" class="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/50 rounded-lg transition-all">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <form id="knowledge-form" class="space-y-4">
          <div>
            <label class="block text-label-sm text-on-surface-variant mb-1.5 font-bold uppercase tracking-wider">Title</label>
            <input type="text" id="knowledge-title" placeholder="e.g. Q3 Marketing Plan" required
              class="w-full bg-surface-container border-outline-variant/20 rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-tertiary/20 outline-none transition-all" />
          </div>
          <div>
            <label class="block text-label-sm text-on-surface-variant mb-1.5 font-bold uppercase tracking-wider">Description</label>
            <input type="text" id="knowledge-desc" placeholder="Brief summary of contents" required
              class="w-full bg-surface-container border-outline-variant/20 rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-tertiary/20 outline-none transition-all" />
          </div>
          
          <div class="pt-2 border-t border-outline-variant/20">
            <p class="text-label-sm text-on-surface-variant mb-3 font-bold uppercase tracking-wider">Content Source (Choose One)</p>
            
            <div class="flex flex-col gap-4">
              <!-- Upload Option -->
              <div class="p-4 rounded-xl border border-outline-variant/30 bg-surface/50 hover:bg-surface-variant/20 transition-all relative">
                <label class="flex flex-col items-center justify-center cursor-pointer w-full">
                  <span class="material-symbols-outlined text-3xl text-tertiary mb-2">cloud_upload</span>
                  <span class="text-sm font-medium text-on-surface">Upload from Device</span>
                  <span class="text-xs text-on-surface-variant mt-1" id="file-name-display">PDF, TXT, DOCX, CSV</span>
                  <input type="file" id="knowledge-file" class="hidden" />
                </label>
              </div>
              
              <div class="flex items-center gap-2">
                <div class="h-px bg-outline-variant/20 flex-1"></div>
                <span class="text-xs text-on-surface-variant uppercase font-bold">OR</span>
                <div class="h-px bg-outline-variant/20 flex-1"></div>
              </div>

              <!-- Manual Entry Option -->
              <div>
                <label class="block text-label-sm text-on-surface-variant mb-1.5 font-bold uppercase tracking-wider">Fill Manually (Details)</label>
                <textarea id="knowledge-content" placeholder="Paste or type context details here..." rows="4"
                  class="w-full bg-surface-container border-outline-variant/20 rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-tertiary/20 outline-none transition-all resize-none"></textarea>
              </div>
            </div>
          </div>
          
          <div class="pt-4">
            <button type="submit" class="w-full bg-tertiary text-on-tertiary py-4 px-6 rounded-2xl text-label-md font-bold hover:bg-on-tertiary-fixed-variant transition-all shadow-lg shadow-tertiary/20 flex items-center justify-center gap-2">
              <span class="material-symbols-outlined">add_task</span>
              Index Knowledge
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function renderKnowledgeList() {
  if (knowledgeBase.length === 0) {
    return `
      <div class="col-span-full py-20 flex flex-col items-center justify-center text-center bg-surface-container-low rounded-[32px] border-2 border-dashed border-outline-variant/30">
        <div class="w-16 h-16 rounded-2xl bg-surface-variant flex items-center justify-center text-on-surface-variant mb-4">
          <span class="material-symbols-outlined text-4xl">folder_off</span>
        </div>
        <h3 class="text-headline-md text-on-surface font-bold">No knowledge indexed</h3>
        <p class="text-on-surface-variant mt-2">Upload files or enter details manually to build the agent's context.</p>
      </div>
    `;
  }

  return knowledgeBase.map(item => {
    let icon = 'description';
    if (item.type === 'architecture') icon = 'account_tree';
    if (item.type === 'api') icon = 'api';
    if (item.type === 'palette') icon = 'palette';
    if (item.type === 'upload') icon = 'file_present';

    return `
      <div class="glass-panel rounded-[28px] p-6 border border-outline-variant/20 relative group hover:border-tertiary/30 transition-all">
        <div class="flex items-start justify-between mb-4">
          <div class="w-12 h-12 rounded-2xl bg-surface-container-high flex items-center justify-center text-on-surface-variant group-hover:bg-tertiary/10 group-hover:text-tertiary transition-all shadow-sm">
            <span class="material-symbols-outlined text-[28px]">${icon}</span>
          </div>
          <button class="p-2 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-xl transition-all btn-remove-knowledge" data-id="${item.id}" title="Remove Knowledge">
            <span class="material-symbols-outlined text-[20px]">delete</span>
          </button>
        </div>
        <h3 class="text-[18px] font-bold text-on-surface mb-2">${item.title}</h3>
        <p class="text-[14px] text-on-surface leading-relaxed line-clamp-2 opacity-90">${item.desc}</p>
        <div class="mt-4 pt-4 border-t border-outline-variant/10 flex items-center justify-between">
          <span class="text-[12px] font-mono text-on-surface-variant bg-surface-container-high px-2 py-1 rounded font-semibold border border-outline-variant/30">${item.date}</span>
          <button class="text-tertiary text-label-sm font-bold hover:underline">View</button>
        </div>
      </div>
    `;
  }).join('');
}

function saveKnowledge() {
  localStorage.setItem('arora-knowledge', JSON.stringify(knowledgeBase));
}

function renderAll() {
  const grid = document.getElementById('knowledge-grid');
  if (grid) grid.innerHTML = renderKnowledgeList();
}

export function initKnowledgeView() {
  const btnAdd = document.getElementById('btn-add-knowledge');
  const modal = document.getElementById('knowledge-modal');
  const overlay = document.getElementById('knowledge-modal-overlay');
  const btnClose = document.getElementById('close-knowledge-modal');
  const form = document.getElementById('knowledge-form');
  const fileInput = document.getElementById('knowledge-file');
  const fileNameDisplay = document.getElementById('file-name-display');
  const grid = document.getElementById('knowledge-grid');

  // Modal logic
  btnAdd?.addEventListener('click', () => modal.classList.remove('hidden'));
  btnClose?.addEventListener('click', () => modal.classList.add('hidden'));
  overlay?.addEventListener('click', () => modal.classList.add('hidden'));

  // File selection logic
  fileInput?.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      fileNameDisplay.textContent = e.target.files[0].name;
      fileNameDisplay.classList.add('text-tertiary', 'font-bold');
      // Clear manual text if file is uploaded
      const contentField = document.getElementById('knowledge-content');
      if (contentField) contentField.value = '';
    } else {
      fileNameDisplay.textContent = 'PDF, TXT, DOCX, CSV';
      fileNameDisplay.classList.remove('text-tertiary', 'font-bold');
    }
  });

  // Manual text logic
  document.getElementById('knowledge-content')?.addEventListener('input', (e) => {
    if (e.target.value.trim().length > 0) {
      // Clear file selection if typing manually
      if (fileInput) fileInput.value = '';
      if (fileNameDisplay) {
        fileNameDisplay.textContent = 'PDF, TXT, DOCX, CSV';
        fileNameDisplay.classList.remove('text-tertiary', 'font-bold');
      }
    }
  });

  // Form submission
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const file = fileInput?.files[0];
    const content = document.getElementById('knowledge-content').value;

    if (!file && !content.trim()) {
      if (window.showToast) window.showToast('Please upload a file or enter details manually.', 'error');
      else alert('Please upload a file or enter details manually.');
      return;
    }

    const newItem = {
      id: Date.now().toString(),
      title: document.getElementById('knowledge-title').value,
      desc: document.getElementById('knowledge-desc').value,
      type: file ? 'upload' : 'document',
      date: new Date().toLocaleDateString()
    };

    // Simulated upload/indexing delay
    const originalBtnHTML = btnAdd.innerHTML;
    btnAdd.innerHTML = '<span class="material-symbols-outlined animate-spin">sync</span> Indexing...';
    btnAdd.disabled = true;
    modal.classList.add('hidden');

    setTimeout(() => {
      knowledgeBase.push(newItem);
      saveKnowledge();
      renderAll();
      form.reset();
      fileNameDisplay.textContent = 'PDF, TXT, DOCX, CSV';
      fileNameDisplay.classList.remove('text-tertiary', 'font-bold');
      
      btnAdd.innerHTML = originalBtnHTML;
      btnAdd.disabled = false;

      if (window.showToast) {
        window.showToast(`✓ "${newItem.title}" added to Knowledge Base!`, 'success');
      }
    }, 800);
  });

  // Event delegation for remove
  grid?.addEventListener('click', (e) => {
    const removeBtn = e.target.closest('.btn-remove-knowledge');
    if (removeBtn) {
      const id = removeBtn.dataset.id;
      knowledgeBase = knowledgeBase.filter(w => w.id !== id);
      saveKnowledge();
      renderAll();
      if (window.showToast) window.showToast('Knowledge item deleted', 'success');
    }
  });
}
