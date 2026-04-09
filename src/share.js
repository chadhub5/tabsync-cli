const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { loadSession } = require('./session');

const SHARE_DIR = path.join(process.env.HOME || process.env.USERPROFILE, '.tabsync', 'shared');

function ensureShareDir() {
  if (!fs.existsSync(SHARE_DIR)) {
    fs.mkdirSync(SHARE_DIR, { recursive: true });
  }
}

function generateShareCode() {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
}

function shareSession(sessionName) {
  ensureShareDir();
  const session = loadSession(sessionName);
  if (!session) {
    throw new Error(`Session "${sessionName}" not found`);
  }
  const code = generateShareCode();
  const shareFile = path.join(SHARE_DIR, `${code}.json`);
  const payload = {
    code,
    sessionName,
    sharedAt: new Date().toISOString(),
    session,
  };
  fs.writeFileSync(shareFile, JSON.stringify(payload, null, 2));
  return code;
}

function resolveShare(code) {
  ensureShareDir();
  const shareFile = path.join(SHARE_DIR, `${code.toUpperCase()}.json`);
  if (!fs.existsSync(shareFile)) {
    return null;
  }
  const raw = fs.readFileSync(shareFile, 'utf-8');
  return JSON.parse(raw);
}

function listShares() {
  ensureShareDir();
  const files = fs.readdirSync(SHARE_DIR).filter(f => f.endsWith('.json'));
  return files.map(f => {
    const raw = fs.readFileSync(path.join(SHARE_DIR, f), 'utf-8');
    const { code, sessionName, sharedAt } = JSON.parse(raw);
    return { code, sessionName, sharedAt };
  });
}

function revokeShare(code) {
  const shareFile = path.join(SHARE_DIR, `${code.toUpperCase()}.json`);
  if (!fs.existsSync(shareFile)) {
    return false;
  }
  fs.unlinkSync(shareFile);
  return true;
}

module.exports = { shareSession, resolveShare, listShares, revokeShare, generateShareCode, SHARE_DIR };
