const fs = require('fs');
const path = require('path');

function getModule(mockFs) {
  jest.resetModules();
  jest.mock('fs', () => mockFs);
  return require('./template');
}

describe('template', () => {
  let mockFiles;
  let mockFs;

  beforeEach(() => {
    mockFiles = {};
    mockFs = {
      existsSync: (p) => p in mockFiles,
      mkdirSync: jest.fn(),
      writeFileSync: (p, data) => { mockFiles[p] = data; },
      readFileSync: (p) => {
        if (!(p in mockFiles)) throw new Error('ENOENT');
        return mockFiles[p];
      },
      readdirSync: (dir) => Object.keys(mockFiles).filter(f => f.startsWith(dir) && f.endsWith('.json')).map(f => path.basename(f)),
      unlinkSync: (p) => { delete mockFiles[p]; },
    };
  });

  test('saveTemplate writes template file', () => {
    const { saveTemplate, TEMPLATE_DIR } = getModule(mockFs);
    const result = saveTemplate('work', [{ url: 'https://github.com' }], 'Work tabs');
    expect(result.name).toBe('work');
    expect(result.tabs).toHaveLength(1);
    const key = path.join(TEMPLATE_DIR, 'work.json');
    expect(mockFiles[key]).toBeDefined();
  });

  test('loadTemplate returns parsed template', () => {
    const { saveTemplate, loadTemplate } = getModule(mockFs);
    saveTemplate('dev', [{ url: 'https://localhost:3000' }]);
    const tpl = loadTemplate('dev');
    expect(tpl.name).toBe('dev');
    expect(tpl.tabs[0].url).toBe('https://localhost:3000');
  });

  test('loadTemplate throws if not found', () => {
    const { loadTemplate } = getModule(mockFs);
    expect(() => loadTemplate('missing')).toThrow('Template "missing" not found');
  });

  test('listTemplates returns template summaries', () => {
    const { saveTemplate, listTemplates } = getModule(mockFs);
    saveTemplate('a', [{ url: 'https://a.com' }], 'A tabs');
    saveTemplate('b', [{ url: 'https://b.com' }, { url: 'https://c.com' }]);
    const list = listTemplates();
    expect(list).toHaveLength(2);
    expect(list.find(t => t.name === 'a').tabCount).toBe(1);
  });

  test('deleteTemplate removes the file', () => {
    const { saveTemplate, deleteTemplate, TEMPLATE_DIR } = getModule(mockFs);
    saveTemplate('tmp', []);
    deleteTemplate('tmp');
    expect(mockFiles[path.join(TEMPLATE_DIR, 'tmp.json')]).toBeUndefined();
  });

  test('deleteTemplate throws if template missing', () => {
    const { deleteTemplate } = getModule(mockFs);
    expect(() => deleteTemplate('ghost')).toThrow('Template "ghost" not found');
  });
});
