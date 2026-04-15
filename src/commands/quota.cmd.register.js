const { registerQuotaCommands } = require('./quota.cmd');

function register(program) {
  registerQuotaCommands(program);
}

module.exports = { register };
