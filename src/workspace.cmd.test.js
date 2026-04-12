jest.mock('./workspace');
const ws = require('./workspace');
const { handleWorkspaceSave, handleWorkspaceLoad, handleWorkspaceDelete, handleWorkspaceList, handleWorkspaceSwitch } = require('./workspace.cmd');

beforeEach(() => jest.clearAllMocks());

describe('handleWorkspaceSave', () => {
  it('saves a workspace and returns it', async () => {
    ws.saveWorkspace.mockResolvedValue({ name: 'dev', sessions: ['s1', 's2'] });
    const result = await handleWorkspaceSave('dev', ['s1', 's2']);
    expect(result.success).toBe(true);
    expect(result.workspace.name).toBe('dev');
    expect(ws.saveWorkspace).toHaveBeenCalledWith('dev', ['s1', 's2'], {});
  });

  it('throws if name is missing', async () => {
    await expect(handleWorkspaceSave('', ['s1'])).rejects.toThrow('Workspace name is required');
  });

  it('throws if sessions array is empty', async () => {
    await expect(handleWorkspaceSave('dev', [])).rejects.toThrow('At least one session is required');
  });
});

describe('handleWorkspaceLoad', () => {
  it('loads a workspace by name', async () => {
    ws.loadWorkspace.mockResolvedValue({ name: 'dev', sessions: ['s1'] });
    const result = await handleWorkspaceLoad('dev');
    expect(result.name).toBe('dev');
  });

  it('throws if workspace not found', async () => {
    ws.loadWorkspace.mockResolvedValue(null);
    await expect(handleWorkspaceLoad('missing')).rejects.toThrow("Workspace 'missing' not found");
  });

  it('throws if name is missing', async () => {
    await expect(handleWorkspaceLoad('')).rejects.toThrow('Workspace name is required');
  });
});

describe('handleWorkspaceDelete', () => {
  it('deletes a workspace', async () => {
    ws.deleteWorkspace.mockResolvedValue();
    const result = await handleWorkspaceDelete('dev');
    expect(result.deleted).toBe('dev');
  });

  it('throws if name is missing', async () => {
    await expect(handleWorkspaceDelete('')).rejects.toThrow('Workspace name is required');
  });
});

describe('handleWorkspaceList', () => {
  it('returns list of workspaces', async () => {
    ws.listWorkspaces.mockResolvedValue([{ name: 'dev', sessions: [] }]);
    const result = await handleWorkspaceList();
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('dev');
  });
});

describe('handleWorkspaceSwitch', () => {
  it('switches to a workspace', async () => {
    ws.switchWorkspace.mockResolvedValue({ name: 'prod', sessions: ['s3'] });
    const result = await handleWorkspaceSwitch('prod');
    expect(result.success).toBe(true);
    expect(result.active.name).toBe('prod');
  });

  it('throws if name is missing', async () => {
    await expect(handleWorkspaceSwitch('')).rejects.toThrow('Workspace name is required');
  });
});
