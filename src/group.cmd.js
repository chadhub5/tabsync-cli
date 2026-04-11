const { loadGroup, saveGroup, addSessionToGroup, removeSessionFromGroup, listGroups, deleteGroup } = require('./group');

async function handleGroupCreate(name, options) {
  try {
    const group = await saveGroup(name, { name, sessions: [], createdAt: new Date().toISOString() });
    console.log(`Group '${name}' created.`);
  } catch (err) {
    console.error('Failed to create group:', err.message);
  }
}

async function handleGroupAdd(groupName, sessionName, options) {
  try {
    await addSessionToGroup(groupName, sessionName);
    console.log(`Session '${sessionName}' added to group '${groupName}'.`);
  } catch (err) {
    console.error('Failed to add session to group:', err.message);
  }
}

async function handleGroupRemove(groupName, sessionName, options) {
  try {
    await removeSessionFromGroup(groupName, sessionName);
    console.log(`Session '${sessionName}' removed from group '${groupName}'.`);
  } catch (err) {
    console.error('Failed to remove session from group:', err.message);
  }
}

async function handleGroupList(options) {
  try {
    const groups = await listGroups();
    if (!groups.length) {
      console.log('No groups found.');
      return;
    }
    groups.forEach(g => console.log(`  - ${g}`));
  } catch (err) {
    console.error('Failed to list groups:', err.message);
  }
}

async function handleGroupShow(groupName, options) {
  try {
    const group = await loadGroup(groupName);
    console.log(`Group: ${group.name}`);
    console.log(`Created: ${group.createdAt}`);
    console.log('Sessions:');
    if (!group.sessions.length) {
      console.log('  (none)');
    } else {
      group.sessions.forEach(s => console.log(`  - ${s}`));
    }
  } catch (err) {
    console.error('Failed to show group:', err.message);
  }
}

async function handleGroupDelete(groupName, options) {
  try {
    await deleteGroup(groupName);
    console.log(`Group '${groupName}' deleted.`);
  } catch (err) {
    console.error('Failed to delete group:', err.message);
  }
}

module.exports = {
  handleGroupCreate,
  handleGroupAdd,
  handleGroupRemove,
  handleGroupList,
  handleGroupShow,
  handleGroupDelete
};
