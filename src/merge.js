const { loadSession, saveSession } = require('./session');

/**
 * Merge two sessions by combining their tabs.
 * Duplicate URLs are removed based on strategy.
 */
function mergeSessions(base, incoming, strategy = 'union') {
  if (!base || !Array.isArray(base.tabs)) throw new Error('Invalid base session');
  if (!incoming || !Array.isArray(incoming.tabs)) throw new Error('Invalid incoming session');

  let tabs;
  if (strategy === 'union') {
    const seen = new Set(base.tabs.map(t => t.url));
    const extra = incoming.tabs.filter(t => !seen.has(t.url));
    tabs = [...base.tabs, ...extra];
  } else if (strategy === 'replace') {
    tabs = [...incoming.tabs];
  } else if (strategy === 'intersect') {
    const incomingUrls = new Set(incoming.tabs.map(t => t.url));
    tabs = base.tabs.filter(t => incomingUrls.has(t.url));
  } else {
    throw new Error(`Unknown merge strategy: ${strategy}`);
  }

  return {
    name: base.name,
    tabs,
    createdAt: base.createdAt,
    updatedAt: new Date().toISOString(),
    mergedFrom: incoming.name || null,
  };
}

async function mergeSessionFiles(baseName, incomingName, strategy = 'union') {
  const base = await loadSession(baseName);
  const incoming = await loadSession(incomingName);
  const merged = mergeSessions(base, incoming, strategy);
  await saveSession(baseName, merged);
  return merged;
}

module.exports = { mergeSessions, mergeSessionFiles };
