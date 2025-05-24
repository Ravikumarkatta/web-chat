# Web-Chat 🌐💬

A modern, real-time chat application built with WebSocket technology, featuring secure authentication, room-based messaging, and an intuitive user interface.


## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [API Documentation](#api-documentation)
- [Robustness & Security](#robustness--security)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🌟 Overview

Web-chat is a full-stack real-time chat application designed for seamless communication across multiple chat rooms. Built with modern web technologies, it provides a Discord-like experience with features such as user authentication, room management, typing indicators, and file sharing capabilities.

### Key Highlights

- **Real-time messaging** with WebSocket connections
- **Multi-room support** with public and private channels
- **User authentication** with JWT tokens
- **Responsive design** optimized for all devices
- **Typing indicators** and user activity status
- **File sharing** and image attachments
- **Message reactions** and rich text formatting

## ✨ Features

### Core Features
- 🔐 **Secure Authentication** - JWT-based login/registration system
- 💬 **Real-time Messaging** - Instant message delivery via WebSockets
- 🏠 **Room Management** - Create, join, and manage chat rooms
- 👥 **User Management** - User profiles, online status, and activity tracking
- 📁 **File Sharing** - Upload and share images and documents
- 🎭 **Message Reactions** - React to messages with emojis
- ⌨️ **Typing Indicators** - See when others are typing
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile

### Advanced Features
- 🔒 **Private Rooms** - Password-protected channels
- 🔍 **Message Search** - Find messages across all rooms
- 📊 **User Analytics** - Activity tracking and statistics
- 🌙 **Dark/Light Theme** - Customizable UI themes
- 🔔 **Push Notifications** - Desktop and mobile notifications
- 📝 **Message History** - Persistent chat history
- 🛡️ **Moderation Tools** - Admin controls and user management

## 🏗️ Architecture

### System Architecture Diagram

```mermaid
graph TB
    subgraph "Client Layer"
        A[Web Browser] --> B[React Frontend]
        B --> C[WebSocket Client]
        B --> D[HTTP Client]
    end
    
    subgraph "Server Layer"
        E[Express Server] --> F[WebSocket Server]
        E --> G[REST API Routes]
        E --> H[Authentication Middleware]
    end
    
    subgraph "Data Layer"
        I[MongoDB Database]
        J[Redis Cache]
        K[File Storage]
    end
    
    C <--> F
    D --> G
    G --> H
    H --> I
    F --> J
    G --> K
    
    style A fill:#e1f5fe
    style B fill:#f3e5f5
    style E fill:#e8f5e8
    style I fill:#fff3e0
```

### Component Flow Diagram

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as Auth Service
    participant W as WebSocket
    participant S as Server
    participant D as Database
    
    U->>F: Login Request
    F->>A: Authenticate User
    A->>S: Validate Credentials
    S->>D: Query User Data
    D-->>S: User Information
    S-->>A: JWT Token
    A-->>F: Authentication Success
    F->>W: Establish WebSocket Connection
    W->>S: Connection Handshake
    S-->>W: Connection Confirmed
    U->>F: Send Message
    F->>W: Emit Message Event
    W->>S: Broadcast Message
    S->>D: Store Message
    S->>W: Broadcast to Room
    W-->>F: Receive Message
    F-->>U: Display Message
```

## 🛠️ Technology Stack

### Frontend
- **HTML5** - Semantic markup and structure
- **CSS3/Tailwind CSS** - Modern styling and responsive design
- **Vanilla JavaScript** - Core application logic
- **WebSocket API** - Real-time communication
- **Font Awesome** - Icon library

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **Socket.io** - WebSocket implementation
- **JWT** - JSON Web Token authentication
- **bcrypt** - Password hashing
- **Multer** - File upload handling

### Database & Storage
- **MongoDB** - Primary database for user data and messages
- **Redis** - Caching and session management
- **AWS S3** - File storage (optional)
- **GridFS** - Large file storage in MongoDB

### DevOps & Tools
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Jest** - Testing framework
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **GitHub Actions** - CI/CD pipeline

## 📁 Project Structure

```
Web-chat/
├── 📂 public/                    # Frontend static files
│   ├── 📄 index.html            # Main HTML file
│   ├── 📄 styles.css            # Additional CSS styles
│   ├── 📂 assets/               # Images, icons, etc.
│   └── 📂 js/                   # Frontend JavaScript
│       ├── 📄 app.js            # Main application logic
│       ├── 📄 chat.js           # WebSocket client
│       ├── 📄 auth.js           # Authentication logic
│       └── 📄 utils.js          # Utility functions
├── 📂 server/                   # Backend application
│   ├── 📄 server.js             # Main Express server
│   ├── 📂 config/               # Configuration files
│   │   ├── 📄 db.js             # Database configuration
│   │   └── 📄 websocket.js      # WebSocket configuration
│   ├── 📂 models/               # Database models
│   │   ├── 📄 User.js           # User model
│   │   ├── 📄 Message.js        # Message model
│   │   └── 📄 Room.js           # Room model
│   ├── 📂 routes/               # API route handlers
│   │   ├── 📄 auth.js           # Authentication routes
│   │   ├── 📄 users.js          # User management
│   │   ├── 📄 rooms.js          # Room management
│   │   └── 📄 messages.js       # Message handling
│   ├── 📂 controllers/          # Business logic
│   │   ├── 📄 authController.js
│   │   ├── 📄 userController.js
│   │   ├── 📄 roomController.js
│   │   └── 📄 messageController.js
│   ├── 📂 middlewares/          # Express middlewares
│   │   ├── 📄 auth.js           # Auth middleware
│   │   └── 📄 validation.js     # Input validation
│   └── 📂 utils/                # Helper functions
│       └── 📄 helpers.js
├── 📂 database/                 # Database files
│   ├── 📂 migrations/           # DB migration scripts
│   └── 📂 seeds/                # DB seed data
├── 📂 tests/                    # Test files
│   ├── 📂 frontend/             # Frontend tests
│   ├── 📂 backend/              # Backend tests
│   └── 📂 integration/          # Integration tests
├── 📄 package.json              # Node.js dependencies
├── 📄 docker-compose.yml        # Docker configuration
├── 📄 .env.example              # Environment variables template
├── 📄 .gitignore                # Git ignore rules
└── 📄 README.md                 # Project documentation
```

## 🚀 Installation & Setup

### Prerequisites

- **Node.js** (v14.0.0 or higher)
- **MongoDB** (v4.4 or higher)
- **Redis** (v6.0 or higher)
- **Git**

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/web-chat.git
   cd Web-chat
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file:
   ```env
   # Server Configuration
   PORT=3001
   NODE_ENV=development
   
   # Database Configuration
   MONGODB_URI=mongodb://localhost:27017/Web-chat
   REDIS_URL=redis://localhost:6379
   
   # Authentication
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=7d
   
   # File Upload
   MAX_FILE_SIZE=10485760
   UPLOAD_PATH=./uploads
   
   # Email Configuration (optional)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   ```

4. **Start the services**
   
   **Option A: Using Docker Compose (Recommended)**
   ```bash
   docker-compose up -d
   ```
   
   **Option B: Manual Setup**
   ```bash
   # Start MongoDB
   sudo systemctl start mongod
   
   # Start Redis
   sudo systemctl start redis-server
   
   # Start the application
   npm run dev
   ```

5. **Access the application**
   - Open your browser and navigate to `http://localhost:3001`
   - Register a new account or use demo credentials

### Development Setup

```bash
# Install development dependencies
npm install --dev

# Run in development mode with hot reload
npm run dev

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint code
npm run lint

# Format code
npm run format
```

## 📚 API Documentation

### Authentication Endpoints

#### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "username": "your name",
  "email": "your@example.com",
  "password": "securePassword123",
  "firstName": "First name",
  "lastName": "Last name"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "60d21b4667d0d8992e4c1234",
    "username": "your name",
  "email": "your@example.com",
  "password": "securePassword123",
  "firstName": "First name",
  "lastName": "Last name"
  }
}
```

#### POST /api/auth/login
Authenticate user and return JWT token.

**Request Body:**
```json
{
  "username": "your name",
  "password": "securePassword123",
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d21b4667d0d8992e4c1234",
   "username": "your name",
}
```

### Room Management Endpoints

#### GET /api/rooms
Get all available chat rooms.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "rooms": [
    {
      "id": "60d21b4667d0d8992e4c5678",
      "name": "General",
      "description": "General discussion room",
      "isPrivate": false,
      "memberCount": 15,
      "createdAt": "2023-06-15T10:30:00Z"
    }
  ]
}
```

#### POST /api/rooms
Create a new chat room.

**Request Body:**
```json
{
  "name": "Tech Discussion",
  "description": "Room for technical discussions",
  "isPrivate": false,
  "password": "optional-password"
}
```

### WebSocket Events

#### Client to Server Events

| Event | Description | Payload |
|-------|-------------|---------|
| `join-room` | Join a specific room | `{ roomId: string }` |
| `leave-room` | Leave current room | `{ roomId: string }` |
| `send-message` | Send a message | `{ roomId: string, message: string, type: 'text' }` |
| `typing-start` | User started typing | `{ roomId: string }` |
| `typing-stop` | User stopped typing | `{ roomId: string }` |

#### Server to Client Events

| Event | Description | Payload |
|-------|-------------|---------|
| `message-received` | New message in room | `{ message: object, user: object, timestamp: string }` |
| `user-joined` | User joined room | `{ user: object, roomId: string }` |
| `user-left` | User left room | `{ userId: string, roomId: string }` |
| `typing-status` | Typing indicator update | `{ userId: string, isTyping: boolean }` |

## 🛡️ Robustness & Security

### Security Measures

#### Authentication & Authorization
- **JWT Token Security**: Tokens are signed with strong secrets and have expiration times
- **Password Hashing**: bcrypt with salt rounds for secure password storage
- **Input Validation**: Comprehensive validation using Joi schemas
- **Rate Limiting**: Prevents brute force attacks and API abuse
- **CORS Configuration**: Proper cross-origin resource sharing setup

```javascript
// Example: Password Hashing Implementation
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 12;

async function hashPassword(password) {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

async function verifyPassword(password, hash) {
  return await bcrypt.compare(password, hash);
}
```

#### Data Protection
- **Input Sanitization**: HTML and SQL injection prevention
- **XSS Protection**: Content Security Policy headers
- **SQL Injection Prevention**: Parameterized queries and ORM usage
- **File Upload Security**: File type validation and size limits

#### Network Security
- **HTTPS Enforcement**: SSL/TLS encryption for all communications
- **WebSocket Security**: Origin validation and authentication
- **API Security**: Request signing and timestamp validation

### Error Handling & Recovery

#### Graceful Error Handling
```javascript
// Global Error Handler
app.use((error, req, res, next) => {
  logger.error('Unhandled error:', error);
  
  if (error.isOperational) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message
    });
  }
  
  // Don't leak error details in production
  const message = process.env.NODE_ENV === 'production' 
    ? 'Something went wrong' 
    : error.message;
    
  res.status(500).json({
    success: false,
    message
  });
});
```

#### Database Resilience
- **Connection Pooling**: Efficient database connection management
- **Automatic Reconnection**: Handles temporary database outages
- **Transaction Support**: ACID compliance for critical operations
- **Backup Strategy**: Regular automated backups

#### WebSocket Reliability
- **Automatic Reconnection**: Client-side reconnection logic
- **Heartbeat Mechanism**: Keeps connections alive
- **Graceful Degradation**: Fallback to HTTP polling if WebSocket fails

```javascript
// WebSocket Reconnection Logic
class RobustWebSocket {
  constructor(url, options = {}) {
    this.url = url;
    this.options = options;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectInterval = 1000;
    
    this.connect();
  }
  
  connect() {
    this.ws = new WebSocket(this.url);
    
    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
    };
    
    this.ws.onclose = () => {
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        setTimeout(() => {
          this.reconnectAttempts++;
          this.connect();
        }, this.reconnectInterval * Math.pow(2, this.reconnectAttempts));
      }
    };
    
    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }
}
```

### Performance Optimization

#### Caching Strategy
- **Redis Caching**: Session data and frequently accessed information
- **Message Caching**: Recent messages for quick retrieval
- **CDN Integration**: Static asset delivery optimization

#### Database Optimization
- **Indexing Strategy**: Optimized database indexes for query performance
- **Query Optimization**: Efficient database queries with pagination
- **Connection Pooling**: Reuse database connections

#### Frontend Performance
- **Code Splitting**: Lazy loading of application modules
- **Asset Compression**: Gzipped assets for faster loading
- **Browser Caching**: Efficient cache headers for static resources

### Monitoring & Logging

#### Application Monitoring
```javascript
// Health Check Endpoint
app.get('/health', async (req, res) => {
  const healthCheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
    checks: {
      database: await checkDatabaseHealth(),
      redis: await checkRedisHealth(),
      memory: process.memoryUsage(),
      cpu: process.cpuUsage()
    }
  };
  
  res.status(200).json(healthCheck);
});
```

#### Comprehensive Logging
- **Structured Logging**: JSON format for easy parsing
- **Log Levels**: Debug, Info, Warn, Error categorization
- **Request Logging**: All API requests and responses
- **Error Tracking**: Detailed error information and stack traces

## 🧪 Testing

### Test Structure

```
tests/
├── unit/                 # Unit tests
│   ├── models/          # Database model tests
│   ├── controllers/     # Controller logic tests
│   └── utils/           # Utility function tests
├── integration/         # Integration tests
│   ├── api/            # API endpoint tests
│   └── websocket/      # WebSocket functionality tests
├── e2e/                # End-to-end tests
│   ├── auth.test.js    # Authentication flow
│   ├── chat.test.js    # Chat functionality
│   └── rooms.test.js   # Room management
└── fixtures/           # Test data and mocks
```

### Running Tests

```bash
# Run all tests
npm test

# Run specific test suite
npm test -- --grep "Authentication"

# Run with coverage report
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run end-to-end tests
npm run test:e2e
```

### Test Examples

```javascript
// Example: Unit Test for User Model
describe('User Model', () => {
  it('should hash password before saving', async () => {
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'plaintext'
    };
    
    const user = new User(userData);
    await user.save();
    
    expect(user.password).not.toBe('plaintext');
    expect(await bcrypt.compare('plaintext', user.password)).toBe(true);
  });
});

// Example: Integration Test for Chat API
describe('Chat API', () => {
  it('should send message to room', async () => {
    const token = await loginUser('testuser', 'password');
    
    const response = await request(app)
      .post('/api/messages')
      .set('Authorization', `Bearer ${token}`)
      .send({
        roomId: 'room123',
        message: 'Hello World',
        type: 'text'
      });
      
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
  });
});
```

## 🚀 Deployment

### Production Deployment Options

#### Option 1: Docker Deployment

```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "80:3001"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/Web-chat
      - REDIS_URL=redis://redis:6379
    depends_on:
      - mongo
      - redis
    restart: unless-stopped
    
  mongo:
    image: mongo:4.4
    volumes:
      - mongo_data:/data/db
    restart: unless-stopped
    
  redis:
    image: redis:6-alpine
    restart: unless-stopped
    
  nginx:
    image: nginx:alpine
    ports:
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/ssl
    depends_on:
      - app
    restart: unless-stopped

volumes:
  mongo_data:
```

#### Option 2: Cloud Deployment (AWS)

```bash
# Deploy to AWS ECS
aws ecs create-cluster --cluster-name Web-chat-cluster

# Create task definition
aws ecs register-task-definition --cli-input-json file://task-definition.json

# Create service
aws ecs create-service \
  --cluster Web-chat-cluster \
  --service-name Web-chat-service \
  --task-definition Web-chat:1 \
  --desired-count 2
```

#### Option 3: Heroku Deployment

```bash
# Install Heroku CLI and login
heroku login

# Create new app
heroku create Web-chat-app

# Add MongoDB addon
heroku addons:create mongolab:sandbox

# Add Redis addon
heroku addons:create heroku-redis:hobby-dev

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-production-secret

# Deploy
git push heroku main
```

### Environment Configuration

#### Production Environment Variables
```env
# Production Configuration
NODE_ENV=production
PORT=3001

# Database URLs
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/Web-chat
REDIS_URL=redis://redis-server:6379

# Security
JWT_SECRET=super-secure-production-secret-key
SESSION_SECRET=another-secure-secret

# File Storage
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
S3_BUCKET_NAME=Web-chat-files

# Email Service
SENDGRID_API_KEY=your-sendgrid-api-key

# Monitoring
SENTRY_DSN=https://your-sentry-dsn
```

## 🤝 Contributing

We welcome contributions from the community! Please follow these guidelines:

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Add tests** for new functionality
5. **Run the test suite**
   ```bash
   npm test
   ```
6. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```
7. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```
8. **Open a Pull Request**

### Code Style Guidelines

- Follow ESLint configuration
- Use Prettier for code formatting
- Write meaningful commit messages
- Add JSDoc comments for functions
- Maintain test coverage above 80%

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No new warnings introduced
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2023 Ravi

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 🆘 Support

- **Documentation**: [Wiki](https://github.com/your-username/chat/wiki)
- **Issues**: [GitHub Issues](https://github.com/your-username/chat/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/chat/discussions)
- **Email**: kattaravi000@gmail.com

## 🎯 Roadmap

### Version 2.0 (Q3 2025)
- [ ] Mobile applications (React Native)
- [ ] Voice and video calling
- [ ] Advanced moderation tools
- [ ] Plugin system
- [ ] Multi-language support

### Version 2.1 (Q4 2025)
- [ ] AI-powered message suggestions
- [ ] Advanced search functionality
- [ ] Message scheduling
- [ ] Custom themes and customization
- [ ] Integration with third-party services

---

<div align="center">

**Made with ❤️ by [Ravi](https://github.com/ravi)**

⭐ **Star this repository if you found it helpful!** ⭐

</div>
