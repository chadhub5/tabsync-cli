const fs = require('fs');
const path = require('path');
const os = require('os');

const LOCK_DIR = path.join(os.homedir(), '.tabsync', 'locks');

function ensureLockDir() {
  if (!fs.existsSync(LOCK_DIR)) {
    fs.mkdirSync(LOCK_DIR, { recursive: true });
  }
}

function getLockPath(sessionName) {
  return path.join(LOCK_DIR, `${sessionName}.lock`);
}

function lockSession(sessionName) {
  ensureLockDir();
  const lockPath = getLockPath(sessionName);
  if (fs.existsSync(lockPath)) {
    const data = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
    return { locked: true, by: data.by, at: data.at };
  }
  const lockData = {
    by: os.hostname(),
    at: new Date().toISOString(),
    pid: process.pid
  };
  fs.writeFileSync(lockPath, JSON.stringify(lockData, null, 2));
  return { locked: false, acquired: true };
}

function unlockSession(sessionName) {
  const lockPath = getLockPath(sessionName);
  if (!fs.existsSync(lockPath)) {
    return { existed: false };
  }
  fs.unlinkSync(lockPath);
  return { existed: true, released: true };
}

function getLockInfo(sessionName) {
  const lockPath = getLockPath(sessionName);
  if (!fs.existsSync(lockPath)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(lockPath, 'utf8'));
}

function listLocks() {
  ensureLockDir();
  return fs.readdirSync(LOCK_DIR)
    .filter(f => f.endsWith('.lock'))
    .map(f => {
      const name = f.replace('.lock', '');
      const data = JSON.parse(fs.readFileSync(path.join(LOCK_DIR, f), 'utf8'));
      return { session: name, ...data };
    });
}

module.exports = { ensureLockDir, getLockPath, lockSession, unlockSession, getLockInfo, listLocks };
