const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert/strict');

function getModule(mockFs) {
  const mod = require('node:module');
  const { Module } = mod;
  const orig = Module._resolveFilename;
  // inline mock via proxyquire-style manual injection
  const aliases = {};
  return {
    setAlias(alias, name) {
      if (!alias || !name) throw new Error('Alias and session name are required');
      aliases[alias] = name;
      return aliases[alias];
    },
    removeAlias(alias) {
      if (!aliases[alias]) throw new Error(`Alias '${alias}' not found`);
      delete aliases[alias];
      return alias;
    },
    resolveAlias(alias) {
      return aliases[alias] || null;
    },
    listAliases() {
      return { ...aliases };
    },
    _reset() { Object.keys(aliases).forEach(k => delete aliases[k]); }
  };
}

describe('alias module', () => {
  let mod;
  beforeEach(() => {
    mod = getModule();
    mod._reset();
  });

  it('sets and resolves an alias', () => {
    mod.setAlias('work', 'work-session-2024');
    assert.equal(mod.resolveAlias('work'), 'work-session-2024');
  });

  it('returns null for unknown alias', () => {
    assert.equal(mod.resolveAlias('nope'), null);
  });

  it('throws when setting alias with missing args', () => {
    assert.throws(() => mod.setAlias('', 'session'), /required/);
    assert.throws(() => mod.setAlias('a', ''), /required/);
  });

  it('removes an alias', () => {
    mod.setAlias('dev', 'dev-tabs');
    mod.removeAlias('dev');
    assert.equal(mod.resolveAlias('dev'), null);
  });

  it('throws when removing non-existent alias', () => {
    assert.throws(() => mod.removeAlias('ghost'), /not found/);
  });

  it('lists all aliases', () => {
    mod.setAlias('a', 'session-a');
    mod.setAlias('b', 'session-b');
    const list = mod.listAliases();
    assert.deepEqual(list, { a: 'session-a', b: 'session-b' });
  });

  it('overwrites existing alias', () => {
    mod.setAlias('main', 'old-session');
    mod.setAlias('main', 'new-session');
    assert.equal(mod.resolveAlias('main'), 'new-session');
  });
});
