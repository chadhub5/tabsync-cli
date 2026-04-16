const { recordOpen, getStreak, resetStreak, listStreaks } = require('../streak');

function handleStreakRecord(sessionName) {
  const entry = recordOpen(sessionName);
  console.log(`Streak for "${sessionName}": ${entry.count} day(s) (best: ${entry.best})`);
}

function handleStreakGet(sessionName) {
  const entry = getStreak(sessionName);
  if (!entry.lastDate) {
    console.log(`No streak recorded for "${sessionName}".`);
    return;
  }
  console.log(`Session: ${sessionName}`);
  console.log(`  Current streak : ${entry.count}`);
  console.log(`  Best streak    : ${entry.best}`);
  console.log(`  Last opened    : ${entry.lastDate}`);
}

function handleStreakReset(sessionName) {
  resetStreak(sessionName);
  console.log(`Streak reset for "${sessionName}".`);
}

function handleStreakList() {
  const all = listStreaks();
  const names = Object.keys(all);
  if (!names.length) { console.log('No streaks recorded.'); return; }
  names.sort((a, b) => all[b].count - all[a].count).forEach(name => {
    const e = all[name];
    console.log(`${name}: ${e.count} day(s) (best: ${e.best}, last: ${e.lastDate})`);
  });
}

function registerStreakCommands(program) {
  const streak = program.command('streak').description('Track session open streaks');
  streak.command('record <session>').description('Record a session open for today').action(handleStreakRecord);
  streak.command('get <session>').description('Show streak info for a session').action(handleStreakGet);
  streak.command('reset <session>').description('Reset streak for a session').action(handleStreakReset);
  streak.command('list').description('List all streaks').action(handleStreakList);
}

module.exports = { handleStreakRecord, handleStreakGet, handleStreakReset, handleStreakList, registerStreakCommands };
