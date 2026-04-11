const fs = require('fs');
const path = require('path');
const os = require('os');

const GROUP_DIR = path.join(os.homedir(), '.tabsync', 'groups');

function ensureGroupDir() {
  if (!fs.existsSync(GROUP_DIR)) {
    fs.mkdirSync(GROUP_DIR, { recursive: true });
  }
}

function getGroupPath(groupName) {
  return path.join(GROUP_DIR, `${groupName}.json`);
}

function loadGroup(groupName) {
  const filePath = getGroupPath(groupName);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
}

function saveGroup(groupName, sessions) {
  ensureGroupDir();
  const filePath = getGroupPath(groupName);
  const data = { name: groupName, sessions, updatedAt: new Date().toISOString() };
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  return data;
}

function addSessionToGroup(groupName, sessionName) {
  const group = loadGroup(groupName) || { name: groupName, sessions: [] };
  if (group.sessions.includes(sessionName)) {
    throw new Error(`Session '${sessionName}' is already in group '${groupName}'`);
  }
  group.sessions.push(sessionName);
  return saveGroup(groupName, group.sessions);
}

function removeSessionFromGroup(groupName, sessionName) {
  const group = loadGroup(groupName);
  if (!group) throw new Error(`Group '${groupName}' not found`);
  const idx = group.sessions.indexOf(sessionName);
  if (idx === -1) throw new Error(`Session '${sessionName}' not in group '${groupName}'`);
  group.sessions.splice(idx, 1);
  return saveGroup(groupName, group.sessions);
}

function deleteGroup(groupName) {
  const filePath = getGroupPath(groupName);
  if (!fs.existsSync(filePath)) throw new Error(`Group '${groupName}' not found`);
  fs.unlinkSync(filePath);
}

function listGroups() {
  ensureGroupDir();
  return fs.readdirSync(GROUP_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => f.replace('.json', ''));
}

module.exports = {
  ensureGroupDir,
  getGroupPath,
  loadGroup,
  saveGroup,
  addSessionToGroup,
  removeSessionFromGroup,
  deleteGroup,
  listGroups,
};
