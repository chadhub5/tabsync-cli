const { setBadge, removeBadge, getBadge, listBadges, findByBadge } = require('../badge');

function handleBadgeSet(sessionName, badge) {
  try {
    const result = setBadge(sessionName, badge);
    console.log(`Badge ${result} set for session "${sessionName}"`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

function handleBadgeRemove(sessionName) {
  const removed = removeBadge(sessionName);
  if (removed) {
    console.log(`Badge removed from session "${sessionName}"`);
  } else {
    console.log(`No badge found for session "${sessionName}"`);
  }
}

function handleBadgeGet(sessionName) {
  const badge = getBadge(sessionName);
  if (badge) {
    console.log(`${sessionName}: ${badge}`);
  } else {
    console.log(`No badge set for session "${sessionName}"`);
  }
}

function handleBadgeList() {
  const badges = listBadges();
  const entries = Object.entries(badges);
  if (entries.length === 0) {
    console.log('No badges set.');
    return;
  }
  entries.forEach(([name, badge]) => console.log(`  ${badge}  ${name}`));
}

function handleBadgeFind(badge) {
  const sessions = findByBadge(badge);
  if (sessions.length === 0) {
    console.log(`No sessions with badge "${badge}"`);
    return;
  }
  sessions.forEach(name => console.log(`  ${name}`));
}

function registerBadgeCommands(program) {
  const badge = program.command('badge').description('Manage session badges');

  badge.command('set <session> <badge>').description('Set a badge for a session')
    .action(handleBadgeSet);

  badge.command('remove <session>').description('Remove badge from a session')
    .action(handleBadgeRemove);

  badge.command('get <session>').description('Get badge for a session')
    .action(handleBadgeGet);

  badge.command('list').description('List all session badges')
    .action(handleBadgeList);

  badge.command('find <badge>').description('Find sessions by badge')
    .action(handleBadgeFind);
}

module.exports = { handleBadgeSet, handleBadgeRemove, handleBadgeGet, handleBadgeList, handleBadgeFind, registerBadgeCommands };
