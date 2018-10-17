const express = require('express');
const router = express.Router();

const genres = require('./genres');

router.use('/genres', genres);

module.exports = router;
