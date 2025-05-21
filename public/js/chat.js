// WebSocket client implementation for ChatSphere
class ChatClient {
  constructor(url) {
    this.socket = new WebSocket(url);
    this.messageHandlers = new Set();
    this.connectionHandlers = new Set();
    this.errorHandlers = new Set();

    this.socket.onopen = () => {
      this.connectionHandlers.forEach(handler => handler(true));
    };

    this.socket.onclose = () => {
      this.connectionHandlers.forEach(handler => handler(false));
    };

    this.socket.onerror = (error) => {
      this.errorHandlers.forEach(handler => handler(error));
    };

    this.socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        this.messageHandlers.forEach(handler => handler(message));
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };
  }

  send(message) {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
      return true;
    }
    return false;
  }

  onMessage(handler) {
    this.messageHandlers.add(handler);
    return () => this.messageHandlers.delete(handler);
  }

  onConnectionChange(handler) {
    this.connectionHandlers.add(handler);
    return () => this.connectionHandlers.delete(handler);
  }

  onError(handler) {
    this.errorHandlers.add(handler);
    return () => this.errorHandlers.delete(handler);
  }

  close() {
    this.socket.close();
  }
}

// Export for Node.js testing environment
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ChatClient;
}
