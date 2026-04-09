const { addTag, removeTag, getSessionsByTag, getTagsForSession, listAllTags } = require('../tag');

function handleTagAdd(sessionName, tag, opts = {}) {
  try {
    const sessions = addTag(sessionName, tag);
    if (!opts.quiet) console.log(`Tagged '${sessionName}' with '${tag}'. Sessions under '${tag}': ${sessions.join(', ')}`);
    return { success: true, sessions };
  } catch (err) {
    console.error(`Error: ${err.message}`);
    return { success: false, error: err.message };
  }
}

function handleTagRemove(sessionName, tag, opts = {}) {
  try {
    const remaining = removeTag(sessionName, tag);
    if (!opts.quiet) console.log(`Removed tag '${tag}' from '${sessionName}'.`);
    return { success: true, remaining };
  } catch (err) {
    console.error(`Error: ${err.message}`);
    return { success: false, error: err.message };
  }
}

function handleTagList(tag, opts = {}) {
  try {
    if (tag) {
      const sessions = getSessionsByTag(tag);
      if (!opts.quiet) {
        if (sessions.length === 0) console.log(`No sessions tagged '${tag}'.`);
        else console.log(`Sessions tagged '${tag}':\n${sessions.map(s => `  - ${s}`).join('\n')}`);
      }
      return { success: true, sessions };
    } else {
      const tags = listAllTags();
      if (!opts.quiet) {
        if (tags.length === 0) console.log('No tags found.');
        else console.log(`All tags:\n${tags.map(t => `  - ${t}`).join('\n')}`);
      }
      return { success: true, tags };
    }
  } catch (err) {
    console.error(`Error: ${err.message}`);
    return { success: false, error: err.message };
  }
}

function handleTagShow(sessionName, opts = {}) {
  try {
    const tags = getTagsForSession(sessionName);
    if (!opts.quiet) {
      if (tags.length === 0) console.log(`Session '${sessionName}' has no tags.`);
      else console.log(`Tags for '${sessionName}': ${tags.join(', ')}`);
    }
    return { success: true, tags };
  } catch (err) {
    console.error(`Error: ${err.message}`);
    return { success: false, error: err.message };
  }
}

module.exports = { handleTagAdd, handleTagRemove, handleTagList, handleTagShow };
