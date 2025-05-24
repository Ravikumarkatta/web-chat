const mongoose = require('mongoose');
const { DB_URI } = require('./config');

// Database connection setup
const connectDB = async () => {
  try {
    await mongoose.connect(DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err.message); // Log the error message
    process.exit(1);
  }
};

module.exports = connectDB;
