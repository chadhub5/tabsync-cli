const fs = require('fs');
const path = require('path');
const os = require('os');

const FAVORITES_FILE = path.join(os.homedir(), '.tabsync', 'favorites.json');

function ensureFavoritesFile() {
  const dir = path.dirname(FAVORITES_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(FAVORITES_FILE)) fs.writeFileSync(FAVORITES_FILE, JSON.stringify([]));
}

function loadFavorites() {
  ensureFavoritesFile();
  return JSON.parse(fs.readFileSync(FAVORITES_FILE, 'utf8'));
}

function saveFavorites(favorites) {
  ensureFavoritesFile();
  fs.writeFileSync(FAVORITES_FILE, JSON.stringify(favorites, null, 2));
}

function addFavorite(sessionName) {
  const favorites = loadFavorites();
  if (favorites.includes(sessionName)) {
    throw new Error(`Session '${sessionName}' is already a favorite`);
  }
  favorites.push(sessionName);
  saveFavorites(favorites);
  return favorites;
}

function removeFavorite(sessionName) {
  const favorites = loadFavorites();
  const index = favorites.indexOf(sessionName);
  if (index === -1) {
    throw new Error(`Session '${sessionName}' is not a favorite`);
  }
  favorites.splice(index, 1);
  saveFavorites(favorites);
  return favorites;
}

function isFavorite(sessionName) {
  const favorites = loadFavorites();
  return favorites.includes(sessionName);
}

/**
 * Renames a favorite session entry. Useful when a session is renamed
 * and the favorites list needs to stay in sync.
 */
function renameFavorite(oldName, newName) {
  const favorites = loadFavorites();
  const index = favorites.indexOf(oldName);
  if (index === -1) {
    throw new Error(`Session '${oldName}' is not a favorite`);
  }
  if (favorites.includes(newName)) {
    throw new Error(`Session '${newName}' is already a favorite`);
  }
  favorites[index] = newName;
  saveFavorites(favorites);
  return favorites;
}

module.exports = {
  ensureFavoritesFile,
  loadFavorites,
  saveFavorites,
  addFavorite,
  removeFavorite,
  isFavorite,
  renameFavorite
};
