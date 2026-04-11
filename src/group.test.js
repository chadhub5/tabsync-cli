const path = require('path');

function getModule() {
  jest.resetModules();
  jest.mock('fs/promises');
  return require('./group');
}

describe('group module', () => {
  let fs;

  beforeEach(() => {
    jest.resetModules();
    jest.mock('fs/promises');
    fs = require('fs/promises');
  });

  afterEach(() => jest.clearAllMocks());

  test('ensureGroupDir creates directory', async () => {
    fs.mkdir = jest.fn().mockResolvedValue();
    const { ensureGroupDir } = getModule();
    await ensureGroupDir();
    expect(fs.mkdir).toHaveBeenCalled();
  });

  test('saveGroup writes JSON file', async () => {
    fs.mkdir = jest.fn().mockResolvedValue();
    fs.writeFile = jest.fn().mockResolvedValue();
    const { saveGroup } = getModule();
    await saveGroup('work', { name: 'work', sessions: [] });
    expect(fs.writeFile).toHaveBeenCalled();
    const args = fs.writeFile.mock.calls[0];
    expect(args[0]).toContain('work');
    expect(JSON.parse(args[1])).toMatchObject({ name: 'work' });
  });

  test('loadGroup reads and parses JSON', async () => {
    fs.mkdir = jest.fn().mockResolvedValue();
    fs.readFile = jest.fn().mockResolvedValue(JSON.stringify({ name: 'work', sessions: ['s1'] }));
    const { loadGroup } = getModule();
    const result = await loadGroup('work');
    expect(result.name).toBe('work');
    expect(result.sessions).toContain('s1');
  });

  test('addSessionToGroup appends session', async () => {
    fs.mkdir = jest.fn().mockResolvedValue();
    fs.readFile = jest.fn().mockResolvedValue(JSON.stringify({ name: 'work', sessions: [] }));
    fs.writeFile = jest.fn().mockResolvedValue();
    const { addSessionToGroup } = getModule();
    await addSessionToGroup('work', 'newSession');
    const written = JSON.parse(fs.writeFile.mock.calls[0][1]);
    expect(written.sessions).toContain('newSession');
  });

  test('listGroups returns group names', async () => {
    fs.mkdir = jest.fn().mockResolvedValue();
    fs.readdir = jest.fn().mockResolvedValue(['work.json', 'personal.json', 'notjson.txt']);
    const { listGroups } = getModule();
    const result = await listGroups();
    expect(result).toContain('work');
    expect(result).toContain('personal');
    expect(result).not.toContain('notjson.txt');
  });

  test('deleteGroup removes file', async () => {
    fs.mkdir = jest.fn().mockResolvedValue();
    fs.unlink = jest.fn().mockResolvedValue();
    const { deleteGroup } = getModule();
    await deleteGroup('work');
    expect(fs.unlink).toHaveBeenCalled();
    expect(fs.unlink.mock.calls[0][0]).toContain('work');
  });
});
