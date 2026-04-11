const { handleDiff } = require('./diff.cmd');
const { diffSessions, formatDiff } = require('../diff');

jest.mock('../diff');

beforeEach(() => {
  jest.clearAllMocks();
  delete process.exitCode;
});

const fakeDiff = {
  added: ['https://new.com'],
  removed: ['https://old.com'],
  common: ['https://shared.com'],
  summary: { sessionA: 'a', sessionB: 'b', addedCount: 1, removedCount: 1, commonCount: 1, tabsA: 2, tabsB: 2 },
};

test('handleDiff prints formatted diff', async () => {
  diffSessions.mockReturnValue(fakeDiff);
  formatDiff.mockReturnValue('formatted output');
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});

  await handleDiff('a', 'b');

  expect(diffSessions).toHaveBeenCalledWith('a', 'b');
  expect(formatDiff).toHaveBeenCalledWith(fakeDiff);
  expect(spy).toHaveBeenCalledWith('formatted output');
  spy.mockRestore();
});

test('handleDiff prints JSON when --json flag set', async () => {
  diffSessions.mockReturnValue(fakeDiff);
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});

  await handleDiff('a', 'b', { json: true });

  expect(formatDiff).not.toHaveBeenCalled();
  expect(spy).toHaveBeenCalledWith(JSON.stringify(fakeDiff, null, 2));
  spy.mockRestore();
});

test('handleDiff sets exitCode on error from diffSessions', async () => {
  diffSessions.mockImplementation(() => { throw new Error('Session not found: x'); });
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

  await handleDiff('x', 'b');

  expect(process.exitCode).toBe(1);
  expect(spy).toHaveBeenCalledWith(expect.stringContaining('Session not found: x'));
  spy.mockRestore();
});

test('handleDiff shows usage and sets exitCode when args missing', async () => {
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

  await handleDiff();

  expect(process.exitCode).toBe(1);
  expect(spy).toHaveBeenCalledWith(expect.stringContaining('Usage'));
  spy.mockRestore();
});
