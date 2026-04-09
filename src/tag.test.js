const fs = require('fs');
const path = require('path');
const os = require('os');

let tmpDir;
beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tabsync-tag-'));
  process.env.HOME = tmpDir;
  jest.resetModules();
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

function getModule() {
  jest.mock('./session', () => ({
    loadSession: (name) => name === 'work' || name === 'home' ? { name, tabs: [] } : null,
    saveSession: jest.fn()
  }));
  return require('./tag');
}

test('addTag adds session to tag index', () => {
  const { addTag, getSessionsByTag } = getModule();
  addTag('work', 'dev');
  expect(getSessionsByTag('dev')).toContain('work');
});

test('addTag does not duplicate entries', () => {
  const { addTag, getSessionsByTag } = getModule();
  addTag('work', 'dev');
  addTag('work', 'dev');
  expect(getSessionsByTag('dev').filter(s => s === 'work').length).toBe(1);
});

test('addTag throws if session not found', () => {
  const { addTag } = getModule();
  expect(() => addTag('missing', 'dev')).toThrow("Session 'missing' not found");
});

test('removeTag removes session from tag', () => {
  const { addTag, removeTag, getSessionsByTag } = getModule();
  addTag('work', 'dev');
  removeTag('work', 'dev');
  expect(getSessionsByTag('dev')).not.toContain('work');
});

test('removeTag removes tag key when empty', () => {
  const { addTag, removeTag, listAllTags } = getModule();
  addTag('work', 'dev');
  removeTag('work', 'dev');
  expect(listAllTags()).not.toContain('dev');
});

test('getTagsForSession returns all tags for a session', () => {
  const { addTag, getTagsForSession } = getModule();
  addTag('work', 'dev');
  addTag('work', 'important');
  const tags = getTagsForSession('work');
  expect(tags).toContain('dev');
  expect(tags).toContain('important');
});

test('listAllTags returns all tag keys', () => {
  const { addTag, listAllTags } = getModule();
  addTag('work', 'dev');
  addTag('home', 'personal');
  expect(listAllTags()).toEqual(expect.arrayContaining(['dev', 'personal']));
});
