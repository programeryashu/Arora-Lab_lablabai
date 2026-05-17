// ═══════════════════════════════════════════════
// ARORA LAB — AI Response Engine (Enhanced)
// Orchestrates dynamic conversational AI with streaming
// ═══════════════════════════════════════════════

import { renderIdleView } from './views/idle.js';
import { renderEditorView } from './views/editor.js';
import { renderExecutionView } from './views/execution.js';
import { api } from './api.js';
import { navigateTo, setActiveProject } from './main.js';
import { IBMBobService } from '../services/ibmBobService.js';

const ibmBobService = new IBMBobService();

// ── Configuration ──
const CONFIG = {
  BASE_URL: 'http://localhost:8000',
  MODEL: 'meta/llama-3.3-70b-instruct', // Default high-perf model
  DEBUG: true
};

// ── Message History & Persistence ──
let messageHistory = JSON.parse(sessionStorage.getItem('arora_chat_history') || '[]');

function saveHistory() {
  sessionStorage.setItem('arora_chat_history', JSON.stringify(messageHistory));
}

// ── AI Response Knowledge Base (Legacy fallback) ──
const responses = {
  'status': { icon: 'monitoring', text: '**System Status:**\n• CPU: 42% utilized\n• Memory: 4.2 / 8.0 GB active\n• 3 agents standing by (Coder, Scout, Designer)\n• Last deployment: v1.4.2 (edge) — 12 min ago\n• Uptime: 4h 23m' },
  'bridge': { icon: 'hub', text: '**System Bridge Status:**\n• Handshake: **Active**\n• Connection: **Stable**\n• Protocol: **Secure WebSocket**\n• Telemetry: **Streaming**\n• Latency: **12ms**' },
  'agents': { icon: 'smart_toy', text: '**Active Agents:**\n• **Arora Coder** — Ready\n• **Arora Scout** — Idle\n• **Arora Designer** — Ready\n• **Arora QA** — Standby' },
  'dark mode': { icon: 'dark_mode', text: '🌙 Toggling dark mode...', action: 'toggle-dark' },
  'light mode': { icon: 'light_mode', text: '☀️ Toggling light mode...', action: 'toggle-dark' },
  'clear': { icon: 'delete_sweep', text: '✓ Conversation cleared.', action: 'clear' },
};

// ── Provider Routing Helper ──
function routeProvider(prompt, requestedProvider) {
  if (requestedProvider && requestedProvider !== 'default' && requestedProvider !== 'auto') {
    return requestedProvider;
  }
  
  const lower = prompt.toLowerCase();
  
  // 1. Coding -> DeepSeek
  const codingKeywords = [
    'code', 'function', 'api', 'endpoint', 'css', 'html', 'javascript', 'python', 
    'react', 'tailwind', 'develop', 'program', 'script', 'bug', 'fix', 'refactor', 
    'class', 'implement', 'coding', 'generate ui', 'db schema', 'sql'
  ];
  if (codingKeywords.some(kw => lower.includes(kw))) {
    return 'deepseek';
  }
  
  // 2. IBM BOB -> Research, planning, workflow analysis, documentation, enterprise reasoning
  const bobKeywords = [
    'research', 'analyze', 'workflow', 'document', 'readme', 'plan', 'structured', 
    'enterprise', 'reasoning', 'architecture', 'requirements', 'features', 
    'database design', 'outline', 'proposal', 'spec', 'specification'
  ];
  if (bobKeywords.some(kw => lower.includes(kw))) {
    return 'ibm-bob';
  }
  
  // 3. General -> default
  return 'default';
}

// ── Default AI Caller ──
async function callDefaultAI(prompt, history, onToken, modelOverride) {
  const messages = [
    { role: 'system', content: 'You are Arora Prime, the intelligent orchestrator of Arora Lab. You are concise, technical, and helpful. You manage AI agents, code workflows, and system operations. Use markdown for formatting. If the user asks for code, provide it in code blocks.' },
    ...history.map(m => ({ role: m.type === 'user' ? 'user' : 'assistant', content: m.text })),
    { role: 'user', content: prompt }
  ];

  const model = modelOverride || CONFIG.MODEL;
  
  const response = await fetch(`${CONFIG.BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      messages,
      stream: true
    })
  });

  if (!response.ok) throw new Error(`AI API Error: ${response.statusText}`);

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullText = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split('\n');
    
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        if (data === '[DONE]') break;
        try {
          const json = JSON.parse(data);
          const token = json.choices[0]?.delta?.content || '';
          fullText += token;
          if (onToken) onToken(fullText);
        } catch (e) {}
      }
    }
  }
  return fullText;
}

// ── AI Abstraction ──
async function askAI(prompt, optionsOrHistory, onTokenLegacy) {
  if (CONFIG.DEBUG) console.log('[AI] Requesting response for:', prompt);
  
  let history = [];
  let provider = 'default';
  let callback = onTokenLegacy;

  if (Array.isArray(optionsOrHistory)) {
    history = optionsOrHistory;
  } else if (optionsOrHistory && typeof optionsOrHistory === 'object') {
    history = optionsOrHistory.history || [];
    provider = optionsOrHistory.provider || 'default';
    callback = optionsOrHistory.onToken || onTokenLegacy;
  }

  const resolvedProvider = routeProvider(prompt, provider);
  if (CONFIG.DEBUG) console.log(`[AI] Routed provider: ${resolvedProvider} (requested: ${provider})`);

  if (resolvedProvider === 'ibm-bob') {
    try {
      const messages = [
        { role: 'system', content: 'You are Arora Prime (IBM BOB), the intelligent orchestrator of Arora Lab. You are concise, technical, and helpful. You manage AI agents, code workflows, and system operations. Use markdown for formatting.' },
        ...history.map(m => ({ role: m.type === 'user' ? 'user' : 'assistant', content: m.text })),
        { role: 'user', content: prompt }
      ];

      if (callback) {
        return await ibmBobService.stream(messages, callback);
      } else {
        return await ibmBobService.chat(messages);
      }
    } catch (error) {
      console.warn('[AI] IBM BOB failed, falling back to default provider. Error:', error);
      // Fallback: route to default provider
      return await callDefaultAI(prompt, history, callback);
    }
  } else if (resolvedProvider === 'deepseek') {
    return await callDefaultAI(prompt, history, callback, 'deepseek-ai/deepseek-v4-flash');
  } else {
    return await callDefaultAI(prompt, history, callback);
  }
}

// ── Text Formatter ──
function formatText(text) {
  if (!text) return '';
  return text
    .replace(/```([\s\S]*?)```/g, '<pre class="bg-surface-container/50 p-3 rounded-xl border border-outline-variant my-2 overflow-x-auto text-[12px] font-mono leading-relaxed"><code class="text-secondary">$1</code></pre>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code class="bg-surface-container px-1.5 py-0.5 rounded text-tertiary font-mono text-[12px]">$1</code>')
    .replace(/• /g, '<span class="text-tertiary mr-1">•</span> ');
}

// ── Typewriter Helper for HTML ──
function typewriteHTML(element, htmlText, speed = 8, onComplete) {
  let i = 0;
  element.innerHTML = '';
  
  const cursor = document.createElement('span');
  cursor.className = 'inline-block w-2 h-3.5 bg-tertiary ml-1 animate-pulse';
  cursor.style.verticalAlign = 'middle';
  element.appendChild(cursor);

  function tick() {
    if (i < htmlText.length) {
      if (htmlText.charAt(i) === '<') {
        const closeIndex = htmlText.indexOf('>', i);
        if (closeIndex !== -1) {
          i = closeIndex + 1;
        } else {
          i++;
        }
      } else {
        i++;
      }
      
      const currentHTML = htmlText.substring(0, i);
      element.innerHTML = currentHTML;
      element.appendChild(cursor);
      
      const scrollContainer = document.getElementById('ai-chat-scroll');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
      
      setTimeout(tick, speed);
    } else {
      cursor.remove();
      if (onComplete) onComplete();
    }
  }
  
  tick();
}

// ── Renderers ──
function renderMessage(msg, isUser, isLastMsg = false, isStreaming = false) {
  const text = typeof msg === 'string' ? msg : msg.text;
  const icon = typeof msg === 'string' ? 'person' : (msg.icon || 'psychology');

  if (isUser) {
    return `
      <div class="flex justify-end mb-3">
        <div class="max-w-[85%] bg-tertiary text-on-tertiary px-4 py-2.5 rounded-2xl rounded-br-md text-[14px] leading-relaxed shadow-sm">
          ${text}
        </div>
      </div>`;
  }

  const cursor = isStreaming ? '<span class="inline-block w-2 h-3.5 bg-tertiary ml-1 animate-pulse" style="vertical-align: middle;"></span>' : '';
  const animatedAttr = (isLastMsg && !msg.animated && !isStreaming) ? 'data-animate="true"' : '';

  return `
    <div class="flex gap-3 mb-3 ai-response-panel" ${animatedAttr}>
      <div class="w-7 h-7 rounded-full bg-tertiary-container flex items-center justify-center text-tertiary shrink-0 mt-0.5 border border-tertiary/10">
        <span class="material-symbols-outlined text-[16px]">${icon}</span>
      </div>
      <div class="flex-1 text-[14px] text-on-surface leading-relaxed whitespace-pre-wrap message-content">
        ${formatText(text)}${cursor}
      </div>
    </div>`;
}

function renderTypingIndicator() {
  return `
    <div id="typing-indicator" class="flex gap-3 mb-3 ai-response-panel">
      <div class="w-7 h-7 rounded-full bg-tertiary-container flex items-center justify-center text-tertiary shrink-0 mt-0.5 border border-tertiary/10">
        <span class="material-symbols-outlined text-[16px]">psychology</span>
      </div>
      <div class="flex items-center gap-1 py-2">
        <div class="typing-dots"><span></span><span></span><span></span></div>
      </div>
    </div>`;
}

// ── Main Handler ──
export async function handleCommand(input, container) {
  if (!input.trim()) return;

  const lower = input.toLowerCase().trim();
  container.classList.remove('hidden');

  // 1. Log and Update History
  if (CONFIG.DEBUG) console.log('[AI] Command:', input);
  messageHistory.push({ type: 'user', text: input });
  saveHistory();

  // 2. Initial Render
  renderChat(container, true);

  // 3. Check for Special Project Commands (Preserve logic)
  const isIdea = input.split(' ').length > 4 && !responses[lower];
  if (isIdea || lower.startsWith('generate') || lower.startsWith('create')) {
    await handleProjectCreation(input, container);
    return;
  }

  // 4. Check for Static Command Fallbacks
  if (responses[lower]) {
    const resp = responses[lower];
    setTimeout(() => {
      messageHistory.push({ type: 'ai', icon: resp.icon, text: resp.text });
      saveHistory();
      renderChat(container);
      if (resp.action === 'toggle-dark') document.getElementById('dark-mode-toggle')?.click();
      if (resp.action === 'clear') {
        messageHistory = [];
        saveHistory();
        container.classList.add('hidden');
      }
    }, 400);
    return;
  }

  // 5. Dynamic AI Response with Streaming
  try {
    let currentAIIndex = messageHistory.length;
    messageHistory.push({ type: 'ai', icon: 'psychology', text: '' });
    
    await askAI(input, messageHistory.slice(0, -1), (fullText) => {
      if (CONFIG.DEBUG && fullText.length % 50 === 0) console.log('[Streaming] Tokens received...');
      messageHistory[currentAIIndex].text = fullText;
      messageHistory[currentAIIndex].animated = true; // Mark animated during streaming
      renderChat(container, true, true);
    });

    saveHistory();
    renderChat(container, false, false);
  } catch (error) {
    messageHistory.push({ type: 'ai', icon: 'error', text: `Failed to connect to Arora Prime. Error: ${error.message}` });
    saveHistory();
    renderChat(container);
  }
}

async function handleProjectCreation(input, container) {
  try {
    const lower = input.toLowerCase().trim();
    const idea = (input.split(' ').length > 4 && !responses[lower]) ? input : input.replace(/^(generate|create)\s+/i, '');
    const project = await api.startProject(idea);
    
    setActiveProject(project.project_id, idea);
    
    messageHistory.push({ 
      type: 'ai', 
      icon: 'rocket_launch', 
      text: `🚀 **Project pipeline initiated!**\n\nI've started the autonomous workflow for: *"${idea}"*\n\nID: \`${project.project_id}\`\n\nSwitching you to the **Execution** tab to monitor progress.` 
    });
    
    saveHistory();
    renderChat(container);
    setTimeout(() => navigateTo('execution'), 2000);
  } catch (error) {
    messageHistory.push({ type: 'ai', icon: 'error', text: `Failed to initiate project. ${error.message}` });
    saveHistory();
    renderChat(container);
  }
}

function renderChat(container, showTyping = false, isStreaming = false) {
  const scrollId = 'ai-chat-scroll';
  container.innerHTML = `
    <div class="glass-panel rounded-2xl p-4 max-h-[400px] overflow-y-auto space-y-0" id="${scrollId}">
      ${messageHistory.map((m, idx) => {
        const isLast = idx === messageHistory.length - 1;
        return renderMessage(m, m.type === 'user', isLast, isLast && isStreaming);
      }).join('')}
      ${showTyping && !messageHistory[messageHistory.length-1]?.text ? renderTypingIndicator() : ''}
    </div>`;
  
  const scroll = document.getElementById(scrollId);
  if (scroll) scroll.scrollTop = scroll.scrollHeight;

  const animateEl = container.querySelector('[data-animate="true"]');
  if (animateEl) {
    const lastMsgIndex = messageHistory.length - 1;
    const msg = messageHistory[lastMsgIndex];
    if (msg && !msg.animated) {
      msg.animated = true;
      const contentEl = animateEl.querySelector('.message-content');
      if (contentEl) {
        const fullHTML = formatText(msg.text);
        typewriteHTML(contentEl, fullHTML, 8, () => {
          saveHistory();
        });
      }
    }
  }
}

export function clearHistory(container) {
  messageHistory = [];
  saveHistory();
  if (container) {
    container.classList.add('hidden');
    container.innerHTML = '';
  }
}

export function startNewChat(container) {
  messageHistory = [{
    type: 'ai',
    icon: 'auto_awesome',
    text: 'Context cleared. Awaiting new instructions...'
  }];
  saveHistory();
  if (container) {
    container.classList.remove('hidden');
    renderChat(container);
  }
}
