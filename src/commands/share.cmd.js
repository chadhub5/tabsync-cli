const { shareSession, resolveShare, listShares, revokeShare } = require('../share');
const { saveSession } = require('../session');

function handleShareCreate(sessionName, opts) {
  try {
    const code = shareSession(sessionName);
    console.log(`Session "${sessionName}" shared with code: ${code}`);
    if (opts.verbose) {
      console.log(`Share this code with others to let them import your session.`);
    }
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

function handleShareImport(code, opts) {
  const targetName = opts.name;
  const payload = resolveShare(code);
  if (!payload) {
    console.error(`Error: No shared session found for code "${code}"`);
    process.exit(1);
  }
  const importName = targetName || payload.sessionName;
  saveSession(importName, payload.session);
  console.log(`Imported shared session as "${importName}" (${payload.session.tabs.length} tab(s))`);
}

function handleShareList() {
  const shares = listShares();
  if (shares.length === 0) {
    console.log('No shared sessions.');
    return;
  }
  console.log('Shared sessions:');
  shares.forEach(({ code, sessionName, sharedAt }) => {
    console.log(`  [${code}] ${sessionName} — shared at ${new Date(sharedAt).toLocaleString()}`);
  });
}

function handleShareRevoke(code) {
  const removed = revokeShare(code);
  if (removed) {
    console.log(`Share code "${code}" revoked.`);
  } else {
    console.error(`Error: Share code "${code}" not found.`);
    process.exit(1);
  }
}

module.exports = { handleShareCreate, handleShareImport, handleShareList, handleShareRevoke };
