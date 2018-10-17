const { Genre, validate } = require('../models/genre');
const BaseController = require('./BaseController');

class GenreController extends BaseController {
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
    const genres = await Genre.find().sort('name');

    if (!genres) return res.status(404).send('There is no any genres');

    req.responseData = genres;
    next();
  }

  async _getById(req, res, next) {
    const genre = await Genre.findById(req.params.id);

    if (!genre) return res.status(404).send('The genre with the given ID was not found.');

    req.responseData = genre;
    next();
  }

  async _create(req, res, next) {
    const genre = await Genre({
      name: req.body.name
    });

    req.responseData = await genre.save();
    next();
  }

  async _update(req, res, next) {
    const genre = await Genre.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
    );

    if (!genre) return res.status(404).send('The genre with the given ID was not found.');

    req.responseData = genre;
    next();
  }

  async _delete(req, res, next) {
    const genre = await Genre.findOneAndDelete({ _id: req.params.id });

    if (!genre) return res.status(404).send('The genre with the given ID was not found.');

    req.responseData = genre;

    next();
  }
}

module.exports = GenreController;
