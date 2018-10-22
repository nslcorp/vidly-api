const { getToken } = require('../../utils');

const BaseController = require('../../../controllers/BaseController');
const baseController = new BaseController();

describe('BaseController.auth', () => {
  it('should parse user from token and define it in req.user', () => {
    const token = getToken();
    const req = { header: jest.fn().mockReturnValue(token) };
    const res = {};
    const next = jest.fn();

    baseController.auth(req, res, next);

    expect(next).toBeCalled();
    expect(req.user).toBeDefined();
  });
});
