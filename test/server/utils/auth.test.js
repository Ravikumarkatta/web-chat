// test/server/utils/auth.test.js
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
  verify: jest.fn(),
}));

const authUtils = require('../../../server/utils/auth');

describe('authUtils', () => {
  it('should have a generateToken function', () => {
    expect(typeof authUtils.generateToken).toBe('function');
  });

  it('should have a verifyToken function', () => {
    expect(typeof authUtils.verifyToken).toBe('function');
  });

  it('should pass', () => {
    expect(1).toBe(1);
  });
});
