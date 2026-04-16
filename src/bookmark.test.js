const fs = require('fs');
const path = require('path');
const os = require('os');

let tmpDir;
let mod;

function getModule() {
  jest.resetModules();
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tabsync-bookmark-'));
  process.env.TABSYNC_DIR = tmpDir;
  return require('./bookmark');
}

beforeEach(() => { mod = getModule(); });
afterEach(() => fs.rmSync(tmpDir, { recursive: true, force: true }));

test('addBookmark adds entry for session', () => {
  const entry = mod.addBookmark('work', 'https://example.com', 'docs');
  expect(entry.url).toBe('https://example.com');
  expect(entry.label).toBe('docs');
  expect(entry.createdAt).toBeDefined();
});

test('getBookmarks returns entries for session', () => {
  mod.addBookmark('work', 'https://a.com');
  mod.addBookmark('work', 'https://b.com', 'b');
  const bms = mod.getBookmarks('work');
  expect(bms).toHaveLength(2);
});

test('getBookmarks returns empty array for unknown session', () => {
  expect(mod.getBookmarks('nope')).toEqual([]);
});

test('removeBookmark removes matching url', () => {
  mod.addBookmark('work', 'https://a.com');
  const removed = mod.removeBookmark('work', 'https://a.com');
  expect(removed).toBe(true);
  expect(mod.getBookmarks('work')).toHaveLength(0);
});

test('removeBookmark returns false for missing session', () => {
  expect(mod.removeBookmark('ghost', 'https://x.com')).toBe(false);
});

test('clearBookmarks removes all entries for session', () => {
  mod.addBookmark('work', 'https://a.com');
  mod.clearBookmarks('work');
  expect(mod.getBookmarks('work')).toEqual([]);
});

test('findBookmarksByLabel finds across sessions', () => {
  mod.addBookmark('work', 'https://a.com', 'docs');
  mod.addBookmark('personal', 'https://b.com', 'fun');
  mod.addBookmark('work', 'https://c.com', 'docs-extra');
  const results = mod.findBookmarksByLabel('docs');
  expect(results['work']).toHaveLength(2);
  expect(results['personal']).toBeUndefined();
});
