const { addDependency, removeDependency, getDependencies, getDependents, clearDependencies } = require('../dependency');

function handleDepAdd(sessionId, dependsOnId) {
  if (!sessionId || !dependsOnId) {
    console.error('Usage: dependency add <sessionId> <dependsOnId>');
    return;
  }
  const result = addDependency(sessionId, dependsOnId);
  console.log(`Session "${sessionId}" now depends on: ${result.join(', ')}`);
}

function handleDepRemove(sessionId, dependsOnId) {
  if (!sessionId || !dependsOnId) {
    console.error('Usage: dependency remove <sessionId> <dependsOnId>');
    return;
  }
  const result = removeDependency(sessionId, dependsOnId);
  console.log(`Updated dependencies for "${sessionId}": ${result.length ? result.join(', ') : '(none)'}`);
}

function handleDepList(sessionId) {
  if (!sessionId) {
    console.error('Usage: dependency list <sessionId>');
    return;
  }
  const deps = getDependencies(sessionId);
  if (deps.length === 0) {
    console.log(`No dependencies for "${sessionId}".`);
  } else {
    console.log(`Dependencies of "${sessionId}":`);
    deps.forEach(d => console.log(`  - ${d}`));
  }
}

function handleDepDependents(sessionId) {
  if (!sessionId) {
    console.error('Usage: dependency dependents <sessionId>');
    return;
  }
  const dependents = getDependents(sessionId);
  if (dependents.length === 0) {
    console.log(`No sessions depend on "${sessionId}".`);
  } else {
    console.log(`Sessions depending on "${sessionId}":`);
    dependents.forEach(d => console.log(`  - ${d}`));
  }
}

function handleDepClear(sessionId) {
  if (!sessionId) {
    console.error('Usage: dependency clear <sessionId>');
    return;
  }
  clearDependencies(sessionId);
  console.log(`Cleared all dependencies for "${sessionId}".`);
}

function registerDependencyCommands(program) {
  const dep = program.command('dependency').description('Manage session dependencies');
  dep.command('add <sessionId> <dependsOnId>').description('Add a dependency').action(handleDepAdd);
  dep.command('remove <sessionId> <dependsOnId>').description('Remove a dependency').action(handleDepRemove);
  dep.command('list <sessionId>').description('List dependencies of a session').action(handleDepList);
  dep.command('dependents <sessionId>').description('List sessions that depend on a session').action(handleDepDependents);
  dep.command('clear <sessionId>').description('Clear all dependencies for a session').action(handleDepClear);
}

module.exports = { handleDepAdd, handleDepRemove, handleDepList, handleDepDependents, handleDepClear, registerDependencyCommands };
