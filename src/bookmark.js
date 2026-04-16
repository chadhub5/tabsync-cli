const fs = require('fs');
const path = require('path');

const BOOKMARK_FILE = path.join(process.env.TABSYNC_DIR || '.tabsync', 'bookmarks.json');

function ensureBookmarkFile() {
  const dir = path.dirname(BOOKMARK_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(BOOKMARK_FILE)) fs.writeFileSync(BOOKMARK_FILE, JSON.stringify({}));
}

function loadBookmarks() {
  ensureBookmarkFile();
  return JSON.parse(fs.readFileSync(BOOKMARK_FILE, 'utf8'));
}

function saveBookmarks(bookmarks) {
  ensureBookmarkFile();
  fs.writeFileSync(BOOKMARK_FILE, JSON.stringify(bookmarks, null, 2));
}

function addBookmark(sessionName, url, label = '') {
  const bookmarks = loadBookmarks();
  if (!bookmarks[sessionName]) bookmarks[sessionName] = [];
  const entry = { url, label, createdAt: new Date().toISOString() };
  bookmarks[sessionName].push(entry);
  saveBookmarks(bookmarks);
  return entry;
}

function removeBookmark(sessionName, url) {
  const bookmarks = loadBookmarks();
  if (!bookmarks[sessionName]) return false;
  const before = bookmarks[sessionName].length;
  bookmarks[sessionName] = bookmarks[sessionName].filter(b => b.url !== url);
  saveBookmarks(bookmarks);
  return bookmarks[sessionName].length < before;
}

function getBookmarks(sessionName) {
  const bookmarks = loadBookmarks();
  return bookmarks[sessionName] || [];
}

function clearBookmarks(sessionName) {
  const bookmarks = loadBookmarks();
  delete bookmarks[sessionName];
  saveBookmarks(bookmarks);
}

function findBookmarksByLabel(label) {
  const bookmarks = loadBookmarks();
  const results = {};
  for (const [session, entries] of Object.entries(bookmarks)) {
    const matched = entries.filter(b => b.label && b.label.includes(label));
    if (matched.length) results[session] = matched;
  }
  return results;
}

module.exports = { ensureBookmarkFile, loadBookmarks, saveBookmarks, addBookmark, removeBookmark, getBookmarks, clearBookmarks, findBookmarksByLabel };
