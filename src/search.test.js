jest.mock('./session');
jest.mock('./tag');

const { listSessions, loadSession } = require('./session');
const { loadTagIndex } = require('./tag');
const { searchByTitle, searchByUrl, searchByTag, searchAll } = require('./search');

const mockSessions = {
  work: {
    tabs: [
      { title: 'GitHub - work repo', url: 'https://github.com/org/repo' },
      { title: 'Jira Board', url: 'https://jira.example.com/board' }
    ]
  },
  personal: {
    tabs: [
      { title: 'YouTube', url: 'https://youtube.com' },
      { title: 'Reddit', url: 'https://reddit.com' }
    ]
  }
};

beforeEach(() => {
  listSessions.mockResolvedValue(['work', 'personal']);
  loadSession.mockImplementation(name => Promise.resolve(mockSessions[name] || null));
  loadTagIndex.mockResolvedValue({ dev: ['work'], fun: ['personal'] });
});

test('searchByTitle finds matching sessions', async () => {
  const results = await searchByTitle('github');
  expect(results).toHaveLength(1);
  expect(results[0].name).toBe('work');
});

test('searchByTitle returns empty if no match', async () => {
  const results = await searchByTitle('nonexistent');
  expect(results).toHaveLength(0);
});

test('searchByUrl finds matching sessions', async () => {
  const results = await searchByUrl('youtube.com');
  expect(results).toHaveLength(1);
  expect(results[0].name).toBe('personal');
});

test('searchByTag returns sessions with that tag', async () => {
  const results = await searchByTag('dev');
  expect(results).toHaveLength(1);
  expect(results[0].name).toBe('work');
});

test('searchByTag returns empty for unknown tag', async () => {
  const results = await searchByTag('unknown');
  expect(results).toHaveLength(0);
});

test('searchAll deduplicates results', async () => {
  const results = await searchAll('github');
  expect(results).toHaveLength(1);
  expect(results[0].name).toBe('work');
});

test('searchAll returns from both title and url matches', async () => {
  const results = await searchAll('reddit');
  expect(results).toHaveLength(1);
  expect(results[0].name).toBe('personal');
});
