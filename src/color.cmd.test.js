jest.mock('./color');

const colorModule = require('./color');
const { handleColorSet, handleColorRemove, handleColorList, handleColorGet } = require('./color.cmd');

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  console.log.mockRestore();
  console.error.mockRestore();
});

describe('handleColorSet', () => {
  it('sets a color and logs success', async () => {
    colorModule.setColor = jest.fn().mockResolvedValue();
    await handleColorSet('work', 'blue', {});
    expect(colorModule.setColor).toHaveBeenCalledWith('work', 'blue');
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('blue'));
  });

  it('logs error on failure', async () => {
    colorModule.setColor = jest.fn().mockRejectedValue(new Error('write error'));
    const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});
    await handleColorSet('work', 'red', {});
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('write error'));
    mockExit.mockRestore();
  });
});

describe('handleColorRemove', () => {
  it('removes a color and logs success', async () => {
    colorModule.removeColor = jest.fn().mockResolvedValue();
    await handleColorRemove('work', {});
    expect(colorModule.removeColor).toHaveBeenCalledWith('work');
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('removed'));
  });
});

describe('handleColorList', () => {
  it('lists colors when present', async () => {
    colorModule.loadColors = jest.fn().mockResolvedValue({ work: 'blue', personal: 'green' });
    await handleColorList({});
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('work'));
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('personal'));
  });

  it('shows message when no colors assigned', async () => {
    colorModule.loadColors = jest.fn().mockResolvedValue({});
    await handleColorList({});
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('No colors'));
  });
});

describe('handleColorGet', () => {
  it('prints color for a session', async () => {
    colorModule.loadColors = jest.fn().mockResolvedValue({ work: 'blue' });
    await handleColorGet('work', {});
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('blue'));
  });

  it('prints message when no color assigned', async () => {
    colorModule.loadColors = jest.fn().mockResolvedValue({});
    await handleColorGet('work', {});
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('No color'));
  });
});
