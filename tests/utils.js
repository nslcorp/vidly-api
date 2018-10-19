const UserController = require('../controllers/UserController');
const mongoose = require('mongoose');

const userController = new UserController();
const req = { user: { _id: mongoose.Types.ObjectId().toHexString(), isAdmin: true } };
const res = {};
const next = jest.fn();
userController._generateAuthToken(req, res, next);

console.log(req);

module.exports.token = req.token;
