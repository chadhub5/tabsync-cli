const { registerGroupCommands } = require('./group.cmd.register');

jest.mock('../group.cmd', () => ({
  handleGroupCreate: jest.fn(),
  handleGroupAdd: jest.fn(),
  handleGroupRemove: jest.fn(),
  handleGroupList: jest.fn(),
  handleGroupShow: jest.fn(),
  handleGroupDelete: jest.fn()
}));

function makeProgram() {
  const actions = {};
  const sub = (name) => {
    const cmd = {
      description: () => cmd,
      command: (n) => {
        const c = { description: () => c, action: (fn) => { actions[`${name}:${n}`] = fn; return c; } };
        return c;
      }
    };
    return cmd;
  };
  return {
    command: (name) => {
      const cmd = sub(name);
      cmd.description = () => cmd;
      return cmd;
    },
    actions
  };
}

describe('registerGroupCommands', () => {
  test('registers without throwing', () => {
    const program = makeProgram();
    expect(() => registerGroupCommands(program)).not.toThrow();
  });

  test('exports registerGroupCommands as function', () => {
    expect(typeof registerGroupCommands).toBe('function');
  });
});
