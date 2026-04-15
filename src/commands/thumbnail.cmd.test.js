jest.mock('../session');
jest.mock('../thumbnail');

const { loadSession } = require('../session');
const { saveThumbnail, loadThumbnail, deleteThumbnail, listThumbnails, generateThumbnail } = require('../thumbnail');
const {
  handleThumbnailGenerate,
  handleThumbnailShow,
  handleThumbnailDelete,
  handleThumbnailList
} = require('./thumbnail.cmd');

describe('thumbnail commands', () => {
  let consoleSpy, errorSpy;
  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(process, 'exit').mockImplementation(() => { throw new Error('exit'); });
  });
  afterEach(() => jest.clearAllMocks());

  test('handleThumbnailGenerate exits if session not found', () => {
    loadSession.mockReturnValue(null);
    expect(() => handleThumbnailGenerate('ghost')).toThrow('exit');
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('not found'));
  });

  test('handleThumbnailGenerate saves and logs thumbnail', () => {
    loadSession.mockReturnValue({ tabs: [{ url: 'https://github.com', title: 'GH' }] });
    generateThumbnail.mockReturnValue({ preview: 'GH', tabCount: 1, topDomains: ['github.com'] });
    saveThumbnail.mockReturnValue({ sessionName: 'work', tabCount: 1, topDomains: ['github.com'] });
    handleThumbnailGenerate('work');
    expect(saveThumbnail).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('generated'));
  });

  test('handleThumbnailShow exits if thumbnail not found', () => {
    loadThumbnail.mockReturnValue(null);
    expect(() => handleThumbnailShow('work')).toThrow('exit');
  });

  test('handleThumbnailShow prints thumbnail info', () => {
    loadThumbnail.mockReturnValue({ sessionName: 'work', tabCount: 4, preview: 'A | B', topDomains: ['a.com'], updatedAt: '2024-01-01' });
    handleThumbnailShow('work');
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('work'));
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('4'));
  });

  test('handleThumbnailDelete removes thumbnail', () => {
    deleteThumbnail.mockReturnValue(true);
    handleThumbnailDelete('work');
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('deleted'));
  });

  test('handleThumbnailDelete exits when not found', () => {
    deleteThumbnail.mockReturnValue(false);
    expect(() => handleThumbnailDelete('ghost')).toThrow('exit');
  });

  test('handleThumbnailList prints empty message', () => {
    listThumbnails.mockReturnValue([]);
    handleThumbnailList();
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('No thumbnails'));
  });

  test('handleThumbnailList prints thumbnails', () => {
    listThumbnails.mockReturnValue([{ sessionName: 'work', tabCount: 3, topDomains: ['github.com'] }]);
    handleThumbnailList();
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('work'));
  });
});
