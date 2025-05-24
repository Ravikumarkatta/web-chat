// test/models/message.test.js
const mongoose = require('mongoose');

const Message = require('../../models/message');

describe('Message Model', () => {
  it('should be a mongoose model', () => {
    expect(typeof Message.modelName).toBe('string');
  });

  it('should have a schema', () => {
    expect(Message.schema).toBeDefined();
  });
});
