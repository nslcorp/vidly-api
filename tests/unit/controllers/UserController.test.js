const UserController = require('../../../controllers/UserController');
const userController = new UserController();

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

let req = null;
let res = null;
let next = null;
beforeEach(() => {
  req = { user: { _id: mongoose.Types.ObjectId().toHexString(), isAdmin: true } };
  res = {};
  next = jest.fn();
});

describe('userController._generateAuthToken', () => {
  it('should generate token', () => {
    userController._generateAuthToken(req, res, next);
    const token = jwt.sign(req.user, config.get('jwtPrivateKey'));

    expect(req.token).toBe(token);
    expect(next).toBeCalled();
  });
});
