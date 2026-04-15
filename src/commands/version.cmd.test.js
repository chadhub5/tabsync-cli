jest.mock('../version');
jest.mock('../session');

const version = require('../version');
const session = require('../session');
const {
  handleVersionSave,
  handleVersionList,
  handleVersionRestore,
  handleVersionDelete
} = require('./version.cmd');

beforeEach(() => jest.clearAllMocks());

describe('handleVersionSave', () => {
  test('saves version for existing session', () => {
    session.loadSession.mockReturnValue({ name: 'work', tabs: [] });
    version.addVersion.mockReturnValue({ versionId: 'v1', timestamp: '2024-01-01T00:00:00Z' });
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    handleVersionSave('work', 'initial');
    expect(version.addVersion).toHaveBeenCalledWith('work', { name: 'work', tabs: [] }, 'initial');
    spy.mockRestore();
  });

  test('exits if session not found', () => {
    session.loadSession.mockReturnValue(null);
    const exit = jest.spyOn(process, 'exit').mockImplementation(() => { throw new Error('exit'); });
    jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => handleVersionSave('missing', '')).toThrow('exit');
    exit.mockRestore();
  });
});

describe('handleVersionList', () => {
  test('prints versions', () => {
    version.listVersions.mockReturnValue([
      { versionId: 'v1', timestamp: '2024-01-01T00:00:00Z', message: 'first' }
    ]);
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    handleVersionList('work');
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('v1'));
    spy.mockRestore();
  });

  test('prints message when no versions', () => {
    version.listVersions.mockReturnValue([]);
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    handleVersionList('empty');
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('No versions'));
    spy.mockRestore();
  });
});

describe('handleVersionRestore', () => {
  test('restores session from version', () => {
    version.getVersion.mockReturnValue({ versionId: 'v1', data: { tabs: ['x'] } });
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    handleVersionRestore('work', 'v1');
    expect(session.saveSession).toHaveBeenCalledWith('work', { tabs: ['x'] });
    spy.mockRestore();
  });

  test('exits if version not found', () => {
    version.getVersion.mockReturnValue(null);
    const exit = jest.spyOn(process, 'exit').mockImplementation(() => { throw new Error('exit'); });
    jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => handleVersionRestore('work', 'v99')).toThrow('exit');
    exit.mockRestore();
  });
});

describe('handleVersionDelete', () => {
  test('deletes a version', () => {
    version.deleteVersion.mockReturnValue(true);
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    handleVersionDelete('work', 'v1');
    expect(version.deleteVersion).toHaveBeenCalledWith('work', 'v1');
    spy.mockRestore();
  });

  test('exits if version not found', () => {
    version.deleteVersion.mockReturnValue(false);
    const exit = jest.spyOn(process, 'exit').mockImplementation(() => { throw new Error('exit'); });
    jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => handleVersionDelete('work', 'v99')).toThrow('exit');
    exit.mockRestore();
  });
});
