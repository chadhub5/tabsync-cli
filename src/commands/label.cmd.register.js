const { registerLabelCommands } = require('./label.cmd');

function register(program) {
  registerLabelCommands(program);
}

module.exports = { register };
