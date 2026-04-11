const { loadSession } = require('./session');

/**
 * Compare two sessions and return a diff summary
 * @param {string} nameA
 * @param {string} nameB
 * @returns {{ added: string[], removed: string[], common: string[], summary: object }}
 */
function diffSessions(nameA, nameB) {
  const sessionA = loadSession(nameA);
  const sessionB = loadSession(nameB);

  if (!sessionA) throw new Error(`Session not found: ${nameA}`);
  if (!sessionB) throw new Error(`Session not found: ${nameB}`);

  const urlsA = new Set(sessionA.tabs.map(t => t.url));
  const urlsB = new Set(sessionB.tabs.map(t => t.url));

  const added = [...urlsB].filter(url => !urlsA.has(url));
  const removed = [...urlsA].filter(url => !urlsB.has(url));
  const common = [...urlsA].filter(url => urlsB.has(url));

  return {
    added,
    removed,
    common,
    summary: {
      sessionA: nameA,
      sessionB: nameB,
      tabsA: sessionA.tabs.length,
      tabsB: sessionB.tabs.length,
      addedCount: added.length,
      removedCount: removed.length,
      commonCount: common.length,
    },
  };
}

/**
 * Format a diff result as a human-readable string
 */
function formatDiff(diff) {
  const lines = [];
  lines.push(`Comparing "${diff.summary.sessionA}" → "${diff.summary.sessionB}"`);
  lines.push(`  Common tabs : ${diff.summary.commonCount}`);
  lines.push(`  Added (+)   : ${diff.summary.addedCount}`);
  lines.push(`  Removed (-) : ${diff.summary.removedCount}`);

  if (diff.added.length) {
    lines.push('\nAdded:');
    diff.added.forEach(url => lines.push(`  + ${url}`));
  }
  if (diff.removed.length) {
    lines.push('\nRemoved:');
    diff.removed.forEach(url => lines.push(`  - ${url}`));
  }

  return lines.join('\n');
}

module.exports = { diffSessions, formatDiff };
