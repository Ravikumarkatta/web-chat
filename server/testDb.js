require('dotenv').config();
const mongoose = require('mongoose');

const testConnection = async () => {
  try {
    console.log('Testing MongoDB connection...');
    console.log(`Using connection string: ${process.env.DB_URI.replace(/:([^:@]+)@/, ':****@')}`);
    
    await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('MongoDB connection successful!');
    
    // Create a simple test collection
    const TestModel = mongoose.model('Test', new mongoose.Schema({
      name: String,
      date: { type: Date, default: Date.now }
    }));
    
    // Insert a test document
    const testDoc = new TestModel({ name: 'Test Connection' });
    await testDoc.save();
    console.log('Test document created successfully');
    
    // Find the test document
    const foundDoc = await TestModel.findOne({ name: 'Test Connection' });
    console.log('Retrieved test document:', foundDoc);
    
    // Clean up - remove the test document
    await TestModel.deleteOne({ _id: foundDoc._id });
    console.log('Test document deleted successfully');
    
    mongoose.connection.close();
    console.log('Connection closed');
    
    return true;
  } catch (err) {
    console.error('MongoDB connection test failed:', err.message);
    
    if (err.name === 'MongoNetworkError' || err.message.includes('connect ECONNREFUSED')) {
      console.log('\nSuggestions:');
      console.log('1. Check if you have MongoDB installed and running locally');
      console.log('2. Verify your MongoDB Atlas connection string in the .env file');
      console.log('3. Make sure your IP address is whitelisted in MongoDB Atlas');
      console.log('4. Check if your username and password are correct in the connection string');
    }
    
    return false;
  }
};

// Run the test if this file is executed directly
if (require.main === module) {
  testConnection()
    .then(success => {
      process.exit(success ? 0 : 1);
    });
}

module.exports = { testConnection };