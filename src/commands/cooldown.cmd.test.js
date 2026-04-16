jest.mock('../cooldown');
const cooldown = require('../cooldown');
const { handleCooldownSet, handleCooldownRemove, handleCooldownGet, handleCooldownList } = require('./cooldown.cmd');

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => console.log.mockRestore());

test('handleCooldownSet calls setCooldown and logs', () => {
  cooldown.setCooldown.mockReturnValue({ seconds: 30 });
  handleCooldownSet('work', '30');
  expect(cooldown.setCooldown).toHaveBeenCalledWith('work', 30);
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('work'));
});

test('handleCooldownRemove logs success when found', () => {
  cooldown.removeCooldown.mockReturnValue(true);
  handleCooldownRemove('work');
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('removed'));
});

test('handleCooldownRemove logs not found', () => {
  cooldown.removeCooldown.mockReturnValue(false);
  handleCooldownRemove('ghost');
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('No cooldown'));
});

test('handleCooldownGet logs when no entry', () => {
  cooldown.getCooldown.mockReturnValue(null);
  handleCooldownGet('work');
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('No cooldown'));
});

test('handleCooldownGet logs entry details', () => {
  cooldown.getCooldown.mockReturnValue({ seconds: 60, setAt: Date.now() - 10000 });
  cooldown.isCoolingDown.mockReturnValue(false);
  handleCooldownGet('work');
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('work'));
});

test('handleCooldownList logs empty message', () => {
  cooldown.listCooldowns.mockReturnValue([]);
  handleCooldownList();
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('No cooldowns'));
});

test('handleCooldownList logs entries', () => {
  cooldown.listCooldowns.mockReturnValue([{ name: 'work', seconds: 60, remaining: 45, active: true }]);
  handleCooldownList();
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('work'));
});
