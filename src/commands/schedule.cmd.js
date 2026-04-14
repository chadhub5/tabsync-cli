const { addSchedule, removeSchedule, listSchedules, getSchedule } = require('../schedule');

function handleScheduleAdd(sessionName, cronExpr, options = {}) {
  const action = options.action || 'restore';
  if (!sessionName || !cronExpr) {
    console.error('Error: session name and cron expression are required');
    return;
  }
  const schedule = addSchedule(sessionName, cronExpr, action);
  console.log(`Scheduled "${sessionName}" with cron "${cronExpr}" (action: ${schedule.action})`);
}

function handleScheduleRemove(sessionName) {
  if (!sessionName) {
    console.error('Error: session name is required');
    return;
  }
  const removed = removeSchedule(sessionName);
  if (removed) {
    console.log(`Schedule for "${sessionName}" removed.`);
  } else {
    console.error(`No schedule found for "${sessionName}"`);
  }
}

function handleScheduleList() {
  const schedules = listSchedules();
  if (schedules.length === 0) {
    console.log('No schedules configured.');
    return;
  }
  schedules.forEach(s => {
    const lastRun = s.lastRun ? s.lastRun : 'never';
    console.log(`  ${s.sessionName} | cron: ${s.cron} | action: ${s.action} | last run: ${lastRun}`);
  });
}

function handleScheduleShow(sessionName) {
  if (!sessionName) {
    console.error('Error: session name is required');
    return;
  }
  const schedule = getSchedule(sessionName);
  if (!schedule) {
    console.error(`No schedule found for "${sessionName}"`);
    return;
  }
  console.log(JSON.stringify(schedule, null, 2));
}

function registerScheduleCommands(program) {
  const schedule = program.command('schedule').description('Manage session schedules');

  schedule.command('add <session> <cron>')
    .description('Schedule a session action using a cron expression')
    .option('-a, --action <action>', 'Action to perform (restore)', 'restore')
    .action((session, cron, opts) => handleScheduleAdd(session, cron, opts));

  schedule.command('remove <session>')
    .description('Remove a schedule for a session')
    .action(handleScheduleRemove);

  schedule.command('list')
    .description('List all schedules')
    .action(handleScheduleList);

  schedule.command('show <session>')
    .description('Show schedule details for a session')
    .action(handleScheduleShow);
}

module.exports = { handleScheduleAdd, handleScheduleRemove, handleScheduleList, handleScheduleShow, registerScheduleCommands };
