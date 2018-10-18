const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');

class BaseController {
  sendResponse(req, res) {
    const status = req.responseStatus || 200;
    const result = req.responseData || {};

    res.status(status).send(result);
  }

  validateParamsId(req, res, next) {
    const { error } = Joi.validate(req.params.id, Joi.objectId().required());

    if (error) return res.status(400).send(error.details[0].message);

    next();
  }

  auth(req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send('Access denied. No token provided.');

    try {
      const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
      console.log(decoded);
      req.user = decoded;

      next();
    } catch (ex) {
      res.status(400).send('Invalid token.');
    }
  }

  admin(req, res, next) {
    console.log(req.user);
    // 401 Unauthorized
    // 403 Forbidden
    if (!req.user.isAdmin) return res.status(403).send('Access denied.');

    next();
  }
}

module.exports = BaseController;
