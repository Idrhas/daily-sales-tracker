const app = require('./app');
const { initDB } = require('./db');
const { initBackupScheduler } = require('./backupService');

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await initDB();
    await initBackupScheduler();

    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to initialize server:', err);
    process.exit(1);
  }
}

startServer();
