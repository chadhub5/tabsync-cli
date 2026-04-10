const fs = require('fs');
const path = require('path');

function getModule() {
  jest.resetModules();
  const tmpFile = path.join(require('os').tmpdir(), `reminders-${Date.now()}.json`);
  jest.mock('path', () => ({ ...jest.requireActual('path'), join: (...args) => args.includes('reminders.json') ? tmpFile : jest.requireActual('path').join(...args) }));
  return require('./reminder');
}

describe('reminder', () => {
  afterEach(() => jest.resetModules());

  test('loadReminders returns empty array initially', () => {
    const { loadReminders } = getModule();
    expect(loadReminders()).toEqual([]);
  });

  test('addReminder stores a reminder', () => {
    const { addReminder, loadReminders } = getModule();
    const r = addReminder('work', 'Check tabs', new Date(Date.now() + 60000).toISOString());
    expect(r).toHaveProperty('id');
    expect(loadReminders()).toHaveLength(1);
  });

  test('removeReminder deletes by id', () => {
    const { addReminder, removeReminder, loadReminders } = getModule();
    const r = addReminder('work', 'msg', new Date().toISOString());
    removeReminder(r.id);
    expect(loadReminders()).toHaveLength(0);
  });

  test('removeReminder throws for unknown id', () => {
    const { removeReminder } = getModule();
    expect(() => removeReminder('nonexistent')).toThrow('Reminder not found');
  });

  test('getDueReminders returns only past reminders', () => {
    const { addReminder, getDueReminders } = getModule();
    addReminder('s1', 'past', new Date(Date.now() - 1000).toISOString());
    addReminder('s2', 'future', new Date(Date.now() + 100000).toISOString());
    const due = getDueReminders();
    expect(due).toHaveLength(1);
    expect(due[0].sessionName).toBe('s1');
  });

  test('listReminders filters by sessionName', () => {
    const { addReminder, listReminders } = getModule();
    addReminder('alpha', 'msg1', new Date().toISOString());
    addReminder('beta', 'msg2', new Date().toISOString());
    expect(listReminders('alpha')).toHaveLength(1);
    expect(listReminders()).toHaveLength(2);
  });
});
