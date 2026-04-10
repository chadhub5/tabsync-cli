const { handleArchiveCreate, handleArchiveRestore, handleArchiveList, handleArchiveDelete } = require('./archive.cmd');

jest.mock('../archive');
jest.mock('../session');

const archive = require('../archive');
const session = require('../session');

beforeEach(() => jest.clearAllMocks());

describe('handleArchiveCreate', () => {
  test('archives a session by name', async () => {
    session.loadSession.mockReturnValue({ tabs: [] });
    archive.archiveSession.mockReturnValue({});
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    await handleArchiveCreate({ _: ['archive', 'work'] });
    expect(session.loadSession).toHaveBeenCalledWith('work');
    expect(archive.archiveSession).toHaveBeenCalledWith('work', { tabs: [] });
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('archived successfully'));
    spy.mockRestore();
  });

  test('exits if no name provided', async () => {
    const spy = jest.spyOn(process, 'exit').mockImplementation(() => { throw new Error('exit'); });
    jest.spyOn(console, 'error').mockImplementation(() => {});
    await expect(handleArchiveCreate({ _: ['archive'] })).rejects.toThrow('exit');
    spy.mockRestore();
  });
});

describe('handleArchiveRestore', () => {
  test('restores a session from archive', async () => {
    archive.unarchiveSession.mockReturnValue({ tabs: ['https://a.com'] });
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    await handleArchiveRestore({ _: ['restore', 'work'] });
    expect(archive.unarchiveSession).toHaveBeenCalledWith('work');
    expect(session.saveSession).toHaveBeenCalledWith('work', { tabs: ['https://a.com'] });
    spy.mockRestore();
  });
});

describe('handleArchiveList', () => {
  test('prints archived sessions', async () => {
    archive.listArchived.mockReturnValue([{ name: 'old', archivedAt: '2024-01-01T00:00:00.000Z' }]);
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    await handleArchiveList();
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('old'));
    spy.mockRestore();
  });

  test('prints message when empty', async () => {
    archive.listArchived.mockReturnValue([]);
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    await handleArchiveList();
    expect(spy).toHaveBeenCalledWith('No archived sessions.');
    spy.mockRestore();
  });
});

describe('handleArchiveDelete', () => {
  test('deletes an archived session', async () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    await handleArchiveDelete({ _: ['delete', 'old'] });
    expect(archive.deleteArchived).toHaveBeenCalledWith('old');
    spy.mockRestore();
  });
});
