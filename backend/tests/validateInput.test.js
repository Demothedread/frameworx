const test = require('node:test');
const assert = require('node:assert/strict');

const validateInput = require('../middleware/validateInput');

function createResponseDouble() {
  return {
    statusCode: null,
    payload: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.payload = payload;
      return this;
    }
  };
}

test('validateInput rejects missing required values including whitespace-only strings', async () => {
  const middleware = validateInput({
    prompt: { required: true }
  });
  const res = createResponseDouble();

  let nextCalled = false;
  middleware({ body: { prompt: '   ' } }, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, false);
  assert.equal(res.statusCode, 400);
  assert.deepEqual(res.payload, { error: 'prompt is required' });
});

test('validateInput rejects strings longer than maxLen', async () => {
  const middleware = validateInput({
    prompt: { required: true, maxLen: 5 }
  });
  const res = createResponseDouble();

  let nextCalled = false;
  middleware({ body: { prompt: '123456' } }, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, false);
  assert.equal(res.statusCode, 400);
  assert.deepEqual(res.payload, { error: 'prompt exceeds maximum length of 5' });
});

test('validateInput calls next for valid values', async () => {
  const middleware = validateInput({
    prompt: { required: true, maxLen: 5 }
  });
  const res = createResponseDouble();

  let nextCalled = false;
  middleware({ body: { prompt: 'valid' } }, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, true);
  assert.equal(res.statusCode, null);
  assert.equal(res.payload, null);
});
