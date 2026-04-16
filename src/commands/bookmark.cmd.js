const { addBookmark, removeBookmark, getBookmarks, clearBookmarks, findBookmarksByLabel } = require('../bookmark');

function handleBookmarkAdd(sessionName, url, opts) {
  const label = opts.label || '';
  const entry = addBookmark(sessionName, url, label);
  console.log(`Bookmarked ${url} in session "${sessionName}"${label ? ` [${label}]` : ''}`);
  return entry;
}

function handleBookmarkRemove(sessionName, url) {
  const removed = removeBookmark(sessionName, url);
  if (removed) {
    console.log(`Removed bookmark ${url} from session "${sessionName}"`);
  } else {
    console.log(`Bookmark not found in session "${sessionName}"`);
  }
  return removed;
}

function handleBookmarkList(sessionName) {
  const bms = getBookmarks(sessionName);
  if (!bms.length) {
    console.log(`No bookmarks for session "${sessionName}"`);
    return bms;
  }
  bms.forEach(b => console.log(`  ${b.url}${b.label ? ` (${b.label})` : ''}`));
  return bms;
}

function handleBookmarkClear(sessionName) {
  clearBookmarks(sessionName);
  console.log(`Cleared all bookmarks for session "${sessionName}"`);
}

function handleBookmarkFind(label) {
  const results = findBookmarksByLabel(label);
  const sessions = Object.keys(results);
  if (!sessions.length) {
    console.log(`No bookmarks found with label containing "${label}"`);
    return results;
  }
  sessions.forEach(s => {
    console.log(`${s}:`);
    results[s].forEach(b => console.log(`  ${b.url} [${b.label}]`));
  });
  return results;
}

function registerBookmarkCommands(program) {
  const bm = program.command('bookmark').description('Manage session bookmarks');

  bm.command('add <session> <url>').option('-l, --label <label>', 'Bookmark label')
    .description('Add a bookmark to a session').action(handleBookmarkAdd);

  bm.command('remove <session> <url>').description('Remove a bookmark from a session').action(handleBookmarkRemove);

  bm.command('list <session>').description('List bookmarks for a session').action(handleBookmarkList);

  bm.command('clear <session>').description('Clear all bookmarks for a session').action(handleBookmarkClear);

  bm.command('find <label>').description('Find bookmarks by label').action(handleBookmarkFind);
}

module.exports = { handleBookmarkAdd, handleBookmarkRemove, handleBookmarkList, handleBookmarkClear, handleBookmarkFind, registerBookmarkCommands };
