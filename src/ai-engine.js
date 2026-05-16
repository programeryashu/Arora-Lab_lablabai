// ═══════════════════════════════════════════════
// ARORA OS — AI Response Engine
// Simulates intelligent command-bar responses
// ═══════════════════════════════════════════════

// ── AI Response Knowledge Base ──
const responses = {
  // Greetings
  'hello': { icon: 'waving_hand', text: 'Hey there, Founder! I\'m Arora — your ambient AI workspace. Ask me anything about your projects, agents, or just chat.' },
  'hi': { icon: 'waving_hand', text: 'Hello! Arora Prime is online and ready. What would you like to work on today?' },
  'hey': { icon: 'waving_hand', text: 'Hey! All systems are running smoothly. What\'s on your mind?' },

  // Status commands
  'status': { icon: 'monitoring', text: '**System Status:**\n• CPU: 42% utilized\n• Memory: 4.2 / 8.0 GB active\n• 3 agents standing by (Coder, Scout, Designer)\n• Last deployment: v1.4.2 (edge) — 12 min ago\n• Uptime: 4h 23m' },
  'agents': { icon: 'smart_toy', text: '**Active Agents:**\n• **Arora Coder** — Ready (last task: index.ts refactor)\n• **Arora Scout** — Idle (last scan: 2h ago)\n• **Arora Designer** — Ready (last output: UI mockup v3)\n• **Arora QA** — Standby\n\nType `deploy coder` to assign a task.' },

  // Actions
  'deploy': { icon: 'rocket_launch', text: '🚀 **Deployment initiated.**\nBuilding production bundle... compiling assets... optimizing images...\n\n✓ Bundle size: 142kb (gzipped)\n✓ Edge nodes: 12 regions\n✓ Estimated propagation: ~30s\n\nDeployment ID: `deploy-a7x9k2`' },
  'run': { icon: 'play_circle', text: '▶️ **Execution started.**\nSpinning up workflow engine v2.4...\nLoading context from Project Alpha (1.2MB)...\n\nSwitch to the **Execution** tab to monitor progress.' },
  'build': { icon: 'construction', text: '🔨 **Build started.**\n\nCompiling TypeScript → JavaScript...\nProcessing 24 source files...\nTree-shaking unused exports...\n\n✓ Build complete in 2.1s\n✓ 0 errors, 0 warnings' },
  'test': { icon: 'bug_report', text: '🧪 **Running test suite...**\n\n✓ 47 tests passed\n✗ 2 tests failed:\n  — `agent.memory.test.ts:34` — Expected 4, got 3\n  — `router.path.test.ts:12` — Timeout exceeded\n\nCoverage: 89.2%' },

  // Knowledge
  'help': { icon: 'help', text: '**Available Commands:**\n• `status` — System health overview\n• `agents` — List active AI agents\n• `deploy` — Trigger deployment\n• `run` — Start workflow execution\n• `build` — Build production bundle\n• `test` — Run test suite\n• `dark mode` — Toggle dark/light theme\n• `clear` — Clear chat history\n\nOr just ask me anything in natural language!' },
  'dark mode': { icon: 'dark_mode', text: '🌙 Toggling dark mode...', action: 'toggle-dark' },
  'light mode': { icon: 'light_mode', text: '☀️ Toggling light mode...', action: 'toggle-dark' },
  'clear': { icon: 'delete_sweep', text: '✓ Conversation cleared.', action: 'clear' },

  // About
  'who are you': { icon: 'psychology', text: 'I\'m **Arora** — an ambient AI operating system built by **YA Labs**. I orchestrate intelligent agents, manage code workflows, and keep your development environment running at peak performance.\n\nThink of me as your always-on AI co-pilot.' },
  'what can you do': { icon: 'auto_awesome', text: 'I can:\n• 🤖 Manage and deploy AI agents\n• 📝 Help write and review code\n• 🚀 Trigger builds and deployments\n• 📊 Monitor system health\n• 🧠 Maintain context across sessions\n• 🎨 Generate UI components\n\nJust type naturally or use commands like `status`, `deploy`, `test`.' },
};

// ── Fuzzy Matcher ──
function findBestMatch(input) {
  const lower = input.toLowerCase().trim();

  // Exact match
  if (responses[lower]) return responses[lower];

  // Partial match (starts with)
  for (const [key, val] of Object.entries(responses)) {
    if (lower.startsWith(key) || key.startsWith(lower)) return val;
  }

  // Keyword match
  const keywords = {
    'deploy': ['deploy', 'push', 'ship', 'release', 'publish'],
    'status': ['status', 'health', 'how are', 'system', 'overview'],
    'agents': ['agent', 'worker', 'bot', 'assistant'],
    'run': ['run', 'execute', 'start', 'launch', 'go'],
    'build': ['build', 'compile', 'bundle'],
    'test': ['test', 'spec', 'coverage', 'check'],
    'help': ['help', 'command', 'what can', 'how to', 'guide'],
    'hello': ['hello', 'hi', 'hey', 'sup', 'yo', 'good morning', 'good evening'],
    'who are you': ['who are', 'what are', 'about you', 'your name'],
  };

  for (const [key, words] of Object.entries(keywords)) {
    if (words.some(w => lower.includes(w))) return responses[key];
  }

  // Default fallback — contextual
  return {
    icon: 'psychology',
    text: `I understand you're asking about: *"${input}"*\n\nI'm processing this through my knowledge base. Here's what I can suggest:\n\n• Try \`help\` for available commands\n• Ask about \`status\`, \`agents\`, or \`deploy\`\n• Or describe what you need in more detail\n\n*Arora Prime is always learning.*`
  };
}

// ── Message History ──
let messageHistory = [];

// ── Render Functions ──
function formatText(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code class="bg-surface-container px-1.5 py-0.5 rounded text-tertiary font-mono text-[12px]">$1</code>')
    .replace(/\n/g, '<br>')
    .replace(/• /g, '<span class="text-tertiary mr-1">•</span> ');
}

function renderMessage(msg, isUser) {
  if (isUser) {
    return `
      <div class="flex justify-end mb-3">
        <div class="max-w-[85%] bg-tertiary text-on-tertiary px-4 py-2.5 rounded-2xl rounded-br-md text-[14px] leading-relaxed shadow-sm">
          ${msg}
        </div>
      </div>`;
  }
  return `
    <div class="flex gap-3 mb-3 ai-response-panel">
      <div class="w-7 h-7 rounded-full bg-tertiary-container flex items-center justify-center text-tertiary shrink-0 mt-0.5 border border-tertiary/10">
        <span class="material-symbols-outlined text-[16px]">${msg.icon}</span>
      </div>
      <div class="flex-1 text-[14px] text-on-surface leading-relaxed">
        ${formatText(msg.text)}
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
export function handleCommand(input, container) {
  if (!input.trim()) return;

  // Show container
  container.classList.remove('hidden');

  // Add user message
  messageHistory.push({ type: 'user', text: input });

  // Find response
  const response = findBestMatch(input);

  // Render all messages + typing indicator
  container.innerHTML = `
    <div class="glass-panel rounded-2xl p-4 max-h-[300px] overflow-y-auto space-y-0" id="ai-chat-scroll">
      ${messageHistory.map(m => m.type === 'user' ? renderMessage(m.text, true) : renderMessage(m, false)).join('')}
      ${renderTypingIndicator()}
    </div>`;

  // Scroll to bottom
  const scroll = document.getElementById('ai-chat-scroll');
  scroll.scrollTop = scroll.scrollHeight;

  // Simulate typing delay then show response
  const delay = 600 + Math.random() * 800;
  setTimeout(() => {
    messageHistory.push({ type: 'ai', icon: response.icon, text: response.text });

    container.innerHTML = `
      <div class="glass-panel rounded-2xl p-4 max-h-[300px] overflow-y-auto space-y-0" id="ai-chat-scroll">
        ${messageHistory.map(m => m.type === 'user' ? renderMessage(m.text, true) : renderMessage(m, false)).join('')}
      </div>`;

    const scroll2 = document.getElementById('ai-chat-scroll');
    scroll2.scrollTop = scroll2.scrollHeight;

    // Handle special actions
    if (response.action === 'toggle-dark') {
      setTimeout(() => document.getElementById('dark-mode-toggle')?.click(), 400);
    }
    if (response.action === 'clear') {
      setTimeout(() => {
        messageHistory = [];
        container.classList.add('hidden');
        container.innerHTML = '';
      }, 600);
    }
  }, delay);
}

export function clearHistory(container) {
  messageHistory = [];
  if (container) {
    container.classList.add('hidden');
    container.innerHTML = '';
  }
}
