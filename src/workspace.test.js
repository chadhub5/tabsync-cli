const { describe, it, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const os = require('os');

function getModule(homeDir) {
  process.env.HOME = homeDir;
  Object.keys(require.cache).forEach(k => { if (k.includes('workspace')) delete require.cache[k]; });
  return require('./workspace');
}

describe('workspace', () => {
  let tmpDir;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tabsync-ws-'));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('saves and loads a workspace', () => {
    const mod = getModule(tmpDir);
    const ws = mod.saveWorkspace('mywork', ['session1', 'session2']);
    assert.equal(ws.name, 'mywork');
    assert.deepEqual(ws.sessions, ['session1', 'session2']);
    const loaded = mod.loadWorkspace('mywork');
    assert.equal(loaded.name, 'mywork');
    assert.deepEqual(loaded.sessions, ['session1', 'session2']);
  });

  it('returns null for missing workspace', () => {
    const mod = getModule(tmpDir);
    const result = mod.loadWorkspace('nope');
    assert.equal(result, null);
  });

  it('lists workspaces', () => {
    const mod = getModule(tmpDir);
    mod.saveWorkspace('alpha', ['s1']);
    mod.saveWorkspace('beta', ['s2', 's3']);
    const list = mod.listWorkspaces();
    assert.equal(list.length, 2);
    const names = list.map(w => w.name).sort();
    assert.deepEqual(names, ['alpha', 'beta']);
  });

  it('deletes a workspace', () => {
    const mod = getModule(tmpDir);
    mod.saveWorkspace('temp', []);
    const deleted = mod.deleteWorkspace('temp');
    assert.equal(deleted, true);
    assert.equal(mod.loadWorkspace('temp'), null);
  });

  it('returns false when deleting nonexistent workspace', () => {
    const mod = getModule(tmpDir);
    assert.equal(mod.deleteWorkspace('ghost'), false);
  });

  it('adds a session to a workspace without duplicates', () => {
    const mod = getModule(tmpDir);
    mod.saveWorkspace('ws1', ['a']);
    mod.addSessionToWorkspace('ws1', 'b');
    mod.addSessionToWorkspace('ws1', 'b');
    const ws = mod.loadWorkspace('ws1');
    assert.deepEqual(ws.sessions, ['a', 'b']);
  });

  it('removes a session from a workspace', () => {
    const mod = getModule(tmpDir);
    mod.saveWorkspace('ws2', ['x', 'y', 'z']);
    mod.removeSessionFromWorkspace('ws2', 'y');
    const ws = mod.loadWorkspace('ws2');
    assert.deepEqual(ws.sessions, ['x', 'z']);
  });

  it('throws when adding to nonexistent workspace', () => {
    const mod = getModule(tmpDir);
    assert.throws(() => mod.addSessionToWorkspace('missing', 'x'), /not found/);
  });
});
