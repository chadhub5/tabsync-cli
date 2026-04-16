const fs = require('fs');
const path = require('path');

function getModule() {
  jest.resetModules();
  const tmp = fs.mkdtempSync('/tmp/tabsync-decay-');
  process.env.HOME = tmp;
  return require('./decay');
}

describe('decay', () => {
  test('setDecay stores entry', () => {
    const { setDecay, getDecay } = getModule();
    setDecay('work', 7);
    const result = getDecay('work');
    expect(result).not.toBeNull();
    expect(result.days).toBe(7);
    expect(result.setAt).toBeDefined();
  });

  test('getDecay returns null for unknown session', () => {
    const { getDecay } = getModule();
    expect(getDecay('nope')).toBeNull();
  });

  test('removeDecay deletes entry', () => {
    const { setDecay, removeDecay, getDecay } = getModule();
    setDecay('proj', 3);
    const removed = removeDecay('proj');
    expect(removed).toBe(true);
    expect(getDecay('proj')).toBeNull();
  });

  test('removeDecay returns false for missing entry', () => {
    const { removeDecay } = getModule();
    expect(removeDecay('ghost')).toBe(false);
  });

  test('listAll returns all entries', () => {
    const { setDecay, listAll } = getModule();
    setDecay('a', 1);
    setDecay('b', 2);
    const all = listAll();
    expect(all.length).toBe(2);
    expect(all.map(x => x.name)).toContain('a');
  });

  test('listDecayed returns sessions past their decay period', () => {
    const { loadDecay, saveDecay, listDecayed } = getModule();
    const old = new Date(Date.now() - 10 * 86400000).toISOString();
    const data = { stale: { days: 5, setAt: old }, fresh: { days: 30, setAt: new Date().toISOString() } };
    saveDecay(data);
    const decayed = listDecayed();
    expect(decayed.map(x => x.name)).toContain('stale');
    expect(decayed.map(x => x.name)).not.toContain('fresh');
  });
});
