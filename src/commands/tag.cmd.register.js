const { handleTagAdd, handleTagRemove, handleTagList, handleTagShow } = require('./tag.cmd');

function registerTagCommands(program) {
  const tag = program
    .command('tag')
    .description('Manage tags for sessions');

  tag
    .command('add <session> <tag>')
    .description('Add a tag to a session')
    .option('-q, --quiet', 'Suppress output')
    .action((session, tagName, opts) => {
      handleTagAdd(session, tagName, opts);
    });

  tag
    .command('remove <session> <tag>')
    .description('Remove a tag from a session')
    .option('-q, --quiet', 'Suppress output')
    .action((session, tagName, opts) => {
      handleTagRemove(session, tagName, opts);
    });

  tag
    .command('list [tag]')
    .description('List sessions by tag, or list all tags if no tag given')
    .option('-q, --quiet', 'Suppress output')
    .option('-j, --json', 'Output as JSON')
    .action((tagName, opts) => {
      handleTagList(tagName, opts);
    });

  tag
    .command('show <session>')
    .description('Show all tags for a session')
    .option('-q, --quiet', 'Suppress output')
    .option('-j, --json', 'Output as JSON')
    .action((session, opts) => {
      handleTagShow(session, opts);
    });

  return tag;
}

module.exports = { registerTagCommands };
