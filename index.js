const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const Joi = require('joi');
const config = require('config');

const routes = require('./routes');

console.log(config.get('jwtPrivateKey'));

if (!config.get('jwtPrivateKey')) {
  console.error('FATAL ERROR: jwtPrivateKey is not defined.');
  process.exit(1);
}

const app = express();
Joi.objectId = require('joi-objectid')(Joi);

mongoose
  .connect(
    'mongodb://localhost/vidly',
    {
      useNewUrlParser: true,
      useCreateIndex: true
    }
  )
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api', routes);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
