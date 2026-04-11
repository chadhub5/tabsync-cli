jest.mock('../merge');
const { mergeSessionFiles } = require('../merge');
const { handleMerge } = require('./merge.cmd');

let exitSpy;
let logSpy;
let errSpy;

beforeEach(() => {
  jest.clearAllMocks();
  exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => { throw new Error('exit'); });
  logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  errSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  exitSpy.mockRestore();
  logSpy.mockRestore();
  errSpy.mockRestore();
});

test('calls mergeSessionFiles with correct args', async () => {
  mergeSessionFiles.mockResolvedValue({ tabs: [{ url: 'https://a.com' }] });
  await handleMerge('work', 'home', { strategy: 'union' });
  expect(mergeSessionFiles).toHaveBeenCalledWith('work', 'home', 'union');
});

test('logs success message with tab count', async () => {
  mergeSessionFiles.mockResolvedValue({ tabs: [1, 2, 3] });
  await handleMerge('work', 'home', {});
  expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Total tabs: 3'));
});

test('exits on missing base name', async () => {
  await expect(handleMerge(null, 'home')).rejects.toThrow('exit');
  expect(exitSpy).toHaveBeenCalledWith(1);
});

test('exits on missing target name', async () => {
  await expect(handleMerge('work', null)).rejects.toThrow('exit');
  expect(exitSpy).toHaveBeenCalledWith(1);
});

test('exits on invalid strategy', async () => {
  await expect(handleMerge('work', 'home', { strategy: 'bad' })).rejects.toThrow('exit');
  expect(errSpy).toHaveBeenCalledWith(expect.stringContaining('Invalid strategy'));
});

test('exits when mergeSessionFiles throws', async () => {
  mergeSessionFiles.mockRejectedValue(new Error('session not found'));
  await expect(handleMerge('work', 'home', {})).rejects.toThrow('exit');
  expect(errSpy).toHaveBeenCalledWith(expect.stringContaining('session not found'));
});

test('defaults to union strategy when not specified', async () => {
  mergeSessionFiles.mockResolvedValue({ tabs: [] });
  await handleMerge('a', 'b', {});
  expect(mergeSessionFiles).toHaveBeenCalledWith('a', 'b', 'union');
});
