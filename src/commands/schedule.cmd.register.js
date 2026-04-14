const { registerScheduleCommands } = require('./schedule.cmd');

function register(program) {
  registerScheduleCommands(program);
}

module.exports = { register };
