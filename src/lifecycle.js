const fs = require('fs');
const path = require('path');
const os = require('os');

const LIFECYCLE_DIR = path.join(os.homedir(), '.tabsync', 'lifecycle');

function ensureLifecycleDir() {
  if (!fs.existsSync(LIFECYCLE_DIR)) {
    fs.mkdirSync(LIFECYCLE_DIR, { recursive: true });
  }
}

function getLifecyclePath(sessionName) {
  return path.join(LIFECYCLE_DIR, `${sessionName}.json`);
}

function loadLifecycle(sessionName) {
  const filePath = getLifecyclePath(sessionName);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function saveLifecycle(sessionName, data) {
  ensureLifecycleDir();
  fs.writeFileSync(getLifecyclePath(sessionName), JSON.stringify(data, null, 2));
}

function setLifecycleEvent(sessionName, event, timestamp = Date.now()) {
  const lifecycle = loadLifecycle(sessionName) || { session: sessionName, events: [] };
  const validEvents = ['created', 'opened', 'closed', 'modified', 'archived', 'restored'];
  if (!validEvents.includes(event)) {
    throw new Error(`Invalid lifecycle event: ${event}. Must be one of: ${validEvents.join(', ')}`);
  }
  lifecycle.events.push({ event, timestamp });
  lifecycle.lastEvent = event;
  lifecycle.lastUpdated = timestamp;
  saveLifecycle(sessionName, lifecycle);
  return lifecycle;
}

function getLifecycleHistory(sessionName) {
  return loadLifecycle(sessionName);
}

function deleteLifecycle(sessionName) {
  const filePath = getLifecyclePath(sessionName);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    return true;
  }
  return false;
}

function listLifecycles() {
  ensureLifecycleDir();
  return fs.readdirSync(LIFECYCLE_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => f.replace('.json', ''));
}

module.exports = {
  ensureLifecycleDir,
  getLifecyclePath,
  loadLifecycle,
  saveLifecycle,
  setLifecycleEvent,
  getLifecycleHistory,
  deleteLifecycle,
  listLifecycles
};
