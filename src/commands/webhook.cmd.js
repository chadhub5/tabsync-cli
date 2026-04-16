const { setWebhook, removeWebhook, getWebhook, listWebhooks, findByEvent } = require('../webhook');

function handleWebhookSet(sessionName, url, options) {
  const events = options.events ? options.events.split(',').map(e => e.trim()) : ['save', 'delete'];
  const hook = setWebhook(sessionName, url, events);
  console.log(`Webhook set for "${sessionName}": ${hook.url} [${hook.events.join(', ')}]`);
}

function handleWebhookRemove(sessionName) {
  const removed = removeWebhook(sessionName);
  if (removed) {
    console.log(`Webhook removed for "${sessionName}"`);
  } else {
    console.log(`No webhook found for "${sessionName}"`);
  }
}

function handleWebhookGet(sessionName) {
  const hook = getWebhook(sessionName);
  if (!hook) {
    console.log(`No webhook registered for "${sessionName}"`);
    return;
  }
  console.log(`Session: ${sessionName}`);
  console.log(`  URL: ${hook.url}`);
  console.log(`  Events: ${hook.events.join(', ')}`);
  console.log(`  Created: ${hook.createdAt}`);
}

function handleWebhookList() {
  const hooks = listWebhooks();
  const entries = Object.entries(hooks);
  if (!entries.length) {
    console.log('No webhooks registered.');
    return;
  }
  entries.forEach(([session, data]) => {
    console.log(`${session}: ${data.url} [${data.events.join(', ')}]`);
  });
}

function handleWebhookFind(event) {
  const results = findByEvent(event);
  if (!results.length) {
    console.log(`No webhooks listening for event "${event}"`);
    return;
  }
  results.forEach(r => console.log(`${r.session}: ${r.url}`));
}

function registerWebhookCommands(program) {
  const webhook = program.command('webhook').description('Manage session webhooks');
  webhook.command('set <session> <url>').option('--events <events>', 'comma-separated events').action(handleWebhookSet);
  webhook.command('remove <session>').action(handleWebhookRemove);
  webhook.command('get <session>').action(handleWebhookGet);
  webhook.command('list').action(handleWebhookList);
  webhook.command('find <event>').action(handleWebhookFind);
}

module.exports = { handleWebhookSet, handleWebhookRemove, handleWebhookGet, handleWebhookList, handleWebhookFind, registerWebhookCommands };
