const { handleAccessSet, handleAccessRemove, handleAccessGet, handleAccessList, handleAccessFilter } = require('./access.cmd');

jest.mock('../access', () => ({
  setAccess: jest.fn(),
  removeAccess: jest.fn(),
  getAccess: jest.fn(),
  listAccess: jest.fn(),
  filterByLevel: jest.fn(),
}));

const access = require('../access');

describe('access.cmd', () => {
  let out;
  beforeEach(() => {
    out = jest.fn();
    jest.clearAllMocks();
  });

  test('handleAccessSet outputs success message', () => {
    access.setAccess.mockReturnValue({ level: 'private', updatedAt: '2024-01-01' });
    handleAccessSet('work', 'private', {}, out);
    expect(out).toHaveBeenCalledWith(expect.stringContaining('private'));
  });

  test('handleAccessSet outputs error on exception', () => {
    access.setAccess.mockImplementation(() => { throw new Error('bad level'); });
    handleAccessSet('work', 'god', {}, out);
    expect(out).toHaveBeenCalledWith(expect.stringContaining('Error'));
  });

  test('handleAccessRemove confirms removal', () => {
    access.removeAccess.mockReturnValue(true);
    handleAccessRemove('work', {}, out);
    expect(out).toHaveBeenCalledWith(expect.stringContaining('removed'));
  });

  test('handleAccessRemove reports not found', () => {
    access.removeAccess.mockReturnValue(false);
    handleAccessRemove('ghost', {}, out);
    expect(out).toHaveBeenCalledWith(expect.stringContaining('No access entry'));
  });

  test('handleAccessGet prints entry details', () => {
    access.getAccess.mockReturnValue({ level: 'readonly', updatedAt: '2024-01-02' });
    handleAccessGet('docs', {}, out);
    expect(out).toHaveBeenCalledWith(expect.stringContaining('readonly'));
  });

  test('handleAccessGet handles missing entry', () => {
    access.getAccess.mockReturnValue(null);
    handleAccessGet('unknown', {}, out);
    expect(out).toHaveBeenCalledWith(expect.stringContaining('No access entry'));
  });

  test('handleAccessList prints all entries', () => {
    access.listAccess.mockReturnValue({ a: { level: 'public' }, b: { level: 'private' } });
    handleAccessList({}, out);
    expect(out).toHaveBeenCalledTimes(2);
  });

  test('handleAccessList handles empty', () => {
    access.listAccess.mockReturnValue({});
    handleAccessList({}, out);
    expect(out).toHaveBeenCalledWith(expect.stringContaining('No access entries'));
  });

  test('handleAccessFilter prints matching sessions', () => {
    access.filterByLevel.mockReturnValue([{ name: 'work', level: 'public' }]);
    handleAccessFilter('public', {}, out);
    expect(out).toHaveBeenCalledWith(expect.stringContaining('work'));
  });
});
