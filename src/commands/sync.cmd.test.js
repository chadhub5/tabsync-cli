const { handleSyncAdd, handleSyncRemove, handleSyncList, handleSyncStatus } = require('./sync.cmd');

jest.mock('../sync', () => ({
  registerSession: jest.fn(() => ({ name: 'work', filePath: '/tmp/.tabsync/sessions/work.json', syncedAt: '2024-01-01T00:00:00.000Z' })),
  unregisterSession: jest.fn(),
  getSyncedSessions: jest.fn(),
  getLastSync: jest.fn(),
}));

jest.mock('../session', () => ({
  loadSession: jest.fn(),
}));

jest.mock('../export', () => ({
  exportSession: jest.fn(),
}));

const { registerSession, unregisterSession, getSyncedSessions, getLastSync } = require('../sync');
const { loadSession } = require('../session');
const { exportSession } = require('../export');

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(process, 'exit').mockImplementation(() => {});
});

afterEach(() => {
  console.log.mockRestore();
  console.error.mockRestore();
  process.exit.mockRestore();
});

describe('handleSyncAdd', () => {
  it('exports and registers session', () => {
    loadSession.mockReturnValue({ name: 'work', tabs: [] });
    handleSyncAdd('work', { dir: '/tmp/.tabsync/sessions' });
    expect(exportSession).toHaveBeenCalled();
    expect(registerSession).toHaveBeenCalledWith('work', '/tmp/.tabsync/sessions/work.json');
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('registered for sync'));
  });

  it('exits if session not found', () => {
    loadSession.mockReturnValue(null);
    handleSyncAdd('missing');
    expect(process.exit).toHaveBeenCalledWith(1);
  });
});

describe('handleSyncRemove', () => {
  it('removes a registered session', () => {
    unregisterSession.mockReturnValue(true);
    handleSyncRemove('work');
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('removed from sync'));
  });

  it('exits if session not registered', () => {
    unregisterSession.mockReturnValue(false);
    handleSyncRemove('ghost');
    expect(process.exit).toHaveBeenCalledWith(1);
  });
});

describe('handleSyncList', () => {
  it('prints message when no sessions', () => {
    getSyncedSessions.mockReturnValue([]);
    handleSyncList();
    expect(console.log).toHaveBeenCalledWith('No sessions registered for sync.');
  });

  it('lists all synced sessions', () => {
    getSyncedSessions.mockReturnValue([{ name: 'work', filePath: '/tmp/work.json', syncedAt: '2024-01-01T00:00:00.000Z' }]);
    getLastSync.mockReturnValue('2024-01-01T00:00:00.000Z');
    handleSyncList();
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('work'));
  });
});

describe('handleSyncStatus', () => {
  it('prints sync status summary', () => {
    getSyncedSessions.mockReturnValue([{ name: 'work' }]);
    getLastSync.mockReturnValue('2024-01-01T00:00:00.000Z');
    handleSyncStatus();
    expect(console.log).toHaveBeenCalledWith('Total synced sessions: 1');
  });
});
