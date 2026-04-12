jest.mock('../label');
const label = require('../label');
const { handleLabelAdd, handleLabelRemove, handleLabelList, handleLabelSearch, handleLabelClear } = require('./label.cmd');

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => {
  console.log.mockRestore();
});

describe('handleLabelAdd', () => {
  test('calls setLabel and logs result', () => {
    label.setLabel.mockReturnValue(['important']);
    handleLabelAdd('work', 'important');
    expect(label.setLabel).toHaveBeenCalledWith('work', 'important');
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('important'));
  });
});

describe('handleLabelRemove', () => {
  test('calls removeLabel and logs remaining', () => {
    label.removeLabel.mockReturnValue(['urgent']);
    handleLabelRemove('work', 'important');
    expect(label.removeLabel).toHaveBeenCalledWith('work', 'important');
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('urgent'));
  });

  test('logs (none) when no labels remain', () => {
    label.removeLabel.mockReturnValue([]);
    handleLabelRemove('work', 'important');
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('(none)'));
  });
});

describe('handleLabelList', () => {
  test('logs labels when present', () => {
    label.getLabels.mockReturnValue(['dev', 'urgent']);
    handleLabelList('work');
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('dev'));
  });

  test('logs no labels message when empty', () => {
    label.getLabels.mockReturnValue([]);
    handleLabelList('work');
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('No labels'));
  });
});

describe('handleLabelSearch', () => {
  test('lists sessions with the label', () => {
    label.getSessionsByLabel.mockReturnValue(['work', 'research']);
    handleLabelSearch('dev');
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('work'));
  });

  test('logs no sessions message when empty', () => {
    label.getSessionsByLabel.mockReturnValue([]);
    handleLabelSearch('dev');
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('No sessions'));
  });
});

describe('handleLabelClear', () => {
  test('calls clearLabels and logs confirmation', () => {
    label.clearLabels.mockImplementation(() => {});
    handleLabelClear('work');
    expect(label.clearLabels).toHaveBeenCalledWith('work');
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('cleared'));
  });
});
