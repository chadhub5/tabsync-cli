jest.mock('../workspace.cmd', () => ({
  registerWorkspaceCommands: jest.fn()
}));

const { registerWorkspaceCommands } = require('../workspace.cmd');
const { register } = require('./workspace.cmd.register');

function makeProgram() {
  return { command: jest.fn().mockReturnThis(), description: jest.fn().mockReturnThis() };
}

describe('register', () => {
  it('calls registerWorkspaceCommands with the program', () => {
    const program = makeProgram();
    register(program);
    expect(registerWorkspaceCommands).toHaveBeenCalledWith(program);
  });

  it('does not throw when called', () => {
    const program = makeProgram();
    expect(() => register(program)).not.toThrow();
  });
});
