const { setHotkey, removeHotkey, resolveHotkey, listHotkeys } = require('../hotkey');

function handleHotkeySet(key, sessionName) {
  try {
    setHotkey(key, sessionName);
    console.log(`Hotkey "${key}" mapped to session "${sessionName}"`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
  }
}

function handleHotkeyRemove(key) {
  const removed = removeHotkey(key);
  if (removed) {
    console.log(`Hotkey "${key}" removed (was "${removed}")`);
  } else {
    console.log(`No hotkey found for key "${key}"`);
  }
}

function handleHotkeyResolve(key) {
  const session = resolveHotkey(key);
  if (session) {
    console.log(`${key} -> ${session}`);
  } else {
    console.log(`No session mapped to "${key}"`);
  }
}

function handleHotkeyList() {
  const hotkeys = listHotkeys();
  const entries = Object.entries(hotkeys);
  if (entries.length === 0) {
    console.log('No hotkeys defined.');
    return;
  }
  entries.forEach(([key, session]) => console.log(`${key}  ->  ${session}`));
}

function registerHotkeyCommands(program) {
  const cmd = program.command('hotkey').description('Manage session hotkeys');

  cmd
    .command('set <key> <session>')
    .description('Map a hotkey to a session')
    .action(handleHotkeySet);

  cmd
    .command('remove <key>')
    .description('Remove a hotkey mapping')
    .action(handleHotkeyRemove);

  cmd
    .command('resolve <key>')
    .description('Show which session a hotkey points to')
    .action(handleHotkeyResolve);

  cmd
    .command('list')
    .description('List all hotkey mappings')
    .action(handleHotkeyList);
}

module.exports = { handleHotkeySet, handleHotkeyRemove, handleHotkeyResolve, handleHotkeyList, registerHotkeyCommands };
