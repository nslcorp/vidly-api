const routes = require('../routes');
const bodyParser = require('body-parser');
const errorHandler = require('../middleware/error');

module.exports = app => {
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use('/api', routes);
  app.use(errorHandler);
};
