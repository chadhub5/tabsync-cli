jest.mock('./session');
jest.mock('./pin');
jest.mock('./favorite');
jest.mock('./reminder');
jest.mock('fs');

const fs = require('fs');

function getModule() {
  jest.resetModules();
  return require('./status');
}

describe('status', () => {
  beforeEach(() => {
    jest.resetModules();
    require('./session').listSessions = jest.fn().mockReturnValue([{ name: 'a' }, { name: 'b' }]);
    require('./pin').loadPinned = jest.fn().mockReturnValue(['a']);
    require('./favorite').loadFavorites = jest.fn().mockReturnValue([{ name: 'a' }]);
    require('./reminder').loadReminders = jest.fn().mockReturnValue([
      { id: '1', dueAt: new Date(Date.now() - 1000).toISOString() },
      { id: '2', dueAt: new Date(Date.now() + 99999).toISOString() },
    ]);
    fs.existsSync = jest.fn().mockReturnValue(true);
    fs.readdirSync = jest.fn().mockReturnValue(['file1.json', 'file2.json']);
    fs.statSync = jest.fn().mockReturnValue({ isFile: () => true, size: 512 });
  });

  test('getStatus returns correct counts', async () => {
    const { getStatus } = getModule();
    const status = await getStatus();
    expect(status.sessionCount).toBe(2);
    expect(status.pinnedCount).toBe(1);
    expect(status.favoriteCount).toBe(1);
    expect(status.reminderCount).toBe(2);
    expect(status.dueReminderCount).toBe(1);
  });

  test('formatBytes handles small values', () => {
    const { formatBytes } = getModule();
    expect(formatBytes(512)).toBe('512B');
    expect(formatBytes(2048)).toBe('2.0KB');
    expect(formatBytes(1048576)).toBe('1.0MB');
  });

  test('getDueReminders filters correctly', () => {
    const { getDueReminders } = getModule();
    const now = Date.now();
    const reminders = [
      { id: '1', dueAt: new Date(now - 5000).toISOString() },
      { id: '2', dueAt: new Date(now + 5000).toISOString() },
    ];
    const due = getDueReminders(reminders);
    expect(due).toHaveLength(1);
    expect(due[0].id).toBe('1');
  });

  test('formatStatus includes due reminder warning', async () => {
    const { getStatus, formatStatus } = getModule();
    const status = await getStatus();
    const output = formatStatus(status);
    expect(output).toContain('Reminders:');
    expect(output).toContain('due!');
    expect(output).toContain('Sessions:');
    expect(output).toContain('Storage:');
  });

  test('getStorageSize returns 0 when dir missing', () => {
    fs.existsSync = jest.fn().mockReturnValue(false);
    const { getStorageSize } = getModule();
    expect(getStorageSize('/nonexistent')).toBe(0);
  });
});
