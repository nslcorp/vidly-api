const { Movie, validate } = require('../models/movie');
const { Genre } = require('../models/genre');
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
    const movies = await Movie.find().sort('name');

    if (!movies) return res.status(404).send('There is no any movies');

    req.responseData = movies;
    next();
  }

  async _getById(req, res, next) {
    const movie = await Movie.findById(req.params.id);

    if (!movie) return res.status(404).send('The movie with the given ID was not found.');

    req.responseData = movie;
    next();
  }

  async _create(req, res, next) {
    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send('Invalid genre.');

    const movie = new Movie({
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate
    });

    req.responseData = await movie.save();
    next();
  }

  async _update(req, res, next) {
    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send('Invalid genre.');

    const movie = await Movie.findOneAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        genre: {
          _id: genre._id,
          name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
      },
      { new: true }
    );

    if (!movie) return res.status(404).send('The movie with the given ID was not found.');

    req.responseData = movie;
    next();
  }

  async _delete(req, res, next) {
    const movie = await Movie.findByIdAndRemove(req.params.id);

    if (!movie) return res.status(404).send('The movie with the given ID was not found.');

    req.responseData = movie;

    next();
  }
}

module.exports = GenreController;
