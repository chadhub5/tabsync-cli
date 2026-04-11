const { registerDiffCommands } = require('./diff.cmd');

/**
 * Register diff commands with the CLI program instance
 * @param {import('commander').Command} program
 */
function register(program) {
  registerDiffCommands(program);
}

module.exports = { register };
