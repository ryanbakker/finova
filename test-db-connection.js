// Test script to verify MongoDB connection
// Run this with: node test-db-connection.js

const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URL = process.env.MONGODB_URL;

async function testConnection() {
  console.log('Testing MongoDB connection...');
  console.log('MONGODB_URL exists:', !!MONGODB_URL);
  
  if (!MONGODB_URL) {
    console.error('MONGODB_URL is not set');
    return;
  }

  try {
    // Test with minimal options first
    console.log('Attempting connection with minimal options...');
    await mongoose.connect(MONGODB_URL, {
      dbName: "InstantAI",
      bufferCommands: false,
    });
    
    console.log('✅ Connection successful with minimal options!');
    
    // Test with SSL options
    await mongoose.disconnect();
    console.log('Testing with SSL options...');
    
    await mongoose.connect(MONGODB_URL, {
      dbName: "InstantAI",
      bufferCommands: false,
      ssl: true,
      tls: true,
      tlsAllowInvalidCertificates: false,
      tlsAllowInvalidHostnames: false,
    });
    
    console.log('✅ Connection successful with SSL options!');
    
    // Test database operations
    const testCollection = mongoose.connection.collection('test');
    await testCollection.insertOne({ test: 'data', timestamp: new Date() });
    console.log('✅ Database write operation successful!');
    
    const result = await testCollection.findOne({ test: 'data' });
    console.log('✅ Database read operation successful!', result);
    
    // Clean up
    await testCollection.deleteOne({ test: 'data' });
    console.log('✅ Database cleanup successful!');
    
    await mongoose.disconnect();
    console.log('✅ All tests passed!');
    
  } catch (error) {
    console.error('❌ Connection failed:', error);
    
    // Try alternative connection string formats
    if (MONGODB_URL.includes('mongodb+srv://')) {
      console.log('Trying with explicit SSL parameters...');
      try {
        const modifiedUrl = MONGODB_URL + '?ssl=true&tls=true';
        await mongoose.connect(modifiedUrl, {
          dbName: "InstantAI",
          bufferCommands: false,
        });
        console.log('✅ Connection successful with modified URL!');
        await mongoose.disconnect();
      } catch (sslError) {
        console.error('❌ SSL connection also failed:', sslError);
      }
    }
  }
}

testConnection();
