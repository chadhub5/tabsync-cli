const { handleReminderAdd, handleReminderRemove, handleReminderList, handleReminderDue } = require('./reminder.cmd');

function registerReminderCommands(program) {
  const reminder = program.command('reminder').description('Manage session reminders');

  reminder
    .command('add <session> <message> <datetime>')
    .description('Add a reminder for a session (datetime in ISO 8601)')
    .action((session, message, datetime) => handleReminderAdd(session, message, datetime));

  reminder
    .command('remove <id>')
    .description('Remove a reminder by id')
    .action(id => handleReminderRemove(id));

  reminder
    .command('list [session]')
    .description('List all reminders, optionally filtered by session')
    .action(session => handleReminderList(session));

  reminder
    .command('due')
    .description('Show reminders that are currently due')
    .action(() => handleReminderDue());
}

module.exports = { registerReminderCommands };
