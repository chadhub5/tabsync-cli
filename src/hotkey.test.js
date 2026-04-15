const fs = require('fs');
const path = require('path');

function getModule() {
  jest.resetModules();
  const tmpFile = path.join(__dirname, '../tmp-hotkeys-test.json');
  process.env.HOME = path.join(__dirname, '..');
  jest.mock('fs');
  return require('./hotkey');
}

describe('hotkey', () => {
  let hotkey;
  const mockHotkeys = { f1: 'work', f2: 'personal' };

  beforeEach(() => {
    jest.resetModules();
    hotkey = require('./hotkey');
    jest.spyOn(hotkey, 'loadHotkeys').mockReturnValue({ ...mockHotkeys });
    jest.spyOn(hotkey, 'saveHotkeys').mockImplementation(() => {});
  });

  afterEach(() => jest.restoreAllMocks());

  test('setHotkey assigns session to key', () => {
    const result = hotkey.setHotkey('f3', 'research');
    expect(hotkey.saveHotkeys).toHaveBeenCalled();
    expect(result).toBe('research');
  });

  test('setHotkey throws if key missing', () => {
    expect(() => hotkey.setHotkey(null, 'session')).toThrow('key and sessionName are required');
  });

  test('removeHotkey deletes existing key', () => {
    const removed = hotkey.removeHotkey('f1');
    expect(removed).toBe('work');
    expect(hotkey.saveHotkeys).toHaveBeenCalled();
  });

  test('removeHotkey returns null for unknown key', () => {
    const result = hotkey.removeHotkey('f9');
    expect(result).toBeNull();
  });

  test('resolveHotkey returns session for key', () => {
    const result = hotkey.resolveHotkey('f2');
    expect(result).toBe('personal');
  });

  test('resolveHotkey returns null for unknown key', () => {
    expect(hotkey.resolveHotkey('f99')).toBeNull();
  });

  test('listHotkeys returns all hotkeys', () => {
    const result = hotkey.listHotkeys();
    expect(result).toEqual(mockHotkeys);
  });

  test('findHotkeyForSession returns matching keys', () => {
    const result = hotkey.findHotkeyForSession('work');
    expect(result).toContain('f1');
  });

  test('findHotkeyForSession returns empty array if none', () => {
    const result = hotkey.findHotkeyForSession('unknown');
    expect(result).toEqual([]);
  });
});
