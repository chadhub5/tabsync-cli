const fs = require('fs');
const path = require('path');

function getModule() {
  jest.resetModules();
  return require('./archive');
}

describe('archive', () => {
  let vol;

  beforeEach(() => {
    jest.mock('fs');
    vol = {};
    fs.existsSync = jest.fn(p => p in vol);
    fs.mkdirSync = jest.fn(p => { vol[p] = {}; });
    fs.writeFileSync = jest.fn((p, data) => { vol[p] = data; });
    fs.readFileSync = jest.fn(p => vol[p]);
    fs.unlinkSync = jest.fn(p => { delete vol[p]; });
    fs.readdirSync = jest.fn(() => Object.keys(vol).map(k => path.basename(k)).filter(f => f.endsWith('.archived.json')));
  });

  afterEach(() => jest.resetAllMocks());

  test('archiveSession writes record with metadata', () => {
    const mod = getModule();
    const data = { tabs: ['https://example.com'] };
    const record = mod.archiveSession('work', data);
    expect(record.name).toBe('work');
    expect(record.archivedAt).toBeDefined();
    expect(record.data).toEqual(data);
    expect(fs.writeFileSync).toHaveBeenCalled();
  });

  test('unarchiveSession returns session data and removes file', () => {
    const mod = getModule();
    const record = { name: 'work', archivedAt: '2024-01-01T00:00:00.000Z', data: { tabs: [] } };
    const filePath = mod.getArchivePath('work');
    vol[filePath] = JSON.stringify(record);
    const data = mod.unarchiveSession('work');
    expect(data).toEqual(record.data);
    expect(fs.unlinkSync).toHaveBeenCalledWith(filePath);
  });

  test('unarchiveSession throws if not found', () => {
    const mod = getModule();
    expect(() => mod.unarchiveSession('missing')).toThrow('No archived session found: missing');
  });

  test('listArchived returns metadata list', () => {
    const mod = getModule();
    const record = { name: 'work', archivedAt: '2024-01-01T00:00:00.000Z', data: {} };
    const filePath = mod.getArchivePath('work');
    vol[filePath] = JSON.stringify(record);
    const list = mod.listArchived();
    expect(list).toHaveLength(1);
    expect(list[0].name).toBe('work');
  });

  test('deleteArchived removes file', () => {
    const mod = getModule();
    const filePath = mod.getArchivePath('old');
    vol[filePath] = '{}';
    mod.deleteArchived('old');
    expect(fs.unlinkSync).toHaveBeenCalledWith(filePath);
  });

  test('deleteArchived throws if not found', () => {
    const mod = getModule();
    expect(() => mod.deleteArchived('ghost')).toThrow('No archived session found: ghost');
  });
});
