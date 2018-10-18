const express = require('express');
const winston = require('winston');

const app = express();

require('./startup/logging')();
require('./startup/config')();
require('./startup/validation')();
require('./startup/api')(app);
require('./startup/db')();

const port = process.env.PORT || 3000;
app.listen(port, () => winston.info(`Listening on port ${port}...`));
