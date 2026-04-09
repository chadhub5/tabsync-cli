const fs = require('fs');
const path = require('path');
const os = require('os');

let tmpDir;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tabsync-share-'));
  jest.resetModules();
  jest.doMock('./session', () => ({
    loadSession: jest.fn((name) => {
      if (name === 'work') return { name: 'work', tabs: [{ url: 'https://example.com', title: 'Example' }] };
      return null;
    }),
  }));
  jest.doMock('./share', () => {
    const actual = jest.requireActual('./share');
    return { ...actual, SHARE_DIR: path.join(tmpDir, 'shared') };
  });
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

test('generateShareCode returns 8-char uppercase hex string', () => {
  const { generateShareCode } = require('./share');
  const code = generateShareCode();
  expect(code).toMatch(/^[A-F0-9]{8}$/);
});

test('shareSession throws if session not found', () => {
  const { shareSession } = require('./share');
  expect(() => shareSession('nonexistent')).toThrow('Session "nonexistent" not found');
});

test('shareSession creates a share file and returns a code', () => {
  const { shareSession, SHARE_DIR } = require('./share');
  const code = shareSession('work');
  expect(code).toMatch(/^[A-F0-9]{8}$/);
  const file = path.join(SHARE_DIR, `${code}.json`);
  expect(fs.existsSync(file)).toBe(true);
  const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
  expect(data.sessionName).toBe('work');
  expect(data.session.tabs).toHaveLength(1);
});

test('resolveShare returns null for unknown code', () => {
  const { resolveShare } = require('./share');
  expect(resolveShare('DEADBEEF')).toBeNull();
});

test('resolveShare returns payload for valid code', () => {
  const { shareSession, resolveShare } = require('./share');
  const code = shareSession('work');
  const payload = resolveShare(code);
  expect(payload).not.toBeNull();
  expect(payload.code).toBe(code);
  expect(payload.sessionName).toBe('work');
});

test('listShares returns all shared sessions', () => {
  const { shareSession, listShares } = require('./share');
  shareSession('work');
  shareSession('work');
  const shares = listShares();
  expect(shares).toHaveLength(2);
  shares.forEach(s => expect(s).toHaveProperty('code'));
});

test('revokeShare removes the share file', () => {
  const { shareSession, revokeShare, resolveShare } = require('./share');
  const code = shareSession('work');
  expect(revokeShare(code)).toBe(true);
  expect(resolveShare(code)).toBeNull();
});

test('revokeShare returns false for unknown code', () => {
  const { revokeShare } = require('./share');
  expect(revokeShare('DEADBEEF')).toBe(false);
});
