const { handleShareCreate, handleShareImport, handleShareList, handleShareRevoke } = require('./share.cmd');

const mockShareSession = jest.fn();
const mockResolveShare = jest.fn();
const mockListShares = jest.fn();
const mockRevokeShare = jest.fn();
const mockSaveSession = jest.fn();

jest.mock('../share', () => ({
  shareSession: (...a) => mockShareSession(...a),
  resolveShare: (...a) => mockResolveShare(...a),
  listShares: (...a) => mockListShares(...a),
  revokeShare: (...a) => mockRevokeShare(...a),
}));

jest.mock('../session', () => ({
  saveSession: (...a) => mockSaveSession(...a),
}));

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(process, 'exit').mockImplementation(() => { throw new Error('exit'); });
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('handleShareCreate logs the share code on success', () => {
  mockShareSession.mockReturnValue('ABCD1234');
  handleShareCreate('work', {});
  expect(mockShareSession).toHaveBeenCalledWith('work');
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('ABCD1234'));
});

test('handleShareCreate exits on error', () => {
  mockShareSession.mockImplementation(() => { throw new Error('not found'); });
  expect(() => handleShareCreate('ghost', {})).toThrow('exit');
  expect(console.error).toHaveBeenCalledWith(expect.stringContaining('not found'));
});

test('handleShareImport saves the session with original name', () => {
  const fakeSession = { tabs: [{ url: 'https://a.com', title: 'A' }] };
  mockResolveShare.mockReturnValue({ code: 'ABCD1234', sessionName: 'work', session: fakeSession });
  handleShareImport('ABCD1234', {});
  expect(mockSaveSession).toHaveBeenCalledWith('work', fakeSession);
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('work'));
});

test('handleShareImport uses --name option if provided', () => {
  const fakeSession = { tabs: [] };
  mockResolveShare.mockReturnValue({ code: 'ABCD1234', sessionName: 'work', session: fakeSession });
  handleShareImport('ABCD1234', { name: 'mywork' });
  expect(mockSaveSession).toHaveBeenCalledWith('mywork', fakeSession);
});

test('handleShareImport exits if code not found', () => {
  mockResolveShare.mockReturnValue(null);
  expect(() => handleShareImport('ZZZZZZZZ', {})).toThrow('exit');
});

test('handleShareList prints shares', () => {
  mockListShares.mockReturnValue([{ code: 'AA', sessionName: 'home', sharedAt: new Date().toISOString() }]);
  handleShareList();
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('AA'));
});

test('handleShareList prints empty message when no shares', () => {
  mockListShares.mockReturnValue([]);
  handleShareList();
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('No shared'));
});

test('handleShareRevoke logs success', () => {
  mockRevokeShare.mockReturnValue(true);
  handleShareRevoke('ABCD1234');
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('revoked'));
});

test('handleShareRevoke exits if code not found', () => {
  mockRevokeShare.mockReturnValue(false);
  expect(() => handleShareRevoke('NOTFOUND')).toThrow('exit');
});
