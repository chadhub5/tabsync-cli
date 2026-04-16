const fs = require('fs');
const path = require('path');

const COOLDOWN_FILE = path.join(process.env.HOME || '.', '.tabsync', 'cooldowns.json');

function ensureCooldownFile() {
  const dir = path.dirname(COOLDOWN_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(COOLDOWN_FILE)) fs.writeFileSync(COOLDOWN_FILE, '{}');
}

function loadCooldowns() {
  ensureCooldownFile();
  return JSON.parse(fs.readFileSync(COOLDOWN_FILE, 'utf8'));
}

function saveCooldowns(data) {
  ensureCooldownFile();
  fs.writeFileSync(COOLDOWN_FILE, JSON.stringify(data, null, 2));
}

function setCooldown(sessionName, seconds) {
  const data = loadCooldowns();
  data[sessionName] = { seconds, setAt: Date.now() };
  saveCooldowns(data);
  return data[sessionName];
}

function removeCooldown(sessionName) {
  const data = loadCooldowns();
  if (!data[sessionName]) return false;
  delete data[sessionName];
  saveCooldowns(data);
  return true;
}

function getCooldown(sessionName) {
  const data = loadCooldowns();
  return data[sessionName] || null;
}

function isCoolingDown(sessionName) {
  const entry = getCooldown(sessionName);
  if (!entry) return false;
  const elapsed = (Date.now() - entry.setAt) / 1000;
  return elapsed < entry.seconds;
}

function listCooldowns() {
  const data = loadCooldowns();
  return Object.entries(data).map(([name, entry]) => {
    const elapsed = (Date.now() - entry.setAt) / 1000;
    const remaining = Math.max(0, entry.seconds - elapsed);
    return { name, seconds: entry.seconds, remaining: Math.round(remaining), active: remaining > 0 };
  });
}

module.exports = { ensureCooldownFile, loadCooldowns, saveCooldowns, setCooldown, removeCooldown, getCooldown, isCoolingDown, listCooldowns };
