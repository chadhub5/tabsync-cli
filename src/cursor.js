const fs = require('fs');
const path = require('path');

const CURSOR_DIR = path.join(process.env.HOME || '.', '.tabsync', 'cursors');

function ensureCursorDir() {
  if (!fs.existsSync(CURSOR_DIR)) fs.mkdirSync(CURSOR_DIR, { recursive: true });
}

function getCursorPath(sessionName) {
  return path.join(CURSOR_DIR, `${sessionName}.cursor.json`);
}

function loadCursor(sessionName) {
  const p = getCursorPath(sessionName);
  if (!fs.existsSync(p)) return null;
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function saveCursor(sessionName, cursor) {
  ensureCursorDir();
  fs.writeFileSync(getCursorPath(sessionName), JSON.stringify(cursor, null, 2));
}

function setCursor(sessionName, tabIndex, scrollY = 0) {
  const cursor = { sessionName, tabIndex, scrollY, updatedAt: new Date().toISOString() };
  saveCursor(sessionName, cursor);
  return cursor;
}

function removeCursor(sessionName) {
  const p = getCursorPath(sessionName);
  if (fs.existsSync(p)) fs.unlinkSync(p);
}

function listCursors() {
  ensureCursorDir();
  return fs.readdirSync(CURSOR_DIR)
    .filter(f => f.endsWith('.cursor.json'))
    .map(f => {
      const data = JSON.parse(fs.readFileSync(path.join(CURSOR_DIR, f), 'utf8'));
      return data;
    });
}

module.exports = { ensureCursorDir, getCursorPath, loadCursor, saveCursor, setCursor, removeCursor, listCursors };
