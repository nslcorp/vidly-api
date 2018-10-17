const Joi = require('joi');

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
}

module.exports = BaseController;
