const path = require('path');

let fs;
let mod;

function getModule() {
  jest.resetModules();
  fs = require('fs').promises;
  jest.mock('fs', () => ({ promises: { mkdir: jest.fn(), readFile: jest.fn(), writeFile: jest.fn(), unlink: jest.fn(), readdir: jest.fn() } }));
  mod = require('./workspace');
  return mod;
}

beforeEach(() => {
  getModule();
});

describe('ensureWorkspaceDir', () => {
  it('creates the workspace directory', async () => {
    fs.mkdir.mockResolvedValue();
    await mod.ensureWorkspaceDir();
    expect(fs.mkdir).toHaveBeenCalledWith(expect.stringContaining('workspaces'), { recursive: true });
  });
});

describe('saveWorkspace', () => {
  it('writes workspace JSON to disk', async () => {
    fs.mkdir.mockResolvedValue();
    fs.writeFile.mockResolvedValue();
    const result = await mod.saveWorkspace('myws', ['s1', 's2'], { description: 'test' });
    expect(result.name).toBe('myws');
    expect(result.sessions).toEqual(['s1', 's2']);
    expect(fs.writeFile).toHaveBeenCalled();
  });
});

describe('loadWorkspace', () => {
  it('reads and parses workspace JSON', async () => {
    fs.mkdir.mockResolvedValue();
    fs.readFile.mockResolvedValue(JSON.stringify({ name: 'myws', sessions: ['s1'] }));
    const result = await mod.loadWorkspace('myws');
    expect(result.name).toBe('myws');
  });

  it('returns null if file not found', async () => {
    fs.mkdir.mockResolvedValue();
    const err = new Error('not found');
    err.code = 'ENOENT';
    fs.readFile.mockRejectedValue(err);
    const result = await mod.loadWorkspace('missing');
    expect(result).toBeNull();
  });
});

describe('deleteWorkspace', () => {
  it('deletes the workspace file', async () => {
    fs.mkdir.mockResolvedValue();
    fs.unlink.mockResolvedValue();
    await mod.deleteWorkspace('myws');
    expect(fs.unlink).toHaveBeenCalled();
  });
});

describe('listWorkspaces', () => {
  it('returns a list of workspaces', async () => {
    fs.mkdir.mockResolvedValue();
    fs.readdir.mockResolvedValue(['myws.json', 'other.json']);
    fs.readFile.mockResolvedValue(JSON.stringify({ name: 'myws', sessions: [] }));
    const result = await mod.listWorkspaces();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(2);
  });

  it('returns empty array when no workspaces exist', async () => {
    fs.mkdir.mockResolvedValue();
    fs.readdir.mockResolvedValue([]);
    const result = await mod.listWorkspaces();
    expect(result).toEqual([]);
  });
});
