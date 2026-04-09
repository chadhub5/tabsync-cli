const fs = require('fs');
const path = require('path');
const os = require('os');

const SNAPSHOT_DIR = path.join(os.homedir(), '.tabsync', 'snapshots');

function ensureSnapshotDir() {
  if (!fs.existsSync(SNAPSHOT_DIR)) {
    fs.mkdirSync(SNAPSHOT_DIR, { recursive: true });
  }
  return SNAPSHOT_DIR;
}

function generateSnapshotId() {
  return `snap_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

function createSnapshot(sessionName, tabs, label = null) {
  ensureSnapshotDir();
  const id = generateSnapshotId();
  const snapshot = {
    id,
    sessionName,
    label: label || `Snapshot of ${sessionName}`,
    createdAt: new Date().toISOString(),
    tabs,
  };
  const filePath = path.join(SNAPSHOT_DIR, `${id}.json`);
  fs.writeFileSync(filePath, JSON.stringify(snapshot, null, 2));
  return snapshot;
}

function loadSnapshot(snapshotId) {
  const filePath = path.join(SNAPSHOT_DIR, `${snapshotId}.json`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Snapshot not found: ${snapshotId}`);
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function listSnapshots(sessionName = null) {
  ensureSnapshotDir();
  const files = fs.readdirSync(SNAPSHOT_DIR).filter(f => f.endsWith('.json'));
  const snapshots = files.map(f => {
    const data = JSON.parse(fs.readFileSync(path.join(SNAPSHOT_DIR, f), 'utf-8'));
    return data;
  });
  if (sessionName) {
    return snapshots.filter(s => s.sessionName === sessionName);
  }
  return snapshots.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function deleteSnapshot(snapshotId) {
  const filePath = path.join(SNAPSHOT_DIR, `${snapshotId}.json`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Snapshot not found: ${snapshotId}`);
  }
  fs.unlinkSync(filePath);
  return true;
}

module.exports = {
  ensureSnapshotDir,
  generateSnapshotId,
  createSnapshot,
  loadSnapshot,
  listSnapshots,
  deleteSnapshot,
  SNAPSHOT_DIR,
};
