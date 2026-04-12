const fs = require('fs');
const path = require('path');

function getModule() {
  jest.resetModules();
  const tmpDir = fs.mkdtempSync('/tmp/tabsync-label-');
  process.env.HOME = tmpDir;
  return require('./label');
}

describe('label', () => {
  test('setLabel adds a label to a session', () => {
    const { setLabel, getLabels } = getModule();
    setLabel('work', 'important');
    expect(getLabels('work')).toContain('important');
  });

  test('setLabel does not duplicate labels', () => {
    const { setLabel, getLabels } = getModule();
    setLabel('work', 'important');
    setLabel('work', 'important');
    expect(getLabels('work').filter(l => l === 'important').length).toBe(1);
  });

  test('removeLabel removes a specific label', () => {
    const { setLabel, removeLabel, getLabels } = getModule();
    setLabel('work', 'important');
    setLabel('work', 'urgent');
    removeLabel('work', 'important');
    expect(getLabels('work')).not.toContain('important');
    expect(getLabels('work')).toContain('urgent');
  });

  test('getLabels returns empty array for unknown session', () => {
    const { getLabels } = getModule();
    expect(getLabels('nonexistent')).toEqual([]);
  });

  test('getSessionsByLabel returns matching sessions', () => {
    const { setLabel, getSessionsByLabel } = getModule();
    setLabel('work', 'dev');
    setLabel('research', 'dev');
    setLabel('personal', 'fun');
    const sessions = getSessionsByLabel('dev');
    expect(sessions).toContain('work');
    expect(sessions).toContain('research');
    expect(sessions).not.toContain('personal');
  });

  test('clearLabels removes all labels for a session', () => {
    const { setLabel, clearLabels, getLabels } = getModule();
    setLabel('work', 'important');
    clearLabels('work');
    expect(getLabels('work')).toEqual([]);
  });
});
