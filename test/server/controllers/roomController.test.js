// test/server/controllers/roomController.test.js
jest.mock('@server/models/Room');
const roomController = require('../../../server/controllers/roomController');

describe('roomController', () => {
  it('should have a getRooms function', () => {
    expect(typeof roomController.getRooms).toBe('function');
  });

  it('should have a createRoom function', () => {
    expect(typeof roomController.createRoom).toBe('function');
  });

  it('should call getRooms with request and response', () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnValue({ json: jest.fn() }),
      json: jest.fn()
    };
    roomController.getRooms(req, res);
    expect(res.status).toHaveBeenCalled();
  });
});
