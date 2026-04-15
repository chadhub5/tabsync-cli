const fs = require('fs');
const path = require('path');

function getModule() {
  jest.resetModules();
  const tmpFile = path.join(__dirname, `access_test_${Date.now()}.json`);
  jest.mock('path', () => ({
    ...jest.requireActual('path'),
    join: (...args) => args.includes('access.json') ? tmpFile : jest.requireActual('path').join(...args),
  }));
  return { mod: require('./access'), tmpFile };
}

describe('access', () => {
  let mod, tmpFile;

  beforeEach(() => {
    ({ mod, tmpFile } = getModule());
  });

  afterEach(() => {
    if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
  });

  test('setAccess stores a valid level', () => {
    mod.ensureAccessFile = jest.fn();
    mod.loadAccess = jest.fn(() => ({}));
    mod.saveAccess = jest.fn();
    const result = mod.setAccess('work', 'private');
    expect(result.level).toBe('private');
    expect(result.updatedAt).toBeDefined();
  });

  test('setAccess throws on invalid level', () => {
    expect(() => mod.setAccess('work', 'superuser')).toThrow('Invalid access level');
  });

  test('removeAccess returns false when session not found', () => {
    mod.loadAccess = jest.fn(() => ({}));
    mod.saveAccess = jest.fn();
    expect(mod.removeAccess('ghost')).toBe(false);
  });

  test('getAccess returns null for unknown session', () => {
    mod.loadAccess = jest.fn(() => ({}));
    expect(mod.getAccess('nobody')).toBeNull();
  });

  test('filterByLevel returns matching sessions', () => {
    mod.loadAccess = jest.fn(() => ({
      alpha: { level: 'public', updatedAt: '' },
      beta: { level: 'private', updatedAt: '' },
      gamma: { level: 'public', updatedAt: '' },
    }));
    const results = mod.filterByLevel('public');
    expect(results).toHaveLength(2);
    expect(results.map(r => r.name)).toContain('alpha');
  });
});
