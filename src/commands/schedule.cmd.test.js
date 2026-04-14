jest.mock('../schedule');

const schedule = require('../schedule');
const {
  handleScheduleAdd,
  handleScheduleRemove,
  handleScheduleList,
  handleScheduleShow
} = require('./schedule.cmd');

describe('schedule commands', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.log.mockRestore();
    console.error.mockRestore();
  });

  test('handleScheduleAdd calls addSchedule and logs success', () => {
    schedule.addSchedule.mockReturnValue({ sessionName: 'work', cron: '0 9 * * 1-5', action: 'restore' });
    handleScheduleAdd('work', '0 9 * * 1-5', { action: 'restore' });
    expect(schedule.addSchedule).toHaveBeenCalledWith('work', '0 9 * * 1-5', 'restore');
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('work'));
  });

  test('handleScheduleAdd errors on missing args', () => {
    handleScheduleAdd(null, null);
    expect(schedule.addSchedule).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalled();
  });

  test('handleScheduleRemove removes and logs', () => {
    schedule.removeSchedule.mockReturnValue(true);
    handleScheduleRemove('work');
    expect(schedule.removeSchedule).toHaveBeenCalledWith('work');
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('removed'));
  });

  test('handleScheduleRemove errors when not found', () => {
    schedule.removeSchedule.mockReturnValue(false);
    handleScheduleRemove('missing');
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('No schedule'));
  });

  test('handleScheduleList prints each schedule', () => {
    schedule.listSchedules.mockReturnValue([
      { sessionName: 'work', cron: '0 9 * * 1-5', action: 'restore', lastRun: null }
    ]);
    handleScheduleList();
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('work'));
  });

  test('handleScheduleList prints empty message when none', () => {
    schedule.listSchedules.mockReturnValue([]);
    handleScheduleList();
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('No schedules'));
  });

  test('handleScheduleShow prints schedule details', () => {
    schedule.getSchedule.mockReturnValue({ sessionName: 'work', cron: '0 9 * * 1-5', action: 'restore' });
    handleScheduleShow('work');
    expect(console.log).toHaveBeenCalled();
  });

  test('handleScheduleShow errors when not found', () => {
    schedule.getSchedule.mockReturnValue(null);
    handleScheduleShow('ghost');
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('No schedule'));
  });
});
