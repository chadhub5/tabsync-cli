jest.mock('../reminder');
const reminder = require('../reminder');
const { handleReminderAdd, handleReminderRemove, handleReminderList, handleReminderDue } = require('./reminder.cmd');

beforeEach(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(process, 'exit').mockImplementation(() => { throw new Error('exit'); });
});
afterEach(() => jest.restoreAllMocks());

describe('handleReminderAdd', () => {
  test('calls addReminder and logs success', () => {
    reminder.addReminder.mockReturnValue({ id: '123', sessionName: 'work' });
    handleReminderAdd('work', 'Check tabs', '2099-01-01T10:00:00');
    expect(reminder.addReminder).toHaveBeenCalledWith('work', 'Check tabs', expect.any(String));
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('123'));
  });

  test('exits on missing args', () => {
    expect(() => handleReminderAdd()).toThrow('exit');
  });

  test('exits on invalid date', () => {
    expect(() => handleReminderAdd('work', 'msg', 'not-a-date')).toThrow('exit');
  });
});

describe('handleReminderRemove', () => {
  test('removes and logs', () => {
    reminder.removeReminder.mockReturnValue('123');
    handleReminderRemove('123');
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('123'));
  });

  test('exits on error', () => {
    reminder.removeReminder.mockImplementation(() => { throw new Error('not found'); });
    expect(() => handleReminderRemove('bad')).toThrow('exit');
  });
});

describe('handleReminderList', () => {
  test('prints reminders', () => {
    reminder.listReminders.mockReturnValue([{ id: '1', sessionName: 'work', message: 'hi', remindAt: new Date().toISOString() }]);
    handleReminderList();
    expect(console.log).toHaveBeenCalled();
  });

  test('prints empty message', () => {
    reminder.listReminders.mockReturnValue([]);
    handleReminderList();
    expect(console.log).toHaveBeenCalledWith('No reminders found.');
  });
});

describe('handleReminderDue', () => {
  test('prints due reminders', () => {
    reminder.getDueReminders.mockReturnValue([{ id: '1', sessionName: 'work', message: 'review' }]);
    handleReminderDue();
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('review'));
  });

  test('prints no due message', () => {
    reminder.getDueReminders.mockReturnValue([]);
    handleReminderDue();
    expect(console.log).toHaveBeenCalledWith('No due reminders.');
  });
});
