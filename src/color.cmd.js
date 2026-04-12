const { loadColors, saveColors, setColor, removeColor } = require('./color');

async function handleColorSet(sessionName, color, options) {
  try {
    await setColor(sessionName, color);
    console.log(`Color '${color}' assigned to session '${sessionName}'.`);
  } catch (err) {
    console.error(`Failed to set color: ${err.message}`);
    process.exit(1);
  }
}

async function handleColorRemove(sessionName, options) {
  try {
    await removeColor(sessionName);
    console.log(`Color removed from session '${sessionName}'.`);
  } catch (err) {
    console.error(`Failed to remove color: ${err.message}`);
    process.exit(1);
  }
}

async function handleColorList(options) {
  try {
    const colors = await loadColors();
    const entries = Object.entries(colors);
    if (entries.length === 0) {
      console.log('No colors assigned.');
      return;
    }
    entries.forEach(([session, color]) => {
      console.log(`  ${session}: ${color}`);
    });
  } catch (err) {
    console.error(`Failed to list colors: ${err.message}`);
    process.exit(1);
  }
}

async function handleColorGet(sessionName, options) {
  try {
    const colors = await loadColors();
    const color = colors[sessionName];
    if (!color) {
      console.log(`No color assigned to session '${sessionName}'.`);
    } else {
      console.log(`${sessionName}: ${color}`);
    }
  } catch (err) {
    console.error(`Failed to get color: ${err.message}`);
    process.exit(1);
  }
}

function registerColorCommands(program) {
  const color = program.command('color').description('Manage session colors');

  color
    .command('set <session> <color>')
    .description('Assign a color to a session')
    .action(handleColorSet);

  color
    .command('remove <session>')
    .description('Remove color from a session')
    .action(handleColorRemove);

  color
    .command('list')
    .description('List all session colors')
    .action(handleColorList);

  color
    .command('get <session>')
    .description('Get color for a specific session')
    .action(handleColorGet);
}

module.exports = { handleColorSet, handleColorRemove, handleColorList, handleColorGet, registerColorCommands };
