const { Command } = require('commander');
const { handleShareCreate, handleShareImport, handleShareList, handleShareRevoke } = require('./share.cmd');

function registerShareCommands(program) {
  const share = program
    .command('share')
    .description('Share and receive tab sessions via share codes');

  share
    .command('create <sessionName>')
    .description('Share a saved session and get a share code')
    .option('-v, --verbose', 'Show extra info after sharing')
    .action((sessionName, opts) => handleShareCreate(sessionName, opts));

  share
    .command('import <code>')
    .description('Import a shared session by its code')
    .option('-n, --name <name>', 'Save under a different session name')
    .action((code, opts) => handleShareImport(code, opts));

  share
    .command('list')
    .description('List all sessions you have shared')
    .action(() => handleShareList());

  share
    .command('revoke <code>')
    .description('Revoke a previously shared session code')
    .action((code) => handleShareRevoke(code));

  return share;
}

module.exports = { registerShareCommands };
