const { diffSessions, formatDiff } = require('../diff');

/**
 * Handle the `diff <sessionA> <sessionB>` command
 */
async function handleDiff(nameA, nameB, opts = {}) {
  if (!nameA || !nameB) {
    console.error('Usage: tabsync diff <sessionA> <sessionB> [--json]');
    process.exitCode = 1;
    return;
  }

  let diff;
  try {
    diff = diffSessions(nameA, nameB);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exitCode = 1;
    return;
  }

  if (opts.json) {
    console.log(JSON.stringify(diff, null, 2));
    return;
  }

  console.log(formatDiff(diff));
}

function registerDiffCommands(program) {
  program
    .command('diff <sessionA> <sessionB>')
    .description('Show the difference between two saved sessions')
    .option('--json', 'Output result as JSON')
    .action((nameA, nameB, opts) => handleDiff(nameA, nameB, opts));
}

module.exports = { handleDiff, registerDiffCommands };
