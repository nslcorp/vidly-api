class BaseController {
  sendResponse(req, res) {
    const status = req.responseStatus || 200;
    const result = req.responseData || {};

    res.status(status).send(result);
  }
}

module.exports = BaseController;
