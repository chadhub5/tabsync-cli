const { getModule } = (() => {
  let mod;
  return {
    getModule: () => {
      if (!mod) mod = require('./quota');
      return mod;
    }
  };
})();

const fs = require('fs');
const path = require('path');

jest.mock('fs');

describe('quota', () => {
  beforeEach(() => {
    jest.resetModules();
    fs.existsSync.mockReturnValue(true);
    fs.readFileSync.mockReturnValue(JSON.stringify({
      limits: { maxSessions: 100, maxTabsPerSession: 500, maxStorageMB: 50 },
      usage: {}
    }));
    fs.writeFileSync.mockImplementation(() => {});
    fs.mkdirSync.mockImplementation(() => {});
  });

  test('getLimits returns current limits', () => {
    const { getLimits } = require('./quota');
    const limits = getLimits();
    expect(limits.maxSessions).toBe(100);
    expect(limits.maxTabsPerSession).toBe(500);
    expect(limits.maxStorageMB).toBe(50);
  });

  test('setLimit updates a valid key', () => {
    const { setLimit } = require('./quota');
    const updated = setLimit('maxSessions', 200);
    expect(updated.maxSessions).toBe(200);
    expect(fs.writeFileSync).toHaveBeenCalled();
  });

  test('setLimit throws for unknown key', () => {
    const { setLimit } = require('./quota');
    expect(() => setLimit('unknownKey', 10)).toThrow('Unknown quota key: unknownKey');
  });

  test('checkQuota returns ok when under limit', () => {
    const { checkQuota } = require('./quota');
    const result = checkQuota('maxSessions', 50);
    expect(result.ok).toBe(true);
    expect(result.percent).toBe(50);
  });

  test('checkQuota returns not ok when at or over limit', () => {
    const { checkQuota } = require('./quota');
    const result = checkQuota('maxSessions', 100);
    expect(result.ok).toBe(false);
  });

  test('resetLimits restores defaults', () => {
    const { resetLimits, DEFAULT_LIMITS } = require('./quota');
    const limits = resetLimits();
    expect(limits).toEqual(DEFAULT_LIMITS);
    expect(fs.writeFileSync).toHaveBeenCalled();
  });

  test('ensureQuotaFile creates file if missing', () => {
    fs.existsSync.mockReturnValue(false);
    const { ensureQuotaFile } = require('./quota');
    ensureQuotaFile();
    expect(fs.mkdirSync).toHaveBeenCalled();
    expect(fs.writeFileSync).toHaveBeenCalled();
  });
});
