const { registerSession, unregisterSession, getSyncedSessions, getLastSync } = require('../sync');
const { loadSession } = require('../session');
const { exportSession } = require('../export');
const path = require('path');
const os = require('os');

const DEFAULT_SYNC_PATH = path.join(os.homedir(), '.tabsync', 'sessions');

function handleSyncAdd(sessionName, options = {}) {
  const session = loadSession(sessionName);
  if (!session) {
    console.error(`Session "${sessionName}" not found.`);
    process.exit(1);
  }
  const outDir = options.dir || DEFAULT_SYNC_PATH;
  const filePath = path.join(outDir, `${sessionName}.json`);
  exportSession(session, filePath);
  const entry = registerSession(sessionName, filePath);
  console.log(`Session "${sessionName}" registered for sync at ${entry.filePath}`);
}

function handleSyncRemove(sessionName) {
  const removed = unregisterSession(sessionName);
  if (removed) {
    console.log(`Session "${sessionName}" removed from sync.`);
  } else {
    console.error(`Session "${sessionName}" is not registered for sync.`);
    process.exit(1);
  }
}

function handleSyncList() {
  const sessions = getSyncedSessions();
  const lastSync = getLastSync();
  if (sessions.length === 0) {
    console.log('No sessions registered for sync.');
    return;
  }
  console.log(`Synced sessions (last sync: ${lastSync || 'never'}):`);
  sessions.forEach(s => {
    console.log(`  - ${s.name} => ${s.filePath} (synced: ${s.syncedAt})`);
  });
}

function handleSyncStatus() {
  const sessions = getSyncedSessions();
  const lastSync = getLastSync();
  console.log(`Total synced sessions: ${sessions.length}`);
  console.log(`Last sync: ${lastSync || 'never'}`);
}

module.exports = { handleSyncAdd, handleSyncRemove, handleSyncList, handleSyncStatus };
