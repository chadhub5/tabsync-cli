const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert/strict');

function getModule() {
  jest.resetModules();
  const fs = require('fs');
  jest.mock('fs');
  fs.existsSync = jest.fn().mockReturnValue(true);
  let store = {};
  fs.readFileSync = jest.fn(() => JSON.stringify(store));
  fs.writeFileSync = jest.fn((_, data) => { store = JSON.parse(data); });
  fs.mkdirSync = jest.fn();
  const mod = require('./category');
  return { mod, store: () => store };
}

describe('category module', () => {
  let mod, getStore;
  beforeEach(() => {
    const result = getModule();
    mod = result.mod;
    getStore = result.store;
  });

  it('setCategory assigns a category to a session', () => {
    mod.setCategory('work', 'productivity');
    assert.equal(getStore()['work'], 'productivity');
  });

  it('getCategory returns the category for a session', () => {
    mod.setCategory('news', 'reading');
    assert.equal(mod.getCategory('news'), 'reading');
  });

  it('getCategory returns null for unknown session', () => {
    assert.equal(mod.getCategory('unknown'), null);
  });

  it('removeCategory removes the session entry', () => {
    mod.setCategory('dev', 'coding');
    const result = mod.removeCategory('dev');
    assert.equal(result, true);
    assert.equal(mod.getCategory('dev'), null);
  });

  it('removeCategory returns false if session not found', () => {
    assert.equal(mod.removeCategory('ghost'), false);
  });

  it('getSessionsByCategory returns matching sessions', () => {
    mod.setCategory('s1', 'work');
    mod.setCategory('s2', 'work');
    mod.setCategory('s3', 'personal');
    const result = mod.getSessionsByCategory('work');
    assert.ok(result.includes('s1'));
    assert.ok(result.includes('s2'));
    assert.equal(result.length, 2);
  });

  it('listCategories groups sessions by category', () => {
    mod.setCategory('a', 'tools');
    mod.setCategory('b', 'tools');
    mod.setCategory('c', 'media');
    const cats = mod.listCategories();
    assert.ok(cats['tools'].includes('a'));
    assert.ok(cats['media'].includes('c'));
  });
});
