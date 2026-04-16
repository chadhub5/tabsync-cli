const fs = require('fs');
const path = require('path');

const STREAK_FILE = path.join(process.env.HOME || '.', '.tabsync', 'streaks.json');

function ensureStreakFile() {
  const dir = path.dirname(STREAK_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(STREAK_FILE)) fs.writeFileSync(STREAK_FILE, '{}');
}

function loadStreaks() {
  ensureStreakFile();
  return JSON.parse(fs.readFileSync(STREAK_FILE, 'utf8'));
}

function saveStreaks(streaks) {
  ensureStreakFile();
  fs.writeFileSync(STREAK_FILE, JSON.stringify(streaks, null, 2));
}

function recordOpen(sessionName) {
  const streaks = loadStreaks();
  const today = new Date().toISOString().slice(0, 10);
  const entry = streaks[sessionName] || { count: 0, lastDate: null, best: 0 };
  if (entry.lastDate === today) return entry;
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  entry.count = entry.lastDate === yesterday ? entry.count + 1 : 1;
  entry.best = Math.max(entry.best, entry.count);
  entry.lastDate = today;
  streaks[sessionName] = entry;
  saveStreaks(streaks);
  return entry;
}

function getStreak(sessionName) {
  const streaks = loadStreaks();
  return streaks[sessionName] || { count: 0, lastDate: null, best: 0 };
}

function resetStreak(sessionName) {
  const streaks = loadStreaks();
  delete streaks[sessionName];
  saveStreaks(streaks);
}

function listStreaks() {
  return loadStreaks();
}

module.exports = { ensureStreakFile, loadStreaks, saveStreaks, recordOpen, getStreak, resetStreak, listStreaks };
