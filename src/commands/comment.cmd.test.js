const { handleCommentAdd, handleCommentRemove, handleCommentList, handleCommentClear } = require('./comment.cmd');

const fs = require('fs');
const path = require('path');

beforeEach(() => {
  jest.resetModules();
  const mockDir = path.join(__dirname, '__test_comment_cmd__', '.tabsync', 'comments');
  if (fs.existsSync(mockDir)) fs.rmSync(mockDir, { recursive: true });
});

test('handleCommentAdd logs success message', () => {
  const logs = [];
  handleCommentAdd('work', 'hello world', {}, m => logs.push(m));
  expect(logs[0]).toMatch(/Comment added to "work"/);
  expect(logs[0]).toMatch(/id:/);
});

test('handleCommentAdd logs usage when args missing', () => {
  const logs = [];
  handleCommentAdd('', '', {}, m => logs.push(m));
  expect(logs[0]).toMatch(/Usage/);
});

test('handleCommentList shows no comments message when empty', () => {
  const logs = [];
  handleCommentList('emptySession', {}, m => logs.push(m));
  expect(logs[0]).toMatch(/No comments/);
});

test('handleCommentList shows comments after add', () => {
  const logs = [];
  handleCommentAdd('proj', 'test note', {}, () => {});
  handleCommentList('proj', {}, m => logs.push(m));
  expect(logs[0]).toMatch(/test note/);
});

test('handleCommentRemove logs not found for bad id', () => {
  const logs = [];
  handleCommentRemove('work', '999999999', {}, m => logs.push(m));
  expect(logs[0]).toMatch(/No comment with id/);
});

test('handleCommentClear logs cleared message', () => {
  const logs = [];
  handleCommentAdd('work', 'to clear', {}, () => {});
  handleCommentClear('work', {}, m => logs.push(m));
  expect(logs[0]).toMatch(/cleared/);
});

test('handleCommentList logs usage when no session given', () => {
  const logs = [];
  handleCommentList('', {}, m => logs.push(m));
  expect(logs[0]).toMatch(/Usage/);
});
