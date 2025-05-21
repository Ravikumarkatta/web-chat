const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const roomRoutes = require('./routes/room');
const messageRoutes = require('./routes/messages');
const { setupWebSocket } = require('./config/websocket');
require('dotenv').config();

const app = express();
// Enable CORS for all routes
app.use(cors());
// Create an HTTP server
const server = http.createServer(app);
// Connect Socket.IO to the HTTP server
const io = socketIO(server, {
    cors: {
        origin: '*', // Allow all origins
        methods: ["GET", "POST"] // Allow these methods
    }
});
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '../public')));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch(err => console.error('MongoDB connection error:', err));

// API routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/rooms', roomRoutes);
app.use('/messages', messageRoutes);

// WebSocket setup
setupWebSocket(io);

// Basic route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
