const { diffSessions, formatDiff } = require('./diff');
const { loadSession } = require('./session');

jest.mock('./session');

const sessionA = { tabs: [
  { url: 'https://a.com' },
  { url: 'https://b.com' },
  { url: 'https://c.com' },
] };

const sessionB = { tabs: [
  { url: 'https://b.com' },
  { url: 'https://c.com' },
  { url: 'https://d.com' },
] };

beforeEach(() => {
  loadSession.mockImplementation(name => {
    if (name === 'alpha') return sessionA;
    if (name === 'beta') return sessionB;
    return null;
  });
});

test('diffSessions returns correct added/removed/common', () => {
  const result = diffSessions('alpha', 'beta');
  expect(result.added).toEqual(['https://d.com']);
  expect(result.removed).toEqual(['https://a.com']);
  expect(result.common).toEqual(expect.arrayContaining(['https://b.com', 'https://c.com']));
  expect(result.common).toHaveLength(2);
});

test('diffSessions summary contains correct counts', () => {
  const { summary } = diffSessions('alpha', 'beta');
  expect(summary.tabsA).toBe(3);
  expect(summary.tabsB).toBe(3);
  expect(summary.addedCount).toBe(1);
  expect(summary.removedCount).toBe(1);
  expect(summary.commonCount).toBe(2);
});

test('diffSessions stores session names in summary', () => {
  const { summary } = diffSessions('alpha', 'beta');
  expect(summary.nameA).toBe('alpha');
  expect(summary.nameB).toBe('beta');
});

test('diffSessions throws when session not found', () => {
  expect(() => diffSessions('missing', 'beta')).toThrow('Session not found: missing');
  expect(() => diffSessions('alpha', 'missing')).toThrow('Session not found: missing');
});

test('formatDiff returns a non-empty string with session names', () => {
  const diff = diffSessions('alpha', 'beta');
  const output = formatDiff(diff);
  expect(output).toContain('alpha');
  expect(output).toContain('beta');
  expect(output).toContain('https://d.com');
  expect(output).toContain('https://a.com');
});

test('formatDiff omits sections when nothing added or removed', () => {
  loadSession.mockReturnValue(sessionA);
  const diff = diffSessions('alpha', 'alpha');
  const output = formatDiff(diff);
  expect(output).not.toContain('Added:');
  expect(output).not.toContain('Removed:');
});
