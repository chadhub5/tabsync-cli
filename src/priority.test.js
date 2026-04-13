const fs = require('fs');
const path = require('path');

function getModule() {
  jest.resetModules();
  const mockFile = {};
  jest.mock('fs', () => ({
    existsSync: jest.fn(() => true),
    mkdirSync: jest.fn(),
    readFileSync: jest.fn(() => JSON.stringify(mockFile)),
    writeFileSync: jest.fn((p, data) => {
      Object.assign(mockFile, JSON.parse(data));
    }),
  }));
  return { mod: require('./priority'), mockFile };
}

describe('priority', () => {
  test('setPriority sets a valid level', () => {
    const { mod } = getModule();
    const result = mod.setPriority('work', 'high');
    expect(result).toBe('high');
  });

  test('setPriority throws on invalid level', () => {
    const { mod } = getModule();
    expect(() => mod.setPriority('work', 'urgent')).toThrow('Invalid priority level');
  });

  test('getPriority returns null when not set', () => {
    const { mod } = getModule();
    jest.spyOn(mod, 'loadPriorities').mockReturnValue({});
    expect(mod.getPriority('unknown')).toBeNull();
  });

  test('getPriority returns level when set', () => {
    const { mod } = getModule();
    jest.spyOn(mod, 'loadPriorities').mockReturnValue({ research: 'critical' });
    expect(mod.getPriority('research')).toBe('critical');
  });

  test('removePriority returns false if session not found', () => {
    const { mod } = getModule();
    jest.spyOn(mod, 'loadPriorities').mockReturnValue({});
    expect(mod.removePriority('ghost')).toBe(false);
  });

  test('removePriority removes and returns true', () => {
    const { mod } = getModule();
    jest.spyOn(mod, 'loadPriorities').mockReturnValue({ dev: 'high' });
    jest.spyOn(mod, 'savePriorities').mockImplementation(() => {});
    expect(mod.removePriority('dev')).toBe(true);
  });

  test('listByPriority returns all when no filter', () => {
    const { mod } = getModule();
    jest.spyOn(mod, 'loadPriorities').mockReturnValue({ a: 'low', b: 'high' });
    const result = mod.listByPriority();
    expect(result).toHaveLength(2);
    expect(result[0]).toHaveProperty('name');
    expect(result[0]).toHaveProperty('priority');
  });

  test('listByPriority filters by level', () => {
    const { mod } = getModule();
    jest.spyOn(mod, 'loadPriorities').mockReturnValue({ a: 'low', b: 'high', c: 'low' });
    const result = mod.listByPriority('low');
    expect(result).toEqual(['a', 'c']);
  });

  test('getSessionsSortedByPriority sorts descending', () => {
    const { mod } = getModule();
    jest.spyOn(mod, 'loadPriorities').mockReturnValue({ a: 'low', b: 'critical', c: 'normal' });
    const result = mod.getSessionsSortedByPriority();
    expect(result[0].name).toBe('b');
    expect(result[result.length - 1].name).toBe('a');
  });
});
