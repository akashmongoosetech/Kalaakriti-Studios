const { connectDatabase, disconnectDatabase } = require('../config/db');
const { seedDatabase } = require('../config/seed');

async function run() {
  try {
    await connectDatabase();
    await seedDatabase();
    console.log('[seed] Seeding completed successfully.');
  } catch (err) {
    console.error('[seed] Seeding failed:', err);
    process.exitCode = 1;
  } finally {
    await disconnectDatabase();
  }
}

run();
