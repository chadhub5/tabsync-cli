const fs = require('fs');
const path = require('path');
const os = require('os');
const { Session, saveSession, loadSession, listSessions } = require('./session');

let tmpDir;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tabsync-test-'));
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe('Session', () => {
  test('creates a session with name and tabs', () => {
    const s = new Session('work', ['https://github.com', 'https://notion.so']);
    expect(s.name).toBe('work');
    expect(s.tabs).toHaveLength(2);
    expect(s.version).toBe('1.0');
    expect(s.createdAt).toBeTruthy();
  });
});

describe('saveSession / loadSession', () => {
  test('round-trips a session to disk', () => {
    const session = new Session('home', ['https://example.com']);
    const filePath = path.join(tmpDir, 'home.json');
    saveSession(session, filePath);
    expect(fs.existsSync(filePath)).toBe(true);
    const loaded = loadSession(filePath);
    expect(loaded.name).toBe('home');
    expect(loaded.tabs).toEqual(['https://example.com']);
  });

  test('creates nested directories if needed', () => {
    const session = new Session('nested', []);
    const filePath = path.join(tmpDir, 'a', 'b', 'nested.json');
    saveSession(session, filePath);
    expect(fs.existsSync(filePath)).toBe(true);
  });

  test('throws when file does not exist', () => {
    expect(() => loadSession(path.join(tmpDir, 'nope.json'))).toThrow('not found');
  });

  test('throws on invalid JSON', () => {
    const filePath = path.join(tmpDir, 'bad.json');
    fs.writeFileSync(filePath, '{not valid json}', 'utf8');
    expect(() => loadSession(filePath)).toThrow('Invalid JSON');
  });

  test('throws when required fields are missing', () => {
    const filePath = path.join(tmpDir, 'missing.json');
    fs.writeFileSync(filePath, JSON.stringify({ name: 'oops' }), 'utf8');
    expect(() => loadSession(filePath)).toThrow('missing required fields');
  });
});

describe('listSessions', () => {
  test('returns empty array for missing directory', () => {
    expect(listSessions(path.join(tmpDir, 'nonexistent'))).toEqual([]);
  });

  test('lists only .json files', () => {
    fs.writeFileSync(path.join(tmpDir, 'a.json'), '{}');
    fs.writeFileSync(path.join(tmpDir, 'b.json'), '{}');
    fs.writeFileSync(path.join(tmpDir, 'notes.txt'), 'ignore me');
    const results = listSessions(tmpDir);
    expect(results).toHaveLength(2);
    expect(results.every(f => f.endsWith('.json'))).toBe(true);
  });
});
