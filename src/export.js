const fs = require('fs');
const path = require('path');
const { loadSession } = require('./session');

/**
 * Export a session to a shareable JSON file at the given output path.
 * @param {string} sessionName
 * @param {string} outputPath
 */
function exportSession(sessionName, outputPath) {
  const session = loadSession(sessionName);
  if (!session) {
    throw new Error(`Session "${sessionName}" not found.`);
  }

  const payload = {
    exportedAt: new Date().toISOString(),
    version: '1.0',
    session,
  };

  const resolvedPath = path.resolve(outputPath);
  fs.writeFileSync(resolvedPath, JSON.stringify(payload, null, 2), 'utf8');
  return resolvedPath;
}

/**
 * Import a session from a previously exported JSON file.
 * Returns the parsed session object so the caller can decide what to do with it.
 * @param {string} filePath
 * @returns {{ name: string, tabs: Array, createdAt: string }}
 */
function importSession(filePath) {
  const resolvedPath = path.resolve(filePath);

  if (!fs.existsSync(resolvedPath)) {
    throw new Error(`File not found: ${resolvedPath}`);
  }

  let payload;
  try {
    payload = JSON.parse(fs.readFileSync(resolvedPath, 'utf8'));
  } catch (err) {
    throw new Error(`Failed to parse export file: ${err.message}`);
  }

  if (!payload.session || !payload.session.name || !Array.isArray(payload.session.tabs)) {
    throw new Error('Invalid export file format.');
  }

  return payload.session;
}

module.exports = { exportSession, importSession };
