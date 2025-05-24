// test/middlewares/auth.test.js
const authMiddleware = require('@server/middlewares/auth');

describe('authMiddleware', () => {
  it('should have an authentication function', () => {
    expect(typeof authMiddleware.authenticate).toBe('function');
  });

  it('should call next if authentication is successful', () => {
    const req = {
      header: jest.fn().mockReturnValue('Bearer token')
    };
    const res = {};
    const next = jest.fn();
    authMiddleware.authenticate(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
