const fs = require('fs');
const path = require('path');
const os = require('os');

const FAVORITES_FILE = path.join(os.homedir(), '.tabsync', 'favorites.json');

function getModule() {
  jest.resetModules();
  return require('./favorite');
}

beforeEach(() => {
  jest.resetModules();
  if (fs.existsSync(FAVORITES_FILE)) fs.unlinkSync(FAVORITES_FILE);
});

test('loadFavorites returns empty array when file does not exist', () => {
  const { loadFavorites } = getModule();
  expect(loadFavorites()).toEqual([]);
});

test('addFavorite adds a session name', () => {
  const { addFavorite, loadFavorites } = getModule();
  addFavorite('work');
  expect(loadFavorites()).toContain('work');
});

test('addFavorite throws if already a favorite', () => {
  const { addFavorite } = getModule();
  addFavorite('work');
  expect(() => addFavorite('work')).toThrow("Session 'work' is already a favorite");
});

test('removeFavorite removes a session name', () => {
  const { addFavorite, removeFavorite, loadFavorites } = getModule();
  addFavorite('work');
  removeFavorite('work');
  expect(loadFavorites()).not.toContain('work');
});

test('removeFavorite throws if not a favorite', () => {
  const { removeFavorite } = getModule();
  expect(() => removeFavorite('ghost')).toThrow("Session 'ghost' is not a favorite");
});

test('isFavorite returns true for favorited session', () => {
  const { addFavorite, isFavorite } = getModule();
  addFavorite('research');
  expect(isFavorite('research')).toBe(true);
});

test('isFavorite returns false for non-favorited session', () => {
  const { isFavorite } = getModule();
  expect(isFavorite('nope')).toBe(false);
});
