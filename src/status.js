const fs = require('fs');
const path = require('path');
const { listSessions } = require('./session');
const { loadPinned } = require('./pin');
const { loadFavorites } = require('./favorite');
const { loadReminders } = require('./reminder');

const TABSYNC_DIR = process.env.TABSYNC_DIR || path.join(process.env.HOME || '', '.tabsync');

function getStorageSize(dir) {
  if (!fs.existsSync(dir)) return 0;
  let total = 0;
  for (const file of fs.readdirSync(dir)) {
    try {
      const stat = fs.statSync(path.join(dir, file));
      if (stat.isFile()) total += stat.size;
    } catch (_) {}
  }
  return total;
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

function getDueReminders(reminders) {
  const now = Date.now();
  return reminders.filter(r => r.dueAt && new Date(r.dueAt).getTime() <= now);
}

async function getStatus() {
  const sessions = listSessions();
  const pinned = loadPinned();
  const favorites = loadFavorites();
  const reminders = loadReminders();
  const dueReminders = getDueReminders(reminders);
  const storageSize = getStorageSize(TABSYNC_DIR);

  return {
    sessionCount: sessions.length,
    pinnedCount: pinned.length,
    favoriteCount: favorites.length,
    reminderCount: reminders.length,
    dueReminderCount: dueReminders.length,
    storageSize: formatBytes(storageSize),
    storageSizeBytes: storageSize,
    tabsyncDir: TABSYNC_DIR,
  };
}

function formatStatus(status) {
  const lines = [
    `tabsync status`,
    `  Sessions:   ${status.sessionCount}`,
    `  Pinned:     ${status.pinnedCount}`,
    `  Favorites:  ${status.favoriteCount}`,
    `  Reminders:  ${status.reminderCount}${
      status.dueReminderCount > 0 ? ` (${status.dueReminderCount} due!)` : ''
    }`,
    `  Storage:    ${status.storageSize}`,
    `  Dir:        ${status.tabsyncDir}`,
  ];
  return lines.join('\n');
}

module.exports = { getStatus, formatStatus, getStorageSize, formatBytes, getDueReminders };
