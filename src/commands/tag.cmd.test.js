let mockAddTag, mockRemoveTag, mockGetSessionsByTag, mockGetTagsForSession, mockListAllTags;

jest.mock('../tag', () => ({
  addTag: (...args) => mockAddTag(...args),
  removeTag: (...args) => mockRemoveTag(...args),
  getSessionsByTag: (...args) => mockGetSessionsByTag(...args),
  getTagsForSession: (...args) => mockGetTagsForSession(...args),
  listAllTags: (...args) => mockListAllTags(...args)
}));

const { handleTagAdd, handleTagRemove, handleTagList, handleTagShow } = require('./tag.cmd');

beforeEach(() => jest.clearAllMocks());

test('handleTagAdd returns success with sessions', () => {
  mockAddTag = jest.fn().mockReturnValue(['work']);
  const result = handleTagAdd('work', 'dev', { quiet: true });
  expect(result.success).toBe(true);
  expect(result.sessions).toContain('work');
  expect(mockAddTag).toHaveBeenCalledWith('work', 'dev');
});

test('handleTagAdd returns error on failure', () => {
  mockAddTag = jest.fn().mockImplementation(() => { throw new Error('Session not found'); });
  const result = handleTagAdd('ghost', 'dev', { quiet: true });
  expect(result.success).toBe(false);
  expect(result.error).toMatch('Session not found');
});

test('handleTagRemove returns success', () => {
  mockRemoveTag = jest.fn().mockReturnValue([]);
  const result = handleTagRemove('work', 'dev', { quiet: true });
  expect(result.success).toBe(true);
});

test('handleTagList with tag returns sessions', () => {
  mockGetSessionsByTag = jest.fn().mockReturnValue(['work', 'home']);
  const result = handleTagList('dev', { quiet: true });
  expect(result.success).toBe(true);
  expect(result.sessions).toHaveLength(2);
});

test('handleTagList without tag returns all tags', () => {
  mockListAllTags = jest.fn().mockReturnValue(['dev', 'personal']);
  const result = handleTagList(null, { quiet: true });
  expect(result.success).toBe(true);
  expect(result.tags).toContain('dev');
});

test('handleTagShow returns tags for session', () => {
  mockGetTagsForSession = jest.fn().mockReturnValue(['dev', 'work']);
  const result = handleTagShow('work', { quiet: true });
  expect(result.success).toBe(true);
  expect(result.tags).toContain('dev');
});

test('handleTagShow handles empty tags gracefully', () => {
  mockGetTagsForSession = jest.fn().mockReturnValue([]);
  const result = handleTagShow('empty', { quiet: true });
  expect(result.success).toBe(true);
  expect(result.tags).toHaveLength(0);
});
