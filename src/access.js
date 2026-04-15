const fs = require('fs');
const path = require('path');

const ACCESS_FILE = path.join(process.env.HOME || '.', '.tabsync', 'access.json');

function ensureAccessFile() {
  const dir = path.dirname(ACCESS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  ACCESS_FILE)) fs.writeFileSync(ACCESS_FILE, JSON.stringify({}));
}

function loadAccess() {
  ensureAccessFile();
  return JSON.parse(fs.readFileSync(ACCESS_FILE, 'utf8'));
}

function saveAccess(data) {
  ensureAccessFile();
  fs.writeFileSync(ACCESS_FILE, JSON.stringify(data, null, 2));
}

function setAccess(sessionName, level) {
  const valid = ['public', 'private', 'readonly'];
  if (!valid.includes(level)) throw new Error(`Invalid access level: ${level}. Use: ${valid.join(', ')}`);
  const data = loadAccess();
  data[sessionName] = { level, updatedAt: new Date().toISOString() };
  saveAccess(data);
  return data[sessionName];
}

function removeAccess(sessionName) {
  const data = loadAccess();
  if (!data[sessionName]) return false;
  delete data[sessionName];
  saveAccess(data);
  return true;
}

function getAccess(sessionName) {
  const data = loadAccess();
  return data[sessionName] || null;
}

function listAccess() {
  return loadAccess();
}

function filterByLevel(level) {
  const data = loadAccess();
  return Object.entries(data)
    .filter(([, v]) => v.level === level)
    .map(([name, info]) => ({ name, ...info }));
}

module.exports = { ensureAccessFile, loadAccess, saveAccess, setAccess, removeAccess, getAccess, listAccess, filterByLevel };
