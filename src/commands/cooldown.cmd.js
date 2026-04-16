const { setCooldown, removeCooldown, getCooldown, isCoolingDown, listCooldowns } = require('../cooldown');

function handleCooldownSet(sessionName, seconds) {
  const entry = setCooldown(sessionName, Number(seconds));
  console.log(`Cooldown set for "${sessionName}": ${entry.seconds}s`);
}

function handleCooldownRemove(sessionName) {
  const removed = removeCooldown(sessionName);
  if (removed) {
    console.log(`Cooldown removed for "${sessionName}"`);
  } else {
    console.log(`No cooldown found for "${sessionName}"`);
  }
}

function handleCooldownGet(sessionName) {
  const entry = getCooldown(sessionName);
  if (!entry) {
    console.log(`No cooldown set for "${sessionName}"`);
    return;
  }
  const active = isCoolingDown(sessionName);
  const elapsed = Math.round((Date.now() - entry.setAt) / 1000);
  const remaining = Math.max(0, entry.seconds - elapsed);
  console.log(`${sessionName}: ${entry.seconds}s total, ${remaining}s remaining [${active ? 'active' : 'expired'}]`);
}

function handleCooldownList() {
  const list = listCooldowns();
  if (!list.length) {
    console.log('No cooldowns configured.');
    return;
  }
  list.forEach(e => {
    const status = e.active ? `${e.remaining}s remaining` : 'expired';
    console.log(`  ${e.name}: ${e.seconds}s [${status}]`);
  });
}

function registerCooldownCommands(program) {
  const cmd = program.command('cooldown').description('Manage session cooldowns');
  cmd.command('set <session> <seconds>').description('Set a cooldown for a session').action(handleCooldownSet);
  cmd.command('remove <session>').description('Remove a cooldown').action(handleCooldownRemove);
  cmd.command('get <session>').description('Get cooldown info').action(handleCooldownGet);
  cmd.command('list').description('List all cooldowns').action(handleCooldownList);
}

module.exports = { handleCooldownSet, handleCooldownRemove, handleCooldownGet, handleCooldownList, registerCooldownCommands };
