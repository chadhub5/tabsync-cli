const fs = require('fs');
const path = require('path');
const os = require('os');

const SCHEDULE_DIR = path.join(os.homedir(), '.tabsync', 'schedules');
const SCHEDULE_FILE = path.join(SCHEDULE_DIR, 'schedules.json');

function ensureScheduleDir() {
  if (!fs.existsSync(SCHEDULE_DIR)) {
    fs.mkdirSync(SCHEDULE_DIR, { recursive: true });
  }
}

function loadSchedules() {
  ensureScheduleDir();
  if (!fs.existsSync(SCHEDULE_FILE)) return {};
  return JSON.parse(fs.readFileSync(SCHEDULE_FILE, 'utf8'));
}

function saveSchedules(schedules) {
  ensureScheduleDir();
  fs.writeFileSync(SCHEDULE_FILE, JSON.stringify(schedules, null, 2));
}

function addSchedule(sessionName, cronExpr, action = 'restore') {
  const schedules = loadSchedules();
  schedules[sessionName] = {
    sessionName,
    cron: cronExpr,
    action,
    createdAt: new Date().toISOString(),
    lastRun: null
  };
  saveSchedules(schedules);
  return schedules[sessionName];
}

function removeSchedule(sessionName) {
  const schedules = loadSchedules();
  if (!schedules[sessionName]) return false;
  delete schedules[sessionName];
  saveSchedules(schedules);
  return true;
}

function getSchedule(sessionName) {
  const schedules = loadSchedules();
  return schedules[sessionName] || null;
}

function listSchedules() {
  const schedules = loadSchedules();
  return Object.values(schedules);
}

function updateLastRun(sessionName) {
  const schedules = loadSchedules();
  if (schedules[sessionName]) {
    schedules[sessionName].lastRun = new Date().toISOString();
    saveSchedules(schedules);
  }
}

module.exports = {
  ensureScheduleDir,
  loadSchedules,
  saveSchedules,
  addSchedule,
  removeSchedule,
  getSchedule,
  listSchedules,
  updateLastRun
};
