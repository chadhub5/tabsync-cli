jest.mock('../expiry');
const expiry = require('../expiry');
const { handleExpirySet, handleExpiryRemove, handleExpiryGet, handleExpiryList, handleExpiryExpired } = require('./expiry.cmd');

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

test('handleExpirySet logs success', () => {
  expiry.setExpiry.mockReturnValue({ expiresAt: '2099-01-01T00:00:00.000Z' });
  handleExpirySet('work', '2099-01-01');
  expect(expiry.setExpiry).toHaveBeenCalledWith('work', '2099-01-01');
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Expiry set'));
});

test('handleExpirySet exits on invalid date', () => {
  expect(() => handleExpirySet('work', 'not-a-date')).toThrow('exit');
  expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Invalid date'));
});

test('handleExpirySet exits when args missing', () => {
  expect(() => handleExpirySet()).toThrow('exit');
});

test('handleExpiryRemove logs removed', () => {
  expiry.removeExpiry.mockReturnValue(true);
  handleExpiryRemove('work');
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('removed'));
});

test('handleExpiryRemove logs not found', () => {
  expiry.removeExpiry.mockReturnValue(false);
  handleExpiryRemove('ghost');
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('No expiry found'));
});

test('handleExpiryGet logs entry when found', () => {
  expiry.getExpiry.mockReturnValue({ expiresAt: '2099-01-01T00:00:00.000Z' });
  handleExpiryGet('dev');
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('expires at'));
});

test('handleExpiryGet logs none when not found', () => {
  expiry.getExpiry.mockReturnValue(null);
  handleExpiryGet('unknown');
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('No expiry set'));
});

test('handleExpiryList logs entries', () => {
  expiry.listExpiry.mockReturnValue([{ name: 'dev', expiresAt: '2099-01-01T00:00:00.000Z' }]);
  handleExpiryList();
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('dev'));
});

test('handleExpiryList logs empty message', () => {
  expiry.listExpiry.mockReturnValue([]);
  handleExpiryList();
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('No expiry'));
});

test('handleExpiryExpired lists expired sessions', () => {
  expiry.listExpired.mockReturnValue([{ name: 'old', expiresAt: '2000-01-01T00:00:00.000Z' }]);
  handleExpiryExpired();
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('old'));
});

test('handleExpiryExpired logs none message', () => {
  expiry.listExpired.mockReturnValue([]);
  handleExpiryExpired();
  expect(console.log).toHaveBeenCalledWith('No expired sessions.');
});
