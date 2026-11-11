const fs = require('fs');
const path = require('path');
const cron = require('node-cron');
const { db } = require('./db');

const isServerless = !!(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const backupsDir = isServerless ? path.join('/tmp', 'backups') : path.join(__dirname, 'backups');
if (!fs.existsSync(backupsDir)) {
  try {
    fs.mkdirSync(backupsDir, { recursive: true });
  } catch (e) {}
}

let activeCronJob = null;

async function createBackup() {
  const archiverModule = await import('archiver');
  const ZipArchive = archiverModule.ZipArchive || archiverModule.default;
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFileName = `backup-${timestamp}.zip`;
  const backupFilePath = path.join(backupsDir, backupFileName);

  const output = fs.createWriteStream(backupFilePath);
  const archive = typeof ZipArchive === 'function' && ZipArchive.prototype?.pipe
    ? new ZipArchive({ zlib: { level: 9 } })
    : (typeof archiverModule.default === 'function' ? archiverModule.default('zip', { zlib: { level: 9 } }) : new archiverModule.Archiver('zip', { zlib: { level: 9 } }));

  return new Promise(async (resolve, reject) => {
    output.on('close', async () => {
      const stats = fs.statSync(backupFilePath);
      console.log(`Backup completed: ${backupFileName} (${(stats.size / 1024).toFixed(2)} KB)`);

      // Record backup in settings
      await db.runAsync(
        `INSERT OR REPLACE INTO settings (key, value) VALUES ('last_backup_time', ?)`,
        [new Date().toISOString()]
      );
      await db.runAsync(
        `INSERT OR REPLACE INTO settings (key, value) VALUES ('last_backup_file', ?)`,
        [backupFileName]
      );

      // Check if custom cloud sync path (e.g., Dropbox / Google Drive folder) is configured
      try {
        const cloudPathSetting = await db.getAsync(`SELECT value FROM settings WHERE key = 'cloud_sync_folder'`);
        if (cloudPathSetting && cloudPathSetting.value && fs.existsSync(cloudPathSetting.value)) {
          const destination = path.join(cloudPathSetting.value, backupFileName);
          fs.copyFileSync(backupFilePath, destination);
          console.log(`Synced backup to cloud folder: ${destination}`);
        }
      } catch (err) {
        console.error('Error syncing to cloud folder:', err);
      }

      // Check if Dropbox API token is configured
      try {
        const dropboxTokenSetting = await db.getAsync(`SELECT value FROM settings WHERE key = 'dropbox_token'`);
        if (dropboxTokenSetting && dropboxTokenSetting.value) {
          await uploadToDropbox(dropboxTokenSetting.value, backupFilePath, backupFileName);
        }
      } catch (err) {
        console.error('Dropbox API upload failed:', err.message);
      }

      resolve({
        filename: backupFileName,
        path: backupFilePath,
        size: stats.size,
        timestamp: new Date().toISOString()
      });
    });

    archive.on('error', (err) => {
      reject(err);
    });

    archive.pipe(output);

    // 1. Add database file
    const dbFile = path.join(__dirname, 'sales.db');
    if (fs.existsSync(dbFile)) {
      archive.file(dbFile, { name: 'sales.db' });
    }

    // 2. Generate and add sales CSV export
    try {
      const sales = await db.allAsync(`SELECT * FROM sales ORDER BY date DESC, time DESC`);
      let csvContent = 'ID,Date,Time,Amount,Currency,Category,Description,ReceiptURL,CreatedAt,UpdatedAt,CreatedBy,Notes\n';
      for (const s of sales) {
        const escape = (val) => `"${String(val || '').replace(/"/g, '""')}"`;
        csvContent += `${s.id},${escape(s.date)},${escape(s.time)},${s.amount},${escape(s.currency)},${escape(s.category)},${escape(s.description)},${escape(s.receipt_url)},${escape(s.created_at)},${escape(s.updated_at)},${escape(s.created_by)},${escape(s.notes)}\n`;
      }
      archive.append(csvContent, { name: 'sales-export.csv' });
    } catch (e) {
      console.error('CSV export generation error in backup:', e);
    }

    // 3. Add uploads folder (receipt images)
    const uploadsDir = path.join(__dirname, 'uploads');
    if (fs.existsSync(uploadsDir)) {
      archive.directory(uploadsDir, 'uploads');
    }

    archive.finalize();
  });
}

async function uploadToDropbox(token, filePath, fileName) {
  try {
    const fileContent = fs.readFileSync(filePath);
    const response = await fetch('https://content.dropboxapi.com/2/files/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Dropbox-API-Arg': JSON.stringify({
          path: `/${fileName}`,
          mode: 'add',
          autorename: true,
          mute: false
        }),
        'Content-Type': 'application/octet-stream'
      },
      body: fileContent
    });
    if (response.ok) {
      console.log(`Successfully uploaded ${fileName} to Dropbox!`);
    } else {
      const errText = await response.text();
      console.error('Dropbox upload failed with response:', errText);
    }
  } catch (err) {
    console.error('Dropbox upload network error:', err);
  }
}

async function initBackupScheduler() {
  const intervalSetting = await db.getAsync(`SELECT value FROM settings WHERE key = 'backup_interval'`);
  const interval = intervalSetting ? intervalSetting.value : 'daily';
  setupCron(interval);
}

function setupCron(interval) {
  if (activeCronJob) {
    activeCronJob.stop();
    activeCronJob = null;
  }

  let cronExpression;
  switch (interval) {
    case 'hourly':
      cronExpression = '0 * * * *'; // Top of every hour
      break;
    case 'every6hours':
      cronExpression = '0 */6 * * *';
      break;
    case 'daily':
      cronExpression = '0 0 * * *'; // Midnight every day
      break;
    case 'weekly':
      cronExpression = '0 0 * * 0'; // Midnight every Sunday
      break;
    case 'disabled':
      console.log('Automated scheduled backups disabled.');
      return;
    default:
      cronExpression = '0 0 * * *';
  }

  console.log(`Configuring automated backup cron schedule (${interval}): ${cronExpression}`);
  activeCronJob = cron.schedule(cronExpression, async () => {
    console.log(`[Scheduled Task] Executing scheduled backup (${interval})...`);
    try {
      await createBackup();
    } catch (err) {
      console.error('Scheduled backup error:', err);
    }
  });
}

function listBackups() {
  if (!fs.existsSync(backupsDir)) return [];
  const files = fs.readdirSync(backupsDir)
    .filter(f => f.endsWith('.zip'))
    .map(f => {
      const p = path.join(backupsDir, f);
      const stat = fs.statSync(p);
      return {
        filename: f,
        size: stat.size,
        sizeFormatted: `${(stat.size / 1024).toFixed(1)} KB`,
        createdAt: stat.birthtime || stat.mtime
      };
    })
    .sort((a, b) => b.createdAt - a.createdAt);
  return files;
}

module.exports = {
  createBackup,
  initBackupScheduler,
  setupCron,
  listBackups,
  backupsDir
};
