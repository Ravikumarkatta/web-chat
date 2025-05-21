# ChatSphere Project Structure

## Frontend
- `/public/`
  - `index.html` (Main HTML file)
  - `styles.css` (Additional CSS styles)
  - `assets/` (Images, icons, etc.)
  - `js/`
    - `app.js` (Main application logic)
    - `chat.js` (WebSocket client implementation)
    - `auth.js` (Authentication logic)
    - `utils.js` (Utility functions)

## Backend
- `/server/`
  - `server.js` (Main Express server file)
  - `config/`
    - `db.js` (Database configuration)
    - `websocket.js` (WebSocket server configuration)
  - `models/`
    - `User.js` (User model)
    - `Message.js` (Message model)
    - `Room.js` (Room model)
  - `routes/`
    - `auth.js` (Authentication routes)
    - `users.js` (User management routes)
    - `rooms.js` (Room management routes)
    - `messages.js` (Message handling routes)
  - `controllers/`
    - `authController.js` (Authentication logic)
    - `userController.js` (User management logic)
    - `roomController.js` (Room management logic)
    - `messageController.js` (Message handling logic)
  - `middlewares/`
    - `auth.js` (Authentication middleware)
    - `validation.js` (Input validation middleware)
  - `utils/`
    - `helpers.js` (Helper functions)

## Database
- `/database/`
  - `migrations/` (Database migration files)
  - `seeds/` (Database seed files)

## Config Files
- `package.json` (Node.js package configuration)
- `.env` (Environment variables)
- `.gitignore` (Git ignore file)
- `README.md` (Project documentation)
- `docker-compose.yml` (Docker configuration if applicable)

## Tests
- `/tests/`
  - `frontend/` (Frontend tests)
  - `backend/` (Backend tests)
  - `integration/` (Integration tests)

## Author
Ravi

## License
MIT

## Version
1.0.0
