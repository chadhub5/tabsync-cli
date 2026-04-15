const fs = require('fs');
const path = require('path');

const METADATA_DIR = path.join(process.env.HOME || '.', '.tabsync', 'metadata');

function ensureMetadataDir() {
  if (!fs.existsSync(METADATA_DIR)) {
    fs.mkdirSync(METADATA_DIR, { recursive: true });
  }
}

function getMetadataPath(sessionName) {
  return path.join(METADATA_DIR, `${sessionName}.meta.json`);
}

function loadMetadata(sessionName) {
  ensureMetadataDir();
  const filePath = getMetadataPath(sessionName);
  if (!fs.existsSync(filePath)) return {};
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function saveMetadata(sessionName, meta) {
  ensureMetadataDir();
  const filePath = getMetadataPath(sessionName);
  fs.writeFileSync(filePath, JSON.stringify(meta, null, 2));
}

function setMeta(sessionName, key, value) {
  const meta = loadMetadata(sessionName);
  meta[key] = value;
  saveMetadata(sessionName, meta);
  return meta;
}

function getMeta(sessionName, key) {
  const meta = loadMetadata(sessionName);
  return key ? meta[key] : meta;
}

function removeMeta(sessionName, key) {
  const meta = loadMetadata(sessionName);
  delete meta[key];
  saveMetadata(sessionName, meta);
  return meta;
}

function deleteMetadata(sessionName) {
  const filePath = getMetadataPath(sessionName);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
}

function listMetadata() {
  ensureMetadataDir();
  return fs.readdirSync(METADATA_DIR)
    .filter(f => f.endsWith('.meta.json'))
    .map(f => f.replace('.meta.json', ''));
}

module.exports = {
  ensureMetadataDir,
  getMetadataPath,
  loadMetadata,
  saveMetadata,
  setMeta,
  getMeta,
  removeMeta,
  deleteMetadata,
  listMetadata
};
