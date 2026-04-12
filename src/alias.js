const fs = require('fs');
const path = require('path');

const ALIAS_FILE = path.join(process.env.HOME || '.', '.tabsync', 'aliases.json');

function ensureAliasFile() {
  const dir = path.dirname(ALIAS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(ALIAS_FILE)) fs.writeFileSync(ALIAS_FILE, '{}', 'utf8');
}

function loadAliases() {
  ensureAliasFile();
  const raw = fs.readFileSync(ALIAS_FILE, 'utf8');
  return JSON.parse(raw);
}

function saveAliases(aliases) {
  ensureAliasFile();
  fs.writeFileSync(ALIAS_FILE, JSON.stringify(aliases, null, 2), 'utf8');
}

function setAlias(alias, sessionName) {
  if (!alias || !sessionName) throw new Error('Alias and session name are required');
  const aliases = loadAliases();
  aliases[alias] = sessionName;
  saveAliases(aliases);
  return aliases[alias];
}

function removeAlias(alias) {
  const aliases = loadAliases();
  if (!aliases[alias]) throw new Error(`Alias '${alias}' not found`);
  delete aliases[alias];
  saveAliases(aliases);
  return alias;
}

function resolveAlias(alias) {
  const aliases = loadAliases();
  return aliases[alias] || null;
}

function listAliases() {
  return loadAliases();
}

module.exports = { ensureAliasFile, loadAliases, saveAliases, setAlias, removeAlias, resolveAlias, listAliases };
