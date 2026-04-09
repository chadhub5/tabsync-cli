jest.mock('../snapshot');
jest.mock('../session');

const snap = require('../snapshot');
const session = require('../session');
const {
  handleSnapshotCreate,
  handleSnapshotList,
  handleSnapshotRestore,
  handleSnapshotDelete,
} = require('./snapshot.cmd');

const MOCK_TABS = [
  { url: 'https://example.com', title: 'Example' },
];

const MOCK_SNAP = {
  id: 'snap_abc123',
  sessionName: 'work',
  label: 'My snap',
  tabs: MOCK_TABS,
  createdAt: '2024-06-01T00:00:00.000Z',
};

describe('snapshot commands', () => {
  let consoleSpy, errorSpy, exitSpy;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => { throw new Error('exit'); });
    jest.clearAllMocks();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
    errorSpy.mockRestore();
    exitSpy.mockRestore();
  });

  test('handleSnapshotCreate creates and logs snapshot', () => {
    session.loadSession.mockReturnValue({ tabs: MOCK_TABS });
    snap.createSnapshot.mockReturnValue(MOCK_SNAP);
    handleSnapshotCreate('work', { label: 'My snap' });
    expect(snap.createSnapshot).toHaveBeenCalledWith('work', MOCK_TABS, 'My snap');
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('snap_abc123'));
  });

  test('handleSnapshotCreate exits if session not found', () => {
    session.loadSession.mockReturnValue(null);
    expect(() => handleSnapshotCreate('missing')).toThrow('exit');
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('Session not found'));
  });

  test('handleSnapshotList prints snapshots', () => {
    snap.listSnapshots.mockReturnValue([MOCK_SNAP]);
    handleSnapshotList();
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('snap_abc123'));
  });

  test('handleSnapshotList prints empty message when no snapshots', () => {
    snap.listSnapshots.mockReturnValue([]);
    handleSnapshotList();
    expect(consoleSpy).toHaveBeenCalledWith('No snapshots found.');
  });

  test('handleSnapshotRestore logs tabs and success', () => {
    snap.loadSnapshot.mockReturnValue(MOCK_SNAP);
    handleSnapshotRestore('snap_abc123');
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Restoring snapshot'));
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('restored'));
  });

  test('handleSnapshotRestore exits on error', () => {
    snap.loadSnapshot.mockImplementation(() => { throw new Error('not found'); });
    expect(() => handleSnapshotRestore('snap_bad')).toThrow('exit');
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('Error restoring snapshot'));
  });

  test('handleSnapshotDelete deletes and logs', () => {
    snap.deleteSnapshot.mockReturnValue(true);
    handleSnapshotDelete('snap_abc123');
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Snapshot deleted'));
  });

  test('handleSnapshotDelete exits on error', () => {
    snap.deleteSnapshot.mockImplementation(() => { throw new Error('not found'); });
    expect(() => handleSnapshotDelete('snap_bad')).toThrow('exit');
  });
});
