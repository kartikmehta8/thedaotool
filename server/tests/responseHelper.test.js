const ResponseHelper = require('../utils/ResponseHelper');

describe('ResponseHelper', () => {
  function mockRes() {
    return {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
  }

  test('success', () => {
    const res = mockRes();
    ResponseHelper.success(res, 'ok');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, message: 'ok' });
  });

  test('created', () => {
    const res = mockRes();
    ResponseHelper.created(res, 'done');
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ success: true, message: 'done' });
  });

  test('error with default code', () => {
    const res = mockRes();
    ResponseHelper.error(res, 'err');
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'err' });
  });
});
