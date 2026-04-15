const fs = require('fs');
const path = require('path');

function getModule() {
  jest.resetModules();
  const mockDir = '/tmp/tabsync-test-version-' + Date.now();
  process.env.HOME = mockDir;
  return require('./version');
}

describe('version', () => {
  afterEach(() => jest.resetModules());

  test('addVersion creates a versioned entry', () => {
    const { addVersion, loadVersions } = getModule();
    const data = { name: 'work', tabs: ['https://github.com'] };
    const entry = addVersion('work', data, 'initial save');
    expect(entry.versionId).toBe('v1');
    expect(entry.message).toBe('initial save');
    expect(entry.data).toEqual(data);
    const versions = loadVersions('work');
    expect(versions).toHaveLength(1);
  });

  test('addVersion increments versionId', () => {
    const { addVersion } = getModule();
    addVersion('proj', {}, 'first');
    const v2 = addVersion('proj', {}, 'second');
    expect(v2.versionId).toBe('v2');
  });

  test('getVersion returns correct entry', () => {
    const { addVersion, getVersion } = getModule();
    addVersion('s1', { tabs: [] }, 'a');
    addVersion('s1', { tabs: ['x'] }, 'b');
    const v = getVersion('s1', 'v2');
    expect(v.message).toBe('b');
  });

  test('getVersion returns null for missing id', () => {
    const { getVersion } = getModule();
    expect(getVersion('none', 'v99')).toBeNull();
  });

  test('listVersions omits data field', () => {
    const { addVersion, listVersions } = getModule();
    addVersion('s2', { tabs: ['a'] }, 'msg');
    const list = listVersions('s2');
    expect(list[0]).not.toHaveProperty('data');
    expect(list[0]).toHaveProperty('versionId');
    expect(list[0]).toHaveProperty('timestamp');
  });

  test('deleteVersion removes entry', () => {
    const { addVersion, deleteVersion, loadVersions } = getModule();
    addVersion('s3', {}, 'x');
    addVersion('s3', {}, 'y');
    const result = deleteVersion('s3', 'v1');
    expect(result).toBe(true);
    expect(loadVersions('s3')).toHaveLength(1);
  });

  test('deleteVersion returns false if not found', () => {
    const { deleteVersion } = getModule();
    expect(deleteVersion('s4', 'v99')).toBe(false);
  });
});
