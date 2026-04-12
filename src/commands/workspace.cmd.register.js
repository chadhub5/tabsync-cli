const { registerWorkspaceCommands } = require('../workspace.cmd');

/**
 * Registers all workspace-related subcommands onto the given commander program.
 * @param {import('commander').Command} program
 */
function register(program) {
  registerWorkspaceCommands(program);
}

module.exports = { register };
