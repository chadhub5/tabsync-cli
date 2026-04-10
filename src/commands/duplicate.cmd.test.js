const { handleDuplicate } = require('./duplicate.cmd');

const mockResult = {
  name: 'work-copy',
  copiedFrom: 'work',
  tabs: [{ url: 'https://github.com', title: 'GitHub' }],
};

jest.mock('../duplicate', () => ({
  duplicateSession: jest.fn(),
  cloneSession: jest.fn(),
}));

let consoleSpy, errorSpy, exitSpy;

beforeEach(() => {
  consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => { throw new Error('exit'); });
  jest.clearAllMocks();
});

afterEach(() => {
  consoleSpy.mockRestore();
  errorSpy.mockRestore();
  exitSpy.mockRestore();
});

describe('handleDuplicate', () => {
  test('calls duplicateSession when destName provided', async () => {
    const { duplicateSession } = require('../duplicate');
    duplicateSession.mockResolvedValue(mockResult);
    await handleDuplicate('work', 'work-copy');
    expect(duplicateSession).toHaveBeenCalledWith('work', 'work-copy', {});
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('duplicated as'));
  });

  test('calls cloneSession when no destName provided', async () => {
    const { cloneSession } = require('../duplicate');
    cloneSession.mockResolvedValue({ ...mockResult, name: 'work-copy-123' });
    await handleDuplicate('work', undefined);
    expect(cloneSession).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('cloned as'));
  });

  test('exits with error when source is missing', async () => {
    await expect(handleDuplicate(undefined, undefined)).rejects.toThrow('exit');
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('source session name is required'));
  });

  test('exits on duplicateSession error', async () => {
    const { duplicateSession } = require('../duplicate');
    duplicateSession.mockRejectedValue(new Error('Session "missing" not found.'));
    await expect(handleDuplicate('missing', 'dest')).rejects.toThrow('exit');
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('not found'));
  });
});
