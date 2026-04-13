const { setPriority, removePriority, getPriority, listByPriority, getPriorityLabel } = require('./priority');

function handlePrioritySet(sessionName, level, opts) {
  const validLevels = [1, 2, 3, 4, 5];
  const parsed = parseInt(level, 10);
  if (!validLevels.includes(parsed)) {
    console.error(`Invalid priority level: ${level}. Must be 1-5.`);
    process.exit(1);
  }
  setPriority(sessionName, parsed, opts.dir);
  console.log(`Priority for "${sessionName}" set to ${parsed} (${getPriorityLabel(parsed)}).`);
}

function handlePriorityGet(sessionName, opts) {
  const entry = getPriority(sessionName, opts.dir);
  if (!entry) {
    console.log(`No priority set for "${sessionName}".`);
    return;
  }
  console.log(`${sessionName}: ${entry.level} (${getPriorityLabel(entry.level)})`);
}

function handlePriorityRemove(sessionName, opts) {
  removePriority(sessionName, opts.dir);
  console.log(`Priority removed for "${sessionName}".`);
}

function handlePriorityList(opts) {
  const entries = listByPriority(opts.dir);
  if (!entries.length) {
    console.log('No priorities set.');
    return;
  }
  entries.forEach(e => {
    console.log(`${e.session}: ${e.level} (${getPriorityLabel(e.level)})`);
  });
}

function registerPriorityCommands(program, opts = {}) {
  const priority = program.command('priority').description('Manage session priorities');

  priority
    .command('set <session> <level>')
    .description('Set priority level (1-5) for a session')
    .action((session, level) => handlePrioritySet(session, level, opts));

  priority
    .command('get <session>')
    .description('Get priority for a session')
    .action(session => handlePriorityGet(session, opts));

  priority
    .command('remove <session>')
    .description('Remove priority from a session')
    .action(session => handlePriorityRemove(session, opts));

  priority
    .command('list')
    .description('List all sessions sorted by priority')
    .action(() => handlePriorityList(opts));
}

module.exports = { handlePrioritySet, handlePriorityGet, handlePriorityRemove, handlePriorityList, registerPriorityCommands };
