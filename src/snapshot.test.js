const fs = require('fs');
const path = require('path');

jest.mock('fs');

function getModule() {
  jest.resetModules();
  return require('./snapshot');
}

const MOCK_TABS = [
  { url: 'https://example.com', title: 'Example' },
  { url: 'https://github.com', title: 'GitHub' },
];

describe('snapshot', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fs.existsSync.mockReturnValue(true);
    fs.mkdirSync.mockImplementation(() => {});
  });

  test('createSnapshot writes a snapshot file', () => {
    const mod = getModule();
    fs.writeFileSync.mockImplementation(() => {});
    const snap = mod.createSnapshot('work', MOCK_TABS, 'My Snapshot');
    expect(snap.sessionName).toBe('work');
    expect(snap.label).toBe('My Snapshot');
    expect(snap.tabs).toEqual(MOCK_TABS);
    expect(snap.id).toMatch(/^snap_/);
    expect(fs.writeFileSync).toHaveBeenCalled();
  });

  test('createSnapshot uses default label when none provided', () => {
    const mod = getModule();
    fs.writeFileSync.mockImplementation(() => {});
    const snap = mod.createSnapshot('personal', MOCK_TABS);
    expect(snap.label).toBe('Snapshot of personal');
  });

  test('loadSnapshot returns parsed snapshot', () => {
    const mod = getModule();
    const mockSnap = { id: 'snap_123', sessionName: 'work', tabs: MOCK_TABS };
    fs.existsSync.mockReturnValue(true);
    fs.readFileSync.mockReturnValue(JSON.stringify(mockSnap));
    const result = mod.loadSnapshot('snap_123');
    expect(result).toEqual(mockSnap);
  });

  test('loadSnapshot throws if file not found', () => {
    const mod = getModule();
    fs.existsSync.mockReturnValue(false);
    expect(() => mod.loadSnapshot('snap_missing')).toThrow('Snapshot not found');
  });

  test('listSnapshots returns all snapshots sorted by date', () => {
    const mod = getModule();
    const snaps = [
      { id: 'snap_1', sessionName: 'work', createdAt: '2024-01-01T00:00:00.000Z' },
      { id: 'snap_2', sessionName: 'personal', createdAt: '2024-02-01T00:00:00.000Z' },
    ];
    fs.readdirSync.mockReturnValue(['snap_1.json', 'snap_2.json']);
    fs.readFileSync.mockImplementation((p) =>
      p.includes('snap_1') ? JSON.stringify(snaps[0]) : JSON.stringify(snaps[1])
    );
    const result = mod.listSnapshots();
    expect(result[0].id).toBe('snap_2');
  });

  test('deleteSnapshot removes file', () => {
    const mod = getModule();
    fs.existsSync.mockReturnValue(true);
    fs.unlinkSync.mockImplementation(() => {});
    const result = mod.deleteSnapshot('snap_123');
    expect(result).toBe(true);
    expect(fs.unlinkSync).toHaveBeenCalled();
  });

  test('deleteSnapshot throws if not found', () => {
    const mod = getModule();
    fs.existsSync.mockReturnValue(false);
    expect(() => mod.deleteSnapshot('snap_nope')).toThrow('Snapshot not found');
  });
});
