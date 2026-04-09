const { registerMergeCommands } = require('./merge.cmd');

/**
 * Registers merge-related CLI commands onto the given commander program.
 * Called from the main CLI entry point.
 */
function register(program) {
  registerMergeCommands(program);
}

module.exports = { register };
