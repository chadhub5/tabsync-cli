const fs = require('fs');
const path = require('path');
const os = require('os');

jest.mock('fs');

let mod;
function getModule() {
  jest.resetModules();
  mod = require('./history');
  return mod;
}

beforeEach(() => {
  jest.clearAllMocks();
  fs.existsSync.mockReturnValue(false);
  fs.mkdirSync.mockImplementation(() => {});
  fs.writeFileSync.mockImplementation(() => {});
});

test('loadHistory returns empty array when file does not exist', () => {
  const { loadHistory } = getModule();
  fs.existsSync.mockReturnValue(false);
  expect(loadHistory()).toEqual([]);
});

test('loadHistory returns parsed entries when file exists', () => {
  const { loadHistory } = getModule();
  const entries = [{ id: 'abc', action: 'save', sessionName: 'work' }];
  fs.existsSync.mockReturnValue(true);
  fs.readFileSync.mockReturnValue(JSON.stringify(entries));
  expect(loadHistory()).toEqual(entries);
});

test('loadHistory returns empty array on parse error', () => {
  const { loadHistory } = getModule();
  fs.existsSync.mockReturnValue(true);
  fs.readFileSync.mockReturnValue('not json');
  expect(loadHistory()).toEqual([]);
});

test('recordAction prepends entry and writes file', () => {
  const { recordAction } = getModule();
  fs.existsSync.mockReturnValue(true);
  fs.readFileSync.mockReturnValue('[]');
  const entry = recordAction('save', 'mySession', { tags: ['work'] });
  expect(entry.action).toBe('save');
  expect(entry.sessionName).toBe('mySession');
  expect(entry.tags).toEqual(['work']);
  expect(entry.timestamp).toBeDefined();
  expect(fs.writeFileSync).toHaveBeenCalled();
});

test('getHistory respects limit', () => {
  const { getHistory } = getModule();
  const entries = Array.from({ length: 30 }, (_, i) => ({ id: String(i), action: 'save', sessionName: `s${i}` }));
  fs.existsSync.mockReturnValue(true);
  fs.readFileSync.mockReturnValue(JSON.stringify(entries));
  expect(getHistory(10)).toHaveLength(10);
});

test('clearHistory writes empty array', () => {
  const { clearHistory } = getModule();
  clearHistory();
  expect(fs.writeFileSync).toHaveBeenCalledWith(
    expect.stringContaining('history.json'),
    JSON.stringify([], null, 2)
  );
});

test('filterHistory returns matching entries', () => {
  const { filterHistory } = getModule();
  const entries = [
    { id: '1', action: 'save', sessionName: 'work' },
    { id: '2', action: 'load', sessionName: 'home' },
  ];
  fs.existsSync.mockReturnValue(true);
  fs.readFileSync.mockReturnValue(JSON.stringify(entries));
  const result = filterHistory(e => e.action === 'save');
  expect(result).toHaveLength(1);
  expect(result[0].sessionName).toBe('work');
});
