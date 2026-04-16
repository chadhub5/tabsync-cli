const fs = require('fs');
const path = require('path');

const TRIGGER_FILE = path.join(
  process.env.TABSYNC_DIR || path.join(require('os').homedir(), '.tabsync'),
  'triggers.json'
);

function ensureTriggerFile() {
  const dir = path.dirname(TRIGGER_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(TRIGGER_FILE)) fs.writeFileSync(TRIGGER_FILE, JSON.stringify({}));
}

function loadTriggers() {
  ensureTriggerFile();
  return JSON.parse(fs.readFileSync(TRIGGER_FILE, 'utf8'));
}

function saveTriggers(triggers) {
  ensureTriggerFile();
  fs.writeFileSync(TRIGGER_FILE, JSON.stringify(triggers, null, 2));
}

function setTrigger(sessionName, event, action) {
  const triggers = loadTriggers();
  if (!triggers[sessionName]) triggers[sessionName] = {};
  triggers[sessionName][event] = action;
  saveTriggers(triggers);
  return triggers[sessionName];
}

function removeTrigger(sessionName, event) {
  const triggers = loadTriggers();
  if (!triggers[sessionName]) return false;
  if (!triggers[sessionName][event]) return false;
  delete triggers[sessionName][event];
  if (Object.keys(triggers[sessionName]).length === 0) delete triggers[sessionName];
  saveTriggers(triggers);
  return true;
}

function getTriggers(sessionName) {
  const triggers = loadTriggers();
  return triggers[sessionName] || {};
}

function listAllTriggers() {
  return loadTriggers();
}

function clearTriggers(sessionName) {
  const triggers = loadTriggers();
  if (!triggers[sessionName]) return false;
  delete triggers[sessionName];
  saveTriggers(triggers);
  return true;
}

module.exports = {
  ensureTriggerFile,
  loadTriggers,
  saveTriggers,
  setTrigger,
  removeTrigger,
  getTriggers,
  listAllTriggers,
  clearTriggers
};
