const fs = require('fs');
const path = require('path');
const os = require('os');

const PIN_FILE = path.join(os.homedir(), '.tabsync', 'pinned.json');

function ensurePinFile() {
  const dir = path.dirname(PIN_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(PIN_FILE)) fs.writeFileSync(PIN_FILE, JSON.stringify([]));
}

function loadPinned() {
  ensurePinFile();
  const raw = fs.readFileSync(PIN_FILE, 'utf8');
  return JSON.parse(raw);
}

function savePinned(pins) {
  ensurePinFile();
  fs.writeFileSync(PIN_FILE, JSON.stringify(pins, null, 2));
}

function pinSession(sessionName) {
  const pins = loadPinned();
  if (pins.includes(sessionName)) {
    return { alreadyPinned: true };
  }
  pins.push(sessionName);
  savePinned(pins);
  return { pinned: true, sessionName };
}

function unpinSession(sessionName) {
  const pins = loadPinned();
  const idx = pins.indexOf(sessionName);
  if (idx === -1) {
    return { notFound: true };
  }
  pins.splice(idx, 1);
  savePinned(pins);
  return { unpinned: true, sessionName };
}

function listPinned() {
  return loadPinned();
}

function isPinned(sessionName) {
  return loadPinned().includes(sessionName);
}

module.exports = { ensurePinFile, loadPinned, savePinned, pinSession, unpinSession, listPinned, isPinned };
