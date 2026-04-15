const { registerMetadataCommands } = require('./metadata.cmd');

function register(program) {
  registerMetadataCommands(program);
}

module.exports = { register };
