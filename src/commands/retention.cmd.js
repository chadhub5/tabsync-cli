const { setRetention, removeRetention, getRetention, listRetention, getExpiredSessions } = require('../retention');

function handleRetentionSet(sessionId, days, opts, cmd) {
  const numDays = parseInt(days, 10);
  try {
    const result = setRetention(sessionId, numDays);
    console.log(`Retention set: ${sessionId} expires after ${result.days} day(s) (set at ${result.setAt})`);
  } catch (e) {
    console.error(`Error: ${e.message}`);
    process.exit(1);
  }
}

function handleRetentionRemove(sessionId) {
  const removed = removeRetention(sessionId);
  if (removed) {
    console.log(`Retention policy removed for: ${sessionId}`);
  } else {
    console.log(`No retention policy found for: ${sessionId}`);
  }
}

function handleRetentionGet(sessionId) {
  const r = getRetention(sessionId);
  if (!r) {
    console.log(`No retention policy set for: ${sessionId}`);
  } else {
    console.log(`${sessionId}: ${r.days} day(s), set at ${r.setAt}`);
  }
}

function handleRetentionList() {
  const all = listRetention();
  const entries = Object.entries(all);
  if (entries.length === 0) {
    console.log('No retention policies set.');
    return;
  }
  entries.forEach(([id, val]) => {
    console.log(`${id}: ${val.days} day(s), set at ${val.setAt}`);
  });
}

function handleRetentionExpired() {
  const expired = getExpiredSessions();
  if (expired.length === 0) {
    console.log('No expired sessions.');
    return;
  }
  expired.forEach(e => {
    console.log(`EXPIRED: ${e.sessionId} (${e.days} day policy, set at ${e.setAt})`);
  });
}

function registerRetentionCommands(program) {
  const retention = program.command('retention').description('Manage session retention policies');
  retention.command('set <sessionId> <days>').description('Set retention period in days').action(handleRetentionSet);
  retention.command('remove <sessionId>').description('Remove retention policy').action(handleRetentionRemove);
  retention.command('get <sessionId>').description('Get retention policy').action(handleRetentionGet);
  retention.command('list').description('List all retention policies').action(handleRetentionList);
  retention.command('expired').description('List sessions past their retention period').action(handleRetentionExpired);
}

module.exports = { handleRetentionSet, handleRetentionRemove, handleRetentionGet, handleRetentionList, handleRetentionExpired, registerRetentionCommands };
