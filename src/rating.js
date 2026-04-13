const fs = require('fs');
const path = require('path');
const os = require('os');

const RATINGS_FILE = path.join(os.homedir(), '.tabsync', 'ratings.json');

function ensureRatingsFile() {
  const dir = path.dirname(RATINGS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(RATINGS_FILE)) fs.writeFileSync(RATINGS_FILE, '{}', 'utf8');
}

function loadRatings() {
  ensureRatingsFile();
  return JSON.parse(fs.readFileSync(RATINGS_FILE, 'utf8'));
}

function saveRatings(ratings) {
  ensureRatingsFile();
  fs.writeFileSync(RATINGS_FILE, JSON.stringify(ratings, null, 2), 'utf8');
}

function setRating(sessionName, score) {
  if (score < 1 || score > 5) throw new Error('Rating must be between 1 and 5');
  const ratings = loadRatings();
  ratings[sessionName] = { score, updatedAt: new Date().toISOString() };
  saveRatings(ratings);
  return ratings[sessionName];
}

function removeRating(sessionName) {
  const ratings = loadRatings();
  if (!ratings[sessionName]) return false;
  delete ratings[sessionName];
  saveRatings(ratings);
  return true;
}

function getRating(sessionName) {
  const ratings = loadRatings();
  return ratings[sessionName] || null;
}

function listRatings() {
  return loadRatings();
}

function getTopRated(limit = 5) {
  const ratings = loadRatings();
  return Object.entries(ratings)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

module.exports = {
  ensureRatingsFile,
  loadRatings,
  saveRatings,
  setRating,
  removeRating,
  getRating,
  listRatings,
  getTopRated,
};
