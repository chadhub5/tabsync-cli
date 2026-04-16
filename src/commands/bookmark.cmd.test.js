jest.mock('../bookmark');
const bm = require('../bookmark');
const { handleBookmarkAdd, handleBookmarkRemove, handleBookmarkList, handleBookmarkClear, handleBookmarkFind } = require('./bookmark.cmd');

beforeEach(() => jest.clearAllMocks());

test('handleBookmarkAdd calls addBookmark and logs', () => {
  bm.addBookmark.mockReturnValue({ url: 'https://a.com', label: 'docs', createdAt: 'now' });
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  handleBookmarkAdd('work', 'https://a.com', { label: 'docs' });
  expect(bm.addBookmark).toHaveBeenCalledWith('work', 'https://a.com', 'docs');
  expect(spy).toHaveBeenCalled();
  spy.mockRestore();
});

test('handleBookmarkRemove logs success when removed', () => {
  bm.removeBookmark.mockReturnValue(true);
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  handleBookmarkRemove('work', 'https://a.com');
  expect(spy).toHaveBeenCalledWith(expect.stringContaining('Removed'));
  spy.mockRestore();
});

test('handleBookmarkRemove logs not found when missing', () => {
  bm.removeBookmark.mockReturnValue(false);
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  handleBookmarkRemove('work', 'https://x.com');
  expect(spy).toHaveBeenCalledWith(expect.stringContaining('not found'));
  spy.mockRestore();
});

test('handleBookmarkList logs each bookmark', () => {
  bm.getBookmarks.mockReturnValue([{ url: 'https://a.com', label: 'x' }]);
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  handleBookmarkList('work');
  expect(spy).toHaveBeenCalledWith(expect.stringContaining('https://a.com'));
  spy.mockRestore();
});

test('handleBookmarkList logs empty message', () => {
  bm.getBookmarks.mockReturnValue([]);
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  handleBookmarkList('work');
  expect(spy).toHaveBeenCalledWith(expect.stringContaining('No bookmarks'));
  spy.mockRestore();
});

test('handleBookmarkClear calls clearBookmarks', () => {
  bm.clearBookmarks.mockImplementation(() => {});
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  handleBookmarkClear('work');
  expect(bm.clearBookmarks).toHaveBeenCalledWith('work');
  spy.mockRestore();
});

test('handleBookmarkFind logs results', () => {
  bm.findBookmarksByLabel.mockReturnValue({ work: [{ url: 'https://a.com', label: 'docs' }] });
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  handleBookmarkFind('docs');
  expect(spy).toHaveBeenCalledWith(expect.stringContaining('work:'));
  spy.mockRestore();
});
