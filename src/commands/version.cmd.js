const { addVersion, getVersion, listVersions, deleteVersion } = require('../version');
const { loadSession, saveSession } = require('../session');

function handleVersionSave(sessionName, message, opts) {
  const session = loadSession(sessionName);
  if (!session) {
    console.error(`Session "${sessionName}" not found.`);
    process.exit(1);
  }
  const entry = addVersion(sessionName, session, message || '');
  console.log(`Saved version ${entry.versionId} for "${sessionName}" at ${entry.timestamp}`);
}

function handleVersionList(sessionName) {
  const versions = listVersions(sessionName);
  if (!versions.length) {
    console.log(`No versions found for "${sessionName}".`);
    return;
  }
  versions.forEach(v => {
    const msg = v.message ? ` — ${v.message}` : '';
    console.log(`  ${v.versionId}  ${v.timestamp}${msg}`);
  });
}

function handleVersionRestore(sessionName, versionId) {
  const entry = getVersion(sessionName, versionId);
  if (!entry) {
    console.error(`Version "${versionId}" not found for "${sessionName}".`);
    process.exit(1);
  }
  saveSession(sessionName, entry.data);
  console.log(`Restored "${sessionName}" to ${versionId}.`);
}

function handleVersionDelete(sessionName, versionId) {
  const ok = deleteVersion(sessionName, versionId);
  if (!ok) {
    console.error(`Version "${versionId}" not found for "${sessionName}".`);
    process.exit(1);
  }
  console.log(`Deleted version ${versionId} from "${sessionName}".`);
}

function registerVersionCommands(program) {
  const ver = program.command('version').description('manage session versions');

  ver.command('save <session> [message]')
    .description('save current state as a new version')
    .action(handleVersionSave);

  ver.command('list <session>')
    .description('list all versions of a session')
    .action(handleVersionList);

  ver.command('restore <session> <versionId>')
    .description('restore a session to a specific version')
    .action(handleVersionRestore);

  ver.command('delete <session> <versionId>')
    .description('delete a specific version')
    .action(handleVersionDelete);
}

module.exports = { handleVersionSave, handleVersionList, handleVersionRestore, handleVersionDelete, registerVersionCommands };
