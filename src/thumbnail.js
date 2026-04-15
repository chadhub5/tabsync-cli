const fs = require('fs');
const path = require('path');

const THUMBNAIL_DIR = path.join(process.env.HOME || '.', '.tabsync', 'thumbnails');

function ensureThumbnailDir() {
  if (!fs.existsSync(THUMBNAIL_DIR)) {
    fs.mkdirSync(THUMBNAIL_DIR, { recursive: true });
  }
}

function getThumbnailPath(sessionName) {
  return path.join(THUMBNAIL_DIR, `${sessionName}.json`);
}

function saveThumbnail(sessionName, data) {
  ensureThumbnailDir();
  const thumbnail = {
    sessionName,
    preview: data.preview || '',
    tabCount: data.tabCount || 0,
    topDomains: data.topDomains || [],
    updatedAt: new Date().toISOString()
  };
  fs.writeFileSync(getThumbnailPath(sessionName), JSON.stringify(thumbnail, null, 2));
  return thumbnail;
}

function loadThumbnail(sessionName) {
  const filePath = getThumbnailPath(sessionName);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function deleteThumbnail(sessionName) {
  const filePath = getThumbnailPath(sessionName);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    return true;
  }
  return false;
}

function listThumbnails() {
  ensureThumbnailDir();
  return fs.readdirSync(THUMBNAIL_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => {
      const data = JSON.parse(fs.readFileSync(path.join(THUMBNAIL_DIR, f), 'utf8'));
      return data;
    });
}

function generateThumbnail(session) {
  const tabs = session.tabs || [];
  const topDomains = [...new Set(
    tabs.map(t => {
      try { return new URL(t.url).hostname; } catch { return null; }
    }).filter(Boolean)
  )].slice(0, 5);
  const preview = tabs.slice(0, 3).map(t => t.title || t.url).join(' | ');
  return { preview, tabCount: tabs.length, topDomains };
}

module.exports = {
  ensureThumbnailDir,
  getThumbnailPath,
  saveThumbnail,
  loadThumbnail,
  deleteThumbnail,
  listThumbnails,
  generateThumbnail
};
