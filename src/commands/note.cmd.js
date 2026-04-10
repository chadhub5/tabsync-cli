const { loadNote, saveNote, deleteNote, listNotes } = require('../note');

function handleNoteSet(sessionName, text, { log = console.log } = {}) {
  if (!sessionName) {
    log('Error: session name is required');
    return;
  }
  if (!text || !text.trim()) {
    log('Error: note text is required');
    return;
  }
  const note = saveNote(sessionName, text.trim());
  log(`Note saved for session "${note.session}" at ${note.updatedAt}`);
}

function handleNoteGet(sessionName, { log = console.log } = {}) {
  if (!sessionName) {
    log('Error: session name is required');
    return;
  }
  const note = loadNote(sessionName);
  if (!note) {
    log(`No note found for session "${sessionName}"`);
    return;
  }
  log(`[${sessionName}] ${note.text}  (updated: ${note.updatedAt})`);
}

function handleNoteDelete(sessionName, { log = console.log } = {}) {
  if (!sessionName) {
    log('Error: session name is required');
    return;
  }
  const removed = deleteNote(sessionName);
  if (removed) {
    log(`Note for session "${sessionName}" deleted.`);
  } else {
    log(`No note found for session "${sessionName}"`);
  }
}

function handleNoteList({ log = console.log } = {}) {
  const notes = listNotes();
  if (notes.length === 0) {
    log('No notes found.');
    return;
  }
  notes.forEach(n => log(`${n.session}: ${n.text}`));
}

function registerNoteCommands(program) {
  const note = program.command('note').description('Manage notes attached to sessions');
  note.command('set <session> <text>').description('Set or update a note for a session').action((session, text) => handleNoteSet(session, text));
  note.command('get <session>').description('Show the note for a session').action(session => handleNoteGet(session));
  note.command('delete <session>').description('Delete the note for a session').action(session => handleNoteDelete(session));
  note.command('list').description('List all session notes').action(() => handleNoteList());
}

module.exports = { handleNoteSet, handleNoteGet, handleNoteDelete, handleNoteList, registerNoteCommands };
