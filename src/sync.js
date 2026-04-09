const fs = require('fs');
const path = require('path');
const os = require('os');

const SYNC_DIR = path.join(os.homedir(), '.tabsync');
const SYNC_MANIFEST = path.join(SYNC_DIR, 'manifest.json');

function ensureSyncDir() {
  if (!fs.existsSync(SYNC_DIR)) {
    fs.mkdirSync(SYNC_DIR, { recursive: true });
  }
}

function readManifest() {
  ensureSyncDir();
  if (!fs.existsSync(SYNC_MANIFEST)) {
    return { sessions: [], lastSync: null };
  }
  const raw = fs.readFileSync(SYNC_MANIFEST, 'utf-8');
  return JSON.parse(raw);
}

function writeManifest(manifest) {
  ensureSyncDir();
  fs.writeFileSync(SYNC_MANIFEST, JSON.stringify(manifest, null, 2));
}

function registerSession(sessionName, filePath) {
  const manifest = readManifest();
  const existing = manifest.sessions.findIndex(s => s.name === sessionName);
  const entry = { name: sessionName, filePath, syncedAt: new Date().toISOString() };
  if (existing >= 0) {
    manifest.sessions[existing] = entry;
  } else {
    manifest.sessions.push(entry);
  }
  manifest.lastSync = new Date().toISOString();
  writeManifest(manifest);
  return entry;
}

function unregisterSession(sessionName) {
  const manifest = readManifest();
  const before = manifest.sessions.length;
  manifest.sessions = manifest.sessions.filter(s => s.name !== sessionName);
  if (manifest.sessions.length === before) {
    return false;
  }
  writeManifest(manifest);
  return true;
}

function getSyncedSessions() {
  return readManifest().sessions;
}

function getLastSync() {
  return readManifest().lastSync;
}

module.exports = { registerSession, unregisterSession, getSyncedSessions, getLastSync, readManifest, SYNC_DIR };
