const fs = require('fs');
const path = require('path');

const WORKSPACE_DIR = path.join(process.env.HOME || process.env.USERPROFILE, '.tabsync', 'workspaces');

function ensureWorkspaceDir() {
  if (!fs.existsSync(WORKSPACE_DIR)) {
    fs.mkdirSync(WORKSPACE_DIR, { recursive: true });
  }
}

function getWorkspacePath(name) {
  return path.join(WORKSPACE_DIR, `${name}.json`);
}

function saveWorkspace(name, sessionNames) {
  ensureWorkspaceDir();
  const data = { name, sessions: sessionNames, createdAt: new Date().toISOString() };
  fs.writeFileSync(getWorkspacePath(name), JSON.stringify(data, null, 2));
  return data;
}

function loadWorkspace(name) {
  const p = getWorkspacePath(name);
  if (!fs.existsSync(p)) return null;
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function deleteWorkspace(name) {
  const p = getWorkspacePath(name);
  if (!fs.existsSync(p)) return false;
  fs.unlinkSync(p);
  return true;
}

function listWorkspaces() {
  ensureWorkspaceDir();
  return fs.readdirSync(WORKSPACE_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => {
      const data = JSON.parse(fs.readFileSync(path.join(WORKSPACE_DIR, f), 'utf8'));
      return { name: data.name, sessionCount: data.sessions.length, createdAt: data.createdAt };
    });
}

function addSessionToWorkspace(workspaceName, sessionName) {
  const ws = loadWorkspace(workspaceName);
  if (!ws) throw new Error(`Workspace '${workspaceName}' not found`);
  if (!ws.sessions.includes(sessionName)) {
    ws.sessions.push(sessionName);
    saveWorkspace(workspaceName, ws.sessions);
  }
  return ws;
}

function removeSessionFromWorkspace(workspaceName, sessionName) {
  const ws = loadWorkspace(workspaceName);
  if (!ws) throw new Error(`Workspace '${workspaceName}' not found`);
  ws.sessions = ws.sessions.filter(s => s !== sessionName);
  saveWorkspace(workspaceName, ws.sessions);
  return ws;
}

module.exports = {
  ensureWorkspaceDir,
  getWorkspacePath,
  saveWorkspace,
  loadWorkspace,
  deleteWorkspace,
  listWorkspaces,
  addSessionToWorkspace,
  removeSessionFromWorkspace,
};
