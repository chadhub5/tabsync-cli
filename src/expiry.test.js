const fs = require('fs');
const path = require('path');

let setExpiry, removeExpiry, getExpiry, listExpired, listExpiry;

function getModule() {
  jest.resetModules();
  const mod = require('./expiry');
  ({ setExpiry, removeExpiry, getExpiry, listExpired, listExpiry } = mod);
  return mod;
}

beforeEach(() => {
  jest.resetModules();
  jest.mock('fs');
  fs.existsSync = jest.fn().mockReturnValue(true);
  fs.mkdirSync = jest.fn();
  fs.writeFileSync = jest.fn();
  fs.readFileSync = jest.fn().mockReturnValue(JSON.stringify({}));
  getModule();
});

test('setExpiry stores expiry for a session', () => {
  fs.readFileSync.mockReturnValue(JSON.stringify({}));
  const result = setExpiry('work', '2099-01-01T00:00:00.000Z');
  expect(result).toHaveProperty('expiresAt');
  expect(fs.writeFileSync).toHaveBeenCalled();
});

test('getExpiry returns null for unknown session', () => {
  fs.readFileSync.mockReturnValue(JSON.stringify({}));
  expect(getExpiry('unknown')).toBeNull();
});

test('getExpiry returns entry for known session', () => {
  fs.readFileSync.mockReturnValue(JSON.stringify({ dev: { expiresAt: '2099-01-01T00:00:00.000Z' } }));
  expect(getExpiry('dev')).toEqual({ expiresAt: '2099-01-01T00:00:00.000Z' });
});

test('removeExpiry returns false if session not found', () => {
  fs.readFileSync.mockReturnValue(JSON.stringify({}));
  expect(removeExpiry('ghost')).toBe(false);
});

test('removeExpiry deletes entry and returns true', () => {
  fs.readFileSync.mockReturnValue(JSON.stringify({ dev: { expiresAt: '2099-01-01T00:00:00.000Z' } }));
  expect(removeExpiry('dev')).toBe(true);
  expect(fs.writeFileSync).toHaveBeenCalled();
});

test('listExpired returns only past sessions', () => {
  fs.readFileSync.mockReturnValue(JSON.stringify({
    old: { expiresAt: '2000-01-01T00:00:00.000Z' },
    future: { expiresAt: '2099-01-01T00:00:00.000Z' }
  }));
  const expired = listExpired();
  expect(expired).toHaveLength(1);
  expect(expired[0].name).toBe('old');
});

test('listExpiry returns all entries', () => {
  fs.readFileSync.mockReturnValue(JSON.stringify({
    a: { expiresAt: '2099-01-01T00:00:00.000Z' },
    b: { expiresAt: '2099-06-01T00:00:00.000Z' }
  }));
  expect(listExpiry()).toHaveLength(2);
});
