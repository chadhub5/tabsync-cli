const { createSnapshot, loadSnapshot, listSnapshots, deleteSnapshot } = require('../snapshot');
const { loadSession } = require('../session');

function handleSnapshotCreate(sessionName, options = {}) {
  try {
    const session = loadSession(sessionName);
    if (!session) {
      console.error(`Session not found: ${sessionName}`);
      process.exit(1);
    }
    const snap = createSnapshot(sessionName, session.tabs, options.label);
    console.log(`Snapshot created: ${snap.id}`);
    console.log(`  Session : ${snap.sessionName}`);
    console.log(`  Label   : ${snap.label}`);
    console.log(`  Tabs    : ${snap.tabs.length}`);
    console.log(`  Created : ${snap.createdAt}`);
  } catch (err) {
    console.error(`Error creating snapshot: ${err.message}`);
    process.exit(1);
  }
}

function handleSnapshotList(sessionName = null) {
  try {
    const snaps = listSnapshots(sessionName);
    if (snaps.length === 0) {
      console.log('No snapshots found.');
      return;
    }
    snaps.forEach(s => {
      console.log(`[${s.id}] ${s.label} (${s.sessionName}) — ${s.tabs.length} tabs — ${s.createdAt}`);
    });
  } catch (err) {
    console.error(`Error listing snapshots: ${err.message}`);
    process.exit(1);
  }
}

function handleSnapshotRestore(snapshotId) {
  try {
    const snap = loadSnapshot(snapshotId);
    console.log(`Restoring snapshot: ${snap.id}`);
    snap.tabs.forEach((tab, i) => {
      console.log(`  ${i + 1}. ${tab.title || tab.url} — ${tab.url}`);
    });
    console.log(`Snapshot ${snap.id} restored to session "${snap.sessionName}".`);
  } catch (err) {
    console.error(`Error restoring snapshot: ${err.message}`);
    process.exit(1);
  }
}

function handleSnapshotDelete(snapshotId) {
  try {
    deleteSnapshot(snapshotId);
    console.log(`Snapshot deleted: ${snapshotId}`);
  } catch (err) {
    console.error(`Error deleting snapshot: ${err.message}`);
    process.exit(1);
  }
}

module.exports = {
  handleSnapshotCreate,
  handleSnapshotList,
  handleSnapshotRestore,
  handleSnapshotDelete,
};
