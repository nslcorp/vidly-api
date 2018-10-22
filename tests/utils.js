const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

const objectId = mongoose.Types.ObjectId();

module.exports.getToken = (_id = objectId.toHexString(), isAdmin = false) => {
  return jwt.sign({ _id, isAdmin }, config.get('jwtPrivateKey'));
};

module.exports.objectId = () => objectId;
