jest.mock('../streak');
const streak = require('../streak');
const { handleStreakRecord, handleStreakGet, handleStreakReset, handleStreakList } = require('./streak.cmd');

beforeEach(() => jest.clearAllMocks());

describe('handleStreakRecord', () => {
  test('logs streak info', () => {
    streak.recordOpen.mockReturnValue({ count: 3, best: 5 });
    console.log = jest.fn();
    handleStreakRecord('work');
    expect(streak.recordOpen).toHaveBeenCalledWith('work');
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('3'));
  });
});

describe('handleStreakGet', () => {
  test('logs no streak when missing', () => {
    streak.getStreak.mockReturnValue({ count: 0, lastDate: null, best: 0 });
    console.log = jest.fn();
    handleStreakGet('work');
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('No streak'));
  });

  test('logs streak details', () => {
    streak.getStreak.mockReturnValue({ count: 4, lastDate: '2024-06-01', best: 7 });
    console.log = jest.fn();
    handleStreakGet('work');
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('4'));
  });
});

describe('handleStreakReset', () => {
  test('calls resetStreak and logs', () => {
    streak.resetStreak.mockReturnValue();
    console.log = jest.fn();
    handleStreakReset('work');
    expect(streak.resetStreak).toHaveBeenCalledWith('work');
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('reset'));
  });
});

describe('handleStreakList', () => {
  test('logs no streaks when empty', () => {
    streak.listStreaks.mockReturnValue({});
    console.log = jest.fn();
    handleStreakList();
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('No streaks'));
  });

  test('lists sorted streaks', () => {
    streak.listStreaks.mockReturnValue({
      work: { count: 2, best: 4, lastDate: '2024-06-01' },
      research: { count: 5, best: 5, lastDate: '2024-06-02' }
    });
    console.log = jest.fn();
    handleStreakList();
    const calls = console.log.mock.calls.map(c => c[0]);
    expect(calls[0]).toContain('research');
  });
});
