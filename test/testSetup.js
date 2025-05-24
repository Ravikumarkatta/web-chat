const mongoose = require('mongoose');
const connectDB = require('../server/config/db');
const { DB_URI } = require('../server/config/config');

beforeAll(async () => {
  // Use a separate test database
  const testDBUri = 'mongodb+srv://kattaravi000:<ufIVC7of4RPoAslY>@cluster0.jlhtgsy.mongodb.net/';
  process.env.DB_URI = testDBUri; // Ensure DB_URI is set
  try {
    await connectDB();
    console.log('Connected to test database');
  } catch (error) {
    console.error('Failed to connect to test database:', error);
    throw error; // Throw the error to fail the tests
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});
