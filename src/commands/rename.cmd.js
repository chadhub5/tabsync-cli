const { renameSession } = require('../rename');
const path = require('path');

const DEFAULT_SESSIONS_DIR = path.join(
  process.env.HOME || process.env.USERPROFILE || '.',
  '.tabsync',
  'sessions'
);

async function handleRename(oldName, newName, options = {}) {
  const sessionsDir = options.dir || DEFAULT_SESSIONS_DIR;

  if (!oldName || !newName) {
    console.error('Usage: tabsync rename <old-name> <new-name>');
    process.exitCode = 1;
    return;
  }

  try {
    const result = await renameSession(sessionsDir, oldName, newName);
    console.log(`Session renamed: "${oldName}" → "${result.name}"`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exitCode = 1;
  }
}

function registerRenameCommands(program, options = {}) {
  program
    .command('rename <old-name> <new-name>')
    .description('Rename a saved session')
    .action((oldName, newName) => handleRename(oldName, newName, options));
}

module.exports = { handleRename, registerRenameCommands };
