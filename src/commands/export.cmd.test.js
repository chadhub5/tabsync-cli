const path = require('path');
const os = require('os');
const fs = require('fs');
const { handleExport, handleImport } = require('./export.cmd');
const { saveSession, loadSession } = require('../session');

const TMP_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'tabsync-cmd-'));

const SAMPLE = {
  name: 'research',
  tabs: [{ url: 'https://mdn.web.docs', title: 'MDN' }],
  createdAt: new Date().toISOString(),
};

beforeEach(() => {
  saveSession(SAMPLE);
});

afterAll(() => {
  fs.rmSync(TMP_DIR, { recursive: true, force: true });
});

describe('handleExport', () => {
  test('exports session and logs success', () => {
    const outPath = path.join(TMP_DIR, 'research.json');
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    handleExport(['research', outPath]);

    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('exported'));
    expect(fs.existsSync(outPath)).toBe(true);
    consoleSpy.mockRestore();
  });

  test('exits with code 1 when args are missing', () => {
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => { throw new Error('exit'); });
    const errSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => handleExport([])).toThrow('exit');
    expect(exitSpy).toHaveBeenCalledWith(1);

    exitSpy.mockRestore();
    errSpy.mockRestore();
  });
});

describe('handleImport', () => {
  test('imports a session and saves it', () => {
    const outPath = path.join(TMP_DIR, 'import-cmd.json');
    handleExport(['research', outPath]);

    // Remove session so we can verify import re-creates it
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    handleImport([outPath]);

    const loaded = loadSession('research');
    expect(loaded).not.toBeNull();
    expect(loaded.tabs).toHaveLength(1);
    consoleSpy.mockRestore();
  });

  test('imports with a custom --name flag', () => {
    const outPath = path.join(TMP_DIR, 'import-renamed.json');
    handleExport(['research', outPath]);

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    handleImport([outPath, '--name', 'research-copy']);

    const loaded = loadSession('research-copy');
    expect(loaded).not.toBeNull();
    expect(loaded.name).toBe('research-copy');
    consoleSpy.mockRestore();
  });
});
