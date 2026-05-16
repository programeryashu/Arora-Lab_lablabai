// ═══════════════════════════════════════════════
// ARORA LAB — Bridge Service
// Secure WebSocket connection to local agent
// Telemetry, hardware stats, and auto-reconnect
// ═══════════════════════════════════════════════

class BridgeService {
  constructor() {
    this.ws = null;
    this.url = 'ws://localhost:8000/ws/bridge';
    this.token = 'arora-secure-bridge-2024'; // Secure token for bridge
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.listeners = new Set();
    this.isConnected = false;
    this.lastData = null;
  }

  connect() {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    console.log('Bridge: Connecting to local agent...');
    this.ws = new WebSocket(`${this.url}?token=${this.token}`);

    this.ws.onopen = () => {
      console.log('Bridge: Secure connection established.');
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
          console.error('Bridge Error:', data.message);
          this.notify({ type: 'error', message: data.message });
        }
      } catch (err) {
        console.error('Bridge: Failed to parse message', err);
      }
    };

    this.ws.onclose = () => {
      this.isConnected = false;
      this.notify({ type: 'connection', status: 'disconnected' });
      this.attemptReconnect();
    };

    this.ws.onerror = (err) => {
      console.error('Bridge WebSocket Error:', err);
      this.ws.close();
    };
  }

  attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 10000);
      console.log(`Bridge: Reconnecting in ${delay}ms (Attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      setTimeout(() => this.connect(), delay);
    } else {
      console.error('Bridge: Maximum reconnect attempts reached.');
      this.notify({ type: 'connection', status: 'failed' });
    }
  }

  subscribe(callback) {
    this.listeners.add(callback);
    // Immediately send last known data if available
    if (this.lastData) callback({ type: 'telemetry', data: this.lastData });
    return () => this.listeners.delete(callback);
  }

  notify(event) {
    this.listeners.forEach(cb => cb(event));
  }

  disconnect() {
    if (this.ws) {
      this.ws.onclose = null; // Prevent auto-reconnect
      this.ws.close();
      this.isConnected = false;
    }
  }
}

export const bridgeService = new BridgeService();
