const fs = require('fs');
const path = require('path');

const VISIBILITY_FILE = path.join(process.env.HOME || '.', '.tabsync', 'visibility.json');

const VALID_LEVELS = ['public', 'private', 'shared'];

function ensureVisibilityFile() {
  const dir = path.dirname(VISIBILITY_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(VISIBILITY_FILE)) fs.writeFileSync(VISIBILITY_FILE, JSON.stringify({}));
}

function loadVisibility() {
  ensureVisibilityFile();
  return JSON.parse(fs.readFileSync(VISIBILITY_FILE, 'utf8'));
}

function saveVisibility(data) {
  ensureVisibilityFile();
  fs.writeFileSync(VISIBILITY_FILE, JSON.stringify(data, null, 2));
}

function setVisibility(sessionName, level) {
  if (!VALID_LEVELS.includes(level)) {
    throw new Error(`Invalid visibility level: ${level}. Must be one of: ${VALID_LEVELS.join(', ')}`);
  }
  const data = loadVisibility();
  data[sessionName] = level;
  saveVisibility(data);
  return level;
}

function removeVisibility(sessionName) {
  const data = loadVisibility();
  const existed = sessionName in data;
  delete data[sessionName];
  saveVisibility(data);
  return existed;
}

function getVisibility(sessionName) {
  const data = loadVisibility();
  return data[sessionName] || 'private';
}

function listByVisibility(level) {
  const data = loadVisibility();
  return Object.entries(data)
    .filter(([, v]) => v === level)
    .map(([name]) => name);
}

function getAllVisibility() {
  return loadVisibility();
}

module.exports = {
  ensureVisibilityFile,
  loadVisibility,
  saveVisibility,
  setVisibility,
  removeVisibility,
  getVisibility,
  listByVisibility,
  getAllVisibility,
  VALID_LEVELS,
};
