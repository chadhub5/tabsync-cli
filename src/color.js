const fs = require('fs');
const path = require('path');

const COLOR_FILE = path.join(process.env.HOME || '.', '.tabsync', 'colors.json');

function ensureColorFile() {
  const dir = path.dirname(COLOR_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(COLOR_FILE)) fs.writeFileSync(COLOR_FILE, JSON.stringify({}));
}

function loadColors() {
  ensureColorFile();
  return JSON.parse(fs.readFileSync(COLOR_FILE, 'utf8'));
}

function saveColors(colors) {
  ensureColorFile();
  fs.writeFileSync(COLOR_FILE, JSON.stringify(colors, null, 2));
}

const VALID_COLORS = ['red', 'green', 'blue', 'yellow', 'purple', 'orange', 'cyan', 'pink'];

function setColor(sessionName, color) {
  if (!VALID_COLORS.includes(color)) {
    throw new Error(`Invalid color "${color}". Valid colors: ${VALID_COLORS.join(', ')}`);
  }
  const colors = loadColors();
  colors[sessionName] = color;
  saveColors(colors);
  return color;
}

function removeColor(sessionName) {
  const colors = loadColors();
  if (!colors[sessionName]) return false;
  delete colors[sessionName];
  saveColors(colors);
  return true;
}

function getColor(sessionName) {
  const colors = loadColors();
  return colors[sessionName] || null;
}

function listColors() {
  return loadColors();
}

function getValidColors() {
  return [...VALID_COLORS];
}

module.exports = { ensureColorFile, loadColors, saveColors, setColor, removeColor, getColor, listColors, getValidColors };
