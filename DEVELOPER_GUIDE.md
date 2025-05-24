# Web-Chat Developer Guide 🚀

A comprehensive guide for developers working on the Web-Chat real-time messaging application. This guide covers everything from initial setup to advanced development patterns, testing strategies, and deployment procedures.

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Development Environment Setup](#development-environment-setup)
- [Architecture Deep Dive](#architecture-deep-dive)
- [Code Organization & Standards](#code-organization--standards)
- [Database Design](#database-design)
- [WebSocket Implementation](#websocket-implementation)
- [Authentication & Security](#authentication--security)
- [Testing Strategy](#testing-strategy)
- [Performance Optimization](#performance-optimization)
- [Debugging & Troubleshooting](#debugging--troubleshooting)
- [Deployment & DevOps](#deployment--devops)
- [Contributing Guidelines](#contributing-guidelines)
- [Common Patterns & Best Practices](#common-patterns--best-practices)

## 🚀 Getting Started

### Prerequisites Checklist

Before diving into development, ensure you have the following installed and configured:

**Required Software:**
- Node.js (v16.0.0 or higher) - [Download](https://nodejs.org/)
- MongoDB (v5.0 or higher) - [Installation Guide](https://docs.mongodb.com/manual/installation/)
- Redis (v6.0 or higher) - [Installation Guide](https://redis.io/download)
- Git - [Download](https://git-scm.com/)

**Recommended Development Tools:**
- VS Code with extensions:
  - ESLint
  - Prettier
  - JavaScript (ES6) code snippets
  - MongoDB for VS Code
  - REST Client
  - GitLens
- MongoDB Compass (GUI for MongoDB)
- Redis Desktop Manager
- Postman or Insomnia (API testing)

### Initial Setup

```bash
# Clone the repository
git clone https://github.com/your-username/web-chat.git
cd web-chat

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Start development services
npm run dev:setup  # Starts MongoDB, Redis, and the application
```

### Project Quick Tour

```bash
# Start the development server
npm run dev

# Run tests
npm test

# Check code quality
npm run lint
npm run format

# Build for production
npm run build

# Start production server
npm start
```

## 🛠️ Development Environment Setup

### Environment Configuration

Create a comprehensive `.env` file for development:

```bash
# .env.development
# ===================

# Server Configuration
NODE_ENV=development
PORT=3001
HOST=localhost

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/webchat_dev
MONGODB_TEST_URI=mongodb://localhost:27017/webchat_test
REDIS_URL=redis://localhost:6379

# Authentication Secrets
JWT_SECRET=dev-jwt-secret-change-in-production
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=dev-refresh-secret
REFRESH_TOKEN_EXPIRES_IN=30d

# File Upload Configuration
MAX_FILE_SIZE=10485760  # 10MB
UPLOAD_PATH=./uploads
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,application/pdf

# Email Configuration (for development)
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_USER=your-ethereal-user
SMTP_PASS=your-ethereal-pass

# WebSocket Configuration
WEBSOCKET_CORS_ORIGIN=http://localhost:3001
WEBSOCKET_TRANSPORTS=websocket,polling

# Logging Configuration
LOG_LEVEL=debug
LOG_FILE=./logs/app.log

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100

# Development Flags
ENABLE_CORS=true
ENABLE_MORGAN_LOGGING=true
ENABLE_SWAGGER_DOCS=true
```

### Docker Development Setup

```yaml
# docker-compose.dev.yml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "3001:3001"
      - "9229:9229"  # Node.js debugger
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
    depends_on:
      - mongodb
      - redis
    command: npm run dev:debug

  mongodb:
    image: mongo:5.0
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
      - ./database/init:/docker-entrypoint-initdb.d
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password

  redis:
    image: redis:6-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  mongo-express:
    image: mongo-express
    ports:
      - "8081:8081"
    environment:
      ME_CONFIG_MONGODB_ADMINUSERNAME: admin
      ME_CONFIG_MONGODB_ADMINPASSWORD: password
      ME_CONFIG_MONGODB_URL: mongodb://admin:password@mongodb:27017/
    depends_on:
      - mongodb

volumes:
  mongodb_data:
  redis_data:
```

### Development Scripts

```json
{
  "scripts": {
    "dev": "nodemon server/server.js",
    "dev:debug": "nodemon --inspect=0.0.0.0:9229 server/server.js",
    "dev:setup": "concurrently \"mongod\" \"redis-server\" \"npm run dev\"",
    "test": "jest --watchAll=false",
    "test:watch": "jest --watchAll",
    "test:coverage": "jest --coverage",
    "test:integration": "jest --testPathPattern=integration",
    "test:unit": "jest --testPathPattern=unit",
    "lint": "eslint . --ext .js,.jsx",
    "lint:fix": "eslint . --ext .js,.jsx --fix",
    "format": "prettier --write \"**/*.{js,jsx,json,md}\"",
    "build": "webpack --mode production",
    "start": "node server/server.js",
    "seed": "node database/seeds/index.js",
    "migrate": "node database/migrations/index.js",
    "docs": "jsdoc -c jsdoc.conf.json"
  }
}
```

## 🏗️ Architecture Deep Dive

### System Architecture Overview

The Web-Chat application follows a layered architecture pattern with clear separation of concerns:

```
┌─────────────────────────────────────────┐
│           Presentation Layer            │
│  ┌─────────────┐  ┌─────────────────┐   │
│  │ Web Client  │  │ Mobile Client   │   │
│  │ (HTML/CSS/JS)│  │ (React Native) │   │
│  └─────────────┘  └─────────────────┘   │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│            API Gateway Layer            │
│  ┌─────────────────────────────────────┐ │
│  │        Express.js Server            │ │
│  │  ┌─────────┐  ┌─────────────────┐   │ │
│  │  │ REST API│  │ WebSocket Server│   │ │
│  │  └─────────┘  └─────────────────┘   │ │
│  └─────────────────────────────────────┘ │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│           Business Logic Layer          │
│  ┌─────────────┐  ┌─────────────────┐   │
│  │Controllers  │  │   Services      │   │
│  └─────────────┘  └─────────────────┘   │
│  ┌─────────────┐  ┌─────────────────┐   │
│  │Middlewares  │  │   Utilities     │   │
│  └─────────────┘  └─────────────────┘   │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│           Data Access Layer             │
│  ┌─────────────┐  ┌─────────────────┐   │
│  │   Models    │  │   Repositories  │   │
│  └─────────────┘  └─────────────────┘   │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│            Data Storage Layer           │
│  ┌─────────────┐  ┌─────────────────┐   │
│  │  MongoDB    │  │     Redis       │   │
│  │ (Primary DB)│  │   (Cache/Sessions)│ │
│  └─────────────┘  └─────────────────┘   │
└─────────────────────────────────────────┘
```

### Core Components

#### 1. Server Entry Point

```javascript
// server/server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const { connectDB } = require('./config/database');
const { initializeWebSocket } = require('./config/websocket');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const roomRoutes = require('./routes/rooms');
const messageRoutes = require('./routes/messages');
const { errorHandler } = require('./middleware/errorHandler');
const { requestLogger } = require('./middleware/logger');

class WebChatServer {
  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    this.io = socketIo(this.server, {
      cors: {
        origin: process.env.WEBSOCKET_CORS_ORIGIN,
        methods: ['GET', 'POST']
      }
    });
    
    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeWebSocket();
    this.initializeErrorHandling();
  }

  initializeMiddleware() {
    // Security middleware
    this.app.use(helmet());
    this.app.use(cors());
    
    // Rate limiting
    const limiter = rateLimit({
      windowMs: process.env.RATE_LIMIT_WINDOW_MS,
      max: process.env.RATE_LIMIT_MAX_REQUESTS
    });
    this.app.use('/api/', limiter);
    
    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true }));
    
    // Logging
    this.app.use(requestLogger);
    
    // Static files
    this.app.use(express.static('public'));
  }

  initializeRoutes() {
    this.app.use('/api/auth', authRoutes);
    this.app.use('/api/users', userRoutes);
    this.app.use('/api/rooms', roomRoutes);
    this.app.use('/api/messages', messageRoutes);
    
    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
      });
    });
  }

  initializeWebSocket() {
    initializeWebSocket(this.io);
  }

  initializeErrorHandling() {
    this.app.use(errorHandler);
  }

  async start() {
    try {
      await connectDB();
      const PORT = process.env.PORT || 3001;
      
      this.server.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`📡 WebSocket server ready`);
        console.log(`🔗 http://localhost:${PORT}`);
      });
    } catch (error) {
      console.error('❌ Failed to start server:', error);
      process.exit(1);
    }
  }
}

// Start the server
const server = new WebChatServer();
server.start();
```

#### 2. Database Configuration

```javascript
// server/config/database.js
const mongoose = require('mongoose');
const { createClient } = require('redis');

class DatabaseManager {
  constructor() {
    this.mongoConnection = null;
    this.redisClient = null;
  }

  async connectMongoDB() {
    try {
      const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        bufferMaxEntries: 0,
        bufferCommands: false,
      };

      this.mongoConnection = await mongoose.connect(
        process.env.MONGODB_URI,
        options
      );

      console.log('✅ MongoDB connected successfully');
      
      // Handle connection events
      mongoose.connection.on('error', (err) => {
        console.error('❌ MongoDB connection error:', err);
      });

      mongoose.connection.on('disconnected', () => {
        console.warn('⚠️ MongoDB disconnected');
      });

      return this.mongoConnection;
    } catch (error) {
      console.error('❌ MongoDB connection failed:', error);
      throw error;
    }
  }

  async connectRedis() {
    try {
      this.redisClient = createClient({
        url: process.env.REDIS_URL,
        retry_strategy: (options) => {
          if (options.error && options.error.code === 'ECONNREFUSED') {
            return new Error('Redis server connection refused');
          }
          if (options.total_retry_time > 1000 * 60 * 60) {
            return new Error('Redis retry time exhausted');
          }
          if (options.attempt > 10) {
            return undefined;
          }
          return Math.min(options.attempt * 100, 3000);
        }
      });

      await this.redisClient.connect();
      console.log('✅ Redis connected successfully');

      this.redisClient.on('error', (err) => {
        console.error('❌ Redis connection error:', err);
      });

      return this.redisClient;
    } catch (error) {
      console.error('❌ Redis connection failed:', error);
      throw error;
    }
  }

  async connectAll() {
    await Promise.all([
      this.connectMongoDB(),
      this.connectRedis()
    ]);
  }

  async disconnect() {
    if (this.mongoConnection) {
      await mongoose.disconnect();
    }
    if (this.redisClient) {
      await this.redisClient.quit();
    }
  }
}

const dbManager = new DatabaseManager();

module.exports = {
  connectDB: () => dbManager.connectAll(),
  getRedisClient: () => dbManager.redisClient,
  disconnect: () => dbManager.disconnect()
};
```

## 📊 Database Design

### MongoDB Schema Design

#### User Model

```javascript
// server/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters'],
    match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores']
  },
  
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password in queries by default
  },
  
  profile: {
    firstName: {
      type: String,
      trim: true,
      maxlength: [50, 'First name cannot exceed 50 characters']
    },
    lastName: {
      type: String,
      trim: true,
      maxlength: [50, 'Last name cannot exceed 50 characters']
    },
    avatar: {
      type: String,
      default: null
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters']
    },
    timezone: {
      type: String,
      default: 'UTC'
    }
  },
  
  status: {
    type: String,
    enum: ['online', 'away', 'busy', 'offline'],
    default: 'offline'
  },
  
  lastSeen: {
    type: Date,
    default: Date.now
  },
  
  joinedRooms: [{
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    role: {
      type: String,
      enum: ['member', 'moderator', 'admin'],
      default: 'member'
    }
  }],
  
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'auto'
    },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      sound: { type: Boolean, default: true }
    },
    privacy: {
      showOnlineStatus: { type: Boolean, default: true },
      showLastSeen: { type: Boolean, default: true }
    }
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  
  refreshToken: {
    type: String,
    select: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
userSchema.index({ username: 1 });
userSchema.index({ email: 1 });
userSchema.index({ 'joinedRooms.room': 1 });
userSchema.index({ createdAt: -1 });

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.profile.firstName || ''} ${this.profile.lastName || ''}`.trim();
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Instance method to update last seen
userSchema.methods.updateLastSeen = function() {
  this.lastSeen = new Date();
  return this.save({ validateBeforeSave: false });
};

// Static method to find active users
userSchema.statics.findActiveUsers = function() {
  return this.find({ isActive: true }).select('-password -refreshToken');
};

module.exports = mongoose.model('User', userSchema);
```

#### Room Model

```javascript
// server/models/Room.js
const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Room name is required'],
    trim: true,
    minlength: [1, 'Room name must be at least 1 character'],
    maxlength: [100, 'Room name cannot exceed 100 characters']
  },
  
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  
  type: {
    type: String,
    enum: ['public', 'private', 'direct'],
    default: 'public'
  },
  
  password: {
    type: String,
    select: false
  },
  
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['member', 'moderator', 'admin'],
      default: 'member'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    lastRead: {
      type: Date,
      default: Date.now
    }
  }],
  
  settings: {
    maxMembers: {
      type: Number,
      default: 100,
      min: 1,
      max: 1000
    },
    allowInvites: {
      type: Boolean,
      default: true
    },
    messageRetention: {
      type: Number,
      default: 30 // days
    }
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  
  lastActivity: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
roomSchema.index({ name: 1 });
roomSchema.index({ type: 1 });
roomSchema.index({ owner: 1 });
roomSchema.index({ 'members.user': 1 });
roomSchema.index({ lastActivity: -1 });

// Virtual for member count
roomSchema.virtual('memberCount').get(function() {
  return this.members.length;
});

// Instance method to add member
roomSchema.methods.addMember = function(userId, role = 'member') {
  const existingMember = this.members.find(
    member => member.user.toString() === userId.toString()
  );
  
  if (existingMember) {
    throw new Error('User is already a member of this room');
  }
  
  this.members.push({
    user: userId,
    role: role,
    joinedAt: new Date()
  });
  
  return this.save();
};

// Instance method to remove member
roomSchema.methods.removeMember = function(userId) {
  this.members = this.members.filter(
    member => member.user.toString() !== userId.toString()
  );
  
  return this.save();
};

// Instance method to update member role
roomSchema.methods.updateMemberRole = function(userId, newRole) {
  const member = this.members.find(
    member => member.user.toString() === userId.toString()
  );
  
  if (!member) {
    throw new Error('User is not a member of this room');
  }
  
  member.role = newRole;
  return this.save();
};

// Static method to find public rooms
roomSchema.statics.findPublicRooms = function() {
  return this.find({ type: 'public', isActive: true })
             .populate('owner', 'username profile.firstName profile.lastName')
             .sort({ lastActivity: -1 });
};

module.exports = mongoose.model('Room', roomSchema);
```

#### Message Model

```javascript
// server/models/Message.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Message content is required'],
    maxlength: [2000, 'Message cannot exceed 2000 characters']
  },
  
  type: {
    type: String,
    enum: ['text', 'image', 'file', 'system'],
    default: 'text'
  },
  
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
    default: null
  },
  
  attachment: {
    filename: String,
    originalName: String,
    mimeType: String,
    size: Number,
    path: String,
    url: String
  },
  
  reactions: [{
    emoji: {
      type: String,
      required: true
    },
    users: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  }],
  
  mentions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  isEdited: {
    type: Boolean,
    default: false
  },
  
  editHistory: [{
    content: String,
    editedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  isDeleted: {
    type: Boolean,
    default: false
  },
  
  deletedAt: Date,
  
  readBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
messageSchema.index({ room: 1, createdAt: -1 });
messageSchema.index({ sender: 1 });
messageSchema.index({ content: 'text' }); // Text search index
messageSchema.index({ mentions: 1 });

// Virtual for reaction count
messageSchema.virtual('reactionCount').get(function() {
  return this.reactions.reduce((total, reaction) => total + reaction.users.length, 0);
});

// Instance method to add reaction
messageSchema.methods.addReaction = function(emoji, userId) {
  const existingReaction = this.reactions.find(reaction => reaction.emoji === emoji);
  
  if (existingReaction) {
    if (!existingReaction.users.includes(userId)) {
      existingReaction.users.push(userId);
    }
  } else {
    this.reactions.push({
      emoji: emoji,
      users: [userId]
    });
  }
  
  return this.save();
};

// Instance method to remove reaction
messageSchema.methods.removeReaction = function(emoji, userId) {
  const reactionIndex = this.reactions.findIndex(reaction => reaction.emoji === emoji);
  
  if (reactionIndex > -1) {
    const reaction = this.reactions[reactionIndex];
    reaction.users = reaction.users.filter(user => user.toString() !== userId.toString());
    
    if (reaction.users.length === 0) {
      this.reactions.splice(reactionIndex, 1);
    }
  }
  
  return this.save();
};

// Instance method to mark as read by user
messageSchema.methods.markAsRead = function(userId) {
  const existingRead = this.readBy.find(
    read => read.user.toString() === userId.toString()
  );
  
  if (!existingRead) {
    this.readBy.push({
      user: userId,
      readAt: new Date()
    });
    return this.save();
  }
  
  return Promise.resolve(this);
};

// Static method to find recent messages in room
messageSchema.statics.findRecentMessages = function(roomId, limit = 50) {
  return this.find({ room: roomId, isDeleted: false })
             .populate('sender', 'username profile.firstName profile.lastName profile.avatar')
             .populate('replyTo')
             .sort({ createdAt: -1 })
             .limit(limit);
};

module.exports = mongoose.model('Message', messageSchema);
```

### Redis Data Structures

```javascript
// server/utils/redisKeys.js
class RedisKeys {
  // User session keys
  static userSession(userId) {
    return `user:session:${userId}`;
  }
  
  // Room member keys
  static roomMembers(roomId) {
    return `room:members:${roomId}`;
  }
  
  // Online users
  static onlineUsers() {
    return 'users:online';
  }
  
  // Typing indicators
  static typingUsers(roomId) {
    return `room:typing:${roomId}`;
  }
  
  // Message cache
  static roomMessages(roomId) {
    return `room:messages:${roomId}`;
  }
  
  // Rate limiting
  static rateLimitKey(identifier) {
    return `rate_limit:${identifier}`;
  }
  
  // Temporary data
  static tempData(key) {
    return `temp:${key}`;
  }
}

module.exports = RedisKeys;
```

