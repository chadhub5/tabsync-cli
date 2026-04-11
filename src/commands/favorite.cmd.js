const { addFavorite, removeFavorite, loadFavorites, isFavorite } = require('../favorite');

function handleFavoriteAdd(sessionName) {
  if (!sessionName) {
    console.error('Error: session name is required');
    process.exit(1);
  }
  try {
    addFavorite(sessionName);
    console.log(`Marked '${sessionName}' as a favorite.`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

function handleFavoriteRemove(sessionName) {
  if (!sessionName) {
    console.error('Error: session name is required');
    process.exit(1);
  }
  try {
    removeFavorite(sessionName);
    console.log(`Removed '${sessionName}' from favorites.`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

function handleFavoriteList() {
  const favorites = loadFavorites();
  if (favorites.length === 0) {
    console.log('No favorites saved.');
    return;
  }
  console.log('Favorites:');
  favorites.forEach(name => console.log(`  - ${name}`));
}

function handleFavoriteCheck(sessionName) {
  if (!sessionName) {
    console.error('Error: session name is required');
    process.exit(1);
  }
  const result = isFavorite(sessionName);
  console.log(result ? `'${sessionName}' is a favorite.` : `'${sessionName}' is not a favorite.`);
}

function registerFavoriteCommands(program) {
  const fav = program.command('favorite').description('Manage favorite sessions');
  fav.command('add <session>').description('Mark a session as favorite').action(handleFavoriteAdd);
  fav.command('remove <session>').description('Remove a session from favorites').action(handleFavoriteRemove);
  fav.command('list').description('List all favorite sessions').action(handleFavoriteList);
  fav.command('check <session>').description('Check if a session is a favorite').action(handleFavoriteCheck);
}

module.exports = { handleFavoriteAdd, handleFavoriteRemove, handleFavoriteList, handleFavoriteCheck, registerFavoriteCommands };
