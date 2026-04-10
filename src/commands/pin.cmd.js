const { pinSession, unpinSession, listPinned } = require('../pin');

function handlePinAdd(args) {
  const name = args._[0];
  if (!name) {
    console.error('Usage: tabsync pin add <session-name>');
    process.exit(1);
  }
  const result = pinSession(name);
  if (result.alreadyPinned) {
    console.log(`Session "${name}" is already pinned.`);
  } else {
    console.log(`Pinned session "${name}".`);
  }
}

function handlePinRemove(args) {
  const name = args._[0];
  if (!name) {
    console.error('Usage: tabsync pin remove <session-name>');
    process.exit(1);
  }
  const result = unpinSession(name);
  if (result.notFound) {
    console.log(`Session "${name}" is not pinned.`);
  } else {
    console.log(`Unpinned session "${name}".`);
  }
}

function handlePinList() {
  const pins = listPinned();
  if (pins.length === 0) {
    console.log('No pinned sessions.');
  } else {
    console.log('Pinned sessions:');
    pins.forEach((name) => console.log(`  - ${name}`));
  }
}

function registerPinCommands(cli) {
  cli.command('pin add <name>', 'Pin a session', {}, (argv) => handlePinAdd(argv));
  cli.command('pin remove <name>', 'Unpin a session', {}, (argv) => handlePinRemove(argv));
  cli.command('pin list', 'List pinned sessions', {}, () => handlePinList());
}

module.exports = { handlePinAdd, handlePinRemove, handlePinList, registerPinCommands };
