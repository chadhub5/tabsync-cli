const fs = require('fs');
const path = require('path');

const getModule = () => {
  jest.resetModules();
  const tmpDir = fs.mkdtempSync('/tmp/tabsync-color-');
  process.env.HOME = tmpDir;
  return require('./color');
};

describe('color', () => {
  test('setColor assigns a valid color to a session', () => {
    const { setColor, getColor } = getModule();
    setColor('work', 'blue');
    expect(getColor('work')).toBe('blue');
  });

  test('setColor throws on invalid color', () => {
    const { setColor } = getModule();
    expect(() => setColor('work', 'neon')).toThrow('Invalid color');
  });

  test('getColor returns null for unknown session', () => {
    const { getColor } = getModule();
    expect(getColor('nonexistent')).toBeNull();
  });

  test('removeColor removes an existing color', () => {
    const { setColor, removeColor, getColor } = getModule();
    setColor('dev', 'red');
    const result = removeColor('dev');
    expect(result).toBe(true);
    expect(getColor('dev')).toBeNull();
  });

  test('removeColor returns false for unknown session', () => {
    const { removeColor } = getModule();
    expect(removeColor('ghost')).toBe(false);
  });

  test('listColors returns all assigned colors', () => {
    const { setColor, listColors } = getModule();
    setColor('alpha', 'green');
    setColor('beta', 'yellow');
    const all = listColors();
    expect(all['alpha']).toBe('green');
    expect(all['beta']).toBe('yellow');
  });

  test('getValidColors returns expected list', () => {
    const { getValidColors } = getModule();
    const colors = getValidColors();
    expect(colors).toContain('red');
    expect(colors).toContain('blue');
    expect(colors.length).toBeGreaterThan(0);
  });
});
