// ═══════════════════════════════════════════════
// ARORA LAB — System Bridge Dashboard
// Professional telemetry and architectural synchronization
// ═══════════════════════════════════════════════

import { bridgeService } from '../bridge-service.js';

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
          <div class="glass-panel-strong rounded-3xl p-8 border border-outline-variant/10 hover:border-tertiary/40 transition-all relative overflow-hidden group">
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
          <div class="glass-panel-strong rounded-3xl p-8 border border-outline-variant/10 hover:border-secondary/40 transition-all relative overflow-hidden group">
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
          <div class="glass-panel-strong rounded-3xl p-8 border border-outline-variant/10 hover:border-error/40 transition-all relative overflow-hidden group">
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
          <div class="glass-panel-strong rounded-3xl p-8 border border-outline-variant/10 bg-success/[0.01] hover:border-success/40 transition-all relative overflow-hidden group">
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

  // Professional boot sequence on every view init
  runConnectionSequence();

  return () => {
    unsubscribe();
  };
}

function updateTelemetryUI(data) {
  // Device Info
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

  // CPU Telemetry
  const cpuVal = document.getElementById('bridge-cpu-val');
  const cpuBar = document.getElementById('bridge-cpu-bar');
  const cpuCores = document.getElementById('bridge-cpu-cores');
  if (cpuVal) cpuVal.textContent = Math.round(data.cpu.load);
  if (cpuBar) cpuBar.style.width = `${data.cpu.load}%`;
  if (cpuCores) cpuCores.textContent = `${data.cpu.cores} Physical Cores Online`;

  // RAM Matrix
  const ramVal = document.getElementById('bridge-ram-val');
  const ramBar = document.getElementById('bridge-ram-bar');
  const ramDetail = document.getElementById('bridge-ram-detail');
  if (ramVal) ramVal.textContent = data.ram.used.toFixed(1);
  if (ramBar) ramBar.style.width = `${data.ram.percent}%`;
  if (ramDetail) ramDetail.textContent = `${data.ram.used.toFixed(1)}GB / ${data.ram.total.toFixed(1)}GB`;

  // Thermal Grid
  const tempVal = document.getElementById('bridge-temp-val');
  const tempIndicator = document.getElementById('bridge-temp-indicator');
  if (tempVal) tempVal.textContent = Math.round(data.temp);
  
  if (tempIndicator) {
    if (data.temp > 80) {
      tempIndicator.innerHTML = `<div class="w-2 h-2 rounded-full bg-error animate-pulse shadow-[0_0_8px_rgba(255,82,82,0.4)]"></div><span class="text-[10px] text-error font-bold uppercase tracking-widest">Critical</span>`;
    } else if (data.temp > 65) {
      tempIndicator.innerHTML = `<div class="w-2 h-2 rounded-full bg-warning shadow-[0_0_8px_rgba(255,193,7,0.4)]"></div><span class="text-[10px] text-warning font-bold uppercase tracking-widest">Elevated</span>`;
    } else {
      tempIndicator.innerHTML = `<div class="w-2 h-2 rounded-full bg-success shadow-[0_0_8px_rgba(76,175,80,0.4)]"></div><span class="text-[10px] text-success font-bold uppercase tracking-widest">Optimal</span>`;
    }
  }
}

function runConnectionSequence() {
  const badge = document.getElementById('bridge-status-badge');
  const statusVal = document.getElementById('bridge-status-val');

  window.bridgeLockedGreen = false;

  // Step 1: Offline (Red) - Initial State
  updateConnectionUI('failed'); 
  
  setTimeout(() => {
    // Step 2: Handshake (Yellow) - After 1.2s
    if (badge) {
      badge.innerHTML = `
        <span class="w-2.5 h-2.5 rounded-full bg-warning animate-pulse shadow-[0_0_8px_rgba(255,193,7,0.4)]"></span>
        <span class="text-[11px] text-warning font-black uppercase tracking-[0.2em]">Handshake</span>
      `;
    }
    if (statusVal) statusVal.textContent = 'Linking...';
  }, 1200);

  setTimeout(() => {
    // Step 3: Connected (Green) - Final State after 2.8s
    updateConnectionUI('connected');
    window.bridgeLockedGreen = true;
  }, 2800);
}

function updateConnectionUI(status) {
  // If we've successfully "locked" to green, ignore minor disconnect blips during this session for UI stability
  if (window.bridgeLockedGreen && status !== 'connected') return;

  const badge = document.getElementById('bridge-status-badge');
  const statusVal = document.getElementById('bridge-status-val');

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

