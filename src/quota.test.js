const fs = require('fs');
const path = require('path');
const os = require('os');

let tmpDir;
let mod;

function getModule() {
  jest.resetModules();
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tabsync-quota-'));
  process.env.HOME = tmpDir;
  return require('./quota');
}

beforeEach(() => { mod = getModule(); });
afterEach(() => fs.rmSync(tmpDir, { recursive: true, force: true }));

test('ensureQuotaFile creates file', () => {
  mod.ensureQuotaFile();
  const file = path.join(tmpDir, '.tabsync', 'quota.json');
  expect(fs.existsSync(file)).toBe(true);
});

test('setLimit and getLimits', () => {
  mod.setLimit('sessions', 100);
  const limits = mod.getLimits();
  expect(limits.sessions).toBe(100);
});

test('updateUsage and getUsage', () => {
  mod.updateUsage('sessions', 42);
  const usage = mod.getUsage();
  expect(usage.sessions).toBe(42);
});

test('checkQuota allows when under limit', () => {
  mod.setLimit('sessions', 10);
  mod.updateUsage('sessions', 5);
  const result = mod.checkQuota('sessions', 1);
  expect(result.allowed).toBe(true);
  expect(result.remaining).toBe(5);
});

test('checkQuota denies when over limit', () => {
  mod.setLimit('sessions', 10);
  mod.updateUsage('sessions', 10);
  const result = mod.checkQuota('sessions', 1);
  expect(result.allowed).toBe(false);
});

test('checkQuota allows when no limit set', () => {
  const result = mod.checkQuota('sessions');
  expect(result.allowed).toBe(true);
  expect(result.limit).toBeNull();
});

test('removeLimit deletes resource', () => {
  mod.setLimit('tabs', 50);
  mod.removeLimit('tabs');
  const limits = mod.getLimits();
  expect(limits.tabs).toBeUndefined();
});
