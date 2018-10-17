const Fawn = require('fawn');
const mongoose = require('mongoose');

const { Rental, validate } = require('../models/rental');
const { Customer } = require('../models/customer');
const { Movie } = require('../models/movie');
const BaseController = require('./BaseController');

Fawn.init(mongoose);

class RentalController extends BaseController {
  constructor() {
    super();

    this.getAll = [this._getAll, this.sendResponse];
    this.getById = [this.validateParamsId, this._getById, this.sendResponse];
    this.create = [
      this._validateBody,
      this._getCustomer,
      this._getMovie,
      this._checkMovieInStock,
      this._create,
      this.sendResponse
    ];
    this.delete = [this.validateParamsId, this._delete, this.sendResponse];
  }

  _validateBody(req, res, next) {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    next();
  }

  async _getAll(req, res, next) {
    const rentals = await Rental.find().sort('-dateOut');

    if (!rentals) return res.status(404).send('There is no any rentals');

    req.responseData = rentals;
    next();
  }

  async _getById(req, res, next) {
    const rental = await Rental.findById(req.params.id);

    if (!rental) return res.status(404).send('The rental with the given ID was not found.');

    req.responseData = rental;
    next();
  }

  async _getCustomer(req, res, next) {
    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send('Invalid customer.');

    req.customer = customer;
    next();
  }

  async _getMovie(req, res, next) {
    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send('Invalid movie.');

    req.movie = movie;
    next();
  }

  _checkMovieInStock(req, res, next) {
    if (req.movie.numberInStock === 0) return res.status(400).send('Movie not in stock.');

    next();
  }

  async _create(req, res, next) {
    const rental = new Rental({
      customer: {
        _id: req.customer._id,
        name: req.customer.name,
        phone: req.customer.phone
      },
      movie: {
        _id: req.movie._id,
        title: req.movie.title,
        dailyRentalRate: req.movie.dailyRentalRate
      }
    });

    try {
      new Fawn.Task()
        .save('rentals', rental)
        .update(
          'movies',
          { _id: req.movie._id },
          {
            $inc: { numberInStock: -1 }
          }
        )
        .run();

      req.responseData = rental;
      next();
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }

  /*  async _update(req, res, next) {
    const genre = await Genre.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
    );

    if (!genre) return res.status(404).send('The genre with the given ID was not found.');

    req.responseData = genre;
    next();
  }*/

  async _delete(req, res, next) {
    const rental = await Rental.findOneAndDelete({ _id: req.params.id });

    if (!rental) return res.status(404).send('The rental with the given ID was not found.');

    req.responseData = rental;

    next();
  }
}

module.exports = RentalController;
