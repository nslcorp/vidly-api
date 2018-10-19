const mongoose = require('mongoose');
const winston = require('winston');
const config = require('config');

const db = config.get('db');

module.exports = () =>
  mongoose
    .connect(
      db,
      {
        useNewUrlParser: true,
        useCreateIndex: true
      }
    )
    .then(() => winston.info(`Connected to ${db} ...`));
