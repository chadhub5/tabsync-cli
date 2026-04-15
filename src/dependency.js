const fs = require('fs');
const path = require('path');
const os = require('os');

const DEP_DIR = path.join(os.homedir(), '.tabsync', 'dependencies');
const DEP_FILE = path.join(DEP_DIR, 'deps.json');

function ensureDepFile() {
  if (!fs.existsSync(DEP_DIR)) fs.mkdirSync(DEP_DIR, { recursive: true });
  if (!fs.existsSync(DEP_FILE)) fs.writeFileSync(DEP_FILE, JSON.stringify({}));
}

function loadDependencies() {
  ensureDepFile();
  return JSON.parse(fs.readFileSync(DEP_FILE, 'utf8'));
}

function saveDependencies(deps) {
  ensureDepFile();
  fs.writeFileSync(DEP_FILE, JSON.stringify(deps, null, 2));
}

function addDependency(sessionId, dependsOnId) {
  const deps = loadDependencies();
  if (!deps[sessionId]) deps[sessionId] = [];
  if (!deps[sessionId].includes(dependsOnId)) {
    deps[sessionId].push(dependsOnId);
  }
  saveDependencies(deps);
  return deps[sessionId];
}

function removeDependency(sessionId, dependsOnId) {
  const deps = loadDependencies();
  if (!deps[sessionId]) return [];
  deps[sessionId] = deps[sessionId].filter(id => id !== dependsOnId);
  if (deps[sessionId].length === 0) delete deps[sessionId];
  saveDependencies(deps);
  return deps[sessionId] || [];
}

function getDependencies(sessionId) {
  const deps = loadDependencies();
  return deps[sessionId] || [];
}

function getDependents(sessionId) {
  const deps = loadDependencies();
  return Object.entries(deps)
    .filter(([, list]) => list.includes(sessionId))
    .map(([id]) => id);
}

function clearDependencies(sessionId) {
  const deps = loadDependencies();
  delete deps[sessionId];
  saveDependencies(deps);
}

module.exports = {
  ensureDepFile,
  loadDependencies,
  saveDependencies,
  addDependency,
  removeDependency,
  getDependencies,
  getDependents,
  clearDependencies
};
