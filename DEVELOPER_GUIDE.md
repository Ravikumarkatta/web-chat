# ChatSphere Developer Guide

## Key Files Overview

### Backend Core
1. `server/app.js` - Main Express server setup
   - Initializes middleware
   - Connects routes  
   - Starts WebSocket server

2. `server/config/db.js` - Database connection
   - MongoDB setup
   - Connection handling
   - Error management

3. `server/config/websocket.js` - Real-time communication
   - WebSocket server setup
   - Authentication handling
   - Message broadcasting

### Controllers
1. `authController.js` - User authentication
   - Login/register logic
   - JWT token generation
   - Session management

2. `userController.js` - User operations  
   - CRUD operations
   - Profile management
   - Data validation

3. `roomController.js` - Chat room logic
   - Room creation/management
   - User joining/leaving
   - Access control

### Models
1. `User.js` - User schema
   - Authentication fields
   - Profile data
   - Relationships

2. `Message.js` - Message schema  
   - Content storage
   - Timestamps
   - Sender/room references

## Key Concepts
- JWT Authentication
- WebSocket communication
- MVC architecture
- Async/await patterns
- Error handling
- Data validation

## Beginner Tips
1. Start with `app.js` to understand the overall flow
2. Trace a message from frontend to database
3. Use Postman to test API endpoints
4. Check WebSocket events in browser console
5. Refer to models to understand data structure
