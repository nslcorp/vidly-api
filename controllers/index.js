const GenreController = require('./GenreController');
const CustomerController = require('./CustomerController');
const MovieController = require('./MovieController');
const RentalController = require('./RentalController');
const UserController = require('./UserController');

module.exports.genreController = new GenreController();
module.exports.customerController = new CustomerController();
module.exports.movieController = new MovieController();
module.exports.rentalController = new RentalController();
module.exports.userController = new UserController();
