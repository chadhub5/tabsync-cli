const { handlePrioritySet, handlePriorityGet, handlePriorityRemove, handlePriorityList } = require('./priority.cmd');
const priority = require('./priority');

jest.mock('./priority');

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(process, 'exit').mockImplementation(() => { throw new Error('exit'); });
});

afterEach(() => {
  console.log.mockRestore();
  console.error.mockRestore();
  process.exit.mockRestore();
});

test('handlePrioritySet sets valid priority', () => {
  priority.getPriorityLabel.mockReturnValue('High');
  handlePrioritySet('work', '3', {});
  expect(priority.setPriority).toHaveBeenCalledWith('work', 3, undefined);
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('High'));
});

test('handlePrioritySet rejects invalid level', () => {
  expect(() => handlePrioritySet('work', '9', {})).toThrow('exit');
  expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Invalid'));
});

test('handlePriorityGet prints entry when found', () => {
  priority.getPriority.mockReturnValue({ level: 2 });
  priority.getPriorityLabel.mockReturnValue('Low');
  handlePriorityGet('work', {});
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Low'));
});

test('handlePriorityGet prints message when not found', () => {
  priority.getPriority.mockReturnValue(null);
  handlePriorityGet('work', {});
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('No priority'));
});

test('handlePriorityRemove removes priority', () => {
  handlePriorityRemove('work', {});
  expect(priority.removePriority).toHaveBeenCalledWith('work', undefined);
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('removed'));
});

test('handlePriorityList prints sorted entries', () => {
  priority.listByPriority.mockReturnValue([
    { session: 'alpha', level: 1 },
    { session: 'beta', level: 3 }
  ]);
  priority.getPriorityLabel.mockReturnValue('Medium');
  handlePriorityList({});
  expect(console.log).toHaveBeenCalledTimes(2);
});

test('handlePriorityList prints message when empty', () => {
  priority.listByPriority.mockReturnValue([]);
  handlePriorityList({});
  expect(console.log).toHaveBeenCalledWith('No priorities set.');
});
