const { setLimit, getLimits, getUsage, updateUsage, checkQuota, removeLimit } = require('../quota');

function handleQuotaSet(resource, limit, opts) {
  const parsed = parseInt(limit, 10);
  if (isNaN(parsed) || parsed < 0) {
    console.error('Limit must be a non-negative integer');
    process.exit(1);
  }
  setLimit(resource, parsed);
  console.log(`Quota set: ${resource} = ${parsed}`);
}

function handleQuotaRemove(resource) {
  removeLimit(resource);
  console.log(`Quota removed for: ${resource}`);
}

function handleQuotaList() {
  const limits = getLimits();
  const usage = getUsage();
  const resources = Object.keys(limits);
  if (resources.length === 0) {
    console.log('No quotas configured.');
    return;
  }
  resources.forEach(r => {
    const used = usage[r] || 0;
    const limit = limits[r];
    const pct = Math.round((used / limit) * 100);
    console.log(`${r}: ${used}/${limit} (${pct}%)`);
  });
}

function handleQuotaCheck(resource, amount) {
  const requested = amount ? parseInt(amount, 10) : 1;
  const result = checkQuota(resource, requested);
  if (result.limit === null) {
    console.log(`${resource}: no limit set`);
    return;
  }
  const status = result.allowed ? 'ALLOWED' : 'DENIED';
  console.log(`${resource}: ${status} (usage: ${result.usage}/${result.limit}, remaining: ${result.remaining})`);
}

function handleQuotaUpdate(resource, count) {
  const parsed = parseInt(count, 10);
  if (isNaN(parsed)) { console.error('Count must be an integer'); process.exit(1); }
  updateUsage(resource, parsed);
  console.log(`Usage updated: ${resource} = ${parsed}`);
}

function registerQuotaCommands(program) {
  const quota = program.command('quota').description('Manage resource quotas');
  quota.command('set <resource> <limit>').description('Set quota limit for a resource').action(handleQuotaSet);
  quota.command('remove <resource>').description('Remove quota for a resource').action(handleQuotaRemove);
  quota.command('list').description('List all quotas and usage').action(handleQuotaList);
  quota.command('check <resource> [amount]').description('Check if quota allows usage').action(handleQuotaCheck);
  quota.command('update <resource> <count>').description('Update usage count for a resource').action(handleQuotaUpdate);
}

module.exports = { handleQuotaSet, handleQuotaRemove, handleQuotaList, handleQuotaCheck, handleQuotaUpdate, registerQuotaCommands };
