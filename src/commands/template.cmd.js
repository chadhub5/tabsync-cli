const { saveTemplate, loadTemplate, listTemplates, deleteTemplate, applyTemplate } = require('../template');
const { loadSession } = require('../session');

async function handleTemplateCreate(sessionName, templateName, options = {}) {
  const session = loadSession(sessionName);
  if (!session) {
    console.error(`Session "${sessionName}" not found`);
    process.exit(1);
  }
  const tpl = saveTemplate(templateName, session.tabs, options.description || '');
  console.log(`Template "${tpl.name}" created with ${tpl.tabs.length} tab(s)`);
}

async function handleTemplateList() {
  const templates = listTemplates();
  if (templates.length === 0) {
    console.log('No templates saved.');
    return;
  }
  templates.forEach(t => {
    const desc = t.description ? ` — ${t.description}` : '';
    console.log(`  ${t.name} (${t.tabCount} tabs)${desc}`);
  });
}

async function handleTemplateApply(templateName, sessionName) {
  try {
    const session = applyTemplate(templateName, sessionName);
    console.log(`Session "${sessionName}" created from template "${templateName}" with ${session.tabs.length} tab(s)`);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}

async function handleTemplateDelete(templateName) {
  try {
    deleteTemplate(templateName);
    console.log(`Template "${templateName}" deleted`);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}

async function handleTemplateShow(templateName) {
  try {
    const tpl = loadTemplate(templateName);
    console.log(`Template: ${tpl.name}`);
    if (tpl.description) console.log(`Description: ${tpl.description}`);
    console.log(`Created: ${tpl.createdAt}`);
    tpl.tabs.forEach((tab, i) => console.log(`  [${i + 1}] ${tab.title || tab.url}`));
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}

module.exports = { handleTemplateCreate, handleTemplateList, handleTemplateApply, handleTemplateDelete, handleTemplateShow };
