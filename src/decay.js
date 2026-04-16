const fs = require('fs');
const path = require('path');

const DECAY_FILE = path.join(process.env.HOME || '/tmp', '.tabsync', 'decay.json');

function ensureDecayFile() {
  const dir = path.dirname(DECAY_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DECAY_FILE)) fs.writeFileSync(DECAY_FILE, JSON.stringify({}));
}

function loadDecay() {
  ensureDecayFile();
  return JSON.parse(fs.readFileSync(DECAY_FILE, 'utf8'));
}

function saveDecay(data) {
  ensureDecayFile();
  fs.writeFileSync(DECAY_FILE, JSON.stringify(data, null, 2));
}

function setDecay(sessionName, days) {
  const data = loadDecay();
  data[sessionName] = { days, setAt: new Date().toISOString() };
  saveDecay(data);
  return data[sessionName];
}

function removeDecay(sessionName) {
  const data = loadDecay();
  const existed = !!data[sessionName];
  delete data[sessionName];
  saveDecay(data);
  return existed;
}

function getDecay(sessionName) {
  const data = loadDecay();
  return data[sessionName] || null;
}

function listDecayed() {
  const data = loadDecay();
  const now = Date.now();
  return Object.entries(data)
    .filter(([, v]) => {
      const setAt = new Date(v.setAt).getTime();
      return now - setAt >= v.days * 86400000;
    })
    .map(([name, v]) => ({ name, ...v }));
}

function listAll() {
  const data = loadDecay();
  return Object.entries(data).map(([name, v]) => ({ name, ...v }));
}

module.exports = { ensureDecayFile, loadDecay, saveDecay, setDecay, removeDecay, getDecay, listDecayed, listAll };
