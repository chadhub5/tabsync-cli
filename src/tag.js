const fs = require('fs');
const path = require('path');
const { loadSession, saveSession } = require('./session');

const TAG_INDEX_FILE = path.join(process.env.HOME || '.', '.tabsync', 'tags.json');

function loadTagIndex() {
  if (!fs.existsSync(TAG_INDEX_FILE)) return {};
  try {
    return JSON.parse(fs.readFileSync(TAG_INDEX_FILE, 'utf8'));
  } catch {
    return {};
  }
}

function saveTagIndex(index) {
  const dir = path.dirname(TAG_INDEX_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(TAG_INDEX_FILE, JSON.stringify(index, null, 2));
}

function addTag(sessionName, tag) {
  const session = loadSession(sessionName);
  if (!session) throw new Error(`Session '${sessionName}' not found`);
  const index = loadTagIndex();
  if (!index[tag]) index[tag] = [];
  if (!index[tag].includes(sessionName)) index[tag].push(sessionName);
  saveTagIndex(index);
  return index[tag];
}

function removeTag(sessionName, tag) {
  const index = loadTagIndex();
  if (!index[tag]) return [];
  index[tag] = index[tag].filter(s => s !== sessionName);
  if (index[tag].length === 0) delete index[tag];
  saveTagIndex(index);
  return index[tag] || [];
}

function getSessionsByTag(tag) {
  const index = loadTagIndex();
  return index[tag] || [];
}

function getTagsForSession(sessionName) {
  const index = loadTagIndex();
  return Object.entries(index)
    .filter(([, sessions]) => sessions.includes(sessionName))
    .map(([tag]) => tag);
}

function listAllTags() {
  const index = loadTagIndex();
  return Object.keys(index);
}

module.exports = { loadTagIndex, saveTagIndex, addTag, removeTag, getSessionsByTag, getTagsForSession, listAllTags };
