const fs = require('fs');
const path = require('path');
const os = require('os');

jest.mock('os', () => ({ homedir: () => '/tmp/tabsync-test-home' }));

const { registerSession, unregisterSession, getSyncedSessions, getLastSync, readManifest, SYNC_DIR } = require('./sync');

beforeEach(() => {
  if (fs.existsSync(SYNC_DIR)) {
    fs.rmSync(SYNC_DIR, { recursive: true, force: true });
  }
});

afterAll(() => {
  if (fs.existsSync(SYNC_DIR)) {
    fs.rmSync(SYNC_DIR, { recursive: true, force: true });
  }
});

describe('readManifest', () => {
  it('returns default manifest when no file exists', () => {
    const manifest = readManifest();
    expect(manifest.sessions).toEqual([]);
    expect(manifest.lastSync).toBeNull();
  });
});

describe('registerSession', () => {
  it('adds a new session to the manifest', () => {
    const entry = registerSession('work', '/tmp/work.json');
    expect(entry.name).toBe('work');
    expect(entry.filePath).toBe('/tmp/work.json');
    expect(entry.syncedAt).toBeDefined();
    const sessions = getSyncedSessions();
    expect(sessions).toHaveLength(1);
  });

  it('updates existing session instead of duplicating', () => {
    registerSession('work', '/tmp/work.json');
    registerSession('work', '/tmp/work-updated.json');
    const sessions = getSyncedSessions();
    expect(sessions).toHaveLength(1);
    expect(sessions[0].filePath).toBe('/tmp/work-updated.json');
  });

  it('updates lastSync timestamp', () => {
    registerSession('home', '/tmp/home.json');
    expect(getLastSync()).not.toBeNull();
  });
});

describe('unregisterSession', () => {
  it('removes a registered session', () => {
    registerSession('temp', '/tmp/temp.json');
    const result = unregisterSession('temp');
    expect(result).toBe(true);
    expect(getSyncedSessions()).toHaveLength(0);
  });

  it('returns false when session does not exist', () => {
    const result = unregisterSession('nonexistent');
    expect(result).toBe(false);
  });
});

describe('getSyncedSessions', () => {
  it('returns all registered sessions', () => {
    registerSession('a', '/tmp/a.json');
    registerSession('b', '/tmp/b.json');
    const sessions = getSyncedSessions();
    expect(sessions).toHaveLength(2);
    expect(sessions.map(s => s.name)).toEqual(['a', 'b']);
  });
});
