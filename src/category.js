const fs = require('fs');
const path = require('path');

const CATEGORY_FILE = path.join(process.env.HOME || '.', '.tabsync', 'categories.json');

function ensureCategoryFile() {
  const dir = path.dirname(CATEGORY_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(CATEGORY_FILE)) fs.writeFileSync(CATEGORY_FILE, JSON.stringify({}));
}

function loadCategories() {
  ensureCategoryFile();
  return JSON.parse(fs.readFileSync(CATEGORY_FILE, 'utf8'));
}

function saveCategories(data) {
  ensureCategoryFile();
  fs.writeFileSync(CATEGORY_FILE, JSON.stringify(data, null, 2));
}

function setCategory(sessionName, category) {
  const data = loadCategories();
  data[sessionName] = category;
  saveCategories(data);
  return category;
}

function removeCategory(sessionName) {
  const data = loadCategories();
  if (!data[sessionName]) return false;
  delete data[sessionName];
  saveCategories(data);
  return true;
}

function getCategory(sessionName) {
  const data = loadCategories();
  return data[sessionName] || null;
}

function getSessionsByCategory(category) {
  const data = loadCategories();
  return Object.entries(data)
    .filter(([, cat]) => cat === category)
    .map(([name]) => name);
}

function listCategories() {
  const data = loadCategories();
  const cats = {};
  for (const [session, cat] of Object.entries(data)) {
    if (!cats[cat]) cats[cat] = [];
    cats[cat].push(session);
  }
  return cats;
}

module.exports = {
  ensureCategoryFile,
  loadCategories,
  saveCategories,
  setCategory,
  removeCategory,
  getCategory,
  getSessionsByCategory,
  listCategories
};
