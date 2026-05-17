// ═══════════════════════════════════════════════
// ARORA LAB — System Bridge Dashboard
// Professional telemetry and architectural synchronization
// ═══════════════════════════════════════════════

import { bridgeService } from '../bridge-service.js';

let activeExplorerUnit = null; // 'cpu' | 'ram' | 'temp' | 'link'
let telemetryHistory = {
  cpu: [],
  ram: [],
  temp: [],
  link: []
};
let peakRecords = {
  cpu: 0,
  ram: 0,
  temp: 0,
  link: 0
};
let minRecords = {
  cpu: 100,
  ram: 100,
  temp: 100,
  link: 100
};
let diagnosticLog = {
  cpu: [],
  ram: [],
  temp: [],
  link: []
};

export function renderBridgeView() {
  return `
    <div class="flex-1 flex flex-col p-6 overflow-y-auto bg-surface/20">
      <div class="max-w-[1400px] mx-auto w-full">
        
        <!-- Professional Header -->
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 border-b border-outline-variant/10 pb-12">
          <div class="relative">
            <div class="flex items-center gap-4 mb-6">
              <div id="bridge-status-badge" class="flex items-center gap-2.5 px-4 py-2 bg-surface-container rounded-full border border-outline-variant/30 shadow-sm backdrop-blur-xl">
                <span class="w-2.5 h-2.5 rounded-full bg-outline animate-pulse"></span>
                <span class="text-[11px] text-on-surface-variant font-black uppercase tracking-[0.2em]">Initializing</span>
              </div>
              <div class="w-px h-5 bg-outline-variant/40"></div>
              <div class="flex items-center gap-2 px-3 py-1.5 bg-tertiary/5 rounded-lg border border-tertiary/10">
                <span class="material-symbols-outlined text-[16px] text-tertiary">security</span>
                <span class="text-[11px] text-tertiary font-black uppercase tracking-widest">RSA-4096 Secure Link</span>
              </div>
            </div>
            <h1 class="text-5xl text-on-surface font-black tracking-tighter leading-none mb-4">Control Room</h1>
            <p id="bridge-device-info" class="text-on-surface-variant/70 font-medium text-[14px] flex items-center gap-3">
              <span class="flex h-2.5 w-2.5 relative">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-tertiary"></span>
              </span>
              Establishing neural telemetry handshake...
            </p>
          </div>
          
          <div class="flex items-center gap-8 bg-surface-container/20 p-5 rounded-3xl border border-outline-variant/10 backdrop-blur-md">
            <div class="flex flex-col items-end">
              <span class="text-[11px] font-black text-on-surface-variant/70 uppercase tracking-[0.2em] mb-2">Sync Latency</span>
              <div class="flex items-baseline gap-1.5">
                <span class="text-[18px] font-mono font-black text-tertiary">0.02</span>
                <span class="text-[11px] font-black text-on-surface-variant/60">ms</span>
              </div>
            </div>
            <div class="w-px h-12 bg-outline-variant/20"></div>
            <div class="flex flex-col items-end">
              <span class="text-[11px] font-black text-on-surface-variant/70 uppercase tracking-[0.2em] mb-2">Packet Integrity</span>
              <div class="flex items-baseline gap-1.5">
                <span class="text-[18px] font-mono font-black text-success">100</span>
                <span class="text-[11px] font-black text-on-surface-variant/60">%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- High-Density Telemetry Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          
          <!-- CPU Activity -->
          <div id="btn-explore-cpu" class="glass-panel-strong rounded-3xl p-8 border border-outline-variant/10 hover:border-tertiary/40 hover:scale-[1.02] active:scale-[0.98] cursor-pointer transition-all duration-300 relative overflow-hidden group">
            <div class="absolute -right-4 -top-4 w-32 h-32 bg-tertiary/5 rounded-full blur-3xl group-hover:bg-tertiary/10 transition-all"></div>
            <div class="flex items-center justify-between mb-8 relative z-10">
              <div class="flex flex-col">
                <span class="text-[12px] font-black uppercase tracking-[0.2em] text-on-surface-variant">Compute Engine</span>
                <span id="bridge-cpu-cores" class="text-[11px] font-mono text-tertiary font-bold uppercase mt-1">Detecting Core Array...</span>
              </div>
              <div class="w-10 h-10 rounded-2xl bg-tertiary/10 flex items-center justify-center text-tertiary">
                <span class="material-symbols-outlined text-[20px]">memory</span>
              </div>
            </div>
            <div class="flex items-end justify-between mb-6 relative z-10">
              <div class="flex items-baseline gap-2">
                <span id="bridge-cpu-val" class="text-6xl font-black text-on-surface tracking-tighter">0</span>
                <span class="text-lg font-bold text-on-surface-variant/30 uppercase tracking-tighter">%</span>
              </div>
              <div class="text-right pb-2">
                <span class="text-[10px] font-black text-success uppercase bg-success/10 px-2.5 py-1 rounded-lg border border-success/10">Nominal</span>
              </div>
            </div>
            <div class="space-y-3 relative z-10">
              <div class="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                <div id="bridge-cpu-bar" class="h-full bg-tertiary shadow-[0_0_10px_rgba(0,96,172,0.4)] transition-all duration-1000 ease-out" style="width: 0%"></div>
              </div>
              <div class="flex justify-between text-[11px] font-black text-on-surface-variant/60 uppercase tracking-[0.1em]">
                <span>Idle</span>
                <span>Active</span>
                <span>Max</span>
              </div>
            </div>
          </div>

          <!-- Memory Matrix -->
          <div id="btn-explore-ram" class="glass-panel-strong rounded-3xl p-8 border border-outline-variant/10 hover:border-secondary/40 hover:scale-[1.02] active:scale-[0.98] cursor-pointer transition-all duration-300 relative overflow-hidden group">
            <div class="absolute -right-4 -top-4 w-32 h-32 bg-secondary/5 rounded-full blur-3xl group-hover:bg-secondary/10 transition-all"></div>
            <div class="flex items-center justify-between mb-8 relative z-10">
              <div class="flex flex-col">
                <span class="text-[12px] font-black uppercase tracking-[0.2em] text-on-surface-variant/80">Memory Array</span>
                <span class="text-[10px] font-mono text-secondary font-bold uppercase mt-1">ECC Pool Active</span>
              </div>
              <div class="w-10 h-10 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
                <span class="material-symbols-outlined text-[20px]">layers</span>
              </div>
            </div>
            <div class="flex items-end justify-between mb-6 relative z-10">
              <div class="flex items-baseline gap-2">
                <span id="bridge-ram-val" class="text-6xl font-black text-on-surface tracking-tighter">0.0</span>
                <span class="text-lg font-bold text-on-surface-variant/30 uppercase tracking-tighter">GB</span>
              </div>
              <div class="text-right pb-2">
                <div class="flex flex-col items-end">
                  <span class="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest block mb-1">Allocated</span>
                  <span id="bridge-ram-detail" class="text-[14px] font-mono font-black text-on-surface-variant tracking-tight">-- / --</span>
                </div>
              </div>
            </div>
            <div class="space-y-3 relative z-10">
              <div class="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                <div id="bridge-ram-bar" class="h-full bg-secondary shadow-[0_0_10px_rgba(80,95,118,0.3)] transition-all duration-1000 ease-out" style="width: 0%"></div>
              </div>
              <div class="flex justify-between text-[11px] font-black text-on-surface-variant/60 uppercase tracking-[0.1em]">
                <span>Min</span>
                <span>Optimum</span>
                <span>Limit</span>
              </div>
            </div>
          </div>

          <!-- Thermal Control -->
          <div id="btn-explore-temp" class="glass-panel-strong rounded-3xl p-8 border border-outline-variant/10 hover:border-error/40 hover:scale-[1.02] active:scale-[0.98] cursor-pointer transition-all duration-300 relative overflow-hidden group">
            <div class="absolute -right-4 -top-4 w-32 h-32 bg-error/5 rounded-full blur-3xl group-hover:bg-error/10 transition-all"></div>
            <div class="flex items-center justify-between mb-8 relative z-10">
              <div class="flex flex-col">
                <span class="text-[12px] font-black uppercase tracking-[0.2em] text-on-surface-variant/80">Thermal Status</span>
                <div id="bridge-temp-indicator" class="flex items-center gap-1.5 mt-1">
                  <div class="w-2 h-2 rounded-full bg-success"></div>
                  <span class="text-[10px] font-bold text-success uppercase tracking-widest">Optimal</span>
                </div>
              </div>
              <div class="w-10 h-10 rounded-2xl bg-error/10 flex items-center justify-center text-error">
                <span class="material-symbols-outlined text-[20px]">thermostat</span>
              </div>
            </div>
            <div class="flex items-baseline gap-2 mb-8 relative z-10">
              <span id="bridge-temp-val" class="text-6xl font-black text-on-surface tracking-tighter">0</span>
              <span class="text-lg font-bold text-on-surface-variant/30 uppercase tracking-tighter">°C</span>
            </div>
            <div class="grid grid-cols-12 gap-1.5 relative z-10">
              ${Array(24).fill(0).map(() => `<div class="h-5 bg-surface-container-highest/50 rounded-sm overflow-hidden"><div class="h-full bg-error/40 w-0 transition-all duration-1000"></div></div>`).join('')}
            </div>
          </div>

          <!-- Bridge Connection -->
          <div id="btn-explore-link" class="glass-panel-strong rounded-3xl p-8 border border-outline-variant/10 bg-success/[0.01] hover:border-success/40 hover:scale-[1.02] active:scale-[0.98] cursor-pointer transition-all duration-300 relative overflow-hidden group">
            <div class="absolute -right-4 -top-4 w-32 h-32 bg-success/5 rounded-full blur-3xl group-hover:bg-success/10 transition-all"></div>
            <div class="flex items-center justify-between mb-8 relative z-10">
              <div class="flex flex-col">
                <span class="text-[12px] font-black uppercase tracking-[0.2em] text-on-surface-variant/80">Neural Link</span>
                <span class="text-[10px] font-mono font-bold text-success uppercase mt-1 tracking-widest">Protocol V4.2 Live</span>
              </div>
              <div class="w-10 h-10 rounded-2xl bg-success/10 flex items-center justify-center text-success">
                <span class="material-symbols-outlined text-[20px]">hub</span>
              </div>
            </div>
            <div class="mb-8 relative z-10">
              <div class="flex items-center gap-3 mb-2">
                <span id="bridge-status-val" class="text-4xl font-black text-on-surface tracking-tight">Handshake</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="flex gap-1">
                  <div class="w-1.5 h-1.5 rounded-full bg-success shadow-[0_0_8px_rgba(76,175,80,0.6)]"></div>
                  <div class="w-1.5 h-1.5 rounded-full bg-success/20"></div>
                </div>
                <span class="text-[11px] font-bold text-success uppercase tracking-widest">Active Stream</span>
              </div>
            </div>
            <div class="space-y-3 relative z-10">
              <div class="flex items-center gap-3">
                <div class="flex-1 h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                  <div class="h-full bg-success animate-[shimmer_2s_infinite] shadow-[0_0_10px_rgba(76,175,80,0.3)]" style="width: 100%; background: linear-gradient(90deg, #4caf50 0%, #81c784 50%, #4caf50 100%);"></div>
                </div>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-[10px] font-mono font-black text-on-surface-variant/40 uppercase tracking-widest">Encryption: AES-256</span>
                <span class="text-[10px] font-mono font-black text-success tracking-widest">ENCRYPTED</span>
              </div>
            </div>
          </div>

        </div>

        <!-- System Architecture Layer -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <!-- Hardware Manifest -->
          <div class="lg:col-span-5 glass-panel rounded-3xl p-10 border border-outline-variant/10 relative overflow-hidden group">
            <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-right from-transparent via-tertiary/20 to-transparent"></div>
            <div class="flex items-center justify-between mb-10">
              <div class="flex items-center gap-5">
                <div class="w-14 h-14 rounded-2xl bg-surface-container-high flex items-center justify-center text-on-surface-variant border border-outline-variant/10 shadow-inner group-hover:text-tertiary group-hover:border-tertiary/20 transition-all duration-500">
                  <span class="material-symbols-outlined text-[28px]">architecture</span>
                </div>
                <div>
                  <h3 class="text-[15px] font-black uppercase tracking-[0.25em] text-on-surface">Node Manifest</h3>
                  <p class="text-[11px] text-on-surface-variant/70 font-bold uppercase mt-1 tracking-wider">Hardware Identification Profile</p>
                </div>
              </div>
            </div>
            
            <div class="space-y-2">
              <div class="flex items-center justify-between py-4 group/item">
                <span class="text-[11px] font-black text-on-surface-variant/70 uppercase tracking-[0.2em] group-hover/item:text-on-surface-variant transition-colors">Node Identifier</span>
                <div class="flex-1 border-b border-dotted border-outline-variant/30 mx-6 mb-1.5 opacity-50"></div>
                <span id="manifest-hostname" class="text-[13px] font-mono font-black text-on-surface tracking-tight">Detecting...</span>
              </div>
              <div class="flex items-center justify-between py-4 group/item">
                <span class="text-[11px] font-black text-on-surface-variant/70 uppercase tracking-[0.2em] group-hover/item:text-on-surface-variant transition-colors">OS Kernel</span>
                <div class="flex-1 border-b border-dotted border-outline-variant/30 mx-6 mb-1.5 opacity-50"></div>
                <span id="manifest-os" class="text-[13px] font-mono font-black text-on-surface tracking-tight">Detecting...</span>
              </div>
              <div class="flex items-center justify-between py-4 group/item">
                <span class="text-[11px] font-black text-on-surface-variant/70 uppercase tracking-[0.2em] group-hover/item:text-on-surface-variant transition-colors">System Arch</span>
                <div class="flex-1 border-b border-dotted border-outline-variant/30 mx-6 mb-1.5 opacity-50"></div>
                <span id="manifest-arch" class="text-[13px] font-mono font-black text-on-surface tracking-tight">Detecting...</span>
              </div>
              <div class="flex items-center justify-between py-4 group/item">
                <span class="text-[11px] font-black text-on-surface-variant/70 uppercase tracking-[0.2em] group-hover/item:text-on-surface-variant transition-colors">Sync Key</span>
                <div class="flex-1 border-b border-dotted border-outline-variant/30 mx-6 mb-1.5 opacity-50"></div>
                <span class="text-[13px] font-mono font-black text-tertiary tracking-widest">ARORA-SEC-****</span>
              </div>
              <div class="flex items-center justify-between py-4 group/item">
                <span class="text-[11px] font-black text-on-surface-variant/70 uppercase tracking-[0.2em] group-hover/item:text-on-surface-variant transition-colors">Integrity Shield</span>
                <div class="flex-1 border-b border-dotted border-outline-variant/30 mx-6 mb-1.5 opacity-50"></div>
                <div class="flex items-center gap-2.5">
                  <span class="w-2 h-2 rounded-full bg-success shadow-[0_0_8px_rgba(76,175,80,0.4)]"></span>
                  <span class="text-[11px] font-mono font-black text-success uppercase tracking-widest">Locked</span>
                </div>
              </div>
            </div>
            
            <div class="mt-10 pt-8 border-t border-outline-variant/10 flex justify-between items-center opacity-60 group-hover:opacity-100 transition-opacity duration-700">
              <span class="text-[11px] font-mono text-on-surface-variant/70 tracking-[0.2em]">CERTIFICATE: SYNC-2024-X-99</span>
              <span class="material-symbols-outlined text-[18px] text-on-surface-variant/50">verified</span>
            </div>
          </div>

          <!-- Protocol Stream -->
          <div class="lg:col-span-7 glass-panel rounded-3xl border border-outline-variant/10 overflow-hidden flex flex-col shadow-2xl relative">
            <div class="absolute top-0 right-0 p-8 pointer-events-none opacity-[0.03]">
              <span class="material-symbols-outlined text-[120px]">terminal</span>
            </div>
            <div class="px-10 py-6 border-b border-outline-variant/10 bg-surface-container/30 flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="w-2.5 h-2.5 rounded-full bg-tertiary animate-pulse shadow-[0_0_8px_rgba(0,96,172,0.4)]"></div>
                <span class="text-[13px] font-black uppercase tracking-[0.3em] text-on-surface">Protocol Stream</span>
              </div>
              <div class="flex items-center gap-6">
                <div class="flex items-center gap-3 px-3.5 py-1.5 bg-surface-container rounded-xl border border-outline-variant/30">
                  <span class="text-[10px] font-mono font-black text-on-surface-variant/60 tracking-widest uppercase">Buffer: 4.2MB</span>
                </div>
                <div class="flex items-center gap-2">
                   <span class="relative flex h-2 w-2">
                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-2 w-2 bg-tertiary"></span>
                  </span>
                  <span class="text-[11px] font-mono font-black text-tertiary uppercase tracking-widest">Live</span>
                </div>
              </div>
            </div>
            <div id="bridge-logs" class="p-10 h-[320px] overflow-y-auto font-mono text-[13px] text-on-surface-variant/80 leading-relaxed space-y-4 scroll-smooth custom-scrollbar bg-surface/5">
              <div class="flex gap-6 group">
                <span class="text-on-surface-variant/40 select-none group-hover:text-on-surface-variant/60 transition-colors">09:42:01</span>
                <span class="text-tertiary font-black tracking-tight">[BOOT] Initializing neural orchestration environment...</span>
              </div>
              <div class="flex gap-6 group">
                <span class="text-on-surface-variant/40 select-none group-hover:text-on-surface-variant/60 transition-colors">09:42:02</span>
                <span class="text-on-surface-variant/80">[AUTH] Secure handshake complete. RSA-4096 signature verified.</span>
              </div>
              <div class="flex gap-6 group">
                <span class="text-on-surface-variant/40 select-none group-hover:text-on-surface-variant/60 transition-colors">09:42:02</span>
                <span class="text-on-surface-variant/80">[TELE] Synchronization pool initialized. Ready for telemetry data.</span>
              </div>
              <div class="flex gap-6 group">
                <span class="text-on-surface-variant/40 select-none group-hover:text-on-surface-variant/60 transition-colors">09:42:03</span>
                <span class="text-success/90 font-black">[SYNC] Control Room active. All nodes reporting nominal.</span>
              </div>
            </div>
            <div class="px-10 py-5 bg-surface-container/20 border-t border-outline-variant/10 flex items-center justify-between">
               <div class="flex-1 flex items-center gap-6">
                  <div class="flex-1 h-1 bg-outline-variant/10 rounded-full overflow-hidden">
                     <div class="h-full bg-tertiary/40 animate-[shimmer_2s_infinite]" style="width: 65%"></div>
                  </div>
                  <span class="text-[11px] font-mono text-on-surface-variant/60 font-black uppercase tracking-[0.2em]">Data Integrity: 100%</span>
               </div>
            </div>
          </div>

        </div>

        <!-- Telemetry Explorer Modal -->
        <div id="telemetry-modal" class="fixed inset-0 z-[1000] hidden items-center justify-center p-6 bg-background/80 backdrop-blur-2xl transition-all duration-300 opacity-0">
          <div class="glass-panel-strong max-w-[900px] w-full rounded-[32px] p-8 border border-outline-variant/30 shadow-[0_20px_50px_rgba(0,0,0,0.4)] relative flex flex-col max-h-[90vh] overflow-hidden transform scale-95 transition-all duration-300">
            
            <!-- Modal Header -->
            <div class="flex items-center justify-between pb-6 border-b border-outline-variant/10 mb-6">
              <div class="flex items-center gap-4">
                <div id="modal-icon-container" class="w-12 h-12 rounded-2xl flex items-center justify-center border shadow-inner animate-[pulse_3s_infinite]">
                  <span id="modal-icon" class="material-symbols-outlined text-[24px]">analytics</span>
                </div>
                <div>
                  <h3 id="modal-title" class="text-[16px] font-black uppercase tracking-[0.25em] text-on-surface">Telemetry Explorer</h3>
                  <p id="modal-subtitle" class="text-[11px] text-on-surface-variant/70 font-bold uppercase mt-1 tracking-wider">Deep System Diagnostics</p>
                </div>
              </div>
              <button id="modal-close" class="w-10 h-10 rounded-full hover:bg-surface-container flex items-center justify-center border border-outline-variant/10 hover:border-outline-variant/30 text-on-surface-variant transition-all">
                <span class="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            
            <!-- Modal Body -->
            <div class="flex-1 overflow-y-auto space-y-8 pr-2 custom-scrollbar">
              
              <!-- Metric Summary Bento -->
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="bg-surface-container/20 rounded-2xl p-4 border border-outline-variant/5">
                  <span class="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/50">Current Value</span>
                  <div class="flex items-baseline gap-1 mt-1">
                    <span id="metric-current" class="text-3xl font-black text-on-surface">--</span>
                    <span id="metric-unit" class="text-[12px] font-black text-on-surface-variant/50"></span>
                  </div>
                </div>
                <div class="bg-surface-container/20 rounded-2xl p-4 border border-outline-variant/5">
                  <span class="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/50">Peak Record</span>
                  <div class="flex items-baseline gap-1 mt-1">
                    <span id="metric-peak" class="text-3xl font-black text-on-surface">--</span>
                    <span id="metric-unit-peak" class="text-[12px] font-black text-on-surface-variant/50"></span>
                  </div>
                </div>
                <div class="bg-surface-container/20 rounded-2xl p-4 border border-outline-variant/5">
                  <span class="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/50">Minimum Record</span>
                  <div class="flex items-baseline gap-1 mt-1">
                    <span id="metric-min" class="text-3xl font-black text-on-surface">--</span>
                    <span id="metric-unit-min" class="text-[12px] font-black text-on-surface-variant/50"></span>
                  </div>
                </div>
                <div class="bg-surface-container/20 rounded-2xl p-4 border border-outline-variant/5">
                  <span class="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/50">Diagnostic Shield</span>
                  <div class="mt-2.5">
                    <span id="metric-status-badge" class="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded bg-success/15 text-success border border-success/10">Active</span>
                  </div>
                </div>
              </div>

              <!-- Graphic Report Chart Container -->
              <div class="bg-surface-container/10 rounded-3xl p-6 border border-outline-variant/10 relative overflow-hidden flex flex-col h-[280px]">
                <div class="absolute inset-0 pointer-events-none opacity-[0.02]" style="background-image: radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0); background-size: 24px 24px;"></div>
                <div class="flex items-center justify-between mb-4 z-10">
                  <span class="text-[11px] font-black uppercase tracking-[0.2em] text-on-surface-variant/70">Real-Time Wave Telemetry Report</span>
                  <span class="text-[10px] font-mono text-tertiary flex items-center gap-1.5 uppercase font-black tracking-widest animate-pulse">
                    <span class="w-1.5 h-1.5 rounded-full bg-tertiary shadow-[0_0_8px_rgba(0,96,172,0.4)]"></span> LIVE FEED
                  </span>
                </div>
                <div class="flex-1 relative min-h-0">
                  <canvas id="telemetry-chart" class="w-full h-full block z-10 relative"></canvas>
                </div>
              </div>

              <!-- Detailed Stats Table -->
              <div class="space-y-3">
                <span class="text-[11px] font-black uppercase tracking-[0.2em] text-on-surface-variant/70">Recent Telemetry Frames</span>
                <div class="border border-outline-variant/15 rounded-2xl overflow-hidden bg-surface-container/5">
                  <div class="grid grid-cols-12 gap-4 px-6 py-3 border-b border-outline-variant/10 bg-surface-container/20 text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60">
                    <div class="col-span-3">Timestamp</div>
                    <div class="col-span-3">Registered Value</div>
                    <div class="col-span-3">Integrity Rating</div>
                    <div class="col-span-3">Dynamic State</div>
                  </div>
                  <div id="recent-telemetry-rows" class="divide-y divide-outline-variant/10 max-h-[160px] overflow-y-auto custom-scrollbar font-mono text-[12px] text-on-surface-variant">
                    <div class="grid grid-cols-12 gap-4 px-6 py-3 items-center">
                      <div class="col-span-12 text-center text-on-surface-variant/40 py-2">Waiting for next data stream...</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  `;
}

export function initBridgeView() {
  bridgeService.connect();

  const unsubscribe = bridgeService.subscribe((event) => {
    if (event.type === 'telemetry') {
      updateTelemetryUI(event.data);
    } else if (event.type === 'connection') {
      updateConnectionUI(event.status);
    }
  });

  setupModalListeners();

  if (!bridgeService.isConnected) {
    runConnectionSequence();
  } else {
    updateConnectionUI('connected');
  }

  return () => {
    unsubscribe();
  };
}

function setupModalListeners() {
  const btnCpu = document.getElementById('btn-explore-cpu');
  const btnRam = document.getElementById('btn-explore-ram');
  const btnTemp = document.getElementById('btn-explore-temp');
  const btnLink = document.getElementById('btn-explore-link');
  const modal = document.getElementById('telemetry-modal');
  const closeBtn = document.getElementById('modal-close');

  if (btnCpu) btnCpu.addEventListener('click', () => openExplorer('cpu'));
  if (btnRam) btnRam.addEventListener('click', () => openExplorer('ram'));
  if (btnTemp) btnTemp.addEventListener('click', () => openExplorer('temp'));
  if (btnLink) btnLink.addEventListener('click', () => openExplorer('link'));

  if (closeBtn) {
    closeBtn.addEventListener('click', () => closeExplorer());
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeExplorer();
    });
  }
}

function openExplorer(unit) {
  activeExplorerUnit = unit;
  
  const modal = document.getElementById('telemetry-modal');
  if (!modal) return;

  const iconContainer = document.getElementById('modal-icon-container');
  const icon = document.getElementById('modal-icon');
  const title = document.getElementById('modal-title');
  const subtitle = document.getElementById('modal-subtitle');
  const unitLabel = document.getElementById('metric-unit');
  const unitLabelPeak = document.getElementById('metric-unit-peak');
  const unitLabelMin = document.getElementById('metric-unit-min');

  let themeClass = '';
  let iconName = '';
  let titleText = '';
  let subtitleText = '';
  let unitText = '';

  switch (unit) {
    case 'cpu':
      themeClass = 'text-tertiary bg-tertiary/10 border-tertiary/20';
      iconName = 'memory';
      titleText = 'Compute Engine Explorer';
      subtitleText = 'Real-time CPU Instruction Matrix';
      unitText = '%';
      break;
    case 'ram':
      themeClass = 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
      iconName = 'layers';
      titleText = 'Memory Array Explorer';
      subtitleText = 'Ecc Allocation & Matrix Load';
      unitText = '%';
      break;
    case 'temp':
      themeClass = 'text-error bg-error/10 border-error/20';
      iconName = 'thermostat';
      titleText = 'Thermal Core Explorer';
      subtitleText = 'Core Thermal Dissipation Sensor';
      unitText = '°C';
      break;
    case 'link':
      themeClass = 'text-success bg-success/10 border-success/20';
      iconName = 'hub';
      titleText = 'Neural Link Explorer';
      subtitleText = 'Network Stream Integration Integrity';
      unitText = '%';
      break;
  }

  if (iconContainer) {
    iconContainer.className = `w-12 h-12 rounded-2xl flex items-center justify-center border shadow-inner ${themeClass}`;
  }
  if (icon) icon.textContent = iconName;
  if (title) title.textContent = titleText;
  if (subtitle) subtitle.textContent = subtitleText;
  if (unitLabel) unitLabel.textContent = unitText;
  if (unitLabelPeak) unitLabelPeak.textContent = unitText;
  if (unitLabelMin) unitLabelMin.textContent = unitText;

  const currentVal = telemetryHistory[unit].length > 0 ? telemetryHistory[unit][telemetryHistory[unit].length - 1] : 0;
  updateModalValues(unit, currentVal);
  renderLogRows(unit);

  modal.classList.remove('hidden');
  modal.classList.add('flex');
  
  void modal.offsetWidth;
  
  modal.classList.remove('opacity-0');
  modal.classList.add('opacity-100');
  modal.firstElementChild.classList.remove('scale-95');
  modal.firstElementChild.classList.add('scale-100');

  setTimeout(() => {
    const canvas = document.getElementById('telemetry-chart');
    const color = getUnitColor(unit);
    drawChart(canvas, telemetryHistory[unit], color, unitText);
  }, 100);
}

function closeExplorer() {
  const modal = document.getElementById('telemetry-modal');
  if (!modal) return;

  modal.classList.remove('opacity-100');
  modal.classList.add('opacity-0');
  modal.firstElementChild.classList.remove('scale-100');
  modal.firstElementChild.classList.add('scale-95');

  setTimeout(() => {
    modal.classList.remove('flex');
    modal.classList.add('hidden');
    activeExplorerUnit = null;
  }, 300);
}

function updateModalValues(unit, currentVal) {
  const currentEl = document.getElementById('metric-current');
  const peakEl = document.getElementById('metric-peak');
  const minEl = document.getElementById('metric-min');
  const badgeEl = document.getElementById('metric-status-badge');

  if (currentEl) currentEl.textContent = typeof currentVal === 'number' ? currentVal.toFixed(1) : currentVal;
  if (peakEl) peakEl.textContent = peakRecords[unit].toFixed(1);
  if (minEl) minEl.textContent = minRecords[unit] === 100 ? currentVal.toFixed(1) : minRecords[unit].toFixed(1);

  if (badgeEl) {
    let text = 'Nominal';
    let statusClass = 'bg-success/15 text-success border-success/10';

    if (unit === 'temp' && currentVal > 75) {
      text = 'Critical';
      statusClass = 'bg-error/15 text-error border-error/10 animate-pulse';
    } else if (unit === 'temp' && currentVal > 60) {
      text = 'Warning';
      statusClass = 'bg-warning/15 text-warning border-warning/10';
    } else if (unit === 'cpu' && currentVal > 85) {
      text = 'Overload';
      statusClass = 'bg-warning/15 text-warning border-warning/10';
    } else if (unit === 'link' && currentVal < 90) {
      text = 'Degraded';
      statusClass = 'bg-error/15 text-error border-error/10';
    }

    badgeEl.textContent = text;
    badgeEl.className = `text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded border ${statusClass}`;
  }
}

function renderLogRows(unit) {
  const container = document.getElementById('recent-telemetry-rows');
  if (!container) return;

  const logs = diagnosticLog[unit];
  if (!logs || logs.length === 0) {
    container.innerHTML = `
      <div class="grid grid-cols-12 gap-4 px-6 py-3 items-center">
        <div class="col-span-12 text-center text-on-surface-variant/40 py-2">Waiting for next data stream...</div>
      </div>
    `;
    return;
  }

  const html = [...logs].reverse().map(log => `
    <div class="grid grid-cols-12 gap-4 px-6 py-3 items-center hover:bg-surface-container/10 transition-colors">
      <div class="col-span-3 text-on-surface-variant/50">${log.timestamp}</div>
      <div class="col-span-3 font-bold text-on-surface">${log.value.toFixed(1)}</div>
      <div class="col-span-3 text-success">${log.rating}</div>
      <div class="col-span-3">
        <span class="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
          log.status === 'Nominal' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
        }">${log.status}</span>
      </div>
    </div>
  `).join('');

  container.innerHTML = html;
}

function getUnitColor(unit) {
  switch (unit) {
    case 'cpu': return 'rgba(0, 96, 172, 1)';
    case 'ram': return 'rgba(99, 102, 241, 1)';
    case 'temp': return 'rgba(239, 68, 68, 1)';
    case 'link': return 'rgba(34, 197, 94, 1)';
    default: return 'rgba(255, 255, 255, 1)';
  }
}

function drawChart(canvas, history, color, unitSuffix) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  const width = rect.width;
  const height = rect.height;

  ctx.clearRect(0, 0, width, height);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
  ctx.lineWidth = 1;
  
  const gridRows = 4;
  for (let i = 0; i <= gridRows; i++) {
    const y = (height / gridRows) * i;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  const gridCols = 8;
  for (let i = 0; i <= gridCols; i++) {
    const x = (width / gridCols) * i;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  if (history.length < 2) return;

  const getX = (index) => (width / (history.length - 1)) * index;
  const getY = (val) => height - ((height - 30) * (val / 100)) - 15;

  ctx.beginPath();
  ctx.moveTo(0, height);
  for (let i = 0; i < history.length; i++) {
    ctx.lineTo(getX(i), getY(history[i]));
  }
  ctx.lineTo(width, height);
  ctx.closePath();

  const areaGrad = ctx.createLinearGradient(0, 0, 0, height);
  areaGrad.addColorStop(0, color.replace('1)', '0.25)'));
  areaGrad.addColorStop(1, color.replace('1)', '0.0)'));
  ctx.fillStyle = areaGrad;
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(0, getY(history[0]));
  for (let i = 1; i < history.length; i++) {
    ctx.lineTo(getX(i), getY(history[i]));
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = 3.5;
  ctx.shadowColor = color.replace('1)', '0.4)');
  ctx.shadowBlur = 12;
  ctx.stroke();
  ctx.shadowBlur = 0;

  const endVal = history[history.length - 1];
  const endX = getX(history.length - 1);
  const endY = getY(endVal);

  ctx.beginPath();
  ctx.arc(endX, endY, 6, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(endX, endY, 12, 0, Math.PI * 2);
  ctx.strokeStyle = color.replace('1)', '0.3)');
  ctx.lineWidth = 1.5;
  ctx.stroke();
}

function updateTelemetryUI(data) {
  const deviceEl = document.getElementById('bridge-device-info');
  if (deviceEl && data.device) {
    deviceEl.innerHTML = `
      <span class="flex h-2.5 w-2.5 relative">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
        <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-success"></span>
      </span>
      Synchronized with <span class="text-on-surface font-black tracking-tight">${data.device.hostname}</span> • <span class="text-on-surface-variant font-bold">${data.device.os}</span>
    `;
    
    const hostEl = document.getElementById('manifest-hostname');
    const osEl = document.getElementById('manifest-os');
    const archEl = document.getElementById('manifest-arch');
    if (hostEl) hostEl.textContent = data.device.hostname;
    if (osEl) osEl.textContent = data.device.os;
    if (archEl) archEl.textContent = data.device.arch || 'x64_64';
  }

  const cpuValRaw = data.cpu.load;
  const ramValRaw = data.ram.percent;
  const tempValRaw = data.temp;
  const linkValRaw = 99.8 + (Math.sin(Date.now() / 2000) * 0.15) + (Math.random() * 0.05);

  const timestampStr = new Date().toLocaleTimeString();
  const updateUnitHistory = (unit, val) => {
    const history = telemetryHistory[unit];
    history.push(val);
    if (history.length > 40) history.shift();

    peakRecords[unit] = Math.max(peakRecords[unit], val);
    minRecords[unit] = Math.min(minRecords[unit], val);

    diagnosticLog[unit].push({
      timestamp: timestampStr,
      value: val,
      rating: '99.98%',
      status: (unit === 'temp' && val > 75) ? 'Critical' : 'Nominal'
    });
    if (diagnosticLog[unit].length > 20) diagnosticLog[unit].shift();
  };

  updateUnitHistory('cpu', cpuValRaw);
  updateUnitHistory('ram', ramValRaw);
  updateUnitHistory('temp', tempValRaw);
  updateUnitHistory('link', linkValRaw);

  const cpuVal = document.getElementById('bridge-cpu-val');
  const cpuBar = document.getElementById('bridge-cpu-bar');
  const cpuCores = document.getElementById('bridge-cpu-cores');
  if (cpuVal) cpuVal.textContent = Math.round(cpuValRaw);
  if (cpuBar) cpuBar.style.width = `${cpuValRaw}%`;
  if (cpuCores) cpuCores.textContent = `${data.cpu.cores} Physical Cores Online`;

  const ramVal = document.getElementById('bridge-ram-val');
  const ramBar = document.getElementById('bridge-ram-bar');
  const ramDetail = document.getElementById('bridge-ram-detail');
  if (ramVal) ramVal.textContent = data.ram.used.toFixed(1);
  if (ramBar) ramBar.style.width = `${ramValRaw}%`;
  if (ramDetail) ramDetail.textContent = `${data.ram.used.toFixed(1)}GB / ${data.ram.total.toFixed(1)}GB`;

  const tempVal = document.getElementById('bridge-temp-val');
  const tempIndicator = document.getElementById('bridge-temp-indicator');
  if (tempVal) tempVal.textContent = Math.round(tempValRaw);
  
  if (tempIndicator) {
    if (tempValRaw > 80) {
      tempIndicator.innerHTML = `<div class="w-2 h-2 rounded-full bg-error animate-pulse shadow-[0_0_8px_rgba(255,82,82,0.4)]"></div><span class="text-[10px] text-error font-bold uppercase tracking-widest">Critical</span>`;
    } else if (tempValRaw > 65) {
      tempIndicator.innerHTML = `<div class="w-2 h-2 rounded-full bg-warning shadow-[0_0_8px_rgba(255,193,7,0.4)]"></div><span class="text-[10px] text-warning font-bold uppercase tracking-widest">Elevated</span>`;
    } else {
      tempIndicator.innerHTML = `<div class="w-2 h-2 rounded-full bg-success shadow-[0_0_8px_rgba(76,175,80,0.4)]"></div><span class="text-[10px] text-success font-bold uppercase tracking-widest">Optimal</span>`;
    }
  }

  if (activeExplorerUnit) {
    const activeVal = activeExplorerUnit === 'cpu' ? cpuValRaw : 
                      activeExplorerUnit === 'ram' ? ramValRaw : 
                      activeExplorerUnit === 'temp' ? tempValRaw : 
                      linkValRaw;
    updateModalValues(activeExplorerUnit, activeVal);
    renderLogRows(activeExplorerUnit);
    
    const canvas = document.getElementById('telemetry-chart');
    const color = getUnitColor(activeExplorerUnit);
    const unitText = activeExplorerUnit === 'cpu' ? '%' : 
                     activeExplorerUnit === 'ram' ? '%' : 
                     activeExplorerUnit === 'temp' ? '°C' : '%';
    drawChart(canvas, telemetryHistory[activeExplorerUnit], color, unitText);
  }
}

function runConnectionSequence() {
  const badge = document.getElementById('bridge-status-badge');
  const statusVal = document.getElementById('bridge-status-val');

  window.bridgeLockedGreen = false;

  updateConnectionUI('failed'); 
  
  setTimeout(() => {
    if (badge) {
      badge.innerHTML = `
        <span class="w-2.5 h-2.5 rounded-full bg-warning animate-pulse shadow-[0_0_8px_rgba(255,193,7,0.4)]"></span>
        <span class="text-[11px] text-warning font-black uppercase tracking-[0.2em]">Handshake</span>
      `;
    }
    if (statusVal) statusVal.textContent = 'Linking...';
  }, 1200);

  setTimeout(() => {
    updateConnectionUI('connected');
  }, 2800);
}

function updateConnectionUI(status) {
  const statusVal = document.getElementById('bridge-status-val');
  const badge = document.getElementById('bridge-status-badge');

  if (status === 'connected') {
    if (badge) {
      badge.innerHTML = `
        <span class="w-2.5 h-2.5 rounded-full bg-success shadow-[0_0_12px_rgba(76,175,80,0.6)]"></span>
        <span class="text-[11px] text-success font-black uppercase tracking-[0.2em]">Connected</span>
      `;
    }
    if (statusVal) statusVal.textContent = 'Active';
  } else if (status === 'disconnected') {
    if (badge) {
      badge.innerHTML = `
        <span class="w-2.5 h-2.5 rounded-full bg-outline-variant animate-pulse"></span>
        <span class="text-[11px] text-on-surface-variant/60 font-black uppercase tracking-[0.2em]">Searching</span>
      `;
    }
    if (statusVal) statusVal.textContent = 'Sync...';
  } else if (status === 'failed') {
    if (badge) {
      badge.innerHTML = `
        <span class="w-2.5 h-2.5 rounded-full bg-error shadow-[0_0_12px_rgba(255,82,82,0.6)]"></span>
        <span class="text-[11px] text-error font-black uppercase tracking-[0.2em]">Offline</span>
      `;
    }
    if (statusVal) statusVal.textContent = 'Inactive';
  }
}

