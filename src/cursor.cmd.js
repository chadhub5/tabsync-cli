const { setCursor, getCursor, clearCursor, listCursors } = require('./cursor');

async function handleCursorSet(sessionId, position, options = {}) {
  await setCursor(sessionId, position, options);
  console.log(`Cursor set for session '${sessionId}' at position ${position}`);
}

async function handleCursorGet(sessionId) {
  const cursor = await getCursor(sessionId);
  if (!cursor) {
    console.log(`No cursor found for session '${sessionId}'`);
    return;
  }
  console.log(`Session: ${sessionId}`);
  console.log(`Position: ${cursor.position}`);
  if (cursor.label) console.log(`Label: ${cursor.label}`);
  console.log(`Updated: ${new Date(cursor.updatedAt).toLocaleString()}`);
}

async function handleCursorClear(sessionId) {
  await clearCursor(sessionId);
  console.log(`Cursor cleared for session '${sessionId}'`);
}

async function handleCursorList() {
  const cursors = await listCursors();
  if (!cursors.length) {
    console.log('No cursors found.');
    return;
  }
  for (const c of cursors) {
    console.log(`${c.sessionId} -> position: ${c.position}${c.label ? ` (${c.label})` : ''}`);
  }
}

function registerCursorCommands(program) {
  const cursor = program.command('cursor').description('Manage session cursors');

  cursor
    .command('set <sessionId> <position>')
    .description('Set cursor position for a session')
    .option('-l, --label <label>', 'optional label for the cursor')
    .action((sessionId, position, opts) => handleCursorSet(sessionId, parseInt(position, 10), opts));

  cursor
    .command('get <sessionId>')
    .description('Get cursor position for a session')
    .action(handleCursorGet);

  cursor
    .command('clear <sessionId>')
    .description('Clear cursor for a session')
    .action(handleCursorClear);

  cursor
    .command('list')
    .description('List all session cursors')
    .action(handleCursorList);
}

module.exports = { handleCursorSet, handleCursorGet, handleCursorClear, handleCursorList, registerCursorCommands };
