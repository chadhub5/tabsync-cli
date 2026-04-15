const { registerThumbnailCommands } = require('./thumbnail.cmd');

function register(program) {
  registerThumbnailCommands(program);
}

module.exports = { register };
