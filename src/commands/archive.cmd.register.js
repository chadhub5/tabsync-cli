const { handleArchiveCreate, handleArchiveRestore, handleArchiveList, handleArchiveDelete } = require('./archive.cmd');

function registerArchiveCommands(program) {
  const archiveCmd = program
    .command('archive')
    .description('Manage archived tab sessions');

  archiveCmd
    .command('create <session>')
    .description('Archive a saved session')
    .action(name => handleArchiveCreate({ _: ['create', name] }));

  archiveCmd
    .command('restore <session>')
    .description('Restore a session from the archive')
    .action(name => handleArchiveRestore({ _: ['restore', name] }));

  archiveCmd
    .command('list')
    .description('List all archived sessions')
    .action(() => handleArchiveList());

  archiveCmd
    .command('delete <session>')
    .description('Permanently delete an archived session')
    .action(name => handleArchiveDelete({ _: ['delete', name] }));
}

module.exports = { registerArchiveCommands };
