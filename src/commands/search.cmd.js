const { searchByTitle, searchByUrl, searchByTag, searchAll } = require('../search');

async function handleSearch(query, options = {}) {
  const { tag, url, title } = options;
  let results = [];

  if (tag) {
    results = await searchByTag(query);
  } else if (url) {
    results = await searchByUrl(query);
  } else if (title) {
    results = await searchByTitle(query);
  } else {
    results = await searchAll(query);
  }

  if (results.length === 0) {
    console.log(`No sessions found matching "${query}"`);
    return;
  }

  console.log(`Found ${results.length} session(s) matching "${query}":\n`);

  for (const { name, session } of results) {
    console.log(`  Session: ${name}`);
    console.log(`  Tabs (${session.tabs.length}):`);
    for (const tab of session.tabs) {
      console.log(`    - ${tab.title || '(no title)'}`);
      console.log(`      ${tab.url}`);
    }
    console.log();
  }
}

function registerSearchCommands(program) {
  program
    .command('search <query>')
    .description('search sessions by title, url, or tag')
    .option('--tag', 'search by tag name')
    .option('--url', 'search by tab url')
    .option('--title', 'search by tab title')
    .action((query, options) => {
      handleSearch(query, options).catch(err => {
        console.error('Search failed:', err.message);
        process.exit(1);
      });
    });
}

module.exports = { handleSearch, registerSearchCommands };
