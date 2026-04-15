const { setAccess, removeAccess, getAccess, listAccess, filterByLevel } = require('../access');

function handleAccessSet(sessionName, level, opts, out = console.log) {
  try {
    const result = setAccess(sessionName, level);
    out(`Access for "${sessionName}" set to "${result.level}" (updated: ${result.updatedAt})`);
  } catch (e) {
    out(`Error: ${e.message}`);
  }
}

function handleAccessRemove(sessionName, opts, out = console.log) {
  const removed = removeAccess(sessionName);
  out(removed ? `Access entry for "${sessionName}" removed.` : `No access entry found for "${sessionName}".`);
}

function handleAccessGet(sessionName, opts, out = console.log) {
  const entry = getAccess(sessionName);
  if (!entry) return out(`No access entry for "${sessionName}".`);
  out(`${sessionName}: ${entry.level} (updated: ${entry.updatedAt})`);
}

function handleAccessList(opts, out = console.log) {
  const data = listAccess();
  const entries = Object.entries(data);
  if (!entries.length) return out('No access entries found.');
  entries.forEach(([name, info]) => out(`${name}: ${info.level}`));
}

function handleAccessFilter(level, opts, out = console.log) {
  try {
    const results = filterByLevel(level);
    if (!results.length) return out(`No sessions with access level "${level}".`);
    results.forEach(r => out(`${r.name}: ${r.level}`));
  } catch (e) {
    out(`Error: ${e.message}`);
  }
}

function registerAccessCommands(program) {
  const access = program.command('access').description('Manage session access levels');
  access.command('set <session> <level>').description('Set access level (public/private/readonly)').action((s, l) => handleAccessSet(s, l));
  access.command('remove <session>').description('Remove access entry').action(s => handleAccessRemove(s));
  access.command('get <session>').description('Get access level for a session').action(s => handleAccessGet(s));
  access.command('list').description('List all access entries').action(() => handleAccessList());
  access.command('filter <level>').description('Filter sessions by access level').action(l => handleAccessFilter(l));
}

module.exports = { handleAccessSet, handleAccessRemove, handleAccessGet, handleAccessList, handleAccessFilter, registerAccessCommands };
