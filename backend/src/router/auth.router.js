const express = require('express');
const doctorController = require('../controllers/doctor.controller');
const authController = require('../controllers/auth.controller');
const router = express.Router();

router.route('/register/doctor').post(doctorController.createDoctor);
// router.route('/register/patient').post(patientController.createPatient);

router.route('/login').post(authController.login);
router.route('/forgot-password').post(authController.forgotPassword);
router.route('/reset-password/:token').patch(authController.resetPassword);
router.route('/token/:token').get(authController.getUserFromToken);

module.exports = router;
