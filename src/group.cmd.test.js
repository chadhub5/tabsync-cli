const {
  handleGroupCreate,
  handleGroupAdd,
  handleGroupRemove,
  handleGroupList,
  handleGroupShow,
  handleGroupDelete
} = require('./group.cmd');

jest.mock('./group');

const group = require('./group');

describe('group commands', () => {
  let consoleSpy;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => jest.clearAllMocks());

  test('handleGroupCreate logs success', async () => {
    group.saveGroup.mockResolvedValue({});
    await handleGroupCreate('work');
    expect(consoleSpy).toHaveBeenCalledWith("Group 'work' created.");
  });

  test('handleGroupCreate logs error on failure', async () => {
    group.saveGroup.mockRejectedValue(new Error('disk full'));
    await handleGroupCreate('work');
    expect(console.error).toHaveBeenCalled();
  });

  test('handleGroupAdd logs success', async () => {
    group.addSessionToGroup.mockResolvedValue();
    await handleGroupAdd('work', 'session1');
    expect(consoleSpy).toHaveBeenCalledWith("Session 'session1' added to group 'work'.");
  });

  test('handleGroupRemove logs success', async () => {
    group.removeSessionFromGroup.mockResolvedValue();
    await handleGroupRemove('work', 'session1');
    expect(consoleSpy).toHaveBeenCalledWith("Session 'session1' removed from group 'work'.");
  });

  test('handleGroupList prints groups', async () => {
    group.listGroups.mockResolvedValue(['work', 'personal']);
    await handleGroupList();
    expect(consoleSpy).toHaveBeenCalledWith('  - work');
    expect(consoleSpy).toHaveBeenCalledWith('  - personal');
  });

  test('handleGroupList prints empty message', async () => {
    group.listGroups.mockResolvedValue([]);
    await handleGroupList();
    expect(consoleSpy).toHaveBeenCalledWith('No groups found.');
  });

  test('handleGroupShow prints group details', async () => {
    group.loadGroup.mockResolvedValue({ name: 'work', createdAt: '2024-01-01', sessions: ['s1'] });
    await handleGroupShow('work');
    expect(consoleSpy).toHaveBeenCalledWith('Group: work');
    expect(consoleSpy).toHaveBeenCalledWith('  - s1');
  });

  test('handleGroupDelete logs success', async () => {
    group.deleteGroup.mockResolvedValue();
    await handleGroupDelete('work');
    expect(consoleSpy).toHaveBeenCalledWith("Group 'work' deleted.");
  });
});
