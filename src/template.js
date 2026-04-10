const fs = require('fs');
const path = require('path');
const { loadSession } = require('./session');

const TEMPLATE_DIR = path.join(process.env.HOME || process.env.USERPROFILE, '.tabsync', 'templates');

function ensureTemplateDir() {
  if (!fs.existsSync(TEMPLATE_DIR)) {
    fs.mkdirSync(TEMPLATE_DIR, { recursive: true });
  }
}

function getTemplatePath(name) {
  return path.join(TEMPLATE_DIR, `${name}.json`);
}

function saveTemplate(name, tabs, description = '') {
  ensureTemplateDir();
  const template = {
    name,
    description,
    tabs,
    createdAt: new Date().toISOString(),
  };
  fs.writeFileSync(getTemplatePath(name), JSON.stringify(template, null, 2));
  return template;
}

function loadTemplate(name) {
  const filePath = getTemplatePath(name);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Template "${name}" not found`);
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function listTemplates() {
  ensureTemplateDir();
  return fs.readdirSync(TEMPLATE_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => {
      const data = JSON.parse(fs.readFileSync(path.join(TEMPLATE_DIR, f), 'utf8'));
      return { name: data.name, description: data.description, tabCount: data.tabs.length, createdAt: data.createdAt };
    });
}

function deleteTemplate(name) {
  const filePath = getTemplatePath(name);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Template "${name}" not found`);
  }
  fs.unlinkSync(filePath);
}

function applyTemplate(name, sessionName) {
  const template = loadTemplate(name);
  const { saveSession } = require('./session');
  return saveSession(sessionName, template.tabs);
}

module.exports = { ensureTemplateDir, saveTemplate, loadTemplate, listTemplates, deleteTemplate, applyTemplate, TEMPLATE_DIR };
