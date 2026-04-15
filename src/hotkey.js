const fs = require('fs');
const path = require('path');

const HOTKEY_FILE = path.join(process.env.HOME || '.', '.tabsync', 'hotkeys.json');

function ensureHotkeyFile() {
  const dir = path.dirname(HOTKEY_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(HOTKEY_FILE)) fs.writeFileSync(HOTKEY_FILE, JSON.stringify({}));
}

function loadHotkeys() {
  ensureHotkeyFile();
  return JSON.parse(fs.readFileSync(HOTKEY_FILE, 'utf8'));
}

function saveHotkeys(hotkeys) {
  ensureHotkeyFile();
  fs.writeFileSync(HOTKEY_FILE, JSON.stringify(hotkeys, null, 2));
}

function setHotkey(key, sessionName) {
  if (!key || !sessionName) throw new Error('key and sessionName are required');
  const hotkeys = loadHotkeys();
  hotkeys[key] = sessionName;
  saveHotkeys(hotkeys);
  return hotkeys[key];
}

function removeHotkey(key) {
  const hotkeys = loadHotkeys();
  if (!hotkeys[key]) return null;
  const removed = hotkeys[key];
  delete hotkeys[key];
  saveHotkeys(hotkeys);
  return removed;
}

function resolveHotkey(key) {
  const hotkeys = loadHotkeys();
  return hotkeys[key] || null;
}

function listHotkeys() {
  return loadHotkeys();
}

function findHotkeyForSession(sessionName) {
  const hotkeys = loadHotkeys();
  return Object.entries(hotkeys)
    .filter(([, name]) => name === sessionName)
    .map(([key]) => key);
}

module.exports = {
  ensureHotkeyFile,
  loadHotkeys,
  saveHotkeys,
  setHotkey,
  removeHotkey,
  resolveHotkey,
  listHotkeys,
  findHotkeyForSession
};
