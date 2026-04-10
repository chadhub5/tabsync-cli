const fs = require('fs');
const path = require('path');

const REMINDER_FILE = path.join(process.env.HOME || '.', '.tabsync', 'reminders.json');

function ensureReminderFile() {
  const dir = path.dirname(REMINDER_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(REMINDER_FILE)) fs.writeFileSync(REMINDER_FILE, JSON.stringify([]));
}

function loadReminders() {
  ensureReminderFile();
  return JSON.parse(fs.readFileSync(REMINDER_FILE, 'utf8'));
}

function saveReminders(reminders) {
  ensureReminderFile();
  fs.writeFileSync(REMINDER_FILE, JSON.stringify(reminders, null, 2));
}

function addReminder(sessionName, message, remindAt) {
  const reminders = loadReminders();
  const reminder = { id: Date.now().toString(), sessionName, message, remindAt, createdAt: new Date().toISOString() };
  reminders.push(reminder);
  saveReminders(reminders);
  return reminder;
}

function removeReminder(id) {
  const reminders = loadReminders();
  const filtered = reminders.filter(r => r.id !== id);
  if (filtered.length === reminders.length) throw new Error(`Reminder not found: ${id}`);
  saveReminders(filtered);
  return id;
}

function getDueReminders() {
  const reminders = loadReminders();
  const now = new Date();
  return reminders.filter(r => new Date(r.remindAt) <= now);
}

function listReminders(sessionName) {
  const reminders = loadReminders();
  return sessionName ? reminders.filter(r => r.sessionName === sessionName) : reminders;
}

module.exports = { ensureReminderFile, loadReminders, saveReminders, addReminder, removeReminder, getDueReminders, listReminders };
