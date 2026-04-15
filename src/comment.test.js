const fs = require('fs');
const path = require('path');

function getModule() {
  jest.resetModules();
  const mockDir = path.join(__dirname, '__test_comments__');
  process.env.HOME = mockDir;
  return require('./comment');
}

afterEach(() => {
  const mockDir = path.join(__dirname, '__test_comments__', '.tabsync', 'comments');
  if (fs.existsSync(mockDir)) fs.rmSync(mockDir, { recursive: true });
});

test('addComment adds a comment to a session', () => {
  const { addComment, listComments } = getModule();
  addComment('work', 'First comment');
  const comments = listComments('work');
  expect(comments).toHaveLength(1);
  expect(comments[0].text).toBe('First comment');
  expect(comments[0].id).toBeDefined();
});

test('listComments returns empty array for unknown session', () => {
  const { listComments } = getModule();
  expect(listComments('nonexistent')).toEqual([]);
});

test('removeComment removes by id', () => {
  const { addComment, removeComment, listComments } = getModule();
  const entry = addComment('work', 'to remove');
  const result = removeComment('work', entry.id);
  expect(result).toBe(true);
  expect(listComments('work')).toHaveLength(0);
});

test('removeComment returns false for unknown id', () => {
  const { removeComment } = getModule();
  expect(removeComment('work', 999999)).toBe(false);
});

test('clearComments removes all comments', () => {
  const { addComment, clearComments, listComments } = getModule();
  addComment('work', 'a');
  addComment('work', 'b');
  clearComments('work');
  expect(listComments('work')).toHaveLength(0);
});

test('multiple sessions are independent', () => {
  const { addComment, listComments } = getModule();
  addComment('work', 'work comment');
  addComment('personal', 'personal comment');
  expect(listComments('work')).toHaveLength(1);
  expect(listComments('personal')).toHaveLength(1);
});
