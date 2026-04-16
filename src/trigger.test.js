const fs = require('fs');
const os = require('os');
const path = require('path');

function getModule() {
  jest.resetModules();
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tabsync-trigger-'));
  process.env.TABSYNC_DIR = tmpDir;
  return require('./trigger');
}

describe('trigger', () => {
  afterEach(() => {
    delete process.env.TABSYNC_DIR;
  });

  test('setTrigger stores a trigger for a session event', () => {
    const { setTrigger, getTriggers } = getModule();
    setTrigger('work', 'onOpen', 'notify');
    const triggers = getTriggers('work');
    expect(triggers['onOpen']).toBe('notify');
  });

  test('setTrigger overwrites existing trigger for same event', () => {
    const { setTrigger, getTriggers } = getModule();
    setTrigger('work', 'onOpen', 'notify');
    setTrigger('work', 'onOpen', 'log');
    expect(getTriggers('work')['onOpen']).toBe('log');
  });

  test('removeTrigger removes an existing trigger', () => {
    const { setTrigger, removeTrigger, getTriggers } = getModule();
    setTrigger('work', 'onClose', 'save');
    const result = removeTrigger('work', 'onClose');
    expect(result).toBe(true);
    expect(getTriggers('work')['onClose']).toBeUndefined();
  });

  test('removeTrigger returns false for non-existent session', () => {
    const { removeTrigger } = getModule();
    expect(removeTrigger('ghost', 'onOpen')).toBe(false);
  });

  test('removeTrigger returns false for non-existent event', () => {
    const { setTrigger, removeTrigger } = getModule();
    setTrigger('work', 'onOpen', 'notify');
    expect(removeTrigger('work', 'onClose')).toBe(false);
  });

  test('getTriggers returns empty object for unknown session', () => {
    const { getTriggers } = getModule();
    expect(getTriggers('unknown')).toEqual({});
  });

  test('listAllTriggers returns all triggers', () => {
    const { setTrigger, listAllTriggers } = getModule();
    setTrigger('work', 'onOpen', 'notify');
    setTrigger('home', 'onClose', 'backup');
    const all = listAllTriggers();
    expect(all['work']['onOpen']).toBe('notify');
    expect(all['home']['onClose']).toBe('backup');
  });

  test('clearTriggers removes all triggers for a session', () => {
    const { setTrigger, clearTriggers, getTriggers } = getModule();
    setTrigger('work', 'onOpen', 'notify');
    setTrigger('work', 'onClose', 'save');
    const result = clearTriggers('work');
    expect(result).toBe(true);
    expect(getTriggers('work')).toEqual({});
  });

  test('clearTriggers returns false for unknown session', () => {
    const { clearTriggers } = getModule();
    expect(clearTriggers('nope')).toBe(false);
  });
});
