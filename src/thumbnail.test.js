const fs = require('fs');
const path = require('path');

jest.mock('fs');

function getModule() {
  jest.resetModules();
  return require('./thumbnail');
}

describe('thumbnail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fs.existsSync.mockReturnValue(true);
    fs.mkdirSync.mockImplementation(() => {});
  });

  test('saveThumbnail writes thumbnail json', () => {
    fs.writeFileSync.mockImplementation(() => {});
    const mod = getModule();
    const result = mod.saveThumbnail('work', { preview: 'GitHub | Docs', tabCount: 5, topDomains: ['github.com'] });
    expect(result.sessionName).toBe('work');
    expect(result.tabCount).toBe(5);
    expect(fs.writeFileSync).toHaveBeenCalled();
  });

  test('loadThumbnail returns null when missing', () => {
    fs.existsSync.mockReturnValue(false);
    const mod = getModule();
    expect(mod.loadThumbnail('missing')).toBeNull();
  });

  test('loadThumbnail returns parsed data', () => {
    const data = { sessionName: 'work', tabCount: 3, topDomains: [], preview: '', updatedAt: '' };
    fs.readFileSync.mockReturnValue(JSON.stringify(data));
    const mod = getModule();
    const result = mod.loadThumbnail('work');
    expect(result.sessionName).toBe('work');
  });

  test('deleteThumbnail removes file', () => {
    fs.unlinkSync.mockImplementation(() => {});
    const mod = getModule();
    const result = mod.deleteThumbnail('work');
    expect(result).toBe(true);
    expect(fs.unlinkSync).toHaveBeenCalled();
  });

  test('deleteThumbnail returns false when not found', () => {
    fs.existsSync.mockReturnValue(false);
    const mod = getModule();
    expect(mod.deleteThumbnail('ghost')).toBe(false);
  });

  test('generateThumbnail extracts top domains and preview', () => {
    const mod = getModule();
    const session = {
      tabs: [
        { url: 'https://github.com/foo', title: 'GitHub' },
        { url: 'https://docs.example.com/bar', title: 'Docs' }
      ]
    };
    const result = mod.generateThumbnail(session);
    expect(result.tabCount).toBe(2);
    expect(result.topDomains).toContain('github.com');
    expect(result.preview).toContain('GitHub');
  });

  test('listThumbnails returns all thumbnails', () => {
    const data = { sessionName: 'work', tabCount: 2, topDomains: [], preview: '', updatedAt: '' };
    fs.readdirSync.mockReturnValue(['work.json']);
    fs.readFileSync.mockReturnValue(JSON.stringify(data));
    const mod = getModule();
    const list = mod.listThumbnails();
    expect(list).toHaveLength(1);
    expect(list[0].sessionName).toBe('work');
  });
});
