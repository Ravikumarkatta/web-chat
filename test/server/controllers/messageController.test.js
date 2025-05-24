// test/server/controllers/messageController.test.js
jest.mock('@server/models/Message');
const messageController = require('../../../server/controllers/messageController');

describe('messageController', () => {
  it('should have a getMessages function', () => {
    expect(typeof messageController.getMessages).toBe('function');
  });

  it('should have a createMessage function', () => {
    expect(typeof messageController.createMessage).toBe('function');
  });

  it('should call getMessages with request and response', () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnValue({ json: jest.fn() }),
      json: jest.fn()
    };
    messageController.getMessages(req, res);
    expect(res.status).toHaveBeenCalled();
  });
});
