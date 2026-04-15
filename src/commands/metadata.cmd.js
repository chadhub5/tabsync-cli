const { setMeta, getMeta, removeMeta, loadMetadata, listMetadata } = require('../metadata');

function handleMetaSet(sessionName, key, value, opts) {
  try {
    const parsed = (() => { try { return JSON.parse(value); } catch { return value; } })();
    const meta = setMeta(sessionName, key, parsed);
    if (!opts.quiet) console.log(`Set [${sessionName}] ${key} = ${JSON.stringify(parsed)}`);
    return meta;
  } catch (err) {
    console.error('Error setting metadata:', err.message);
    process.exit(1);
  }
}

function handleMetaGet(sessionName, key, opts) {
  try {
    const value = getMeta(sessionName, key);
    if (value === undefined) {
      if (!opts.quiet) console.log(`No metadata key '${key}' for session '${sessionName}'`);
    } else {
      console.log(JSON.stringify(value));
    }
    return value;
  } catch (err) {
    console.error('Error getting metadata:', err.message);
    process.exit(1);
  }
}

function handleMetaRemove(sessionName, key, opts) {
  try {
    removeMeta(sessionName, key);
    if (!opts.quiet) console.log(`Removed key '${key}' from [${sessionName}]`);
  } catch (err) {
    console.error('Error removing metadata:', err.message);
    process.exit(1);
  }
}

function handleMetaList(sessionName) {
  try {
    const meta = loadMetadata(sessionName);
    const keys = Object.keys(meta);
    if (keys.length === 0) {
      console.log(`No metadata for session '${sessionName}'`);
    } else {
      keys.forEach(k => console.log(`  ${k}: ${JSON.stringify(meta[k])}`));
    }
    return meta;
  } catch (err) {
    console.error('Error listing metadata:', err.message);
    process.exit(1);
  }
}

function handleMetaSessions() {
  try {
    const sessions = listMetadata();
    if (sessions.length === 0) {
      console.log('No sessions with metadata.');
    } else {
      sessions.forEach(s => console.log(` - ${s}`));
    }
    return sessions;
  } catch (err) {
    console.error('Error listing sessions:', err.message);
    process.exit(1);
  }
}

function registerMetadataCommands(program) {
  const meta = program.command('meta').description('Manage session metadata');
  meta.command('set <session> <key> <value>').option('-q, --quiet').action((s, k, v, opts) => handleMetaSet(s, k, v, opts));
  meta.command('get <session> <key>').option('-q, --quiet').action((s, k, opts) => handleMetaGet(s, k, opts));
  meta.command('remove <session> <key>').option('-q, --quiet').action((s, k, opts) => handleMetaRemove(s, k, opts));
  meta.command('list <session>').action(s => handleMetaList(s));
  meta.command('sessions').action(() => handleMetaSessions());
}

module.exports = { handleMetaSet, handleMetaGet, handleMetaRemove, handleMetaList, handleMetaSessions, registerMetadataCommands };
