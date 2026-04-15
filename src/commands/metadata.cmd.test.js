jest.mock('../metadata');
const meta = require('../metadata');
const { handleMetaSet, handleMetaGet, handleMetaRemove, handleMetaList, handleMetaSessions } = require('./metadata.cmd');

beforeEach(() => jest.clearAllMocks());

describe('handleMetaSet', () => {
  test('sets a string value and logs', () => {
    meta.setMeta.mockReturnValue({ author: 'bob' });
    const spy = jest.spyOn(console, 'log').mockImplementation();
    handleMetaSet('s1', 'author', 'bob', {});
    expect(meta.setMeta).toHaveBeenCalledWith('s1', 'author', 'bob');
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  test('parses JSON values', () => {
    meta.setMeta.mockReturnValue({ count: 3 });
    jest.spyOn(console, 'log').mockImplementation();
    handleMetaSet('s1', 'count', '3', { quiet: true });
    expect(meta.setMeta).toHaveBeenCalledWith('s1', 'count', 3);
  });
});

describe('handleMetaGet', () => {
  test('prints value when found', () => {
    meta.getMeta.mockReturnValue('alice');
    const spy = jest.spyOn(console, 'log').mockImplementation();
    handleMetaGet('s1', 'author', {});
    expect(spy).toHaveBeenCalledWith(JSON.stringify('alice'));
    spy.mockRestore();
  });

  test('prints message when key missing', () => {
    meta.getMeta.mockReturnValue(undefined);
    const spy = jest.spyOn(console, 'log').mockImplementation();
    handleMetaGet('s1', 'missing', {});
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

describe('handleMetaRemove', () => {
  test('calls removeMeta and logs', () => {
    meta.removeMeta.mockReturnValue({});
    const spy = jest.spyOn(console, 'log').mockImplementation();
    handleMetaRemove('s1', 'author', {});
    expect(meta.removeMeta).toHaveBeenCalledWith('s1', 'author');
    spy.mockRestore();
  });
});

describe('handleMetaList', () => {
  test('lists keys for a session', () => {
    meta.loadMetadata.mockReturnValue({ a: 1, b: 2 });
    const spy = jest.spyOn(console, 'log').mockImplementation();
    handleMetaList('s1');
    expect(spy).toHaveBeenCalledTimes(2);
    spy.mockRestore();
  });

  test('shows message when empty', () => {
    meta.loadMetadata.mockReturnValue({});
    const spy = jest.spyOn(console, 'log').mockImplementation();
    handleMetaList('s1');
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('No metadata'));
    spy.mockRestore();
  });
});

describe('handleMetaSessions', () => {
  test('lists sessions with metadata', () => {
    meta.listMetadata.mockReturnValue(['alpha', 'beta']);
    const spy = jest.spyOn(console, 'log').mockImplementation();
    handleMetaSessions();
    expect(spy).toHaveBeenCalledTimes(2);
    spy.mockRestore();
  });
});
