// ═══════════════════════════════════════════════
// ARORA LAB — Bridge Service (Optimized)
// Secure WebSocket connection with fast-recovery
// ═══════════════════════════════════════════════

class BridgeService {
  constructor() {
    this.ws = null;
    const WS_BASE = import.meta.env.VITE_WS_BASE_URL || 'ws://localhost:8000';
    this.url = `${WS_BASE}/ws/bridge`;
    this.token = 'arora-secure-bridge-2024';
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 10;
    this.listeners = new Set();
    this.isConnected = false;
    this.lastData = null;
    this.connectTimeout = null;
    this.reconnectTimer = null;
  }

  connect() {
    // 1. Prevent duplicates
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    // 2. Clear existing timers
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    if (this.connectTimeout) clearTimeout(this.connectTimeout);

    console.log('[Bridge] Connecting to local agent...');
    
    try {
      this.ws = new WebSocket(`${this.url}?token=${this.token}`);

      // 3. Connection Timeout (3 sec max)
      this.connectTimeout = setTimeout(() => {
        if (this.ws.readyState !== WebSocket.OPEN) {
          console.warn('[Bridge] Connection timeout. Retrying...');
          this.ws.close();
        }
      }, 3000);

      this.ws.onopen = () => {
        if (this.connectTimeout) clearTimeout(this.connectTimeout);
        console.log('[Bridge] Secure connection established.');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.notify({ type: 'connection', status: 'connected' });
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'telemetry') {
            this.lastData = data.data;
            this.notify({ type: 'telemetry', data: data.data });
          } else if (data.type === 'error') {
            console.error('[Bridge] Error:', data.message);
            this.notify({ type: 'error', message: data.message });
          }
        } catch (err) {
          console.error('[Bridge] Failed to parse message', err);
        }
      };

      this.ws.onclose = () => {
        this.isConnected = false;
        this.notify({ type: 'connection', status: 'disconnected' });
        this.attemptReconnect();
      };

      this.ws.onerror = (err) => {
        console.error('[Bridge] WebSocket Error:', err);
        this.ws.close();
      };
    } catch (e) {
      console.error('[Bridge] Critical connection error:', e);
      this.attemptReconnect();
    }
  }

  attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      // Fast retry for first 3 attempts (1s), then exponential
      const delay = this.reconnectAttempts <= 3 ? 1000 : Math.min(1000 * Math.pow(2, this.reconnectAttempts - 3), 10000);
      
      console.log(`[Bridge] Reconnecting in ${delay}ms (Attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      
      if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
      this.reconnectTimer = setTimeout(() => this.connect(), delay);
    } else {
      console.error('[Bridge] Maximum reconnect attempts reached.');
      this.notify({ type: 'connection', status: 'failed' });
    }
  }

  subscribe(callback) {
    this.listeners.add(callback);
    // 1. Send current telemetry if we have it
    if (this.lastData) callback({ type: 'telemetry', data: this.lastData });
    // 2. Send current connection status immediately
    callback({ type: 'connection', status: this.isConnected ? 'connected' : (this.reconnectAttempts >= this.maxReconnectAttempts ? 'failed' : 'disconnected') });
    return () => this.listeners.delete(callback);
  }

  notify(event) {
    this.listeners.forEach(cb => cb(event));
  }

  disconnect() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    if (this.connectTimeout) clearTimeout(this.connectTimeout);
    
    if (this.ws) {
      this.ws.onclose = null;
      this.ws.close();
      this.isConnected = false;
      console.log('[Bridge] Connection manually closed.');
    }
  }
}

export const bridgeService = new BridgeService();
