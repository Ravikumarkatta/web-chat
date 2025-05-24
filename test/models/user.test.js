// test/models/user.test.js
const mongoose = require('mongoose');
jest.mock('mongoose', () => ({
  Schema: jest.fn().mockImplementation(() => ({
    pre: jest.fn(),
    methods: {
      matchPassword: jest.fn(),
      getSignedJwtToken: jest.fn()
    }
  })),
  model: jest.fn((name, schema) => {
    if (name === 'User') {
      return {
        modelName: 'User',
        schema: schema,
        create: jest.fn(),
        findOne: jest.fn(),
        findById: jest.fn(),
      };
    }
    return jest.fn();
  }),
  Types: {
    ObjectId: jest.fn()
  }
}));

const User = require('../../models/User');

describe('User Model', () => {
  it('should be a mongoose model', () => {
    expect(typeof User.modelName).toBe('string');
  });

  it('should have a schema', () => {
    expect(User.schema).toBeDefined();
  });
});
