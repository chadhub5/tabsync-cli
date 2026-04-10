const fs = require('fs');
const path = require('path');
const os = require('os');

const ARCHIVE_DIR = path.join(os.homedir(), '.tabsync', 'archive');

function ensureArchiveDir() {
  if (!fs.existsSync(ARCHIVE_DIR)) {
    fs.mkdirSync(ARCHIVE_DIR, { recursive: true });
  }
  return ARCHIVE_DIR;
}

function getArchivePath(sessionName) {
  return path.join(ARCHIVE_DIR, `${sessionName}.archived.json`);
}

function archiveSession(sessionName, sessionData) {
  ensureArchiveDir();
  const record = {
    name: sessionName,
    archivedAt: new Date().toISOString(),
    data: sessionData,
  };
  fs.writeFileSync(getArchivePath(sessionName), JSON.stringify(record, null, 2));
  return record;
}

function unarchiveSession(sessionName) {
  const filePath = getArchivePath(sessionName);
  if (!fs.existsSync(filePath)) {
    throw new Error(`No archived session found: ${sessionName}`);
  }
  const record = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  fs.unlinkSync(filePath);
  return record.data;
}

function listArchived() {
  ensureArchiveDir();
  return fs.readdirSync(ARCHIVE_DIR)
    .filter(f => f.endsWith('.archived.json'))
    .map(f => {
      const content = JSON.parse(fs.readFileSync(path.join(ARCHIVE_DIR, f), 'utf8'));
      return { name: content.name, archivedAt: content.archivedAt };
    });
}

function deleteArchived(sessionName) {
  const filePath = getArchivePath(sessionName);
  if (!fs.existsSync(filePath)) {
    throw new Error(`No archived session found: ${sessionName}`);
  }
  fs.unlinkSync(filePath);
}

module.exports = { ensureArchiveDir, getArchivePath, archiveSession, unarchiveSession, listArchived, deleteArchived };
