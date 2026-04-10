const { archiveSession, unarchiveSession, listArchived, deleteArchived } = require('../archive');
const { loadSession, saveSession } = require('../session');

async function handleArchiveCreate(args) {
  const name = args._[1];
  if (!name) {
    console.error('Usage: tabsync archive create <session>');
    process.exit(1);
  }
  try {
    const data = loadSession(name);
    archiveSession(name, data);
    console.log(`Session "${name}" archived successfully.`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

async function handleArchiveRestore(args) {
  const name = args._[1];
  if (!name) {
    console.error('Usage: tabsync archive restore <session>');
    process.exit(1);
  }
  try {
    const data = unarchiveSession(name);
    saveSession(name, data);
    console.log(`Session "${name}" restored from archive.`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

async function handleArchiveList() {
  const items = listArchived();
  if (items.length === 0) {
    console.log('No archived sessions.');
    return;
  }
  items.forEach(item => {
    console.log(`  ${item.name}  (archived: ${item.archivedAt})`);
  });
}

async function handleArchiveDelete(args) {
  const name = args._[1];
  if (!name) {
    console.error('Usage: tabsync archive delete <session>');
    process.exit(1);
  }
  try {
    deleteArchived(name);
    console.log(`Archived session "${name}" deleted.`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

module.exports = { handleArchiveCreate, handleArchiveRestore, handleArchiveList, handleArchiveDelete };
