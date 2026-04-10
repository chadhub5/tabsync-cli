const { renameSession, validateName } = require('./rename');
const { saveSession, listSessions } = require('./session');
const os = require('os');
const path = require('path');
const fs = require('fs');

let tmpDir;

beforeEach(async () => {
  tmpDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'tabsync-rename-'));
});

afterEach(async () => {
  await fs.promises.rm(tmpDir, { recursive: true, force: true });
});

describe('validateName', () => {
  test('accepts valid names', () => {
    expect(validateName('my-session')).toBe(true);
    expect(validateName('session_01')).toBe(true);
    expect(validateName('Work')).toBe(true);
  });

  test('rejects invalid names', () => {
    expect(validateName('')).toBe(false);
    expect(validateName('has space')).toBe(false);
    expect(validateName('has.dot')).toBe(false);
    expect(validateName(null)).toBe(false);
  });
});

describe('renameSession', () => {
  test('renames an existing session', async () => {
    await saveSession(tmpDir, 'old-name', { tabs: ['https://example.com'] });
    const result = await renameSession(tmpDir, 'old-name', 'new-name');
    expect(result.name).toBe('new-name');
    expect(result.renamedAt).toBeDefined();
    const files = await fs.promises.readdir(tmpDir);
    expect(files).toContain('new-name.json');
    expect(files).not.toContain('old-name.json');
  });

  test('throws if old session does not exist', async () => {
    await expect(renameSession(tmpDir, 'ghost', 'new-name')).rejects.toThrow('not found');
  });

  test('throws if new name already exists', async () => {
    await saveSession(tmpDir, 'alpha', { tabs: [] });
    await saveSession(tmpDir, 'beta', { tabs: [] });
    await expect(renameSession(tmpDir, 'alpha', 'beta')).rejects.toThrow('already exists');
  });

  test('throws if names are the same', async () => {
    await saveSession(tmpDir, 'same', { tabs: [] });
    await expect(renameSession(tmpDir, 'same', 'same')).rejects.toThrow('different');
  });

  test('throws on invalid new name', async () => {
    await saveSession(tmpDir, 'valid', { tabs: [] });
    await expect(renameSession(tmpDir, 'valid', 'bad name!')).rejects.toThrow('Invalid new session name');
  });
});
