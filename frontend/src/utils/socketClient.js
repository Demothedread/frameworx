const NOOP = () => {};

class SocketClient {
  constructor(url) {
    this.url = url;
    this.handlers = new Map();
    this.socket = this.createWebSocket(url);
    this.bindSocketEvents();
  }

  createWebSocket(url) {
    if (typeof window === 'undefined' || typeof window.WebSocket === 'undefined') {
      return null;
    }

    try {
      return new window.WebSocket(url.replace(/^ws:/, 'ws:').replace(/^http:/, 'ws:').replace(/^https:/, 'wss:'));
    } catch (_err) {
      return null;
    }
  }

  bindSocketEvents() {
    if (!this.socket) {
      return;
    }

    this.socket.addEventListener('message', (event) => {
      try {
        const { eventName, payload } = JSON.parse(event.data);
        this.trigger(eventName, payload);
      } catch (_err) {
        // Ignore malformed messages from non-structured websocket payloads.
      }
    });
  }

  emit(eventName, payload = {}) {
    if (!this.socket || this.socket.readyState !== 1) {
      return;
    }

    this.socket.send(JSON.stringify({ eventName, payload }));
  }

  on(eventName, callback) {
    const callbacks = this.handlers.get(eventName) || [];
    callbacks.push(callback);
    this.handlers.set(eventName, callbacks);
  }

  trigger(eventName, payload) {
    const callbacks = this.handlers.get(eventName) || [];
    callbacks.forEach((callback) => callback(payload));
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
    }
    this.handlers.clear();
  }
}

export function io(url) {
  return new SocketClient(url);
}

export const socketClientPrivate = { NOOP };
