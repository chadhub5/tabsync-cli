const { saveWorkspace, loadWorkspace, deleteWorkspace, listWorkspaces, switchWorkspace } = require('./workspace');

async function handleWorkspaceSave(name, sessions, opts = {}) {
  if (!name) throw new Error('Workspace name is required');
  if (!Array.isArray(sessions) || sessions.length === 0) throw new Error('At least one session is required');
  const ws = await saveWorkspace(name, sessions, opts);
  return { success: true, workspace: ws };
}

async function handleWorkspaceLoad(name) {
  if (!name) throw new Error('Workspace name is required');
  const ws = await loadWorkspace(name);
  if (!ws) throw new Error(`Workspace '${name}' not found`);
  return ws;
}

async function handleWorkspaceDelete(name) {
  if (!name) throw new Error('Workspace name is required');
  await deleteWorkspace(name);
  return { success: true, deleted: name };
}

async function handleWorkspaceList() {
  const workspaces = await listWorkspaces();
  return workspaces;
}

async function handleWorkspaceSwitch(name) {
  if (!name) throw new Error('Workspace name is required');
  const ws = await switchWorkspace(name);
  return { success: true, active: ws };
}

function registerWorkspaceCommands(program) {
  const ws = program.command('workspace').description('Manage workspaces');

  ws.command('save <name> [sessions...]')
    .description('Save a workspace with given sessions')
    .option('--description <desc>', 'Workspace description')
    .action(async (name, sessions, opts) => {
      const result = await handleWorkspaceSave(name, sessions, opts);
      console.log(`Workspace '${result.workspace.name}' saved with ${sessions.length} session(s).`);
    });

  ws.command('load <name>')
    .description('Load a workspace by name')
    .action(async (name) => {
      const result = await handleWorkspaceLoad(name);
      console.log(JSON.stringify(result, null, 2));
    });

  ws.command('delete <name>')
    .description('Delete a workspace')
    .action(async (name) => {
      await handleWorkspaceDelete(name);
      console.log(`Workspace '${name}' deleted.`);
    });

  ws.command('list')
    .description('List all workspaces')
    .action(async () => {
      const list = await handleWorkspaceList();
      if (list.length === 0) return console.log('No workspaces found.');
      list.forEach(w => console.log(`- ${w.name} (${w.sessions.length} sessions)`));
    });

  ws.command('switch <name>')
    .description('Switch to a workspace')
    .action(async (name) => {
      const result = await handleWorkspaceSwitch(name);
      console.log(`Switched to workspace '${result.active.name}'.`);
    });
}

module.exports = { handleWorkspaceSave, handleWorkspaceLoad, handleWorkspaceDelete, handleWorkspaceList, handleWorkspaceSwitch, registerWorkspaceCommands };
