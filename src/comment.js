const fs = require('fs');
const path = require('path');

const COMMENTS_DIR = path.join(process.env.HOME || '.', '.tabsync', 'comments');

function ensureCommentsDir() {
  if (!fs.existsSync(COMMENTS_DIR)) {
    fs.mkdirSync(COMMENTS_DIR, { recursive: true });
  }
}

function getCommentPath(sessionName) {
  return path.join(COMMENTS_DIR, `${sessionName}.json`);
}

function loadComments(sessionName) {
  ensureCommentsDir();
  const filePath = getCommentPath(sessionName);
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function saveComments(sessionName, comments) {
  ensureCommentsDir();
  fs.writeFileSync(getCommentPath(sessionName), JSON.stringify(comments, null, 2));
}

function addComment(sessionName, text) {
  const comments = loadComments(sessionName);
  const entry = { id: Date.now(), text, createdAt: new Date().toISOString() };
  comments.push(entry);
  saveComments(sessionName, comments);
  return entry;
}

function removeComment(sessionName, id) {
  const comments = loadComments(sessionName);
  const filtered = comments.filter(c => c.id !== id);
  if (filtered.length === comments.length) return false;
  saveComments(sessionName, filtered);
  return true;
}

function listComments(sessionName) {
  return loadComments(sessionName);
}

function clearComments(sessionName) {
  saveComments(sessionName, []);
}

module.exports = {
  ensureCommentsDir,
  getCommentPath,
  loadComments,
  saveComments,
  addComment,
  removeComment,
  listComments,
  clearComments
};
