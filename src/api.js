/**
 * Arora OS API Utility
 * Handles communication with the FastAPI backend
 */

const API_BASE = "http://localhost:8000";
const WS_BASE = "ws://localhost:8000";

export const api = {
    /**
     * Start a new project pipeline
     * @param {string} idea - The project idea/prompt
     * @returns {Promise<{project_id: string, status: string, message: string}>}
     */
    async startProject(idea) {
        const response = await fetch(`${API_BASE}/start-project`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idea })
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    },

    /**
     * Get project status
     * @param {string} projectId 
     */
    async getStatus(projectId) {
        const response = await fetch(`${API_BASE}/status/${projectId}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    },

    /**
     * Get final results
     * @param {string} projectId 
     */
    async getResult(projectId) {
        const response = await fetch(`${API_BASE}/result/${projectId}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    },

    /**
     * Connect to log stream via WebSocket
     * @param {string} projectId 
     * @param {Function} onMessage - Callback for each message
     */
    connectLogs(projectId, onMessage) {
        const socket = new WebSocket(`${WS_BASE}/ws/logs/${projectId}`);
        
        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            onMessage(data);
        };

        socket.onerror = (error) => {
            console.error("WebSocket Error:", error);
        };

        socket.onclose = () => {
            console.log("WebSocket connection closed for project:", projectId);
        };

        return socket;
    },

    /**
     * Run a specific worker with custom prompt and API key
     * @param {string} name - Worker name
     * @param {string} prompt - Worker prompt
     * @param {string} apiKey - API key to use
     * @returns {Promise<any>}
     */
    async runWorker(name, prompt, apiKey) {
        const response = await fetch(`${API_BASE}/run-worker`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, prompt, apiKey })
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    }
};
