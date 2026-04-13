const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert/strict');

function getModule(mockFs) {
  const Module = require('module');
  const orig = Module._resolveFilename;
  const mod = require('./rating');
  return mod;
}

describe('rating', () => {
  let rating;
  let store;

  beforeEach(() => {
    store = {};
    const fsMock = {
      existsSync: () => true,
      mkdirSync: () => {},
      readFileSync: () => JSON.stringify(store),
      writeFileSync: (_, data) => { store = JSON.parse(data); },
    };
    jest.mock('fs', () => fsMock);
    jest.resetModules();
    rating = require('./rating');
  });

  it('setRating stores a score for a session', () => {
    store = {};
    const result = rating.setRating('work', 4);
    assert.equal(result.score, 4);
    assert.ok(result.updatedAt);
  });

  it('setRating throws if score out of range', () => {
    assert.throws(() => rating.setRating('work', 6), /between 1 and 5/);
    assert.throws(() => rating.setRating('work', 0), /between 1 and 5/);
  });

  it('getRating returns null for unknown session', () => {
    store = {};
    const result = rating.getRating('unknown');
    assert.equal(result, null);
  });

  it('getRating returns rating for known session', () => {
    store = { dev: { score: 5, updatedAt: '2024-01-01T00:00:00.000Z' } };
    const result = rating.getRating('dev');
    assert.equal(result.score, 5);
  });

  it('removeRating returns false for missing session', () => {
    store = {};
    assert.equal(rating.removeRating('ghost'), false);
  });

  it('removeRating deletes an existing rating', () => {
    store = { dev: { score: 3, updatedAt: '2024-01-01T00:00:00.000Z' } };
    const ok = rating.removeRating('dev');
    assert.equal(ok, true);
  });

  it('getTopRated returns sessions sorted by score descending', () => {
    store = {
      a: { score: 2, updatedAt: '' },
      b: { score: 5, updatedAt: '' },
      c: { score: 3, updatedAt: '' },
    };
    const top = rating.getTopRated(2);
    assert.equal(top[0].name, 'b');
    assert.equal(top[1].name, 'c');
    assert.equal(top.length, 2);
  });
});
