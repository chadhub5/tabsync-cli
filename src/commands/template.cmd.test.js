jest.mock('../template');
jest.mock('../session');

const { saveTemplate, loadTemplate, listTemplates, deleteTemplate, applyTemplate } = require('../template');
const { loadSession } = require('../session');
const { handleTemplateCreate, handleTemplateList, handleTemplateApply, handleTemplateDelete, handleTemplateShow } = require('./template.cmd');

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(process, 'exit').mockImplementation(() => { throw new Error('exit'); });
});

afterEach(() => {
  console.log.mockRestore();
  console.error.mockRestore();
  process.exit.mockRestore();
});

test('handleTemplateCreate saves template from session', async () => {
  loadSession.mockReturnValue({ tabs: [{ url: 'https://a.com' }] });
  saveTemplate.mockReturnValue({ name: 'work', tabs: [{ url: 'https://a.com' }] });
  await handleTemplateCreate('mysession', 'work', { description: 'Work' });
  expect(saveTemplate).toHaveBeenCalledWith('work', [{ url: 'https://a.com' }], 'Work');
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('work'));
});

test('handleTemplateCreate exits if session not found', async () => {
  loadSession.mockReturnValue(null);
  await expect(handleTemplateCreate('nope', 'tpl')).rejects.toThrow('exit');
  expect(process.exit).toHaveBeenCalledWith(1);
});

test('handleTemplateList prints templates', async () => {
  listTemplates.mockReturnValue([{ name: 'work', tabCount: 3, description: 'Work tabs', createdAt: '' }]);
  await handleTemplateList();
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('work'));
});

test('handleTemplateList prints empty message', async () => {
  listTemplates.mockReturnValue([]);
  await handleTemplateList();
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('No templates'));
});

test('handleTemplateApply creates session from template', async () => {
  applyTemplate.mockReturnValue({ tabs: [{ url: 'https://x.com' }] });
  await handleTemplateApply('work', 'newsession');
  expect(applyTemplate).toHaveBeenCalledWith('work', 'newsession');
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('newsession'));
});

test('handleTemplateDelete removes template', async () => {
  deleteTemplate.mockImplementation(() => {});
  await handleTemplateDelete('work');
  expect(deleteTemplate).toHaveBeenCalledWith('work');
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('deleted'));
});

test('handleTemplateShow displays template info', async () => {
  loadTemplate.mockReturnValue({ name: 'dev', description: 'Dev tabs', createdAt: '2024-01-01', tabs: [{ url: 'https://github.com', title: 'GitHub' }] });
  await handleTemplateShow('dev');
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('dev'));
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('GitHub'));
});
