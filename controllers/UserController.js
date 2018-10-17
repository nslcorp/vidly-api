const _ = require('lodash');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const Joi = require('joi');

const { User, validate } = require('../models/user');
const BaseController = require('./BaseController');

class UserController extends BaseController {
  constructor() {
    super();

    this.getAll = [this._getAll, this.sendResponse];

    this.getMe = [this.auth, this._selectUserData, this.sendResponse];

    this.create = [
      this._validateBody,
      this._checkUser,
      this._createUser,
      this._generateAuthToken,
      this._setHeadersAndSend
    ];

    this.auth = [
      this._validateAuth,
      this._findByEmail,
      this._checkPassword,
      this._generateAuthToken,
      this._setToken,
      this.sendResponse
    ];
  }

  //x-auth-token
  //eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YmM3NDkxMjBhODE2MjJhYzA1NDYyZDIiLCJpYXQiOjE1Mzk3ODcwMjZ9.7tCBRZKiNPo574LLFO9iWH_Q_XxnyfiJEDtv92rPVMM

  _validateBody(req, res, next) {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    next();
  }

  async _getAll(req, res, next) {
    const users = await User.find().sort('name');

    if (!users) return res.status(404).send('There is no any users');

    req.responseData = users;
    next();
  }

  async _selectUserData(req, res, next) {
    const user = await User.findById(req.user._id).select('-password');

    req.responseData = user;

    next();
  }

  async _checkUser(req, res, next) {
    const user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already registered.');

    next();
  }

  async _createUser(req, res, next) {
    const user = new User(_.pick(req.body, ['name', 'email', 'password']));

    try {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
      req.user = await user.save();

      next();
    } catch (err) {
      res.status(500).json(error);
    }
  }

  _generateAuthToken(req, res, next) {
    const token = jwt.sign(
      { _id: req.user._id, isAdmin: req.user.isAdmin },
      config.get('jwtPrivateKey')
    );

    req.token = token;

    next();
  }

  _setHeadersAndSend(req, res) {
    res.header('x-auth-token', req.token).send(_.pick(req.user, ['_id', 'name', 'email']));
  }

  _validateAuth(req, res, next) {
    const schema = {
      email: Joi.string()
        .min(5)
        .max(255)
        .required()
        .email(),
      password: Joi.string()
        .min(5)
        .max(255)
        .required()
    };

    const { error } = Joi.validate(req.body, schema);
    if (error) return res.status(400).send(error.details[0].message);

    next();
  }

  async _findByEmail(req, res, next) {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Invalid email or password.');

    req.user = user;

    next();
  }

  async _checkPassword(req, res, next) {
    const validPassword = await bcrypt.compare(req.body.password, req.user.password);

    if (!validPassword) return res.status(400).send('Invalid email or password.');

    next();
  }

  _setToken(req, res, next) {
    req.responseData = req.token;

    next();
  }
}

module.exports = UserController;
