const express = require('express');
const { create } = require('../controllers/demo.controller');

const router = express.Router();

router.route('/create').post(create);

module.exports = router;
