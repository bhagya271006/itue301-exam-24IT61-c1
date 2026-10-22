const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/eventhub_db';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[MongoDB] Connected successfully to: ${conn.connection.host}/${conn.connection.name}`);
    const autoSeedIfEmpty = require('../seeds/seedDataHelper');
    await autoSeedIfEmpty();
  } catch (err) {
    console.warn(`[MongoDB] Primary connection failed (${err.message}). Starting in-memory MongoDB fallback...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const memoryUri = mongod.getUri();
      const conn = await mongoose.connect(memoryUri);
      console.log(`[MongoDB] In-Memory MongoDB connected at: ${memoryUri}`);
      const autoSeedIfEmpty = require('../seeds/seedDataHelper');
      await autoSeedIfEmpty();
    } catch (fallbackErr) {
      console.error(`[MongoDB] Failed to connect: ${fallbackErr.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
