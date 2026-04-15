const { addComment, removeComment, listComments, clearComments } = require('../comment');

function handleCommentAdd(sessionName, text, opts, log = console.log) {
  if (!sessionName || !text) {
    log('Usage: comment add <session> <text>');
    return;
  }
  const entry = addComment(sessionName, text);
  log(`Comment added to "${sessionName}" (id: ${entry.id})`);
}

function handleCommentRemove(sessionName, id, opts, log = console.log) {
  const numId = parseInt(id, 10);
  if (!sessionName || isNaN(numId)) {
    log('Usage: comment remove <session> <id>');
    return;
  }
  const removed = removeComment(sessionName, numId);
  if (removed) {
    log(`Comment ${numId} removed from "${sessionName}"`);
  } else {
    log(`No comment with id ${numId} found in "${sessionName}"`);
  }
}

function handleCommentList(sessionName, opts, log = console.log) {
  if (!sessionName) {
    log('Usage: comment list <session>');
    return;
  }
  const comments = listComments(sessionName);
  if (comments.length === 0) {
    log(`No comments for "${sessionName}"`);
    return;
  }
  comments.forEach(c => log(`[${c.id}] ${c.createdAt}: ${c.text}`));
}

function handleCommentClear(sessionName, opts, log = console.log) {
  if (!sessionName) {
    log('Usage: comment clear <session>');
    return;
  }
  clearComments(sessionName);
  log(`All comments cleared for "${sessionName}"`);
}

function registerCommentCommands(program) {
  const cmd = program.command('comment').description('Manage session comments');

  cmd.command('add <session> <text>')
    .description('Add a comment to a session')
    .action((session, text) => handleCommentAdd(session, text, {}));

  cmd.command('remove <session> <id>')
    .description('Remove a comment by id')
    .action((session, id) => handleCommentRemove(session, id, {}));

  cmd.command('list <session>')
    .description('List all comments for a session')
    .action(session => handleCommentList(session, {}));

  cmd.command('clear <session>')
    .description('Clear all comments for a session')
    .action(session => handleCommentClear(session, {}));
}

module.exports = { handleCommentAdd, handleCommentRemove, handleCommentList, handleCommentClear, registerCommentCommands };
