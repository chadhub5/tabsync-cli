const { registerStreakCommands } = require('./streak.cmd');

function register(program) {
  registerStreakCommands(program);
}

module.exports = { register };
