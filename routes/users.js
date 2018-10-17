const express = require('express');
const router = express.Router();

const userController = require('../controllers').userController;

router.get('/', userController.getAll);
router.get('/me', userController.getMe);

router.post('/', userController.create);
router.post('/auth', userController.auth);

module.exports = router;
