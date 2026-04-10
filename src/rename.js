const fs = require('fs');
const path = require('path');
const { loadSession, saveSession, listSessions } = require('./session');

function validateName(name) {
  if (!name || typeof name !== 'string') return false;
  return /^[a-zA-Z0-9_-]+$/.test(name.trim());
}

async function renameSession(sessionsDir, oldName, newName) {
  if (!validateName(oldName)) {
    throw new Error(`Invalid session name: "${oldName}"`);
  }
  if (!validateName(newName)) {
    throw new Error(`Invalid new session name: "${newName}"`);
  }
  if (oldName === newName) {
    throw new Error('New name must be different from the current name');
  }

  const sessions = await listSessions(sessionsDir);
  if (!sessions.includes(oldName)) {
    throw new Error(`Session "${oldName}" not found`);
  }
  if (sessions.includes(newName)) {
    throw new Error(`Session "${newName}" already exists`);
  }

  const data = await loadSession(sessionsDir, oldName);
  data.name = newName;
  data.renamedAt = new Date().toISOString();

  await saveSession(sessionsDir, newName, data);

  const oldPath = path.join(sessionsDir, `${oldName}.json`);
  await fs.promises.unlink(oldPath);

  return data;
}

module.exports = { renameSession, validateName };
