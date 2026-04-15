const { setExpiry, removeExpiry, getExpiry, listExpired, listExpiry } = require('../expiry');

function handleExpirySet(sessionName, date, opts, program) {
  if (!sessionName || !date) {
    console.error('Usage: expiry set <session> <date>');
    process.exit(1);
  }
  const parsed = new Date(date);
  if (isNaN(parsed.getTime())) {
    console.error(`Invalid date: ${date}`);
    process.exit(1);
  }
  const result = setExpiry(sessionName, date);
  console.log(`Expiry set for "${sessionName}": ${result.expiresAt}`);
}

function handleExpiryRemove(sessionName) {
  if (!sessionName) {
    console.error('Usage: expiry remove <session>');
    process.exit(1);
  }
  const ok = removeExpiry(sessionName);
  if (ok) {
    console.log(`Expiry removed for "${sessionName}".`);
  } else {
    console.log(`No expiry found for "${sessionName}".`);
  }
}

function handleExpiryGet(sessionName) {
  const entry = getExpiry(sessionName);
  if (!entry) {
    console.log(`No expiry set for "${sessionName}".`);
  } else {
    console.log(`${sessionName}: expires at ${entry.expiresAt}`);
  }
}

function handleExpiryList() {
  const entries = listExpiry();
  if (!entries.length) {
    console.log('No expiry entries found.');
    return;
  }
  entries.forEach(e => console.log(`  ${e.name}: ${e.expiresAt}`));
}

function handleExpiryExpired() {
  const expired = listExpired();
  if (!expired.length) {
    console.log('No expired sessions.');
    return;
  }
  console.log('Expired sessions:');
  expired.forEach(e => console.log(`  ${e.name} (expired: ${e.expiresAt})`));
}

function registerExpiryCommands(program) {
  const expiry = program.command('expiry').description('Manage session expiry dates');
  expiry.command('set <session> <date>').description('Set expiry date for a session').action(handleExpirySet);
  expiry.command('remove <session>').description('Remove expiry for a session').action(handleExpiryRemove);
  expiry.command('get <session>').description('Get expiry for a session').action(handleExpiryGet);
  expiry.command('list').description('List all expiry entries').action(handleExpiryList);
  expiry.command('expired').description('List all expired sessions').action(handleExpiryExpired);
}

module.exports = { handleExpirySet, handleExpiryRemove, handleExpiryGet, handleExpiryList, handleExpiryExpired, registerExpiryCommands };
