const fs = require('fs');
const path = require('path');
const os = require('os');

const PRIORITY_LEVELS = ['low', 'normal', 'high', 'critical'];
const PRIORITIES_FILE = path.join(os.homedir(), '.tabsync', 'priorities.json');

function ensurePriorityFile() {
  const dir = path.dirname(PRIORITIES_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(PRIORITIES_FILE)) fs.writeFileSync(PRIORITIES_FILE, JSON.stringify({}));
}

function loadPriorities() {
  ensurePriorityFile();
  return JSON.parse(fs.readFileSync(PRIORITIES_FILE, 'utf8'));
}

function savePriorities(data) {
  ensurePriorityFile();
  fs.writeFileSync(PRIORITIES_FILE, JSON.stringify(data, null, 2));
}

function setPriority(sessionName, level) {
  if (!PRIORITY_LEVELS.includes(level)) {
    throw new Error(`Invalid priority level "${level}". Must be one of: ${PRIORITY_LEVELS.join(', ')}`);
  }
  const data = loadPriorities();
  data[sessionName] = level;
  savePriorities(data);
  return level;
}

function removePriority(sessionName) {
  const data = loadPriorities();
  if (!data[sessionName]) return false;
  delete data[sessionName];
  savePriorities(data);
  return true;
}

function getPriority(sessionName) {
  const data = loadPriorities();
  return data[sessionName] || null;
}

function listByPriority(level) {
  const data = loadPriorities();
  if (level) {
    return Object.entries(data)
      .filter(([, v]) => v === level)
      .map(([k]) => k);
  }
  return Object.entries(data).map(([name, priority]) => ({ name, priority }));
}

function getSessionsSortedByPriority() {
  const data = loadPriorities();
  return Object.entries(data)
    .sort(([, a], [, b]) => PRIORITY_LEVELS.indexOf(b) - PRIORITY_LEVELS.indexOf(a))
    .map(([name, priority]) => ({ name, priority }));
}

module.exports = {
  PRIORITY_LEVELS,
  ensurePriorityFile,
  loadPriorities,
  savePriorities,
  setPriority,
  removePriority,
  getPriority,
  listByPriority,
  getSessionsSortedByPriority,
};
