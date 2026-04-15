const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert/strict');

function getModule() {
  const store = {};
  return {
    addDependency(sessionId, dependsOnId) {
      if (!store[sessionId]) store[sessionId] = [];
      if (!store[sessionId].includes(dependsOnId)) store[sessionId].push(dependsOnId);
      return store[sessionId];
    },
    removeDependency(sessionId, dependsOnId) {
      if (!store[sessionId]) return [];
      store[sessionId] = store[sessionId].filter(id => id !== dependsOnId);
      if (store[sessionId].length === 0) delete store[sessionId];
      return store[sessionId] || [];
    },
    getDependencies(sessionId) {
      return store[sessionId] || [];
    },
    getDependents(sessionId) {
      return Object.entries(store)
        .filter(([, list]) => list.includes(sessionId))
        .map(([id]) => id);
    },
    clearDependencies(sessionId) {
      delete store[sessionId];
    }
  };
}

describe('dependency', () => {
  let mod;
  beforeEach(() => { mod = getModule(); });

  it('adds a dependency', () => {
    const result = mod.addDependency('a', 'b');
    assert.deepEqual(result, ['b']);
  });

  it('does not duplicate dependencies', () => {
    mod.addDependency('a', 'b');
    const result = mod.addDependency('a', 'b');
    assert.deepEqual(result, ['b']);
  });

  it('removes a dependency', () => {
    mod.addDependency('a', 'b');
    mod.addDependency('a', 'c');
    const result = mod.removeDependency('a', 'b');
    assert.deepEqual(result, ['c']);
  });

  it('returns empty array for unknown session', () => {
    assert.deepEqual(mod.getDependencies('unknown'), []);
  });

  it('gets dependents', () => {
    mod.addDependency('a', 'shared');
    mod.addDependency('b', 'shared');
    const dependents = mod.getDependents('shared');
    assert.ok(dependents.includes('a'));
    assert.ok(dependents.includes('b'));
  });

  it('clears all dependencies for a session', () => {
    mod.addDependency('a', 'b');
    mod.clearDependencies('a');
    assert.deepEqual(mod.getDependencies('a'), []);
  });

  it('remove cleans up empty entry', () => {
    mod.addDependency('a', 'b');
    mod.removeDependency('a', 'b');
    assert.deepEqual(mod.getDependencies('a'), []);
  });
});
