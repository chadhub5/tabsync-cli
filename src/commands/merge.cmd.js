const { mergeSessionFiles } = require('../merge');

async function handleMerge(baseName, incomingName, options = {}) {
  if (!baseName || !incomingName) {
    console.error('Usage: tabsync merge <base> <incoming> [--strategy union|replace|intersect]');
    process.exit(1);
  }

  const strategy = options.strategy || 'union';
  const validStrategies = ['union', 'replace', 'intersect'];
  if (!validStrategies.includes(strategy)) {
    console.error(`Invalid strategy "${strategy}". Choose from: ${validStrategies.join(', ')}`);
    process.exit(1);
  }

  try {
    const merged = await mergeSessionFiles(baseName, incomingName, strategy);
    console.log(`Merged "${incomingName}" into "${baseName}" using strategy: ${strategy}`);
    console.log(`Total tabs: ${merged.tabs.length}`);
  } catch (err) {
    console.error(`Merge failed: ${err.message}`);
    process.exit(1);
  }
}

function registerMergeCommands(program) {
  program
    .command('merge <base> <incoming>')
    .description('Merge tabs from incoming session into base session')
    .option('-s, --strategy <strategy>', 'Merge strategy: union, replace, intersect', 'union')
    .action((base, incoming, options) => handleMerge(base, incoming, options));
}

module.exports = { handleMerge, registerMergeCommands };
