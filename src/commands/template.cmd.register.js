const { handleTemplateCreate, handleTemplateList, handleTemplateApply, handleTemplateDelete, handleTemplateShow } = require('./template.cmd');

function registerTemplateCommands(program) {
  const template = program
    .command('template')
    .description('Manage reusable tab session templates');

  template
    .command('create <session> <name>')
    .description('Create a template from an existing session')
    .option('-d, --description <desc>', 'Template description')
    .action((session, name, options) => handleTemplateCreate(session, name, options));

  template
    .command('list')
    .description('List all saved templates')
    .action(() => handleTemplateList());

  template
    .command('apply <template> <session>')
    .description('Create a new session from a template')
    .action((templateName, sessionName) => handleTemplateApply(templateName, sessionName));

  template
    .command('delete <name>')
    .description('Delete a template')
    .action((name) => handleTemplateDelete(name));

  template
    .command('show <name>')
    .description('Show template details and tabs')
    .action((name) => handleTemplateShow(name));
}

module.exports = { registerTemplateCommands };
