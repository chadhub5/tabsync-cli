const fs = require('fs');
const path = require('path');

const NOTES_DIR = path.join(process.env.HOME || process.env.USERPROFILE, '.tabsync', 'notes');

function ensureNotesDir() {
  if (!fs.existsSync(NOTES_DIR)) {
    fs.mkdirSync(NOTES_DIR, { recursive: true });
  }
}

function getNotePath(sessionName) {
  return path.join(NOTES_DIR, `${sessionName}.json`);
}

function loadNote(sessionName) {
  ensureNotesDir();
  const notePath = getNotePath(sessionName);
  if (!fs.existsSync(notePath)) return null;
  const raw = fs.readFileSync(notePath, 'utf-8');
  return JSON.parse(raw);
}

function saveNote(sessionName, text) {
  ensureNotesDir();
  const note = {
    session: sessionName,
    text,
    updatedAt: new Date().toISOString(),
  };
  fs.writeFileSync(getNotePath(sessionName), JSON.stringify(note, null, 2));
  return note;
}

function deleteNote(sessionName) {
  const notePath = getNotePath(sessionName);
  if (!fs.existsSync(notePath)) return false;
  fs.unlinkSync(notePath);
  return true;
}

function listNotes() {
  ensureNotesDir();
  return fs.readdirSync(NOTES_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => {
      const raw = fs.readFileSync(path.join(NOTES_DIR, f), 'utf-8');
      return JSON.parse(raw);
    });
}

module.exports = { ensureNotesDir, getNotePath, loadNote, saveNote, deleteNote, listNotes };
