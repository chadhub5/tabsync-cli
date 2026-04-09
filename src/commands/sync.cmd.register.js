const { program } = require('commander');
const { handleSyncAdd, handleSyncRemove, handleSyncList, handleSyncStatus } = require('./sync.cmd');

function registerSyncCommands(cli) {
  const sync = (cli || program)
    .command('sync')
    .description('Manage session sync registration');

  sync
    .command('add <session>')
    .description('Register a session for syncing')
    .option('-d, --dir <directory>', 'Custom sync directory')
    .action((session, options) => {
      handleSyncAdd(session, options);
    });

  sync
    .command('remove <session>')
    .alias('rm')
    .description('Remove a session from sync')
    .action((session) => {
      handleSyncRemove(session);
    });

  sync
    .command('list')
    .alias('ls')
    .description('List all synced sessions')
    .action(() => {
      handleSyncList();
    });

  sync
    .command('status')
    .description('Show sync status summary')
    .action(() => {
      handleSyncStatus();
    });

  return sync;
}

module.exports = { registerSyncCommands };
