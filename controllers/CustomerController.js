const { Customer, validate } = require('../models/customer');
const BaseController = require('./BaseController');

class CustomerController extends BaseController {
  constructor() {
    super();

    this.getAll = [this._getAll, this.sendResponse];
    this.getById = [this.validateParamsId, this._getById, this.sendResponse];
    this.create = [this._validateBody, this._create, this.sendResponse];
    this.update = [this.validateParamsId, this._validateBody, this._update, this.sendResponse];
    this.delete = [this.validateParamsId, this._delete, this.sendResponse];
  }

  _validateBody(req, res, next) {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    next();
  }

  async _getAll(req, res, next) {
    const customers = await Customer.find().sort('name');

    if (!customers) return res.status(404).send('There is no any genres');

    req.responseData = customers;
    next();
  }

  async _getById(req, res, next) {
    const customer = await Customer.findById(req.params.id);

    if (!customer) return res.status(404).send('The customer with the given ID was not found.');

    req.responseData = customer;
    next();
  }

  async _create(req, res, next) {
    const customer = new Customer({
      name: req.body.name,
      isGold: req.body.isGold,
      phone: req.body.phone
    });

    req.responseData = await customer.save();
    next();
  }

  async _update(req, res, next) {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        isGold: req.body.isGold ? req.body.isGold : false,
        phone: req.body.phone
      },
      { new: true }
    );

    if (!customer) return res.status(404).send('The customer with the given ID was not found.');

    req.responseData = await customer.save();
    next();
  }

  async _delete(req, res, next) {
    const customer = await Customer.findByIdAndRemove(req.params.id);

    if (!customer) return res.status(404).send('The customer with the given ID was not found.');

    req.responseData = customer;

    next();
  }
}

module.exports = CustomerController;
