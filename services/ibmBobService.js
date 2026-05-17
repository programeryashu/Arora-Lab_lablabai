// ═══════════════════════════════════════════════
// ARORA LAB — IBM BOB Service (Modular Provider)
// Handles chat completions and SSE streaming safely
// ═══════════════════════════════════════════════

export class IBMBobService {
  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
  }

  /**
   * Send a standard non-streaming chat request to IBM BOB.
   * @param {Array} messages - Message history in standard OpenAI format.
   * @returns {Promise<string>} - Complete text response.
   */
  async chat(messages) {
    try {
      const response = await fetch(`${this.baseUrl}/ibm-bob/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages,
          stream: false
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`IBM Bob Server Error: ${errText || response.statusText}`);
      }

      const data = await response.json();
      
      // Parse flexible response properties: Watsonx vs OpenAI
      return data.content || 
             data.choices?.[0]?.message?.content || 
             data.results?.[0]?.generated_text ||
             (typeof data === 'string' ? data : JSON.stringify(data));
    } catch (error) {
      console.error('[IBM BOB Service] Chat Error:', error);
      throw error;
    }
  }

  /**
   * Send a streaming chat request to IBM BOB with live token callbacks.
   * @param {Array} messages - Message history in standard OpenAI format.
   * @param {Function} onToken - Callback invoked as new tokens arrive.
   * @returns {Promise<string>} - Entire consolidated response.
   */
  async stream(messages, onToken) {
    try {
      const response = await fetch(`${this.baseUrl}/ibm-bob/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages,
          stream: true
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`IBM Bob Streaming Server Error: ${errText || response.statusText}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;

          if (trimmed.startsWith('data: ')) {
            const dataStr = trimmed.slice(6).trim();
            if (dataStr === '[DONE]') break;

            try {
              const json = JSON.parse(dataStr);
              // Handle multiple SSE structures: Watsonx, OpenAI choices/deltas, etc.
              const token = json.choices?.[0]?.delta?.content || 
                            json.choices?.[0]?.text || 
                            json.results?.[0]?.generated_text ||
                            json.content || 
                            '';
              
              if (token) {
                fullText += token;
                if (onToken) onToken(fullText);
              }
            } catch (e) {
              // Resilient fallback for raw text chunks
              if (dataStr && !dataStr.startsWith('{') && !dataStr.startsWith('[')) {
                fullText += dataStr;
                if (onToken) onToken(fullText);
              }
            }
          }
        }
      }
      return fullText;
    } catch (error) {
      console.error('[IBM BOB Service] Stream Error:', error);
      throw error;
    }
  }
}
