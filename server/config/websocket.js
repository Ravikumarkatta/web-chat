const WebSocket = require('ws');
const { verifyToken } = require('../utils/auth');

// WebSocket server setup
const setupWebSocket = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws, req) => {
    const token = req.url.split('?token=')[1];
    const user = verifyToken(token);

    if (!user) {
      ws.close(1008, 'Invalid token');
      return;
    }

    ws.user = user;

    ws.on('message', (message) => {
      const data = JSON.parse(message);
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            user: ws.user,
            message: data.message,
            timestamp: new Date()
          }));
        }
      });
    });

    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });

  return wss;
};

module.exports = setupWebSocket;
