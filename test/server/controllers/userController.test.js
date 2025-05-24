// test/server/controllers/userController.test.js
jest.mock('@server/models/User');
const userController = require('../../../server/controllers/userController');

describe('userController', () => {
  it('should have a getUsers function', () => {
    expect(typeof userController.getUsers).toBe('function');
  });

  it('should have a createUser function', () => {
    expect(typeof userController.createUser).toBe('function');
  });

  it('should call getUsers with request and response', () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnValue({ json: jest.fn() }),
      json: jest.fn()
    };
    userController.getUsers(req, res);
    expect(res.status).toHaveBeenCalled();
  });
});
