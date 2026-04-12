const fs = require('fs');
const path = require('path');

const LABELS_FILE = path.join(process.env.HOME || '.', '.tabsync', 'labels.json');

function ensureLabelsFile() {
  const dir = path.dirname(LABELS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(LABELS_FILE)) fs.writeFileSync(LABELS_FILE, JSON.stringify({}));
}

function loadLabels() {
  ensureLabelsFile();
  return JSON.parse(fs.readFileSync(LABELS_FILE, 'utf8'));
}

function saveLabels(labels) {
  ensureLabelsFile();
  fs.writeFileSync(LABELS_FILE, JSON.stringify(labels, null, 2));
}

function setLabel(sessionName, label) {
  const labels = loadLabels();
  if (!labels[sessionName]) labels[sessionName] = [];
  if (!labels[sessionName].includes(label)) {
    labels[sessionName].push(label);
  }
  saveLabels(labels);
  return labels[sessionName];
}

function removeLabel(sessionName, label) {
  const labels = loadLabels();
  if (!labels[sessionName]) return [];
  labels[sessionName] = labels[sessionName].filter(l => l !== label);
  if (labels[sessionName].length === 0) delete labels[sessionName];
  saveLabels(labels);
  return labels[sessionName] || [];
}

function getLabels(sessionName) {
  const labels = loadLabels();
  return labels[sessionName] || [];
}

function getSessionsByLabel(label) {
  const labels = loadLabels();
  return Object.entries(labels)
    .filter(([, lbls]) => lbls.includes(label))
    .map(([name]) => name);
}

function clearLabels(sessionName) {
  const labels = loadLabels();
  delete labels[sessionName];
  saveLabels(labels);
}

module.exports = { ensureLabelsFile, loadLabels, saveLabels, setLabel, removeLabel, getLabels, getSessionsByLabel, clearLabels };
