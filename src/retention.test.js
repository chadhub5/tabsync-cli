const fs = require('fs');
const path = require('path');
const os = require('os');

let tmpDir;
let mod;

function getModule() {
  jest.resetModules();
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tabsync-retention-'));
  process.env.TABSYNC_DIR = tmpDir;
  return require('./retention');
}

beforeEach(() => { mod = getModule(); });
afterEach(() => { fs.rmSync(tmpDir, { recursive: true, force: true }); });

test('setRetention stores days and setAt', () => {
  const result = mod.setRetention('s1', 7);
  expect(result.days).toBe(7);
  expect(result.setAt).toBeDefined();
});

test('getRetention returns stored entry', () => {
  mod.setRetention('s2', 14);
  const r = mod.getRetention('s2');
  expect(r.days).toBe(14);
});

test('getRetention returns null for unknown session', () => {
  expect(mod.getRetention('nope')).toBeNull();
});

test('removeRetention deletes entry', () => {
  mod.setRetention('s3', 3);
  expect(mod.removeRetention('s3')).toBe(true);
  expect(mod.getRetention('s3')).toBeNull();
});

test('removeRetention returns false if not found', () => {
  expect(mod.removeRetention('ghost')).toBe(false);
});

test('listRetention returns all entries', () => {
  mod.setRetention('a', 1);
  mod.setRetention('b', 2);
  const list = mod.listRetention();
  expect(Object.keys(list)).toHaveLength(2);
});

test('setRetention throws on invalid days', () => {
  expect(() => mod.setRetention('s4', 0)).toThrow();
  expect(() => mod.setRetention('s4', -5)).toThrow();
});

test('getExpiredSessions returns sessions past retention period', () => {
  const data = mod.loadRetention();
  const old = new Date(Date.now() - 10 * 86400000).toISOString();
  data['old-session'] = { days: 5, setAt: old };
  mod.saveRetention(data);
  const expired = mod.getExpiredSessions();
  expect(expired.some(e => e.sessionId === 'old-session')).toBe(true);
});

test('getExpiredSessions excludes non-expired sessions', () => {
  mod.setRetention('fresh', 30);
  const expired = mod.getExpiredSessions();
  expect(expired.some(e => e.sessionId === 'fresh')).toBe(false);
});
