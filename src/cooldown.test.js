const fs = require('fs');
const path = require('path');

function getModule() {
  jest.resetModules();
  const tmp = require('os').tmpdir() + '/tabsync-cooldown-test-' + Date.now();
  process.env.HOME = tmp;
  return require('./cooldown');
}

describe('cooldown', () => {
  test('setCooldown stores entry', () => {
    const { setCooldown, getCooldown } = getModule();
    setCooldown('work', 60);
    const entry = getCooldown('work');
    expect(entry).not.toBeNull();
    expect(entry.seconds).toBe(60);
  });

  test('removeCooldown deletes entry', () => {
    const { setCooldown, removeCooldown, getCooldown } = getModule();
    setCooldown('work', 60);
    const result = removeCooldown('work');
    expect(result).toBe(true);
    expect(getCooldown('work')).toBeNull();
  });

  test('removeCooldown returns false if not found', () => {
    const { removeCooldown } = getModule();
    expect(removeCooldown('ghost')).toBe(false);
  });

  test('isCoolingDown returns true within window', () => {
    const { setCooldown, isCoolingDown } = getModule();
    setCooldown('work', 9999);
    expect(isCoolingDown('work')).toBe(true);
  });

  test('isCoolingDown returns false for expired cooldown', () => {
    const mod = getModule();
    mod.setCooldown('old', 1);
    const data = mod.loadCooldowns();
    data['old'].setAt = Date.now() - 5000;
    mod.saveCooldowns(data);
    expect(mod.isCoolingDown('old')).toBe(false);
  });

  test('listCooldowns returns all entries with remaining time', () => {
    const { setCooldown, listCooldowns } = getModule();
    setCooldown('a', 100);
    setCooldown('b', 200);
    const list = listCooldowns();
    expect(list.length).toBe(2);
    expect(list.find(e => e.name === 'a')).toBeDefined();
  });
});
