const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { requireAuth } = require('../middleware/auth');
const { createBackup, listBackups, setupCron, backupsDir } = require('../backupService');
const { db } = require('../db');

// GET /api/backups - Get backup settings and existing archives
router.get('/', requireAuth, async (req, res) => {
  try {
    const intervalRow = await db.getAsync(`SELECT value FROM settings WHERE key = 'backup_interval'`);
    const lastBackupTimeRow = await db.getAsync(`SELECT value FROM settings WHERE key = 'last_backup_time'`);
    const lastBackupFileRow = await db.getAsync(`SELECT value FROM settings WHERE key = 'last_backup_file'`);
    const cloudSyncFolderRow = await db.getAsync(`SELECT value FROM settings WHERE key = 'cloud_sync_folder'`);
    const dropboxTokenRow = await db.getAsync(`SELECT value FROM settings WHERE key = 'dropbox_token'`);

    const files = listBackups();

    res.json({
      settings: {
        interval: intervalRow ? intervalRow.value : 'daily',
        lastBackupTime: lastBackupTimeRow ? lastBackupTimeRow.value : null,
        lastBackupFile: lastBackupFileRow ? lastBackupFileRow.value : null,
        cloudSyncFolder: cloudSyncFolderRow ? cloudSyncFolderRow.value : '',
        hasDropboxToken: !!(dropboxTokenRow && dropboxTokenRow.value)
      },
      backups: files
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve backup info' });
  }
});

// POST /api/backups/trigger - Trigger immediate backup
router.post('/trigger', requireAuth, async (req, res) => {
  try {
    const backupResult = await createBackup();
    res.json({
      message: 'Backup created successfully',
      backup: backupResult
    });
  } catch (err) {
    console.error('Trigger backup error:', err);
    res.status(500).json({ error: 'Failed to create backup: ' + err.message });
  }
});

// GET /api/backups/download/:filename - Download a specific backup zip
router.get('/download/:filename', requireAuth, (req, res) => {
  const { filename } = req.params;
  const safeFilename = path.basename(filename);
  const filePath = path.join(backupsDir, safeFilename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Backup file not found' });
  }

  res.download(filePath, safeFilename);
});

// POST /api/backups/settings - Update backup interval and sync options
router.post('/settings', requireAuth, async (req, res) => {
  try {
    const { interval, cloudSyncFolder, dropboxToken } = req.body;

    if (interval) {
      await db.runAsync(`INSERT OR REPLACE INTO settings (key, value) VALUES ('backup_interval', ?)`, [interval]);
      setupCron(interval);
    }

    if (cloudSyncFolder !== undefined) {
      await db.runAsync(`INSERT OR REPLACE INTO settings (key, value) VALUES ('cloud_sync_folder', ?)`, [cloudSyncFolder.trim()]);
    }

    if (dropboxToken !== undefined) {
      await db.runAsync(`INSERT OR REPLACE INTO settings (key, value) VALUES ('dropbox_token', ?)`, [dropboxToken.trim()]);
    }

    res.json({ message: 'Backup settings updated successfully' });
  } catch (err) {
    console.error('Save backup settings error:', err);
    res.status(500).json({ error: 'Failed to update backup settings' });
  }
});

module.exports = router;

