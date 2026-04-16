const { registerCooldownCommands } = require('./cooldown.cmd');

function register(program) {
  registerCooldownCommands(program);
}

module.exports = { register };
