const {
  setVisibility,
  removeVisibility,
  getVisibility,
  listByVisibility,
  getAllVisibility,
  VALID_LEVELS,
} = require('../visibility');

function handleVisibilitySet(sessionName, level) {
  try {
    const result = setVisibility(sessionName, level);
    console.log(`Set visibility of "${sessionName}" to "${result}"`);
  } catch (err) {
    console.error(err.message);
  }
}

function handleVisibilityRemove(sessionName) {
  const removed = removeVisibility(sessionName);
  if (removed) {
    console.log(`Removed visibility setting for "${sessionName}"`);
  } else {
    console.log(`No visibility setting found for "${sessionName}"`);
  }
}

function handleVisibilityGet(sessionName) {
  const level = getVisibility(sessionName);
  console.log(`${sessionName}: ${level}`);
}

function handleVisibilityList(level) {
  if (level) {
    if (!VALID_LEVELS.includes(level)) {
      console.error(`Invalid level. Choose from: ${VALID_LEVELS.join(', ')}`);
      return;
    }
    const sessions = listByVisibility(level);
    if (sessions.length === 0) {
      console.log(`No sessions with visibility "${level}"`);
    } else {
      sessions.forEach(s => console.log(`  ${s}`));
    }
  } else {
    const all = getAllVisibility();
    const entries = Object.entries(all);
    if (entries.length === 0) {
      console.log('No visibility settings configured');
    } else {
      entries.forEach(([name, lvl]) => console.log(`  ${name}: ${lvl}`));
    }
  }
}

function registerVisibilityCommands(program) {
  const vis = program.command('visibility').description('Manage session visibility levels');

  vis.command('set <session> <level>')
    .description(`Set visibility (${VALID_LEVELS.join('|')})`)
    .action(handleVisibilitySet);

  vis.command('remove <session>')
    .description('Remove visibility setting for a session')
    .action(handleVisibilityRemove);

  vis.command('get <session>')
    .description('Get visibility level of a session')
    .action(handleVisibilityGet);

  vis.command('list [level]')
    .description('List sessions by visibility level')
    .action(handleVisibilityList);
}

module.exports = {
  handleVisibilitySet,
  handleVisibilityRemove,
  handleVisibilityGet,
  handleVisibilityList,
  registerVisibilityCommands,
};
