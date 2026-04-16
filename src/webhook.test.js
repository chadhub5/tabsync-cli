const { getModule } = (() => {
  let mod;
  return {
    getModule: () => {
      if (!mod) mod = require('./webhook');
      return mod;
    }
  };
})();

jest.mock('fs');
const fs = require('fs');

beforeEach(() => {
  fs.existsSync = jest.fn().mockReturnValue(true);
  fs.mkdirSync = jest.fn();
  fs.writeFileSync = jest.fn();
  fs.readFileSync = jest.fn().mockReturnValue(JSON.stringify({
    work: { url: 'https://example.com/hook', events: ['save'], createdAt: '2024-01-01T00:00:00.000Z' }
  }));
});

test('loadWebhooks returns parsed data', () => {
  const { loadWebhooks } = getModule();
  const result = loadWebhooks();
  expect(result).toHaveProperty('work');
  expect(result.work.url).toBe('https://example.com/hook');
});

test('setWebhook writes new entry', () => {
  const { setWebhook } = getModule();
  fs.readFileSync.mockReturnValue(JSON.stringify({}));
  const result = setWebhook('personal', 'https://hook.site/abc', ['save', 'delete']);
  expect(result.url).toBe('https://hook.site/abc');
  expect(fs.writeFileSync).toHaveBeenCalled();
});

test('removeWebhook deletes entry and returns true', () => {
  const { removeWebhook } = getModule();
  const result = removeWebhook('work');
  expect(result).toBe(true);
});

test('removeWebhook returns false for missing session', () => {
  const { removeWebhook } = getModule();
  const result = removeWebhook('nonexistent');
  expect(result).toBe(false);
});

test('getWebhook returns hook or null', () => {
  const { getWebhook } = getModule();
  expect(getWebhook('work')).not.toBeNull();
  expect(getWebhook('missing')).toBeNull();
});

test('findByEvent filters by event', () => {
  const { findByEvent } = getModule();
  const results = findByEvent('save');
  expect(results.length).toBe(1);
  expect(results[0].session).toBe('work');
});
