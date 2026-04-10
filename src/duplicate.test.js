const { duplicateSession, safeDuplicate } = require('./duplicate');

jest.mock('./session');
const { loadSession, saveSession } = require('./session');

const mockSession = {
  name: 'work',
  createdAt: '2024-01-01T00:00:00.000Z',
  tabs: [
    { url: 'https://github.com', title: 'GitHub' },
    { url: 'https://jira.io', title: 'Jira' },
  ],
};

beforeEach(() => {
  jest.clearAllMocks();
  loadSession.mockResolvedValue(mockSession);
  saveSession.mockResolvedValue(undefined);
});

describe('duplicateSession', () => {
  it('copies tabs from source to dest', async () => {
    const result = await duplicateSession('work', 'work-copy');
    expect(result.name).toBe('work-copy');
    expect(result.copiedFrom).toBe('work');
    expect(result.tabs).toHaveLength(2);
    expect(result.tabs[0].url).toBe('https://github.com');
  });

  it('saves the duplicated session', async () => {
    await duplicateSession('work', 'work-copy');
    expect(saveSession).toHaveBeenCalledWith('work-copy', expect.objectContaining({ name: 'work-copy' }));
  });

  it('applies titlePrefix when provided', async () => {
    const result = await duplicateSession('work', 'work-copy', { titlePrefix: '[Copy]' });
    expect(result.tabs[0].title).toBe('[Copy] GitHub');
  });

  it('throws if source session not found', async () => {
    loadSession.mockResolvedValue(null);
    await expect(duplicateSession('missing', 'dest')).rejects.toThrow('Session "missing" not found');
  });

  it('throws if sourceName is missing', async () => {
    await expect(duplicateSession('', 'dest')).rejects.toThrow('sourceName and destName are required');
  });
});

describe('safeDuplicate', () => {
  it('uses destName directly when no conflict', async () => {
    const result = await safeDuplicate('work', 'work-copy', { listSessions: async () => [] });
    expect(result.name).toBe('work-copy');
  });

  it('appends suffix when destName already exists', async () => {
    const existing = [{ name: 'work-copy' }, { name: 'work-copy-1' }];
    const result = await safeDuplicate('work', 'work-copy', {
      listSessions: async () => existing,
    });
    expect(result.name).toBe('work-copy-2');
  });
});
