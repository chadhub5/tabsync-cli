const { registerLabelCommands } = require('./label.cmd');

/**
 * Registers all label-related subcommands onto the CLI program.
 *
 * @param {import('commander').Command} program - The root commander program instance.
 */
function register(program) {
  registerLabelCommands(program);
}

module.exports = { register };
