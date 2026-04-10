jest.mock('fs');

const fs = require('fs');

function getModule() {
  jest.resetModules();
  return require('./note');
}

describe('note', () => {
  beforeEach(() => {
    fs.existsSync = jest.fn().mockReturnValue(true);
    fs.mkdirSync = jest.fn();
    fs.writeFileSync = jest.fn();
    fs.readFileSync = jest.fn();
    fs.unlinkSync = jest.fn();
    fs.readdirSync = jest.fn().mockReturnValue([]);
  });

  test('saveNote writes correct structure', () => {
    const { saveNote } = getModule();
    const note = saveNote('work', 'some note text');
    expect(note.session).toBe('work');
    expect(note.text).toBe('some note text');
    expect(note.updatedAt).toBeDefined();
    expect(fs.writeFileSync).toHaveBeenCalled();
  });

  test('loadNote returns null when file missing', () => {
    fs.existsSync = jest.fn().mockReturnValue(false);
    const { loadNote } = getModule();
    const result = loadNote('missing');
    expect(result).toBeNull();
  });

  test('loadNote parses existing note', () => {
    const fakeNote = { session: 'work', text: 'hello', updatedAt: '2024-01-01T00:00:00.000Z' };
    fs.existsSync = jest.fn().mockReturnValue(true);
    fs.readFileSync = jest.fn().mockReturnValue(JSON.stringify(fakeNote));
    const { loadNote } = getModule();
    const result = loadNote('work');
    expect(result.text).toBe('hello');
  });

  test('deleteNote removes file and returns true', () => {
    fs.existsSync = jest.fn().mockReturnValue(true);
    const { deleteNote } = getModule();
    const result = deleteNote('work');
    expect(result).toBe(true);
    expect(fs.unlinkSync).toHaveBeenCalled();
  });

  test('deleteNote returns false when note does not exist', () => {
    fs.existsSync = jest.fn().mockReturnValue(false);
    const { deleteNote } = getModule();
    const result = deleteNote('ghost');
    expect(result).toBe(false);
  });

  test('listNotes returns parsed notes array', () => {
    const fakeNote = { session: 'work', text: 'hi', updatedAt: '2024-01-01T00:00:00.000Z' };
    fs.readdirSync = jest.fn().mockReturnValue(['work.json']);
    fs.readFileSync = jest.fn().mockReturnValue(JSON.stringify(fakeNote));
    const { listNotes } = getModule();
    const notes = listNotes();
    expect(notes).toHaveLength(1);
    expect(notes[0].session).toBe('work');
  });
});
