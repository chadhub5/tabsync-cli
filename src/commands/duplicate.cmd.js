const { duplicateSession, cloneSession } = require('../duplicate');

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
    console.error(`Error: ${err.message}`);
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
