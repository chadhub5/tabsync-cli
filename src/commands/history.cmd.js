const { recordAction, getHistory, clearHistory, undoLast } = require('../history');

async function handleHistoryList(sessionName, opts) {
  const limit = opts.limit ? parseInt(opts.limit, 10) : 20;
  const entries = await getHistory(sessionName);
  const recent = entries.slice(-limit).reverse();

  if (recent.length === 0) {
    console.log(`No history found for session: ${sessionName}`);
    return;
  }

  console.log(`History for "${sessionName}" (last ${recent.length} actions):`);
  recent.forEach((entry, i) => {
    const ts = new Date(entry.timestamp).toLocaleString();
    console.log(`  ${i + 1}. [${ts}] ${entry.action}${entry.detail ? ' — ' + entry.detail : ''}`);
  });
}

async function handleHistoryClear(sessionName) {
  await clearHistory(sessionName);
  console.log(`History cleared for session: ${sessionName}`);
}

async function handleHistoryUndo(sessionName) {
  const result = await undoLast(sessionName);
  if (!result) {
    console.log(`Nothing to undo for session: ${sessionName}`);
    return;
  }
  console.log(`Undid action: ${result.action}`);
}

function registerHistoryCommands(program) {
  const history = program.command('history').description('View and manage session action history');

  history
    .command('list <session>')
    .description('List recent actions for a session')
    .option('-l, --limit <n>', 'Number of entries to show', '20')
    .action((session, opts) => handleHistoryList(session, opts));

  history
    .command('clear <session>')
    .description('Clear history for a session')
    .action((session) => handleHistoryClear(session));

  history
    .command('undo <session>')
    .description('Undo the last recorded action for a session')
    .action((session) => handleHistoryUndo(session));
}

module.exports = { handleHistoryList, handleHistoryClear, handleHistoryUndo, registerHistoryCommands };
