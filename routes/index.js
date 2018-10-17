const express = require('express');
const router = express.Router();

const genres = require('./genres');
const customers = require('./customers');
const movies = require('./movies');

router.use('/genres', genres);
router.use('/customers', customers);
router.use('/movies', movies);

module.exports = router;
