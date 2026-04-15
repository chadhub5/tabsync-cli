const fs = require('fs');
const path = require('path');
const os = require('os');

let tmpDir;
let quota;
let cmd;

beforeEach(() => {
  jest.resetModules();
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tabsync-quota-cmd-'));
  process.env.HOME = tmpDir;
  quota = require('../quota');
  cmd = require('./quota.cmd');
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
  jest.restoreAllMocks();
});

test('handleQuotaSet sets a limit and logs', () => {
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  cmd.handleQuotaSet('sessions', '50');
  expect(quota.getLimits().sessions).toBe(50);
  expect(spy).toHaveBeenCalledWith(expect.stringContaining('50'));
});

test('handleQuotaSet rejects invalid limit', () => {
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
  const exit = jest.spyOn(process, 'exit').mockImplementation(() => { throw new Error('exit'); });
  expect(() => cmd.handleQuotaSet('sessions', 'abc')).toThrow('exit');
  expect(spy).toHaveBeenCalled();
});

test('handleQuotaRemove removes limit', () => {
  quota.setLimit('tabs', 20);
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  cmd.handleQuotaRemove('tabs');
  expect(quota.getLimits().tabs).toBeUndefined();
});

test('handleQuotaList shows no quotas message', () => {
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  cmd.handleQuotaList();
  expect(spy).toHaveBeenCalledWith(expect.stringContaining('No quotas'));
});

test('handleQuotaList shows usage', () => {
  quota.setLimit('sessions', 100);
  quota.updateUsage('sessions', 30);
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  cmd.handleQuotaList();
  expect(spy).toHaveBeenCalledWith(expect.stringContaining('30/100'));
});

test('handleQuotaCheck reports allowed', () => {
  quota.setLimit('sessions', 10);
  quota.updateUsage('sessions', 3);
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  cmd.handleQuotaCheck('sessions', '1');
  expect(spy).toHaveBeenCalledWith(expect.stringContaining('ALLOWED'));
});

test('handleQuotaCheck reports denied', () => {
  quota.setLimit('sessions', 5);
  quota.updateUsage('sessions', 5);
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  cmd.handleQuotaCheck('sessions', '1');
  expect(spy).toHaveBeenCalledWith(expect.stringContaining('DENIED'));
});

test('handleQuotaUpdate updates usage', () => {
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  cmd.handleQuotaUpdate('sessions', '77');
  expect(quota.getUsage().sessions).toBe(77);
});
