const { lockSession, unlockSession, getLockInfo, listLocks } = require('../lock');

function handleLockAcquire(sessionName) {
  if (!sessionName) {
    console.error('Session name is required.');
    process.exit(1);
  }
  const result = lockSession(sessionName);
  if (result.locked) {
    console.error(`Session "${sessionName}" is already locked by ${result.by} at ${result.at}`);
    process.exit(1);
  }
  console.log(`Lock acquired for session "${sessionName}".`);
}

function handleLockRelease(sessionName) {
  if (!sessionName) {
    console.error('Session name is required.');
    process.exit(1);
  }
  const result = unlockSession(sessionName);
  if (!result.existed) {
    console.warn(`No lock found for session "${sessionName}".`);
    return;
  }
  console.log(`Lock released for session "${sessionName}".`);
}

function handleLockStatus(sessionName) {
  if (!sessionName) {
    console.error('Session name is required.');
    process.exit(1);
  }
  const info = getLockInfo(sessionName);
  if (!info) {
    console.log(`Session "${sessionName}" is not locked.`);
    return;
  }
  console.log(`Locked by: ${info.by}`);
  console.log(`Locked at: ${info.at}`);
  console.log(`PID: ${info.pid}`);
}

function handleLockList() {
  const locks = listLocks();
  if (locks.length === 0) {
    console.log('No active locks.');
    return;
  }
  locks.forEach(l => {
    console.log(`  ${l.session} — locked by ${l.by} at ${l.at}`);
  });
}

function registerLockCommands(program) {
  const lock = program.command('lock').description('Manage session locks');
  lock.command('acquire <session>').description('Lock a session').action(handleLockAcquire);
  lock.command('release <session>').description('Unlock a session').action(handleLockRelease);
  lock.command('status <session>').description('Check lock status').action(handleLockStatus);
  lock.command('list').description('List all locked sessions').action(handleLockList);
}

module.exports = { handleLockAcquire, handleLockRelease, handleLockStatus, handleLockList, registerLockCommands };
