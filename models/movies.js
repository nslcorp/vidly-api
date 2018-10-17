const mongoose = require('mongoose');
const genreSchema = require('./genre').genreSchema;

const moviesSchema = mongoose.Schema({
  title: String,
  numberInStock: Number,
  dailyRate: Number,
  genre: genreSchema
});
