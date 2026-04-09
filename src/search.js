const { loadTagIndex } = require('./tag');
const { listSessions, loadSession } = require('./session');

async function searchByTitle(query, options = {}) {
  const sessions = await listSessions();
  const results = [];

  for (const name of sessions) {
    const session = await loadSession(name);
    if (!session) continue;

    const titleMatch = session.tabs.some(tab =>
      tab.title && tab.title.toLowerCase().includes(query.toLowerCase())
    );

    if (titleMatch) {
      results.push({ name, session });
    }
  }

  return results;
}

async function searchByUrl(query, options = {}) {
  const sessions = await listSessions();
  const results = [];

  for (const name of sessions) {
    const session = await loadSession(name);
    if (!session) continue;

    const urlMatch = session.tabs.some(tab =>
      tab.url && tab.url.toLowerCase().includes(query.toLowerCase())
    );

    if (urlMatch) {
      results.push({ name, session });
    }
  }

  return results;
}

async function searchByTag(tag) {
  const index = await loadTagIndex();
  const sessionNames = index[tag] || [];
  const results = [];

  for (const name of sessionNames) {
    const session = await loadSession(name);
    if (session) {
      results.push({ name, session });
    }
  }

  return results;
}

async function searchAll(query) {
  const byTitle = await searchByTitle(query);
  const byUrl = await searchByUrl(query);

  const seen = new Set();
  const combined = [];

  for (const result of [...byTitle, ...byUrl]) {
    if (!seen.has(result.name)) {
      seen.add(result.name);
      combined.push(result);
    }
  }

  return combined;
}

module.exports = { searchByTitle, searchByUrl, searchByTag, searchAll };
