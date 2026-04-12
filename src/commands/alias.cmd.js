const { setAlias, removeAlias, resolveAlias, listAliases } = require('../alias');

function handleAliasSet(alias, sessionName, opts, logger = console) {
  try {
    setAlias(alias, sessionName);
    logger.log(`Alias '${alias}' -> '${sessionName}' saved.`);
  } catch (err) {
    logger.error(`Error: ${err.message}`);
  }
}

function handleAliasRemove(alias, opts, logger = console) {
  try {
    removeAlias(alias);
    logger.log(`Alias '${alias}' removed.`);
  } catch (err) {
    logger.error(`Error: ${err.message}`);
  }
}

function handleAliasResolve(alias, opts, logger = console) {
  const name = resolveAlias(alias);
  if (name) {
    logger.log(name);
  } else {
    logger.log(`No alias found for '${alias}'.`);
  }
}

function handleAliasList(opts, logger = console) {
  const aliases = listAliases();
  const entries = Object.entries(aliases);
  if (entries.length === 0) {
    logger.log('No aliases defined.');
    return;
  }
  entries.forEach(([alias, session]) => {
    logger.log(`  ${alias} -> ${session}`);
  });
}

function registerAliasCommands(program) {
  const alias = program.command('alias').description('Manage session aliases');

  alias
    .command('set <alias> <session>')
    .description('Create or update an alias for a session')
    .action((a, s) => handleAliasSet(a, s));

  alias
    .command('remove <alias>')
    .description('Remove an alias')
    .action((a) => handleAliasRemove(a));

  alias
    .command('resolve <alias>')
    .description('Print the session name for an alias')
    .action((a) => handleAliasResolve(a));

  alias
    .command('list')
    .description('List all aliases')
    .action(() => handleAliasList());
}

module.exports = { handleAliasSet, handleAliasRemove, handleAliasResolve, handleAliasList, registerAliasCommands };
