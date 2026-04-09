const fs = require('fs');
const path = require('path');
const os = require('os');

const HISTORY_DIR = path.join(os.homedir(), '.tabsync', 'history');
const MAX_HISTORY = 50;

function ensureHistoryDir() {
  if (!fs.existsSync(HISTORY_DIR)) {
    fs.mkdirSync(HISTORY_DIR, { recursive: true });
  }
}

function getHistoryFile() {
  return path.join(HISTORY_DIR, 'history.json');
}

function loadHistory() {
  ensureHistoryDir();
  const file = getHistoryFile();
  if (!fs.existsSync(file)) return [];
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return [];
  }
}

function saveHistory(entries) {
  ensureHistoryDir();
  fs.writeFileSync(getHistoryFile(), JSON.stringify(entries, null, 2));
}

function recordAction(action, sessionName, meta = {}) {
  const entries = loadHistory();
  const entry = {
    id: Date.now().toString(36),
    action,
    sessionName,
    timestamp: new Date().toISOString(),
    ...meta,
  };
  entries.unshift(entry);
  const trimmed = entries.slice(0, MAX_HISTORY);
  saveHistory(trimmed);
  return entry;
}

function getHistory(limit = 20) {
  const entries = loadHistory();
  return entries.slice(0, limit);
}

function clearHistory() {
  saveHistory([]);
}

function filterHistory(predicate) {
  return loadHistory().filter(predicate);
}

module.exports = {
  ensureHistoryDir,
  loadHistory,
  saveHistory,
  recordAction,
  getHistory,
  clearHistory,
  filterHistory,
};
