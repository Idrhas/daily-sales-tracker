import React, { useState, useEffect } from 'react';
import { 
  X, 
  Database, 
  Download, 
  Play, 
  Check, 
  AlertCircle, 
  FolderSync, 
  Cloud, 
  Clock, 
  Calendar 
} from 'lucide-react';

export default function BackupModal({ isOpen, onClose, token }) {
  const [data, setData] = useState({ settings: {}, backups: [] });
  const [interval, setIntervalVal] = useState('daily');
  const [cloudSyncFolder, setCloudSyncFolder] = useState('');
  const [dropboxToken, setDropboxToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const fetchBackupData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/backups', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const json = await res.json();
        setData(json);
        if (json.settings) {
          setIntervalVal(json.settings.interval || 'daily');
          setCloudSyncFolder(json.settings.cloudSyncFolder || '');
        }
      }
    } catch (err) {
      console.error('Fetch backup error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchBackupData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTriggerBackup = async () => {
    setTriggering(true);
    setStatusMsg('');
    try {
      const res = await fetch('/api/backups/trigger', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const resJson = await res.json();
      if (res.ok) {
        setStatusMsg('New backup archive generated successfully!');
        await fetchBackupData();
      } else {
        setStatusMsg('Error: ' + resJson.error);
      }
    } catch (err) {
      setStatusMsg('Failed to trigger backup');
    } finally {
      setTriggering(false);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    setStatusMsg('');
    try {
      const res = await fetch('/api/backups/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          interval,
          cloudSyncFolder,
          dropboxToken: dropboxToken || undefined
        })
      });
      if (res.ok) {
        setStatusMsg('Backup schedule and cloud settings updated!');
        if (dropboxToken) setDropboxToken('');
        await fetchBackupData();
      }
    } catch (err) {
      setStatusMsg('Failed to save settings');
    } finally {
      setSavingSettings(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-100 p-6 relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Backups & Cloud Storage Sync</h3>
            <p className="text-xs text-slate-500">Automated database snapshots, CSV exports, and receipts</p>
          </div>
        </div>

        {statusMsg && (
          <div className="mb-4 p-3 bg-indigo-50 border border-indigo-200 text-indigo-800 rounded-xl text-xs flex items-center gap-2">
            <Check className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>{statusMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Settings & Immediate Trigger */}
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <h4 className="font-semibold text-xs text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-600" /> Automated Schedule
              </h4>
              <form onSubmit={handleSaveSettings} className="space-y-3">
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Backup Frequency</label>
                  <select
                    value={interval}
                    onChange={(e) => setIntervalVal(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2 bg-white outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="hourly">Every Hour</option>
                    <option value="every6hours">Every 6 Hours</option>
                    <option value="daily">Daily at Midnight (Recommended)</option>
                    <option value="weekly">Weekly (Sundays)</option>
                    <option value="disabled">Disabled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-600 mb-1 flex items-center gap-1">
                    <FolderSync className="w-3.5 h-3.5 text-blue-600" />
                    Dropbox / Google Drive Sync Folder Path
                  </label>
                  <input
                    type="text"
                    value={cloudSyncFolder}
                    onChange={(e) => setCloudSyncFolder(e.target.value)}
                    placeholder="e.g. C:\Users\Dell i5\Dropbox\SalesBackups"
                    className="w-full text-xs border border-slate-300 rounded-lg p-2 bg-white outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    Backups will automatically copy directly to your local Dropbox / Google Drive folder.
                  </p>
                </div>

                <div>
                  <label className="block text-xs text-slate-600 mb-1 flex items-center gap-1">
                    <Cloud className="w-3.5 h-3.5 text-indigo-600" />
                    Dropbox API Token (Optional)
                  </label>
                  <input
                    type="password"
                    value={dropboxToken}
                    onChange={(e) => setDropboxToken(e.target.value)}
                    placeholder={data.settings?.hasDropboxToken ? 'Token configured (type to replace)' : 'Paste token to upload via API'}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2 bg-white outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={savingSettings}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold transition"
                >
                  {savingSettings ? 'Saving...' : 'Save Settings'}
                </button>
              </form>
            </div>

            <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl">
              <h4 className="font-semibold text-xs text-emerald-950 mb-1">Instant Backup</h4>
              <p className="text-[11px] text-emerald-800 mb-3">
                Generate an immediate full archive (SQLite database, CSV export, and receipt photos).
              </p>
              <button
                onClick={handleTriggerBackup}
                disabled={triggering}
                className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                {triggering ? 'Creating Archive...' : 'Create Backup Now'}
              </button>
            </div>
          </div>

          {/* Backup Archives List */}
          <div>
            <h4 className="font-semibold text-xs text-slate-800 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Existing Archives</span>
              <span className="text-[11px] font-normal text-slate-500">
                {data.backups?.length || 0} file{data.backups?.length === 1 ? '' : 's'}
              </span>
            </h4>

            {loading ? (
              <div className="text-center py-10 text-xs text-slate-400">Loading backups...</div>
            ) : data.backups?.length === 0 ? (
              <div className="text-center py-10 text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                No backup archives found yet.<br />Click "Create Backup Now" above to generate one.
              </div>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {data.backups.map((b) => (
                  <div
                    key={b.filename}
                    className="p-3 bg-white border border-slate-200 rounded-xl text-xs flex items-center justify-between hover:border-slate-300 transition"
                  >
                    <div className="truncate mr-2">
                      <p className="font-mono font-medium text-slate-800 text-[11px] truncate">
                        {b.filename}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {new Date(b.createdAt).toLocaleString()} • {b.sizeFormatted}
                      </p>
                    </div>
                    <a
                      href={`/api/backups/download/${b.filename}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg text-[11px] shrink-0 transition"
                      title="Download archive ZIP"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>ZIP</span>
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

