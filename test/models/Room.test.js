// test/models/Room.test.js
const mongoose = require('mongoose');

const Room = require('../../models/Room');

describe('Room Model', () => {
  it('should be a mongoose model', () => {
    expect(typeof Room.modelName).toBe('string');
  });

  it('should have a schema', () => {
    expect(Room.schema).toBeDefined();
  });
});
