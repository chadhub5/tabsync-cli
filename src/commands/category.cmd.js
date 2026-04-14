const { setCategory, removeCategory, getCategory, getSessionsByCategory, listCategories } = require('../category');

function handleCategorySet(sessionName, category, opts, log = console.log) {
  if (!sessionName || !category) {
    log('Usage: category set <session> <category>');
    return;
  }
  setCategory(sessionName, category);
  log(`Session "${sessionName}" assigned to category "${category}"`);
}

function handleCategoryRemove(sessionName, opts, log = console.log) {
  if (!sessionName) {
    log('Usage: category remove <session>');
    return;
  }
  const removed = removeCategory(sessionName);
  if (removed) {
    log(`Category removed from session "${sessionName}"`);
  } else {
    log(`No category found for session "${sessionName}"`);
  }
}

function handleCategoryGet(sessionName, opts, log = console.log) {
  if (!sessionName) {
    log('Usage: category get <session>');
    return;
  }
  const cat = getCategory(sessionName);
  if (cat) {
    log(`${sessionName}: ${cat}`);
  } else {
    log(`No category set for "${sessionName}"`);
  }
}

function handleCategoryList(opts, log = console.log) {
  const cats = listCategories();
  const keys = Object.keys(cats);
  if (keys.length === 0) {
    log('No categories defined.');
    return;
  }
  for (const cat of keys) {
    log(`[${cat}]: ${cats[cat].join(', ')}`);
  }
}

function handleCategorySearch(category, opts, log = console.log) {
  if (!category) {
    log('Usage: category search <category>');
    return;
  }
  const sessions = getSessionsByCategory(category);
  if (sessions.length === 0) {
    log(`No sessions in category "${category}"`);
  } else {
    log(`Sessions in "${category}": ${sessions.join(', ')}`);
  }
}

function registerCategoryCommands(program) {
  const cat = program.command('category').description('Manage session categories');
  cat.command('set <session> <category>').description('Assign a category').action((s, c) => handleCategorySet(s, c));
  cat.command('remove <session>').description('Remove category from session').action(s => handleCategoryRemove(s));
  cat.command('get <session>').description('Get category of a session').action(s => handleCategoryGet(s));
  cat.command('list').description('List all categories').action(() => handleCategoryList());
  cat.command('search <category>').description('Find sessions by category').action(c => handleCategorySearch(c));
}

module.exports = { handleCategorySet, handleCategoryRemove, handleCategoryGet, handleCategoryList, handleCategorySearch, registerCategoryCommands };
