const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const env = require('./env');

let memoryServer = null;
let connectionMode = 'disconnected';

async function connectDatabase() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  mongoose.set('strictQuery', true);

  let uri = env.mongodbUri;

  if (!uri) {
    if (env.isProduction) {
      throw new Error(
        'FATAL: MONGODB_URI environment variable is required in production.'
      );
    }

    // Boot a real embedded mongod via mongodb-memory-server for zero-config local dev & testing
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const dbPath = path.resolve(__dirname, '../../.mongodb-data');
    fs.mkdirSync(dbPath, { recursive: true });

    try {
      memoryServer = await MongoMemoryServer.create({
        instance: {
          dbName: 'kalaakriti_studios',
          dbPath,
          storageEngine: 'wiredTiger',
        },
      });
      connectionMode = 'embedded-persistent-mongodb';
    } catch (persistErr) {
      console.warn(
        '[db] Persistent local mongod path unavailable, falling back to in-memory mongod:',
        persistErr.message
      );
      memoryServer = await MongoMemoryServer.create({
        instance: {
          dbName: 'kalaakriti_studios',
        },
      });
      connectionMode = 'embedded-memory-mongodb';
    }

    uri = memoryServer.getUri('kalaakriti_studios');
    console.log(
      `[db] MONGODB_URI not provided — started local embedded MongoDB (${connectionMode})`
    );
  } else {
    connectionMode = 'external-mongodb';
  }

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
    maxPoolSize: 10,
  });

  console.log(
    `[db] Connected to MongoDB (${connectionMode}) — database: ${mongoose.connection.name}`
  );
  return mongoose.connection;
}

async function disconnectDatabase() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
  connectionMode = 'disconnected';
}

function getDatabaseStatus() {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  return {
    state: states[mongoose.connection.readyState] || 'unknown',
    mode: connectionMode,
    database: mongoose.connection.name || null,
  };
}

module.exports = {
  connectDatabase,
  disconnectDatabase,
  getDatabaseStatus,
};
