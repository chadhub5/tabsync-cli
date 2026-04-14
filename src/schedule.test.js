const fs = require('fs');
const path = require('path');

jest.mock('fs');

function getModule() {
  jest.resetModules();
  return require('./schedule');
}

describe('schedule', () => {
  beforeEach(() => {
    fs.existsSync = jest.fn().mockReturnValue(true);
    fs.mkdirSync = jest.fn();
    fs.readFileSync = jest.fn().mockReturnValue('{}');
    fs.writeFileSync = jest.fn();
  });

  test('loadSchedules returns empty object when file missing', () => {
    fs.existsSync = jest.fn().mockReturnValue(false);
    const { loadSchedules } = getModule();
    expect(loadSchedules()).toEqual({});
  });

  test('addSchedule stores schedule entry', () => {
    const { addSchedule } = getModule();
    const result = addSchedule('work', '0 9 * * 1-5', 'restore');
    expect(result.sessionName).toBe('work');
    expect(result.cron).toBe('0 9 * * 1-5');
    expect(result.action).toBe('restore');
    expect(result.lastRun).toBeNull();
    expect(fs.writeFileSync).toHaveBeenCalled();
  });

  test('removeSchedule deletes existing entry', () => {
    fs.readFileSync = jest.fn().mockReturnValue(JSON.stringify({
      work: { sessionName: 'work', cron: '0 9 * * 1-5', action: 'restore' }
    }));
    const { removeSchedule } = getModule();
    expect(removeSchedule('work')).toBe(true);
    expect(fs.writeFileSync).toHaveBeenCalled();
  });

  test('removeSchedule returns false for missing session', () => {
    const { removeSchedule } = getModule();
    expect(removeSchedule('nonexistent')).toBe(false);
  });

  test('listSchedules returns array of schedules', () => {
    fs.readFileSync = jest.fn().mockReturnValue(JSON.stringify({
      work: { sessionName: 'work', cron: '0 9 * * 1-5' },
      home: { sessionName: 'home', cron: '0 18 * * *' }
    }));
    const { listSchedules } = getModule();
    const result = listSchedules();
    expect(result).toHaveLength(2);
    expect(result.map(s => s.sessionName)).toContain('work');
  });

  test('updateLastRun sets lastRun timestamp', () => {
    fs.readFileSync = jest.fn().mockReturnValue(JSON.stringify({
      work: { sessionName: 'work', cron: '0 9 * * 1-5', lastRun: null }
    }));
    const { updateLastRun } = getModule();
    updateLastRun('work');
    const written = JSON.parse(fs.writeFileSync.mock.calls[0][1]);
    expect(written.work.lastRun).not.toBeNull();
  });
});
