const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const Joi = require('joi');


const routes = require('./routes');

const app = express();
Joi.objectId = require('joi-objectid')(Joi);

mongoose
  .connect(
    'mongodb://localhost/vidly',
    { useNewUrlParser: true }
  )
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api', routes);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
