const { loadSession, saveSession } = require('./session');

/**
 * Duplicate an existing session under a new name.
 * Optionally override the title of each tab.
 */
async function duplicateSession(sourceName, destName, options = {}) {
  if (!sourceName || !destName) {
    throw new Error('sourceName and destName are required');
  }

  const source = await loadSession(sourceName);
  if (!source) {
    throw new Error(`Session "${sourceName}" not found`);
  }

  const tabs = source.tabs.map((tab) => ({
    ...tab,
    ...(options.titlePrefix ? { title: `${options.titlePrefix} ${tab.title}` } : {}),
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
 * Duplicate a session and append a numeric suffix if destName already exists.
 */
async function safeDuplicate(sourceName, destName, { listSessions, ...options } = {}) {
  const sessions = listSessions ? await listSessions() : [];
  const existing = new Set(sessions.map((s) => s.name || s));

  let finalName = destName;
  let counter = 1;
  while (existing.has(finalName)) {
    finalName = `${destName}-${counter}`;
    counter++;
  }

  return duplicateSession(sourceName, finalName, options);
}

module.exports = { duplicateSession, safeDuplicate };
