const fs = require('fs');
const path = require('path');
const os = require('os');

const WEBHOOK_DIR = path.join(os.homedir(), '.tabsync', 'webhooks');
const WEBHOOK_FILE = path.join(WEBHOOK_DIR, 'webhooks.json');

function ensureWebhookFile() {
  if (!fs.existsSync(WEBHOOK_DIR)) fs.mkdirSync(WEBHOOK_DIR, { recursive: true });
  if (!fs.existsSync(WEBHOOK_FILE)) fs.writeFileSync(WEBHOOK_FILE, JSON.stringify({}));
}

function loadWebhooks() {
  ensureWebhookFile();
  return JSON.parse(fs.readFileSync(WEBHOOK_FILE, 'utf8'));
}

function saveWebhooks(data) {
  ensureWebhookFile();
  fs.writeFileSync(WEBHOOK_FILE, JSON.stringify(data, null, 2));
}

function setWebhook(sessionName, url, events = ['save', 'delete']) {
  const hooks = loadWebhooks();
  hooks[sessionName] = { url, events, createdAt: new Date().toISOString() };
  saveWebhooks(hooks);
  return hooks[sessionName];
}

function removeWebhook(sessionName) {
  const hooks = loadWebhooks();
  if (!hooks[sessionName]) return false;
  delete hooks[sessionName];
  saveWebhooks(hooks);
  return true;
}

function getWebhook(sessionName) {
  const hooks = loadWebhooks();
  return hooks[sessionName] || null;
}

function listWebhooks() {
  return loadWebhooks();
}

function findByEvent(event) {
  const hooks = loadWebhooks();
  return Object.entries(hooks)
    .filter(([, v]) => v.events.includes(event))
    .map(([session, data]) => ({ session, ...data }));
}

module.exports = { ensureWebhookFile, loadWebhooks, saveWebhooks, setWebhook, removeWebhook, getWebhook, listWebhooks, findByEvent };
