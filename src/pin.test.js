const mockFs = {};

function getModule() {
  jest.resetModules();
  jest.mock('fs', () => ({
    existsSync: jest.fn((p) => p in mockFs),
    mkdirSync: jest.fn(),
    readFileSync: jest.fn((p) => mockFs[p] || '[]'),
    writeFileSync: jest.fn((p, data) => { mockFs[p] = data; }),
  }));
  return require('./pin');
}

beforeEach(() => {
  Object.keys(mockFs).forEach((k) => delete mockFs[k]);
});

test('pinSession adds a session to pinned list', () => {
  const { pinSession, loadPinned } = getModule();
  const result = pinSession('work');
  expect(result.pinned).toBe(true);
  expect(result.sessionName).toBe('work');
});

test('pinSession returns alreadyPinned if session is already pinned', () => {
  const { pinSession } = getModule();
  pinSession('work');
  const result = pinSession('work');
  expect(result.alreadyPinned).toBe(true);
});

test('unpinSession removes a pinned session', () => {
  const { pinSession, unpinSession } = getModule();
  pinSession('work');
  const result = unpinSession('work');
  expect(result.unpinned).toBe(true);
});

test('unpinSession returns notFound for unknown session', () => {
  const { unpinSession } = getModule();
  const result = unpinSession('ghost');
  expect(result.notFound).toBe(true);
});

test('listPinned returns all pinned sessions', () => {
  const { pinSession, listPinned } = getModule();
  pinSession('work');
  pinSession('personal');
  const pins = listPinned();
  expect(pins).toContain('work');
  expect(pins).toContain('personal');
});

test('isPinned returns true for pinned session', () => {
  const { pinSession, isPinned } = getModule();
  pinSession('dev');
  expect(isPinned('dev')).toBe(true);
});

test('isPinned returns false for unpinned session', () => {
  const { isPinned } = getModule();
  expect(isPinned('nope')).toBe(false);
});
