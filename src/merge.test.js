const { mergeSessions } = require('./merge');

describe('mergeSessions', () => {
  const base = {
    name: 'work',
    tabs: [
      { url: 'https://github.com', title: 'GitHub' },
      { url: 'https://npmjs.com', title: 'npm' },
    ],
    createdAt: '2024-01-01T00:00:00.000Z',
  };

  const incoming = {
    name: 'home',
    tabs: [
      { url: 'https://npmjs.com', title: 'npm' },
      { url: 'https://nodejs.org', title: 'Node.js' },
    ],
  };

  test('union strategy combines unique tabs', () => {
    const result = mergeSessions(base, incoming, 'union');
    expect(result.tabs).toHaveLength(3);
    expect(result.tabs.map(t => t.url)).toContain('https://nodejs.org');
  });

  test('union does not duplicate existing URLs', () => {
    const result = mergeSessions(base, incoming, 'union');
    const urls = result.tabs.map(t => t.url);
    expect(urls.filter(u => u === 'https://npmjs.com')).toHaveLength(1);
  });

  test('replace strategy uses incoming tabs only', () => {
    const result = mergeSessions(base, incoming, 'replace');
    expect(result.tabs).toHaveLength(2);
    expect(result.tabs[0].url).toBe('https://npmjs.com');
  });

  test('intersect strategy keeps only shared tabs', () => {
    const result = mergeSessions(base, incoming, 'intersect');
    expect(result.tabs).toHaveLength(1);
    expect(result.tabs[0].url).toBe('https://npmjs.com');
  });

  test('preserves base name and createdAt', () => {
    const result = mergeSessions(base, incoming, 'union');
    expect(result.name).toBe('work');
    expect(result.createdAt).toBe('2024-01-01T00:00:00.000Z');
  });

  test('throws on unknown strategy', () => {
    expect(() => mergeSessions(base, incoming, 'bogus')).toThrow('Unknown merge strategy');
  });

  test('throws on invalid base', () => {
    expect(() => mergeSessions(null, incoming)).toThrow('Invalid base session');
  });

  test('sets mergedFrom to incoming name', () => {
    const result = mergeSessions(base, incoming, 'union');
    expect(result.mergedFrom).toBe('home');
  });
});
