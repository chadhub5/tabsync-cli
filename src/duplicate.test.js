const { duplicateSession, cloneSession } = require('./duplicate');

const mockSession = {
  name: 'work',
  createdAt: '2024-01-01T00:00:00.000Z',
  tabs: [
    { url: 'https://github.com', title: 'GitHub' },
    { url: 'https://example.com', title: 'Example' },
  ],
};

let sessions = {};

jest.mock('./session', () => ({
  loadSession: jest.fn(async (name) => sessions[name] || null),
  saveSession: jest.fn(async (name, data) => { sessions[name] = data; }),
}));

beforeEach(() => {
  sessions = { work: { ...mockSession, tabs: [...mockSession.tabs] } };
  jest.clearAllMocks();
});

describe('duplicateSession', () => {
  test('copies tabs to new session name', async () => {
    const result = await duplicateSession('work', 'work-backup');
    expect(result.name).toBe('work-backup');
    expect(result.tabs).toHaveLength(2);
    expect(result.copiedFrom).toBe('work');
  });

  test('applies titleSuffix to tab titles', async () => {
    const result = await duplicateSession('work', 'work-v2', { titleSuffix: ' [v2]' });
    expect(result.tabs[0].title).toBe('GitHub [v2]');
    expect(result.tabs[1].title).toBe('Example [v2]');
  });

  test('throws if source session not found', async () => {
    await expect(duplicateSession('missing', 'dest')).rejects.toThrow('Session "missing" not found.');
  });

  test('saves the duplicated session', async () => {
    const { saveSession } = require('./session');
    await duplicateSession('work', 'work-copy');
    expect(saveSession).toHaveBeenCalledWith('work-copy', expect.objectContaining({ name: 'work-copy' }));
  });
});

describe('cloneSession', () => {
  test('auto-generates dest name when not provided', async () => {
    const result = await cloneSession('work');
    expect(result.name).toMatch(/^work-copy-\d+$/);
  });

  test('uses provided destName', async () => {
    const result = await cloneSession('work', { destName: 'my-clone' });
    expect(result.name).toBe('my-clone');
  });
});
