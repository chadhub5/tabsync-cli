const fs = require('fs');
const path = require('path');

function getModule() {
  jest.resetModules();
  const mockDir = '/tmp/tabsync-test-metadata-' + Date.now();
  process.env.HOME = mockDir;
  return require('./metadata');
}

describe('metadata', () => {
  afterEach(() => jest.resetModules());

  test('ensureMetadataDir creates directory', () => {
    const { ensureMetadataDir, getMetadataPath } = getModule();
    ensureMetadataDir();
    const dir = path.dirname(getMetadataPath('test'));
    expect(fs.existsSync(dir)).toBe(true);
  });

  test('loadMetadata returns empty object for missing session', () => {
    const { loadMetadata } = getModule();
    expect(loadMetadata('nonexistent')).toEqual({});
  });

  test('setMeta and getMeta round-trip', () => {
    const { setMeta, getMeta } = getModule();
    setMeta('mysession', 'author', 'alice');
    expect(getMeta('mysession', 'author')).toBe('alice');
  });

  test('getMeta with no key returns full object', () => {
    const { setMeta, getMeta } = getModule();
    setMeta('s1', 'foo', 'bar');
    const all = getMeta('s1');
    expect(all.foo).toBe('bar');
  });

  test('removeMeta deletes a key', () => {
    const { setMeta, removeMeta, getMeta } = getModule();
    setMeta('s2', 'x', 1);
    removeMeta('s2', 'x');
    expect(getMeta('s2', 'x')).toBeUndefined();
  });

  test('deleteMetadata removes file', () => {
    const { setMeta, deleteMetadata, getMetadataPath } = getModule();
    setMeta('s3', 'k', 'v');
    deleteMetadata('s3');
    expect(fs.existsSync(getMetadataPath('s3'))).toBe(false);
  });

  test('listMetadata returns session names', () => {
    const { setMeta, listMetadata } = getModule();
    setMeta('alpha', 'a', 1);
    setMeta('beta', 'b', 2);
    const list = listMetadata();
    expect(list).toContain('alpha');
    expect(list).toContain('beta');
  });
});
