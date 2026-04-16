const { registerBookmarkCommands } = require('./bookmark.cmd');

function register(program) {
  registerBookmarkCommands(program);
}

module.exports = { register };
