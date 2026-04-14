const { duplicateSession, cloneSession } = require('../duplicate');

/**
 * Handles the duplicate/clone logic for sessions.
 * If destName is provided, duplicates with that name; otherwise clones with an auto-generated name.
 *
 * @param {string} sourceName - Name of the session to duplicate.
 * @param {string} [destName] - Optional name for the new session.
 * @param {object} [options] - Additional options (e.g. titleSuffix).
 * @returns {Promise<object>} The newly created session.
 */
async function handleDuplicate(sourceName, destName, options = {}) {
  if (!sourceName) {
    console.error('Error: source session name is required.');
    process.exit(1);
  }

  try {
    let result;
    if (destName) {
      result = await duplicateSession(sourceName, destName, options);
      console.log(`Session "${sourceName}" duplicated as "${result.name}" (${result.tabs.length} tabs).`);
    } else {
      result = await cloneSession(sourceName, options);
      console.log(`Session "${sourceName}" cloned as "${result.name}" (${result.tabs.length} tabs).`);
    }
    return result;
  } catch (err) {
    if (err.code === 'SESSION_NOT_FOUND') {
      console.error(`Error: Session "${sourceName}" does not exist.`);
    } else if (err.code === 'SESSION_ALREADY_EXISTS') {
      console.error(`Error: A session named "${destName}" already exists.`);
    } else {
      console.error(`Error: ${err.message}`);
    }
    process.exit(1);
  }
}

function registerDuplicateCommands(program) {
  program
    .command('duplicate <source> [dest]')
    .description('Duplicate a session, optionally with a new name')
    .option('--suffix <text>', 'Append suffix to all tab titles')
    .action(async (source, dest, opts) => {
      const options = {};
      if (opts.suffix) options.titleSuffix = opts.suffix;
      if (dest) options.destName = dest;
      await handleDuplicate(source, dest, options);
    });
}

module.exports = { handleDuplicate, registerDuplicateCommands };
