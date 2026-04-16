jest.mock('fs');
const fs = require('fs');

function getModule() {
  jest.resetModules();
  return require('./streak');
}

describe('streak', () => {
  beforeEach(() => {
    fs.existsSync = jest.fn().mockReturnValue(true);
    fs.mkdirSync = jest.fn();
    fs.writeFileSync = jest.fn();
  });

  test('getStreak returns default when missing', () => {
    fs.readFileSync = jest.fn().mockReturnValue('{}');
    const { getStreak } = getModule();
    expect(getStreak('work')).toEqual({ count: 0, lastDate: null, best: 0 });
  });

  test('recordOpen sets count to 1 on first open', () => {
    fs.readFileSync = jest.fn().mockReturnValue('{}');
    const { recordOpen } = getModule();
    const result = recordOpen('work');
    expect(result.count).toBe(1);
    expect(fs.writeFileSync).toHaveBeenCalled();
  });

  test('recordOpen increments streak on consecutive day', () => {
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    fs.readFileSync = jest.fn().mockReturnValue(JSON.stringify({ work: { count: 3, lastDate: yesterday, best: 3 } }));
    const { recordOpen } = getModule();
    const result = recordOpen('work');
    expect(result.count).toBe(4);
    expect(result.best).toBe(4);
  });

  test('recordOpen resets streak if gap', () => {
    fs.readFileSync = jest.fn().mockReturnValue(JSON.stringify({ work: { count: 5, lastDate: '2000-01-01', best: 5 } }));
    const { recordOpen } = getModule();
    const result = recordOpen('work');
    expect(result.count).toBe(1);
    expect(result.best).toBe(5);
  });

  test('resetStreak removes entry', () => {
    fs.readFileSync = jest.fn().mockReturnValue(JSON.stringify({ work: { count: 2, lastDate: '2024-01-01', best: 2 } }));
    const { resetStreak } = getModule();
    resetStreak('work');
    const written = JSON.parse(fs.writeFileSync.mock.calls[0][1]);
    expect(written.work).toBeUndefined();
  });

  test('listStreaks returns all', () => {
    const data = { work: { count: 1, lastDate: '2024-01-01', best: 1 } };
    fs.readFileSync = jest.fn().mockReturnValue(JSON.stringify(data));
    const { listStreaks } = getModule();
    expect(listStreaks()).toEqual(data);
  });
});
