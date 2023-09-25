const express = require('express');
const specializationController = require('./../controllers/specialization.controller');

const router = express.Router();

router.route('/').get(specializationController.getAllSpecialization);

module.exports = router;
