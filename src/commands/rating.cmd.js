const { setRating, removeRating, getRating, listRatings, getTopRated } = require('../rating');

function handleRatingSet(sessionName, score, opts) {
  try {
    const parsed = parseInt(score, 10);
    const result = setRating(sessionName, parsed);
    console.log(`Rated "${sessionName}": ${result.score}/5 (${result.updatedAt})`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

function handleRatingGet(sessionName) {
  const result = getRating(sessionName);
  if (!result) {
    console.log(`No rating found for "${sessionName}"`);
  } else {
    console.log(`"${sessionName}": ${result.score}/5 (updated ${result.updatedAt})`);
  }
}

function handleRatingRemove(sessionName) {
  const ok = removeRating(sessionName);
  if (ok) {
    console.log(`Rating removed for "${sessionName}"`);
  } else {
    console.log(`No rating found for "${sessionName}"`);
  }
}

function handleRatingList() {
  const ratings = listRatings();
  const entries = Object.entries(ratings);
  if (entries.length === 0) {
    console.log('No ratings saved.');
    return;
  }
  entries.forEach(([name, data]) => {
    console.log(`  ${name}: ${data.score}/5`);
  });
}

function handleRatingTop(opts) {
  const limit = parseInt(opts.limit || '5', 10);
  const top = getTopRated(limit);
  if (top.length === 0) {
    console.log('No ratings yet.');
    return;
  }
  console.log(`Top ${limit} rated sessions:`);
  top.forEach((entry, i) => {
    console.log(`  ${i + 1}. ${entry.name} — ${entry.score}/5`);
  });
}

function registerRatingCommands(program) {
  const rating = program.command('rating').description('Rate browser sessions');

  rating
    .command('set <session> <score>')
    .description('Set a rating (1-5) for a session')
    .action(handleRatingSet);

  rating
    .command('get <session>')
    .description('Get the rating for a session')
    .action(handleRatingGet);

  rating
    .command('remove <session>')
    .description('Remove the rating for a session')
    .action(handleRatingRemove);

  rating
    .command('list')
    .description('List all rated sessions')
    .action(handleRatingList);

  rating
    .command('top')
    .description('Show top rated sessions')
    .option('-l, --limit <n>', 'Number of results', '5')
    .action(handleRatingTop);
}

module.exports = { handleRatingSet, handleRatingGet, handleRatingRemove, handleRatingList, handleRatingTop, registerRatingCommands };
