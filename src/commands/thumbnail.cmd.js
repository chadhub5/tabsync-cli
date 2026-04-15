const { loadSession } = require('../session');
const {
  saveThumbnail,
  loadThumbnail,
  deleteThumbnail,
  listThumbnails,
  generateThumbnail
} = require('../thumbnail');

function handleThumbnailGenerate(sessionName) {
  const session = loadSession(sessionName);
  if (!session) {
    console.error(`Session "${sessionName}" not found.`);
    process.exit(1);
  }
  const data = generateThumbnail(session);
  const thumbnail = saveThumbnail(sessionName, data);
  console.log(`Thumbnail generated for "${sessionName}": ${thumbnail.tabCount} tabs, domains: ${thumbnail.topDomains.join(', ') || 'none'}`);
}

function handleThumbnailShow(sessionName) {
  const thumbnail = loadThumbnail(sessionName);
  if (!thumbnail) {
    console.error(`No thumbnail found for "${sessionName}".`);
    process.exit(1);
  }
  console.log(`Session: ${thumbnail.sessionName}`);
  console.log(`Tabs: ${thumbnail.tabCount}`);
  console.log(`Preview: ${thumbnail.preview || '(none)'}`);
  console.log(`Top domains: ${thumbnail.topDomains.join(', ') || 'none'}`);
  console.log(`Updated: ${thumbnail.updatedAt}`);
}

function handleThumbnailDelete(sessionName) {
  const removed = deleteThumbnail(sessionName);
  if (removed) {
    console.log(`Thumbnail for "${sessionName}" deleted.`);
  } else {
    console.error(`No thumbnail found for "${sessionName}".`);
    process.exit(1);
  }
}

function handleThumbnailList() {
  const thumbnails = listThumbnails();
  if (thumbnails.length === 0) {
    console.log('No thumbnails stored.');
    return;
  }
  thumbnails.forEach(t => {
    console.log(`  ${t.sessionName} — ${t.tabCount} tabs — ${t.topDomains.slice(0, 3).join(', ') || 'no domains'}`);
  });
}

function registerThumbnailCommands(program) {
  const thumb = program.command('thumbnail').description('Manage session thumbnails');
  thumb.command('generate <session>').description('Generate thumbnail for a session').action(handleThumbnailGenerate);
  thumb.command('show <session>').description('Show thumbnail for a session').action(handleThumbnailShow);
  thumb.command('delete <session>').description('Delete thumbnail for a session').action(handleThumbnailDelete);
  thumb.command('list').description('List all thumbnails').action(handleThumbnailList);
}

module.exports = { handleThumbnailGenerate, handleThumbnailShow, handleThumbnailDelete, handleThumbnailList, registerThumbnailCommands };
