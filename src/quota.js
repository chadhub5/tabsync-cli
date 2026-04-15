const fs = require('fs');
const path = require('path');

const QUOTA_FILE = path.join(process.env.HOME || '.', '.tabsync', 'quota.json');

function ensureQuotaFile() {
  const dir = path.dirname(QUOTA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(QUOTA_FILE)) fs.writeFileSync(QUOTA_FILE, JSON.stringify({ limits: {}, usage: {} }));
}

function loadQuota() {
  ensureQuotaFile();
  return JSON.parse(fs.readFileSync(QUOTA_FILE, 'utf8'));
}

function saveQuota(data) {
  ensureQuotaFile();
  fs.writeFileSync(QUOTA_FILE, JSON.stringify(data, null, 2));
}

function setLimit(resource, limit) {
  const data = loadQuota();
  data.limits[resource] = limit;
  saveQuota(data);
}

function getLimits() {
  return loadQuota().limits;
}

function getUsage() {
  return loadQuota().usage;
}

function updateUsage(resource, count) {
  const data = loadQuota();
  data.usage[resource] = count;
  saveQuota(data);
}

function checkQuota(resource, requested = 1) {
  const data = loadQuota();
  const limit = data.limits[resource];
  if (limit === undefined) return { allowed: true, limit: null, usage: data.usage[resource] || 0 };
  const current = data.usage[resource] || 0;
  return {
    allowed: current + requested <= limit,
    limit,
    usage: current,
    remaining: limit - current
  };
}

function removeLimit(resource) {
  const data = loadQuota();
  delete data.limits[resource];
  delete data.usage[resource];
  saveQuota(data);
}

module.exports = { ensureQuotaFile, loadQuota, saveQuota, setLimit, getLimits, getUsage, updateUsage, checkQuota, removeLimit };
