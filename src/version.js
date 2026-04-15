const fs = require('fs');
const path = require('path');

const VERSION_DIR = path.join(process.env.HOME || '.', '.tabsync', 'versions');

function ensureVersionDir() {
  if (!fs.existsSync(VERSION_DIR)) {
    fs.mkdirSync(VERSION_DIR, { recursive: true });
  }
}

function getVersionPath(sessionName) {
  return path.join(VERSION_DIR, `${sessionName}.versions.json`);
}

function loadVersions(sessionName) {
  const file = getVersionPath(sessionName);
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function saveVersions(sessionName, versions) {
  ensureVersionDir();
  fs.writeFileSync(getVersionPath(sessionName), JSON.stringify(versions, null, 2));
}

function addVersion(sessionName, sessionData, message = '') {
  const versions = loadVersions(sessionName);
  const entry = {
    versionId: `v${versions.length + 1}`,
    timestamp: new Date().toISOString(),
    message,
    data: sessionData
  };
  versions.push(entry);
  saveVersions(sessionName, versions);
  return entry;
}

function getVersion(sessionName, versionId) {
  const versions = loadVersions(sessionName);
  return versions.find(v => v.versionId === versionId) || null;
}

function listVersions(sessionName) {
  return loadVersions(sessionName).map(({ versionId, timestamp, message }) => ({
    versionId, timestamp, message
  }));
}

function deleteVersion(sessionName, versionId) {
  const versions = loadVersions(sessionName);
  const updated = versions.filter(v => v.versionId !== versionId);
  if (updated.length === versions.length) return false;
  saveVersions(sessionName, updated);
  return true;
}

module.exports = {
  ensureVersionDir, getVersionPath, loadVersions, saveVersions,
  addVersion, getVersion, listVersions, deleteVersion
};
