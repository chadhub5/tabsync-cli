jest.mock('./cursor');
const cursor = require('./cursor');
const { handleCursorSet, handleCursorGet, handleCursorClear, handleCursorList } = require('./cursor.cmd');

beforeEach(() => jest.clearAllMocks());

describe('handleCursorSet', () => {
  it('calls setCursor and logs confirmation', async () => {
    cursor.setCursor.mockResolvedValue();
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    await handleCursorSet('sess1', 5, { label: 'tab2' });
    expect(cursor.setCursor).toHaveBeenCalledWith('sess1', 5, { label: 'tab2' });
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('sess1'));
    spy.mockRestore();
  });
});

describe('handleCursorGet', () => {
  it('prints cursor info when found', async () => {
    cursor.getCursor.mockResolvedValue({ position: 3, label: 'main', updatedAt: Date.now() });
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    await handleCursorGet('sess1');
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('3'));
    spy.mockRestore();
  });

  it('prints not found message when cursor missing', async () => {
    cursor.getCursor.mockResolvedValue(null);
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    await handleCursorGet('missing');
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('No cursor found'));
    spy.mockRestore();
  });
});

describe('handleCursorClear', () => {
  it('calls clearCursor and logs', async () => {
    cursor.clearCursor.mockResolvedValue();
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    await handleCursorClear('sess1');
    expect(cursor.clearCursor).toHaveBeenCalledWith('sess1');
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('cleared'));
    spy.mockRestore();
  });
});

describe('handleCursorList', () => {
  it('lists all cursors', async () => {
    cursor.listCursors.mockResolvedValue([
      { sessionId: 'a', position: 1, label: 'x' },
      { sessionId: 'b', position: 2 }
    ]);
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    await handleCursorList();
    expect(spy).toHaveBeenCalledTimes(2);
    spy.mockRestore();
  });

  it('prints empty message when no cursors', async () => {
    cursor.listCursors.mockResolvedValue([]);
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    await handleCursorList();
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('No cursors'));
    spy.mockRestore();
  });
});
