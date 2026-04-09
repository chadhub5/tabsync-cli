const { exportSession, importSession } = require('../export');
const { saveSession } = require('../session');

/**
 * CLI handler for: tabsync export <sessionName> <outputFile>
 */
function handleExport(args) {
  const [sessionName, outputFile] = args;

  if (!sessionName || !outputFile) {
    console.error('Usage: tabsync export <sessionName> <outputFile>');
    process.exit(1);
  }

  try {
    const savedPath = exportSession(sessionName, outputFile);
    console.log(`✓ Session "${sessionName}" exported to ${savedPath}`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

/**
 * CLI handler for: tabsync import <filePath> [--name <newName>]
 */
function handleImport(args) {
  const filePath = args[0];
  const nameFlag = args.indexOf('--name');
  const customName = nameFlag !== -1 ? args[nameFlag + 1] : null;

  if (!filePath) {
    console.error('Usage: tabsync import <filePath> [--name <newName>]');
    process.exit(1);
  }

  try {
    const session = importSession(filePath);

    if (customName) {
      session.name = customName;
    }

    saveSession(session);
    console.log(`✓ Session "${session.name}" imported successfully.`);
    console.log(`  ${session.tabs.length} tab(s) restored.`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

module.exports = { handleExport, handleImport };
