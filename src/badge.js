const fs = require('fs');
const path = require('path');

const BADGE_FILE = path.join(process.env.HOME || '.', '.tabsync', 'badges.json');

function ensureBadgeFile() {
  const dir = path.dirname(BADGE_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(BADGE_FILE)) fs.writeFileSync(BADGE_FILE, JSON.stringify({}));
}

function loadBadges() {
  ensureBadgeFile();
  return JSON.parse(fs.readFileSync(BADGE_FILE, 'utf8'));
}

function saveBadges(badges) {
  ensureBadgeFile();
  fs.writeFileSync(BADGE_FILE, JSON.stringify(badges, null, 2));
}

function setBadge(sessionName, badge) {
  if (!badge || typeof badge !== 'string') throw new Error('Badge must be a non-empty string');
  const badges = loadBadges();
  badges[sessionName] = badge;
  saveBadges(badges);
  return badge;
}

function removeBadge(sessionName) {
  const badges = loadBadges();
  if (!badges[sessionName]) return false;
  delete badges[sessionName];
  saveBadges(badges);
  return true;
}

function getBadge(sessionName) {
  const badges = loadBadges();
  return badges[sessionName] || null;
}

function listBadges() {
  return loadBadges();
}

function findByBadge(badge) {
  const badges = loadBadges();
  return Object.entries(badges)
    .filter(([, b]) => b === badge)
    .map(([name]) => name);
}

module.exports = { ensureBadgeFile, loadBadges, saveBadges, setBadge, removeBadge, getBadge, listBadges, findByBadge };
