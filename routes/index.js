const express = require('express');
const router = express.Router();

const genres = require('./genres');
const customers = require('./customers');
const movies = require('./movies');
const rentals = require('./rentals');
const users = require('./users');
const returns = require('./returns');

router.use('/genres', genres);
router.use('/customers', customers);
router.use('/movies', movies);
router.use('/rentals', rentals);
router.use('/users', users);
router.use('/returns', returns);

module.exports = router;
