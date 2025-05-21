const WebSocket = require('ws');
const { verifyToken } = require('../utils/auth');

// WebSocket server setup
const setupWebSocket = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws, req) => {
    console.log('WebSocket connection established');
    
    // Handle connection without token for development purposes
    const urlParts = req.url.split('?token=');
    if (urlParts.length < 2) {
      console.log('Connection without token - allowing for development');
      ws.user = { id: 'anonymous', name: 'Anonymous User' };
    } else {
      const token = urlParts[1];
      const user = verifyToken(token);

      if (!user) {
        console.log('Invalid token provided');
        ws.close(1008, 'Invalid token');
        return;
      }
      
      console.log(`User authenticated: ${user.name || user.id}`);
      ws.user = user;
    }

    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message);
        console.log(`Message received: ${data.message}`);
        
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
              user: ws.user,
              message: data.message,
              timestamp: new Date()
            }));
          }
        });
      } catch (error) {
        console.error('Error processing message:', error);
      }
    });

    ws.on('close', () => {
      console.log('Client disconnected');
    });
    
    // Send welcome message
    ws.send(JSON.stringify({
      user: { name: 'System' },
      message: 'Welcome to ChatSphere!',
      timestamp: new Date()
    }));
  });

  return wss;
};

module.exports = setupWebSocket;