const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const { setupWebSocket } = require('./config/websocket');
const { connectDB } = require('./config/db');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const roomRoutes = require('./routes/rooms'); // Changed from room to rooms
const messageRoutes = require('./routes/messages'); // Changed from message to messages

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/messages', messageRoutes);

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Setup WebSocket
setupWebSocket(server);

module.exports = app;
