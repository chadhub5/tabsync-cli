const fs = require('fs');
const path = require('path');

let setBadge, removeBadge, getBadge, listBadges, findByBadge;

function getModule(mockData = {}) {
  jest.resetModules();
  jest.mock('fs');
  fs.existsSync.mockReturnValue(true);
  fs.readFileSync.mockReturnValue(JSON.stringify(mockData));
  fs.writeFileSync.mockImplementation(() => {});
  fs.mkdirSync.mockImplementation(() => {});
  const mod = require('./badge');
  return mod;
}

describe('badge', () => {
  beforeEach(() => {
    const mod = getModule({ work: '🔵', personal: '🟢' });
    setBadge = mod.setBadge;
    removeBadge = mod.removeBadge;
    getBadge = mod.getBadge;
    listBadges = mod.listBadges;
    findByBadge = mod.findByBadge;
  });

  test('getBadge returns badge for session', () => {
    expect(getBadge('work')).toBe('🔵');
  });

  test('getBadge returns null for unknown session', () => {
    expect(getBadge('unknown')).toBeNull();
  });

  test('setBadge sets badge and returns it', () => {
    const mod = getModule({});
    const result = mod.setBadge('dev', '🔴');
    expect(result).toBe('🔴');
    expect(fs.writeFileSync).toHaveBeenCalled();
  });

  test('setBadge throws on empty badge', () => {
    const mod = getModule({});
    expect(() => mod.setBadge('dev', '')).toThrow('Badge must be a non-empty string');
  });

  test('removeBadge removes existing badge', () => {
    expect(removeBadge('work')).toBe(true);
    expect(fs.writeFileSync).toHaveBeenCalled();
  });

  test('removeBadge returns false for missing session', () => {
    expect(removeBadge('nope')).toBe(false);
  });

  test('listBadges returns all badges', () => {
    const result = listBadges();
    expect(result).toEqual({ work: '🔵', personal: '🟢' });
  });

  test('findByBadge returns sessions with matching badge', () => {
    const result = findByBadge('🔵');
    expect(result).toContain('work');
    expect(result).not.toContain('personal');
  });
});
