const { setLifecycleEvent, getLifecycleHistory, deleteLifecycle, listLifecycles } = require('../lifecycle');

function handleLifecycleTrack(sessionName, event, options) {
  try {
    const result = setLifecycleEvent(sessionName, event);
    console.log(`Recorded '${event}' for session '${sessionName}'`);
    if (options.verbose) {
      console.log(`Total events: ${result.events.length}`);
    }
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

function handleLifecycleHistory(sessionName) {
  const lifecycle = getLifecycleHistory(sessionName);
  if (!lifecycle) {
    console.log(`No lifecycle data found for session '${sessionName}'`);
    return;
  }
  console.log(`Lifecycle history for '${sessionName}':`);
  lifecycle.events.forEach(({ event, timestamp }) => {
    console.log(`  [${new Date(timestamp).toISOString()}] ${event}`);
  });
}

function handleLifecycleClear(sessionName) {
  const removed = deleteLifecycle(sessionName);
  if (removed) {
    console.log(`Lifecycle data cleared for '${sessionName}'`);
  } else {
    console.log(`No lifecycle data found for '${sessionName}'`);
  }
}

function handleLifecycleList() {
  const sessions = listLifecycles();
  if (sessions.length === 0) {
    console.log('No lifecycle records found.');
    return;
  }
  console.log('Sessions with lifecycle data:');
  sessions.forEach(s => console.log(`  - ${s}`));
}

function registerLifecycleCommands(program) {
  const lc = program.command('lifecycle').description('Track session lifecycle events');

  lc.command('track <session> <event>')
    .description('Record a lifecycle event for a session')
    .option('-v, --verbose', 'Show extra details')
    .action((session, event, opts) => handleLifecycleTrack(session, event, opts));

  lc.command('history <session>')
    .description('Show lifecycle event history for a session')
    .action(handleLifecycleHistory);

  lc.command('clear <session>')
    .description('Delete lifecycle data for a session')
    .action(handleLifecycleClear);

  lc.command('list')
    .description('List all sessions with lifecycle records')
    .action(handleLifecycleList);
}

module.exports = { handleLifecycleTrack, handleLifecycleHistory, handleLifecycleClear, handleLifecycleList, registerLifecycleCommands };
