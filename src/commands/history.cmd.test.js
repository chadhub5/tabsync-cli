jest.mock('../history');

const { getHistory, clearHistory, undoLast } = require('../history');
const { handleHistoryList, handleHistoryClear, handleHistoryUndo } = require('./history.cmd');

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => {
  console.log.mockRestore();
});

describe('handleHistoryList', () => {
  it('prints history entries in reverse order', async () => {
    getHistory.mockResolvedValue([
      { timestamp: '2024-01-01T10:00:00Z', action: 'save', detail: 'initial' },
      { timestamp: '2024-01-01T11:00:00Z', action: 'rename', detail: 'to work' },
    ]);
    await handleHistoryList('mysession', { limit: '10' });
    expect(getHistory).toHaveBeenCalledWith('mysession');
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('mysession'));
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('rename'));
  });

  it('prints message when no history found', async () => {
    getHistory.mockResolvedValue([]);
    await handleHistoryList('empty', {});
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('No history found'));
  });

  it('uses default limit of 20 when not specified', async () => {
    const entries = Array.from({ length: 25 }, (_, i) => ({
      timestamp: new Date().toISOString(),
      action: `action-${i}`,
    }));
    getHistory.mockResolvedValue(entries);
    await handleHistoryList('big', {});
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('last 20'));
  });
});

describe('handleHistoryClear', () => {
  it('clears history and confirms', async () => {
    clearHistory.mockResolvedValue();
    await handleHistoryClear('mysession');
    expect(clearHistory).toHaveBeenCalledWith('mysession');
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('cleared'));
  });
});

describe('handleHistoryUndo', () => {
  it('undoes last action and prints it', async () => {
    undoLast.mockResolvedValue({ action: 'rename', detail: 'to work' });
    await handleHistoryUndo('mysession');
    expect(undoLast).toHaveBeenCalledWith('mysession');
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('rename'));
  });

  it('prints message when nothing to undo', async () => {
    undoLast.mockResolvedValue(null);
    await handleHistoryUndo('mysession');
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Nothing to undo'));
  });
});
