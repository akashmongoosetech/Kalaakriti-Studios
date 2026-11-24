const http = require('http');
const env = require('./config/env');
const { initializeDatabase, disconnectDatabase } = require('./config/db');
const { seedDatabase } = require('./config/seed');
const app = require('./app');

let server = null;

async function startServer() {
  // Bind the HTTP port immediately so Cloud Run / container startup probes pass without delay
  server = http.createServer(app);
  server.listen(env.port, '0.0.0.0', () => {
    console.log(
      `[server] Kalaakriti Studios Backend running on http://0.0.0.0:${env.port} (${env.nodeEnv})`
    );
  });

  // Connect and seed MongoDB in the background (API data routes await readiness automatically)
  initializeDatabase(seedDatabase).catch((err) => {
    console.error('[server] Initial database connection error (will retry on API request):', err);
  });
}

async function shutdown(signal) {
  console.log(`[server] Received ${signal}. Shutting down gracefully...`);
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
  await disconnectDatabase();
  process.exit(0);
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

startServer();
