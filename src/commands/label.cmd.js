const { setLabel, removeLabel, getLabels, getSessionsByLabel, clearLabels } = require('../label');

function handleLabelAdd(sessionName, label) {
  const labels = setLabel(sessionName, label);
  console.log(`Label "${label}" added to session "${sessionName}". Labels: ${labels.join(', ')}`);
}

function handleLabelRemove(sessionName, label) {
  const remaining = removeLabel(sessionName, label);
  console.log(`Label "${label}" removed from "${sessionName}". Remaining: ${remaining.length ? remaining.join(', ') : '(none)'}`);
}

function handleLabelList(sessionName) {
  const labels = getLabels(sessionName);
  if (labels.length === 0) {
    console.log(`No labels for session "${sessionName}".`);
  } else {
    console.log(`Labels for "${sessionName}": ${labels.join(', ')}`);
  }
}

function handleLabelSearch(label) {
  const sessions = getSessionsByLabel(label);
  if (sessions.length === 0) {
    console.log(`No sessions with label "${label}".`);
  } else {
    console.log(`Sessions with label "${label}":`);
    sessions.forEach(s => console.log(`  - ${s}`));
  }
}

function handleLabelClear(sessionName) {
  clearLabels(sessionName);
  console.log(`All labels cleared from session "${sessionName}".`);
}

function registerLabelCommands(program) {
  const label = program.command('label').description('Manage session labels');

  label.command('add <session> <label>')
    .description('Add a label to a session')
    .action(handleLabelAdd);

  label.command('remove <session> <label>')
    .description('Remove a label from a session')
    .action(handleLabelRemove);

  label.command('list <session>')
    .description('List labels for a session')
    .action(handleLabelList);

  label.command('search <label>')
    .description('Find sessions with a given label')
    .action(handleLabelSearch);

  label.command('clear <session>')
    .description('Clear all labels from a session')
    .action(handleLabelClear);
}

module.exports = { handleLabelAdd, handleLabelRemove, handleLabelList, handleLabelSearch, handleLabelClear, registerLabelCommands };
