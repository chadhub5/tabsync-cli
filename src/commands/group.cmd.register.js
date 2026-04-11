const {
  handleGroupCreate,
  handleGroupAdd,
  handleGroupRemove,
  handleGroupList,
  handleGroupShow,
  handleGroupDelete
} = require('../group.cmd');

function registerGroupCommands(program) {
  const group = program.command('group').description('Manage session groups');

  group
    .command('create <name>')
    .description('Create a new group')
    .action((name, opts) => handleGroupCreate(name, opts));

  group
    .command('add <group> <session>')
    .description('Add a session to a group')
    .action((g, s, opts) => handleGroupAdd(g, s, opts));

  group
    .command('remove <group> <session>')
    .description('Remove a session from a group')
    .action((g, s, opts) => handleGroupRemove(g, s, opts));

  group
    .command('list')
    .description('List all groups')
    .action(opts => handleGroupList(opts));

  group
    .command('show <name>')
    .description('Show sessions in a group')
    .action((name, opts) => handleGroupShow(name, opts));

  group
    .command('delete <name>')
    .description('Delete a group')
    .action((name, opts) => handleGroupDelete(name, opts));
}

module.exports = { registerGroupCommands };
