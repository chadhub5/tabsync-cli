const fs = require('fs');
const path = require('path');

function getModule() {
  jest.resetModules();
  const os = require('os');
  jest.spyOn(os, 'homedir').mockReturnValue('/mock/home');
  return require('./lifecycle');
}

beforeEach(() => {
  jest.resetAllMocks();
  jest.mock('fs');
});

test('setLifecycleEvent creates new lifecycle for session', () => {
  const mod = getModule();
  jest.spyOn(fs, 'existsSync').mockReturnValue(false);
  jest.spyOn(fs, 'mkdirSync').mockImplementation(() => {});
  const written = [];
  jest.spyOn(fs, 'writeFileSync').mockImplementation((p, d) => written.push(JSON.parse(d)));
  const result = mod.setLifecycleEvent('mysession', 'created', 1000);
  expect(result.session).toBe('mysession');
  expect(result.events).toHaveLength(1);
  expect(result.events[0].event).toBe('created');
  expect(result.lastEvent).toBe('created');
});

test('setLifecycleEvent appends to existing lifecycle', () => {
  const mod = getModule();
  const existing = { session: 'mysession', events: [{ event: 'created', timestamp: 900 }], lastEvent: 'created', lastUpdated: 900 };
  jest.spyOn(fs, 'existsSync').mockReturnValue(true);
  jest.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify(existing));
  jest.spyOn(fs, 'mkdirSync').mockImplementation(() => {});
  jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {});
  const result = mod.setLifecycleEvent('mysession', 'opened', 1000);
  expect(result.events).toHaveLength(2);
  expect(result.lastEvent).toBe('opened');
});

test('setLifecycleEvent throws on invalid event', () => {
  const mod = getModule();
  expect(() => mod.setLifecycleEvent('s', 'invalid')).toThrow('Invalid lifecycle event');
});

test('getLifecycleHistory returns null when no file', () => {
  const mod = getModule();
  jest.spyOn(fs, 'existsSync').mockReturnValue(false);
  expect(mod.getLifecycleHistory('nope')).toBeNull();
});

test('deleteLifecycle removes file and returns true', () => {
  const mod = getModule();
  jest.spyOn(fs, 'existsSync').mockReturnValue(true);
  const unlink = jest.spyOn(fs, 'unlinkSync').mockImplementation(() => {});
  expect(mod.deleteLifecycle('mysession')).toBe(true);
  expect(unlink).toHaveBeenCalled();
});

test('listLifecycles returns session names', () => {
  const mod = getModule();
  jest.spyOn(fs, 'existsSync').mockReturnValue(true);
  jest.spyOn(fs, 'mkdirSync').mockImplementation(() => {});
  jest.spyOn(fs, 'readdirSync').mockReturnValue(['alpha.json', 'beta.json']);
  expect(mod.listLifecycles()).toEqual(['alpha', 'beta']);
});
