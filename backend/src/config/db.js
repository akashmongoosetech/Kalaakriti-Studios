const fs = require('fs');
const os = require('os');
const path = require('path');
const mongoose = require('mongoose');
const env = require('./env');

let memoryServer = null;
let connectionMode = 'disconnected';
let lastConnectionError = null;
let readyPromise = null;
let isInitialized = false;

async function startEmbeddedMongo() {
  const { MongoMemoryServer } = require('mongodb-memory-server');

  const preferredDbPath = env.isProduction
    ? path.join(os.tmpdir(), 'kalaakriti-mongodb-data')
    : path.resolve(__dirname, '../../.mongodb-data');

  const binaryDownloadDir = path.join(os.tmpdir(), 'mongodb-binaries');

  // Attempt persistent embedded MongoDB first (in /tmp for Cloud Run or .mongodb-data in local dev)
  try {
    fs.mkdirSync(preferredDbPath, { recursive: true });
    memoryServer = await MongoMemoryServer.create({
      instance: {
        dbName: 'kalaakriti_studios',
        dbPath: preferredDbPath,
        storageEngine: 'wiredTiger',
      },
      ...(env.isProduction ? { binary: { downloadDir: binaryDownloadDir } } : {}),
    });
    connectionMode = 'embedded-persistent-mongodb';
    return memoryServer.getUri('kalaakriti_studios');
  } catch (persistErr) {
    console.warn(
      '[db] Persistent embedded mongod unavailable, falling back to ephemeral in-memory mongod:',
      persistErr.message
    );
  }

  // Fallback to pure ephemeral in-memory MongoDB
  fs.mkdirSync(binaryDownloadDir, { recursive: true });
  memoryServer = await MongoMemoryServer.create({
    instance: {
      dbName: 'kalaakriti_studios',
    },
    ...(env.isProduction ? { binary: { downloadDir: binaryDownloadDir } } : {}),
  });
  connectionMode = 'embedded-memory-mongodb';
  return memoryServer.getUri('kalaakriti_studios');
}

async function connectDatabase() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  mongoose.set('strictQuery', true);

  let uri = env.mongodbUri;

  if (!uri) {
    if (env.isProduction) {
      console.warn(
        '[db] MONGODB_URI is not set in production — starting embedded MongoDB. Configure MONGODB_URI for external persistent storage.'
      );
    }
    uri = await startEmbeddedMongo();
    console.log(
      `[db] MONGODB_URI not provided — started embedded MongoDB (${connectionMode})`
    );
  } else {
    connectionMode = 'external-mongodb';
  }

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
    maxPoolSize: 10,
  });

  lastConnectionError = null;
  console.log(
    `[db] Connected to MongoDB (${connectionMode}) — database: ${mongoose.connection.name}`
  );
  return mongoose.connection;
}

function initializeDatabase(onConnected) {
  if (isInitialized && mongoose.connection.readyState === 1) {
    return Promise.resolve(mongoose.connection);
  }
  if (!readyPromise) {
    readyPromise = (async () => {
      try {
        const conn = await connectDatabase();
        if (typeof onConnected === 'function') {
          await onConnected();
        }
        isInitialized = true;
        return conn;
      } catch (err) {
        isInitialized = false;
        lastConnectionError = err.message || 'Database connection failed';
        readyPromise = null;
        throw err;
      }
    })();
  }
  return readyPromise;
}

async function ensureDatabaseReady(onConnected) {
  if (isInitialized && mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }
  return initializeDatabase(onConnected);
}

async function disconnectDatabase() {
  readyPromise = null;
  isInitialized = false;
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
    ...(lastConnectionError ? { error: lastConnectionError } : {}),
  };
}

module.exports = {
  connectDatabase,
  initializeDatabase,
  ensureDatabaseReady,
  disconnectDatabase,
  getDatabaseStatus,
};
