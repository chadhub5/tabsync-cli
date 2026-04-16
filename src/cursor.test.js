const mockFs = {};
jest.mock('fs', () => ({
  existsSync: p => !!mockFs[p],
  mkdirSync: () => {},
  writeFileSync: (p, d) => { mockFs[p] = d; },
  readFileSync: (p) => mockFs[p],
  unlinkSync: (p) => { delete mockFs[p]; },
  readdirSync: () => Object.keys(mockFs).map(k => k.split('/').pop()).filter(f => f.endsWith('.cursor.json'))
}));

function getModule() {
  jest.resetModules();
  return require('./cursor');
}

describe('cursor', () => {
  beforeEach(() => { Object.keys(mockFs).forEach(k => delete mockFs[k]); });

  test('setCursor creates cursor entry', () => {
    const { setCursor, loadCursor, getCursorPath } = getModule();
    const result = setCursor('work', 2, 300);
    expect(result.tabIndex).toBe(2);
    expect(result.scrollY).toBe(300);
    expect(result.sessionName).toBe('work');
    expect(result.updatedAt).toBeDefined();
  });

  test('loadCursor returns null if not set', () => {
    const { loadCursor } = getModule();
    expect(loadCursor('nonexistent')).toBeNull();
  });

  test('loadCursor returns saved cursor', () => {
    const { setCursor, loadCursor } = getModule();
    setCursor('research', 0, 100);
    const c = loadCursor('research');
    expect(c.tabIndex).toBe(0);
    expect(c.scrollY).toBe(100);
  });

  test('removeCursor deletes the cursor file', () => {
    const { setCursor, removeCursor, loadCursor } = getModule();
    setCursor('temp', 1);
    removeCursor('temp');
    expect(loadCursor('temp')).toBeNull();
  });

  test('listCursors returns all cursors', () => {
    const { setCursor, listCursors } = getModule();
    setCursor('a', 0);
    setCursor('b', 1);
    const list = listCursors();
    expect(list.length).toBe(2);
  });
});
