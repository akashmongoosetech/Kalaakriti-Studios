const http = require('http');
const env = require('./config/env');
const { connectDatabase, disconnectDatabase } = require('./config/db');
const { seedDatabase } = require('./config/seed');
const app = require('./app');

let server = null;

async function startServer() {
  try {
    await connectDatabase();
    await seedDatabase();

    server = http.createServer(app);
    server.listen(env.port, '0.0.0.0', () => {
      console.log(
        `[server] Kalaakriti Studios Backend running on http://0.0.0.0:${env.port} (${env.nodeEnv})`
      );
    });
  } catch (err) {
    console.error('[server] Fatal startup error:', err);
    process.exit(1);
  }
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
