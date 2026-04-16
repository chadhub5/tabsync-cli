const fs = require('fs');
const path = require('path');

const RETENTION_FILE = path.join(process.env.TABSYNC_DIR || '.tabsync', 'retention.json');

function ensureRetentionFile() {
  const dir = path.dirname(RETENTION_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(RETENTION_FILE)) fs.writeFileSync(RETENTION_FILE, JSON.stringify({}));
}

function loadRetention() {
  ensureRetentionFile();
  return JSON.parse(fs.readFileSync(RETENTION_FILE, 'utf8'));
}

function saveRetention(data) {
  ensureRetentionFile();
  fs.writeFileSync(RETENTION_FILE, JSON.stringify(data, null, 2));
}

function setRetention(sessionId, days) {
  if (typeof days !== 'number' || days < 1) throw new Error('days must be a positive number');
  const data = loadRetention();
  data[sessionId] = { days, setAt: new Date().toISOString() };
  saveRetention(data);
  return data[sessionId];
}

function removeRetention(sessionId) {
  const data = loadRetention();
  if (!data[sessionId]) return false;
  delete data[sessionId];
  saveRetention(data);
  return true;
}

function getRetention(sessionId) {
  const data = loadRetention();
  return data[sessionId] || null;
}

function listRetention() {
  return loadRetention();
}

function getExpiredSessions() {
  const data = loadRetention();
  const now = Date.now();
  return Object.entries(data)
    .filter(([, val]) => {
      const setAt = new Date(val.setAt).getTime();
      return now - setAt > val.days * 86400000;
    })
    .map(([id, val]) => ({ sessionId: id, ...val }));
}

module.exports = {
  ensureRetentionFile,
  loadRetention,
  saveRetention,
  setRetention,
  removeRetention,
  getRetention,
  listRetention,
  getExpiredSessions,
};
