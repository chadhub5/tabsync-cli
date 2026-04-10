const { loadSession, saveSession } = require('./session');

/**
 * Duplicate an existing session under a new name.
 * Optionally append a suffix to all tab titles.
 */
async function duplicateSession(sourceName, destName, options = {}) {
  const { titleSuffix = '' } = options;

  const source = await loadSession(sourceName);
  if (!source) {
    throw new Error(`Session "${sourceName}" not found.`);
  }

  const tabs = source.tabs.map((tab) => ({
    ...tab,
    title: titleSuffix ? `${tab.title}${titleSuffix}` : tab.title,
  }));

  const duplicate = {
    name: destName,
    createdAt: new Date().toISOString(),
    copiedFrom: sourceName,
    tabs,
  };

  await saveSession(destName, duplicate);
  return duplicate;
}

/**
 * Clone a session with an auto-generated name based on the source.
 */
async function cloneSession(sourceName, options = {}) {
  const timestamp = Date.now();
  const destName = options.destName || `${sourceName}-copy-${timestamp}`;
  return duplicateSession(sourceName, destName, options);
}

module.exports = { duplicateSession, cloneSession };
