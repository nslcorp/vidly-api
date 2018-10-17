const GenreController = require('./GenreController');
const CustomerController = require('./CustomerController');
const MovieController = require('./MovieController');

module.exports.genreController = new GenreController();
module.exports.customerController = new CustomerController();
module.exports.movieController = new MovieController();
