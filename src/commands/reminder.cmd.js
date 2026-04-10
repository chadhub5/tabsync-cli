const { addReminder, removeReminder, getDueReminders, listReminders } = require('../reminder');

function handleReminderAdd(sessionName, message, remindAt) {
  if (!sessionName || !message || !remindAt) {
    console.error('Usage: tabsync reminder add <session> <message> <datetime>');
    process.exit(1);
  }
  const date = new Date(remindAt);
  if (isNaN(date.getTime())) {
    console.error('Invalid date format. Use ISO 8601, e.g. 2025-06-01T09:00:00');
    process.exit(1);
  }
  const reminder = addReminder(sessionName, message, date.toISOString());
  console.log(`Reminder set (id: ${reminder.id}) for session "${sessionName}" at ${date.toLocaleString()}`);
}

function handleReminderRemove(id) {
  if (!id) { console.error('Usage: tabsync reminder remove <id>'); process.exit(1); }
  try {
    removeReminder(id);
    console.log(`Reminder ${id} removed.`);
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
}

function handleReminderList(sessionName) {
  const reminders = listReminders(sessionName);
  if (!reminders.length) { console.log('No reminders found.'); return; }
  reminders.forEach(r => {
    console.log(`[${r.id}] ${r.sessionName} — "${r.message}" @ ${new Date(r.remindAt).toLocaleString()}`);
  });
}

function handleReminderDue() {
  const due = getDueReminders();
  if (!due.length) { console.log('No due reminders.'); return; }
  due.forEach(r => {
    console.log(`⏰ [${r.id}] Session: ${r.sessionName} — "${r.message}"`);
  });
}

module.exports = { handleReminderAdd, handleReminderRemove, handleReminderList, handleReminderDue };
