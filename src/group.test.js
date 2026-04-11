const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert/strict');

function getModule(mockFs) {
  const mod = Object.assign({}, require('./group'));
  mod._fs = mockFs;
  return mod;
}

describe('group', () => {
  let store;
  let mod;

  beforeEach(() => {
    store = {};
    const mockFs = {
      existsSync: (p) => p in store,
      mkdirSync: () => {},
      readFileSync: (p) => store[p],
      writeFileSync: (p, data) => { store[p] = data; },
      unlinkSync: (p) => { delete store[p]; },
      readdirSync: () => Object.keys(store).map(k => k.split('/').pop()).filter(f => f.endsWith('.json')),
    };
    jest.mock('fs', () => mockFs);
    jest.resetModules();
    mod = require('./group');
  });

  it('listGroups returns empty array when no groups exist', () => {
    const groups = mod.listGroups();
    assert.ok(Array.isArray(groups));
  });

  it('loadGroup returns null for missing group', () => {
    const result = mod.loadGroup('nonexistent');
    assert.equal(result, null);
  });

  it('saveGroup creates a group with sessions', () => {
    const result = mod.saveGroup('work', ['session1', 'session2']);
    assert.equal(result.name, 'work');
    assert.deepEqual(result.sessions, ['session1', 'session2']);
    assert.ok(result.updatedAt);
  });

  it('addSessionToGroup adds a session to a new group', () => {
    const result = mod.addSessionToGroup('work', 'session1');
    assert.equal(result.name, 'work');
    assert.ok(result.sessions.includes('session1'));
  });

  it('addSessionToGroup throws if session already in group', () => {
    mod.saveGroup('work', ['session1']);
    assert.throws(
      () => mod.addSessionToGroup('work', 'session1'),
      /already in group/
    );
  });

  it('removeSessionFromGroup throws if group not found', () => {
    assert.throws(
      () => mod.removeSessionFromGroup('missing', 'session1'),
      /not found/
    );
  });

  it('removeSessionFromGroup throws if session not in group', () => {
    mod.saveGroup('work', ['session1']);
    assert.throws(
      () => mod.removeSessionFromGroup('work', 'session2'),
      /not in group/
    );
  });

  it('deleteGroup throws if group does not exist', () => {
    assert.throws(
      () => mod.deleteGroup('ghost'),
      /not found/
    );
  });
});
