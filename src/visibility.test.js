const fs = require('fs');
const path = require('path');

function getModule() {
  jest.resetModules();
  const tmp = fs.mkdtempSync('/tmp/tabsync-vis-');
  process.env.HOME = tmp;
  return require('./visibility');
}

describe('visibility', () => {
  test('setVisibility and getVisibility', () => {
    const { setVisibility, getVisibility } = getModule();
    setVisibility('work', 'public');
    expect(getVisibility('work')).toBe('public');
  });

  test('getVisibility defaults to private', () => {
    const { getVisibility } = getModule();
    expect(getVisibility('unknown')).toBe('private');
  });

  test('setVisibility throws on invalid level', () => {
    const { setVisibility } = getModule();
    expect(() => setVisibility('work', 'invisible')).toThrow('Invalid visibility level');
  });

  test('removeVisibility removes existing entry', () => {
    const { setVisibility, removeVisibility, getVisibility } = getModule();
    setVisibility('docs', 'shared');
    const removed = removeVisibility('docs');
    expect(removed).toBe(true);
    expect(getVisibility('docs')).toBe('private');
  });

  test('removeVisibility returns false for missing entry', () => {
    const { removeVisibility } = getModule();
    expect(removeVisibility('ghost')).toBe(false);
  });

  test('listByVisibility returns matching sessions', () => {
    const { setVisibility, listByVisibility } = getModule();
    setVisibility('alpha', 'public');
    setVisibility('beta', 'shared');
    setVisibility('gamma', 'public');
    const pub = listByVisibility('public');
    expect(pub).toContain('alpha');
    expect(pub).toContain('gamma');
    expect(pub).not.toContain('beta');
  });

  test('getAllVisibility returns full map', () => {
    const { setVisibility, getAllVisibility } = getModule();
    setVisibility('s1', 'private');
    setVisibility('s2', 'public');
    const all = getAllVisibility();
    expect(all['s1']).toBe('private');
    expect(all['s2']).toBe('public');
  });
});
