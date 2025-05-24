// test/server/controllers/authController.test.js
jest.mock('@server/models/User');
const authController = require('../../../server/controllers/authController');

describe('authController', () => {
  it('should have a register function', () => {
    expect(typeof authController.register).toBe('function');
  });

  it('should have a login function', () => {
    expect(typeof authController.login).toBe('function');
  });

  it('should have a logout function', () => {
    expect(typeof authController.logout).toBe('function');
  });

  it('should call register with request and response', () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnValue({ json: jest.fn() }),
      json: jest.fn()
    };
    authController.register(req, res);
    expect(res.status).toHaveBeenCalled();
  });
});
