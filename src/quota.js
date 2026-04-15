const fs = require('fs');
const path = require('path');

const QUOTA_FILE = path.join(process.env.HOME || '.', '.tabsync', 'quota.json');

const DEFAULT_LIMITS = {
  maxSessions: 100,
  maxTabsPerSession: 500,
  maxStorageMB: 50
};

function ensureQuotaFile() {
  if (!fs.existsSync(QUOTA_FILE)) {
    fs.mkdirSync(path.dirname(QUOTA_FILE), { recursive: true });
    fs.writeFileSync(QUOTA_FILE, JSON.stringify({ limits: DEFAULT_LIMITS, usage: {} }, null, 2));
  }
}

function loadQuota() {
  ensureQuotaFile();
  return JSON.parse(fs.readFileSync(QUOTA_FILE, 'utf8'));
}

function saveQuota(data) {
  ensureQuotaFile();
  fs.writeFileSync(QUOTA_FILE, JSON.stringify(data, null, 2));
}

function setLimit(key, value) {
  if (!Object.keys(DEFAULT_LIMITS).includes(key)) {
    throw new Error(`Unknown quota key: ${key}`);
  }
  const data = loadQuota();
  data.limits[key] = Number(value);
  saveQuota(data);
  return data.limits;
}

function getLimits() {
  return loadQuota().limits;
}

function checkQuota(key, current) {
  const { limits } = loadQuota();
  if (!(key in limits)) return { ok: true };
  const limit = limits[key];
  return {
    ok: current < limit,
    current,
    limit,
    percent: Math.round((current / limit) * 100)
  };
}

function resetLimits() {
  const data = loadQuota();
  data.limits = { ...DEFAULT_LIMITS };
  saveQuota(data);
  return data.limits;
}

module.exports = {
  ensureQuotaFile,
  loadQuota,
  saveQuota,
  setLimit,
  getLimits,
  checkQuota,
  resetLimits,
  DEFAULT_LIMITS
};
