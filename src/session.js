const fs = require('fs');
const path = require('path');

/**
 * Represents a tab session with a name, timestamp, and list of URLs.
 */
class Session {
  constructor(name, tabs = []) {
    this.name = name;
    this.tabs = tabs;
    this.createdAt = new Date().toISOString();
    this.version = '1.0';
  }
}

/**
 * Save a session to a JSON file.
 * @param {Session} session
 * @param {string} filePath - destination file path
 */
function saveSession(session, filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, JSON.stringify(session, null, 2), 'utf8');
}

/**
 * Load a session from a JSON file.
 * @param {string} filePath
 * @returns {Session}
 */
function loadSession(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Session file not found: ${filePath}`);
  }
  const raw = fs.readFileSync(filePath, 'utf8');
  let data;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    throw new Error(`Invalid JSON in session file: ${filePath}`);
  }
  if (!data.name || !Array.isArray(data.tabs)) {
    throw new Error('Session file is missing required fields: name, tabs');
  }
  return Object.assign(new Session(data.name, data.tabs), {
    createdAt: data.createdAt || new Date().toISOString(),
    version: data.version || '1.0',
  });
}

/**
 * List all .json session files in a given directory.
 * @param {string} dir
 * @returns {string[]}
 */
function listSessions(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.json'))
    .map(f => path.join(dir, f));
}

module.exports = { Session, saveSession, loadSession, listSessions };
