const fs = require('fs');
const path = require('path');
const os = require('os');
const { exportSession, importSession } = require('./export');
const { saveSession, loadSession } = require('./session');

// Use a temp dir so tests don't pollute the project
const TMP_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'tabsync-export-'));

const SAMPLE_SESSION = {
  name: 'work',
  tabs: [
    { url: 'https://github.com', title: 'GitHub' },
    { url: 'https://linear.app', title: 'Linear' },
  ],
  createdAt: new Date().toISOString(),
};

beforeEach(() => {
  saveSession(SAMPLE_SESSION);
});

afterAll(() => {
  fs.rmSync(TMP_DIR, { recursive: true, force: true });
});

describe('exportSession', () => {
  test('writes a JSON file to the given path', () => {
    const outPath = path.join(TMP_DIR, 'work-export.json');
    const result = exportSession('work', outPath);
    expect(result).toBe(outPath);
    expect(fs.existsSync(outPath)).toBe(true);
  });

  test('exported file contains version and exportedAt fields', () => {
    const outPath = path.join(TMP_DIR, 'work-meta.json');
    exportSession('work', outPath);
    const data = JSON.parse(fs.readFileSync(outPath, 'utf8'));
    expect(data.version).toBe('1.0');
    expect(data.exportedAt).toBeDefined();
  });

  test('exported file contains the correct session data', () => {
    const outPath = path.join(TMP_DIR, 'work-data.json');
    exportSession('work', outPath);
    const data = JSON.parse(fs.readFileSync(outPath, 'utf8'));
    expect(data.session.name).toBe('work');
    expect(data.session.tabs).toHaveLength(2);
  });

  test('throws when session does not exist', () => {
    expect(() => exportSession('nonexistent', path.join(TMP_DIR, 'x.json'))).toThrow(
      'Session "nonexistent" not found.'
    );
  });
});

describe('importSession', () => {
  test('returns a valid session object from an exported file', () => {
    const outPath = path.join(TMP_DIR, 'import-test.json');
    exportSession('work', outPath);
    const session = importSession(outPath);
    expect(session.name).toBe('work');
    expect(Array.isArray(session.tabs)).toBe(true);
  });

  test('throws when file does not exist', () => {
    expect(() => importSession('/no/such/file.json')).toThrow('File not found');
  });

  test('throws on malformed JSON', () => {
    const badPath = path.join(TMP_DIR, 'bad.json');
    fs.writeFileSync(badPath, 'not json', 'utf8');
    expect(() => importSession(badPath)).toThrow('Failed to parse export file');
  });

  test('throws on missing session fields', () => {
    const badPath = path.join(TMP_DIR, 'missing-fields.json');
    fs.writeFileSync(badPath, JSON.stringify({ version: '1.0', session: { name: 'x' } }), 'utf8');
    expect(() => importSession(badPath)).toThrow('Invalid export file format.');
  });
});
