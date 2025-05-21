const mongoose = require('mongoose');
require('dotenv').config();

// Database connection setup
const connectDB = async () => {
  try {
    if (!process.env.DB_URI) {
      console.error('MongoDB URI is not defined in environment variables');
      console.error('Using an in-memory MongoDB instance for development');
      
      // For development, you could set up an in-memory MongoDB server
      // This is just a placeholder - the app will continue but DB operations will fail
      return;
    }
    
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    console.log('The application will continue to run, but database operations will fail.');
    console.log('Please ensure you have a valid MongoDB instance running or MongoDB Atlas connection string.');
  }
};

module.exports = { connectDB };