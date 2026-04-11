const mockFiles = {};

jest.mock('fs', () => ({
  existsSync: (p) => p in mockFiles,
  mkdirSync: jest.fn(),
  readFileSync: (p) => mockFiles[p],
  writeFileSync: (p, d) => { mockFiles[p] = d; },
  unlinkSync: (p) => { delete mockFiles[p]; },
  readdirSync: () => Object.keys(mockFiles).map(k => k.split('/').pop()).filter(f => f.endsWith('.lock'))
}));

jest.mock('os', () => ({ homedir: () => '/home/user', hostname: () => 'test-host' }));

function getModule() {
  jest.resetModules();
  return require('./lock');
}

describe('lock', () => {
  beforeEach(() => {
    Object.keys(mockFiles).forEach(k => delete mockFiles[k]);
  });

  test('lockSession acquires lock when none exists', () => {
    const { lockSession } = getModule();
    const result = lockSession('mysession');
    expect(result.acquired).toBe(true);
    expect(result.locked).toBe(false);
  });

  test('lockSession returns locked info when already locked', () => {
    const { lockSession, getLockPath } = getModule();
    lockSession('mysession');
    const result = lockSession('mysession');
    expect(result.locked).toBe(true);
    expect(result.by).toBe('test-host');
  });

  test('unlockSession removes lock file', () => {
    const { lockSession, unlockSession } = getModule();
    lockSession('mysession');
    const result = unlockSession('mysession');
    expect(result.released).toBe(true);
  });

  test('unlockSession returns existed false when no lock', () => {
    const { unlockSession } = getModule();
    const result = unlockSession('nosuchsession');
    expect(result.existed).toBe(false);
  });

  test('getLockInfo returns null when not locked', () => {
    const { getLockInfo } = getModule();
    expect(getLockInfo('free')).toBeNull();
  });

  test('getLockInfo returns data when locked', () => {
    const { lockSession, getLockInfo } = getModule();
    lockSession('mysession');
    const info = getLockInfo('mysession');
    expect(info.by).toBe('test-host');
    expect(info.pid).toBeDefined();
  });

  test('listLocks returns all active locks', () => {
    const { lockSession, listLocks } = getModule();
    lockSession('alpha');
    lockSession('beta');
    const locks = listLocks();
    expect(locks.length).toBe(2);
    expect(locks.map(l => l.session)).toContain('alpha');
  });
});
