const fs = require('fs');
const path = require('path');

const EXPIRY_FILE = path.join(process.env.HOME || '.', '.tabsync', 'expiry.json');

function ensureExpiryFile() {
  const dir = path.dirname(EXPIRY_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(EXPIRY_FILE)) fs.writeFileSync(EXPIRY_FILE, JSON.stringify({}));
}

function loadExpiry() {
  ensureExpiryFile();
  return JSON.parse(fs.readFileSync(EXPIRY_FILE, 'utf8'));
}

function saveExpiry(data) {
  ensureExpiryFile();
  fs.writeFileSync(EXPIRY_FILE, JSON.stringify(data, null, 2));
}

function setExpiry(sessionName, expiresAt) {
  const data = loadExpiry();
  data[sessionName] = { expiresAt: new Date(expiresAt).toISOString() };
  saveExpiry(data);
  return data[sessionName];
}

function removeExpiry(sessionName) {
  const data = loadExpiry();
  if (!data[sessionName]) return false;
  delete data[sessionName];
  saveExpiry(data);
  return true;
}

function getExpiry(sessionName) {
  const data = loadExpiry();
  return data[sessionName] || null;
}

function listExpired() {
  const data = loadExpiry();
  const now = new Date();
  return Object.entries(data)
    .filter(([, val]) => new Date(val.expiresAt) <= now)
    .map(([name, val]) => ({ name, expiresAt: val.expiresAt }));
}

function listExpiry() {
  const data = loadExpiry();
  return Object.entries(data).map(([name, val]) => ({ name, expiresAt: val.expiresAt }));
}

module.exports = { ensureExpiryFile, loadExpiry, saveExpiry, setExpiry, removeExpiry, getExpiry, listExpired, listExpiry };
